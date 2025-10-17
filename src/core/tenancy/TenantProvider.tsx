/**
 * ROBUST TENANT PROVIDER
 * React context provider for tenant management
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { TenantManager, TenantContext, Tenant, tenantManager } from './TenantManager';

// Context Types
interface TenantProviderContext {
  // State
  tenant: Tenant | null;
  user: any;
  permissions: string[];
  isAdmin: boolean;
  isOwner: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // Actions
  switchTenant: (tenantId: string) => Promise<void>;
  refreshTenant: () => Promise<void>;
  clearContext: () => void;
  
  // Permission checking
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  canAccess: (resource: string, action: string) => boolean;
}

// Create Context
const TenantProviderContext = createContext<TenantProviderContext | undefined>(undefined);

// Provider Props
interface TenantProviderProps {
  children: React.ReactNode;
  autoDetect?: boolean;
  fallbackTenant?: string;
}

// Provider Component
export const TenantProvider: React.FC<TenantProviderProps> = ({
  children,
  autoDetect = true,
  fallbackTenant = 'default',
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [context, setContext] = useState<TenantContext | null>(null);

  // Initialize tenant context
  const initializeTenant = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if already initialized
      if (tenantManager.isInitialized()) {
        const currentContext = tenantManager.getCurrentContext();
        setContext(currentContext);
        setInitialized(true);
        return;
      }

      // Auto-detect tenant if enabled
      if (autoDetect) {
        const detectedTenant = tenantManager.detectTenantFromUrl() || 
                               tenantManager.detectTenantFromParams();
        
        if (detectedTenant) {
          await tenantManager.switchTenant(detectedTenant);
          const newContext = tenantManager.getCurrentContext();
          setContext(newContext);
          setInitialized(true);
          return;
        }
      }

      // Use fallback tenant
      if (fallbackTenant) {
        await tenantManager.switchTenant(fallbackTenant);
        const newContext = tenantManager.getCurrentContext();
        setContext(newContext);
        setInitialized(true);
        return;
      }

      // No tenant found
      setContext(null);
      setInitialized(true);
    } catch (err) {
      console.error('Failed to initialize tenant:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize tenant');
      setContext(null);
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  }, [autoDetect, fallbackTenant]);

  // Switch tenant
  const switchTenant = useCallback(async (tenantId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await tenantManager.switchTenant(tenantId);
      const newContext = tenantManager.getCurrentContext();
      setContext(newContext);
    } catch (err) {
      console.error('Failed to switch tenant:', err);
      setError(err instanceof Error ? err.message : 'Failed to switch tenant');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh tenant
  const refreshTenant = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentTenant = tenantManager.getCurrentTenant();
      if (!currentTenant) {
        throw new Error('No current tenant to refresh');
      }

      await tenantManager.switchTenant(currentTenant.id);
      const newContext = tenantManager.getCurrentContext();
      setContext(newContext);
    } catch (err) {
      console.error('Failed to refresh tenant:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh tenant');
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear context
  const clearContext = useCallback(() => {
    tenantManager.clearContext();
    setContext(null);
    setError(null);
  }, []);

  // Permission checking methods
  const hasPermission = useCallback((permission: string): boolean => {
    return context ? tenantManager.hasPermission(permission) : false;
  }, [context]);

  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    return context ? tenantManager.hasAnyPermission(permissions) : false;
  }, [context]);

  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    return context ? tenantManager.hasAllPermissions(permissions) : false;
  }, [context]);

  const canAccess = useCallback((resource: string, action: string): boolean => {
    return context ? tenantManager.canAccess(resource, action) : false;
  }, [context]);

  // Listen to tenant changes
  useEffect(() => {
    const unsubscribe = tenantManager.addListener((newContext) => {
      setContext(newContext);
    });

    return unsubscribe;
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeTenant();
  }, [initializeTenant]);

  // Context value
  const contextValue: TenantProviderContext = {
    // State
    tenant: context?.tenant || null,
    user: context?.user || null,
    permissions: context?.permissions || [],
    isAdmin: context?.isAdmin || false,
    isOwner: context?.isOwner || false,
    loading,
    error,
    initialized,

    // Actions
    switchTenant,
    refreshTenant,
    clearContext,

    // Permission checking
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
  };

  return (
    <TenantProviderContext.Provider value={contextValue}>
      {children}
    </TenantProviderContext.Provider>
  );
};

// Hook to use tenant context
export const useTenant = (): TenantProviderContext => {
  const context = useContext(TenantProviderContext);
  
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  
  return context;
};

// Higher-order component for tenant protection
export const withTenant = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions?: string[]
) => {
  return (props: P) => {
    const { tenant, hasPermission, hasAllPermissions, loading, error } = useTenant();

    // Show loading state
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading tenant...</span>
        </div>
      );
    }

    // Show error state
    if (error) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-red-600">
            <h3 className="text-lg font-semibold">Tenant Error</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      );
    }

    // Check if tenant is available
    if (!tenant) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-600">
            <h3 className="text-lg font-semibold">No Tenant Selected</h3>
            <p className="text-sm">Please select a tenant to continue.</p>
          </div>
        </div>
      );
    }

    // Check permissions if required
    if (requiredPermissions && !hasAllPermissions(requiredPermissions)) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-red-600">
            <h3 className="text-lg font-semibold">Access Denied</h3>
            <p className="text-sm">You don't have permission to access this resource.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default TenantProvider;
