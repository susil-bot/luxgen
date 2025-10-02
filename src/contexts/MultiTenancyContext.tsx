import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
  Tenant, 
  TenantUser, 
  TenantRole, 
  Permission, 
  TenantSession,
  MultiTenancyContext as MultiTenancyContextType,
  TenantId,
  UserId,
  QueryOptions,
  TenantFilter,
  AuditLog,
  ComplianceReport,
  GlobalObject,
  SharedResource
} from '../types/multiTenancy';
import { multiTenancyManager } from '../services/MultiTenancyManager';
import { securityService } from '../services/SecurityService';
import { globalObjectsService } from '../services/GlobalObjectsService';

// Action Types
type MultiTenancyAction =
  | { type: 'SET_CURRENT_TENANT'; payload: Tenant }
  | { type: 'SET_CURRENT_USER'; payload: TenantUser }
  | { type: 'SET_PERMISSIONS'; payload: string[] }
  | { type: 'SET_SESSION'; payload: TenantSession }
  | { type: 'CLEAR_SESSION' }
  | { type: 'UPDATE_TENANT_SETTINGS'; payload: Partial<Tenant> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_AUDIT_LOGS'; payload: AuditLog[] }
  | { type: 'SET_COMPLIANCE_REPORTS'; payload: ComplianceReport[] }
  | { type: 'SET_GLOBAL_OBJECTS'; payload: GlobalObject[] }
  | { type: 'SET_SHARED_RESOURCES'; payload: SharedResource[] }
  | { type: 'SET_TENANT_HEALTH'; payload: any }
  | { type: 'SET_TENANT_ANALYTICS'; payload: any };

// State Interface
interface MultiTenancyState {
  currentTenant: Tenant | null;
  currentUser: TenantUser | null;
  session: TenantSession | null;
  permissions: string[];
  isSystemAdmin: boolean;
  isTenantAdmin: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  auditLogs: AuditLog[];
  complianceReports: ComplianceReport[];
  globalObjects: GlobalObject[];
  sharedResources: SharedResource[];
  tenantHealth: any;
  tenantAnalytics: any;
}

// Initial State
const initialState: MultiTenancyState = {
  currentTenant: null,
  currentUser: null,
  session: null,
  permissions: [],
  isSystemAdmin: false,
  isTenantAdmin: false,
  loading: true,
  error: null,
  initialized: false,
  auditLogs: [],
  complianceReports: [],
  globalObjects: [],
  sharedResources: [],
  tenantHealth: null,
  tenantAnalytics: null,
};

// Reducer
function multiTenancyReducer(state: MultiTenancyState, action: MultiTenancyAction): MultiTenancyState {
  switch (action.type) {
    case 'SET_CURRENT_TENANT':
      return {
        ...state,
        currentTenant: action.payload,
        isTenantAdmin: action.payload.settings.features.enableAuditLogs,
      };
    
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload,
        isSystemAdmin: action.payload.role.name === 'System Admin',
      };
    
    case 'SET_PERMISSIONS':
      return {
        ...state,
        permissions: action.payload,
      };
    
    case 'SET_SESSION':
      return {
        ...state,
        session: action.payload,
      };
    
    case 'CLEAR_SESSION':
      return {
        ...state,
        session: null,
        currentUser: null,
        currentTenant: null,
        permissions: [],
      };
    
    case 'UPDATE_TENANT_SETTINGS':
      return {
        ...state,
        currentTenant: state.currentTenant ? { ...state.currentTenant, ...action.payload } : null,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    
    case 'SET_AUDIT_LOGS':
      return {
        ...state,
        auditLogs: action.payload,
      };
    
    case 'SET_COMPLIANCE_REPORTS':
      return {
        ...state,
        complianceReports: action.payload,
      };
    
    case 'SET_GLOBAL_OBJECTS':
      return {
        ...state,
        globalObjects: action.payload,
      };
    
    case 'SET_SHARED_RESOURCES':
      return {
        ...state,
        sharedResources: action.payload,
      };
    
    case 'SET_TENANT_HEALTH':
      return {
        ...state,
        tenantHealth: action.payload,
      };
    
    case 'SET_TENANT_ANALYTICS':
      return {
        ...state,
        tenantAnalytics: action.payload,
      };
    
    default:
      return state;
  }
}

// Context
const MultiTenancyContext = createContext<MultiTenancyContextType | undefined>(undefined);

// Provider Component
export const MultiTenancyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(multiTenancyReducer, initialState);

  // Initialize multi-tenancy context
  useEffect(() => {
    initializeMultiTenancy();
  }, []);

  const initializeMultiTenancy = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Get tenant from URL or localStorage
      let tenantId = getTenantFromURL() || getTenantFromStorage();
      
      // If no tenant found, use default tenant
      if (!tenantId) {
        tenantId = 'default';
      }
      
      await loadTenant(tenantId);
      
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to initialize multi-tenancy' });
    }
  }, []);

  const getTenantFromURL = (): string | null => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    // Check if it's a valid tenant subdomain
    if (subdomain && subdomain !== 'www' && subdomain !== 'app' && subdomain !== 'localhost') {
      return subdomain;
    }
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tenant');
  };

  const getTenantFromStorage = (): string | null => {
    return localStorage.getItem('currentTenantId');
  };

  const loadTenant = useCallback(async (tenantId: string) => {
    try {
      // Load tenant using the manager
      const tenant = await multiTenancyManager.getTenant(tenantId);
      if (!tenant) {
        throw new Error('Tenant not found');
      }
      
      dispatch({ type: 'SET_CURRENT_TENANT', payload: tenant });
      
      // Load current user for this tenant
      const users = await multiTenancyManager.getTenantUsers(tenantId);
      const user = users.find(u => u.status === 'active');
      
      if (user) {
        dispatch({ type: 'SET_CURRENT_USER', payload: user });
        dispatch({ type: 'SET_PERMISSIONS', payload: user.permissions });
      }
      
      // Load additional tenant data
      await loadTenantData(tenantId);
      
      // Store tenant ID
      localStorage.setItem('currentTenantId', tenantId);
      
    } catch (error) {
      console.error('Failed to load tenant:', error);
      throw error;
    }
  }, []);

  const loadTenantData = useCallback(async (tenantId: string) => {
    try {
      // Load audit logs
      const auditLogs = await multiTenancyManager.getAuditLogs(tenantId, { limit: 50 });
      dispatch({ type: 'SET_AUDIT_LOGS', payload: auditLogs });
      
      // Load global objects
      const globalObjects = await multiTenancyManager.getGlobalObjects({ isPublic: true });
      dispatch({ type: 'SET_GLOBAL_OBJECTS', payload: globalObjects });
      
      // Load shared resources
      const sharedResources = await multiTenancyManager.getSharedResources({ isPublic: true });
      dispatch({ type: 'SET_SHARED_RESOURCES', payload: sharedResources });
      
      // Load tenant health
      const tenantHealth = await multiTenancyManager.getTenantHealth(tenantId);
      dispatch({ type: 'SET_TENANT_HEALTH', payload: tenantHealth });
      
      // Load tenant analytics
      const tenantAnalytics = await multiTenancyManager.getTenantAnalytics(tenantId, 'monthly');
      dispatch({ type: 'SET_TENANT_ANALYTICS', payload: tenantAnalytics });
      
    } catch (error) {
      console.error('Failed to load tenant data:', error);
    }
  }, []);

  // Permission checking
  const canAccess = useCallback((resource: string, action: string): boolean => {
    if (!state.currentUser || !state.permissions) return false;
    return state.permissions.includes(`${resource}:${action}`);
  }, [state.currentUser, state.permissions]);
    
  // Tenant ID getter
  const getTenantId = useCallback((): string => {
    return state.currentTenant?.id || '';
  }, [state.currentTenant]);

  // Tenant switching
  const switchTenant = useCallback(async (tenantId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await loadTenant(tenantId);
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to switch tenant' });
    }
  }, [loadTenant]);

  // Logout
  const logout = useCallback(async () => {
    try {
      if (state.currentUser) {
        await multiTenancyManager.invalidateSession(state.currentUser.id);
    }
    dispatch({ type: 'CLEAR_SESSION' });
    localStorage.removeItem('currentTenantId');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [state.currentUser]);

  // Update tenant settings
  const updateTenantSettings = useCallback(async (settings: Partial<Tenant>) => {
    if (!state.currentTenant) return;
    
    try {
      const updatedTenant = await multiTenancyManager.updateTenant(state.currentTenant.id, settings);
      if (updatedTenant) {
        dispatch({ type: 'UPDATE_TENANT_SETTINGS', payload: settings });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update settings' });
    }
  }, [state.currentTenant]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // Session management
  const createSession = useCallback(async (userId: string, ipAddress: string, userAgent: string) => {
    if (!state.currentTenant) throw new Error('No current tenant');
    
    const session = await multiTenancyManager.createSession(
      state.currentTenant.id,
      userId,
      ipAddress,
      userAgent
    );
    dispatch({ type: 'SET_SESSION', payload: session });
    return session;
  }, [state.currentTenant]);

  const validateSession = useCallback(async (token: string) => {
    return await multiTenancyManager.validateSession(token);
  }, []);

  const refreshSession = useCallback(async (refreshToken: string) => {
    return await multiTenancyManager.refreshSession(refreshToken);
  }, []);

  const validateAccess = useCallback(async (resource: string, action: string) => {
    if (!state.currentTenant || !state.currentUser) return false;
    
    return await multiTenancyManager.validateAccess(
      state.currentTenant.id,
      state.currentUser.id,
      resource,
      action
    );
  }, [state.currentTenant, state.currentUser]);

  // Simplified executeQuery without generics
  const executeQuery = useCallback(async (
    table: string,
    operation: 'find' | 'findOne' | 'create' | 'update' | 'delete',
    options?: QueryOptions,
    data?: any
  ): Promise<any> => {
    if (!state.currentTenant) throw new Error('No current tenant');
    
    return await multiTenancyManager.executeQuery(
      state.currentTenant.id,
      table,
      operation,
      options,
      data
    );
  }, [state.currentTenant]);

  const getGlobalObjects = useCallback(async (filters?: any) => {
    const objects = await multiTenancyManager.getGlobalObjects(filters);
    dispatch({ type: 'SET_GLOBAL_OBJECTS', payload: objects });
    return objects;
  }, []);

  const createGlobalObject = useCallback(async (object: any) => {
    if (!state.currentTenant) throw new Error('No current tenant');
    
    const newObject = await multiTenancyManager.createGlobalObject(object, state.currentTenant.id);
    const currentObjects = state.globalObjects;
    dispatch({ type: 'SET_GLOBAL_OBJECTS', payload: [...currentObjects, newObject] });
    return newObject;
  }, [state.currentTenant, state.globalObjects]);

  const getAuditLogs = useCallback(async (filters?: any) => {
    if (!state.currentTenant) return [];
    
    const logs = await multiTenancyManager.getAuditLogs(state.currentTenant.id, filters);
    dispatch({ type: 'SET_AUDIT_LOGS', payload: logs });
    return logs;
  }, [state.currentTenant]);

  const generateComplianceReport = useCallback(async (type: 'gdpr' | 'sox' | 'hipaa' | 'pci' | 'custom') => {
    if (!state.currentTenant) throw new Error('No current tenant');
    
    const report = await multiTenancyManager.generateComplianceReport(state.currentTenant.id, type);
    const currentReports = state.complianceReports;
    dispatch({ type: 'SET_COMPLIANCE_REPORTS', payload: [...currentReports, report] });
    return report;
  }, [state.currentTenant, state.complianceReports]);

  const getTenantHealth = useCallback(async () => {
    if (!state.currentTenant) return null;
    
    const health = await multiTenancyManager.getTenantHealth(state.currentTenant.id);
    dispatch({ type: 'SET_TENANT_HEALTH', payload: health });
    return health;
  }, [state.currentTenant]);

  const getTenantAnalytics = useCallback(async (period: 'daily' | 'weekly' | 'monthly') => {
    if (!state.currentTenant) return null;
    
    const analytics = await multiTenancyManager.getTenantAnalytics(state.currentTenant.id, period);
    dispatch({ type: 'SET_TENANT_ANALYTICS', payload: analytics });
    return analytics;
  }, [state.currentTenant]);

  const trackResourceUsage = useCallback(async (resourceType: string, amount: number) => {
    if (!state.currentTenant) return;
    
    await multiTenancyManager.trackResourceUsage(state.currentTenant.id, resourceType, amount);
  }, [state.currentTenant]);

  const checkResourceLimits = useCallback(async (resourceType: string, amount: number) => {
    if (!state.currentTenant) return false;
    
    return await multiTenancyManager.checkResourceLimits(state.currentTenant.id, resourceType, amount);
  }, [state.currentTenant]);

  // Context value
  const contextValue: MultiTenancyContextType = {
    currentTenant: state.currentTenant,
    currentUser: state.currentUser,
    permissions: state.permissions,
    isSystemAdmin: state.isSystemAdmin,
    isTenantAdmin: state.isTenantAdmin,
    canAccess,
    getTenantId,
    switchTenant,
    // Enhanced methods
    logout,
    updateTenantSettings,
    clearError,
    loading: state.loading,
    error: state.error,
    initialized: state.initialized,
    // New service methods
    createSession,
    validateSession,
    refreshSession,
    validateAccess,
    executeQuery,
    getGlobalObjects,
    createGlobalObject,
    getAuditLogs,
    generateComplianceReport,
    getTenantHealth,
    getTenantAnalytics,
    trackResourceUsage,
    checkResourceLimits,
    // State data
    auditLogs: state.auditLogs,
    complianceReports: state.complianceReports,
    globalObjects: state.globalObjects,
    sharedResources: state.sharedResources,
    tenantHealth: state.tenantHealth,
    tenantAnalytics: state.tenantAnalytics,
  };

  return (
    <MultiTenancyContext.Provider value={contextValue}>
      {children}
    </MultiTenancyContext.Provider>
  );
};

// Hook to use multi-tenancy context
export const useMultiTenancy = (): MultiTenancyContextType => {
  const context = useContext(MultiTenancyContext);
  if (context === undefined) {
    throw new Error('useMultiTenancy must be used within a MultiTenancyProvider');
  }
  return context;
};

// Utility hooks for common operations
export const useTenant = () => {
  const { currentTenant } = useMultiTenancy();
  return currentTenant;
};

export const useTenantUser = () => {
  const { currentUser } = useMultiTenancy();
  return currentUser;
};

export const usePermissions = () => {
  const { permissions, canAccess } = useMultiTenancy();
  return { permissions, canAccess };
};

export const useTenantId = () => {
  const { getTenantId } = useMultiTenancy();
  return getTenantId();
};

export const useTenantHealth = () => {
  const { tenantHealth, getTenantHealth } = useMultiTenancy();
  return { tenantHealth, getTenantHealth };
};

export const useTenantAnalytics = () => {
  const { tenantAnalytics, getTenantAnalytics } = useMultiTenancy();
  return { tenantAnalytics, getTenantAnalytics };
};

export const useAuditLogs = () => {
  const { auditLogs, getAuditLogs } = useMultiTenancy();
  return { auditLogs, getAuditLogs };
};

export const useGlobalObjects = () => {
  const { globalObjects, getGlobalObjects, createGlobalObject } = useMultiTenancy();
  return { globalObjects, getGlobalObjects, createGlobalObject };
};

// Higher-order component for permission-based rendering
export const withPermission = (
  WrappedComponent: React.ComponentType<any>,
  resource: string,
  action: string
) => {
  return (props: any) => {
    const { canAccess } = useMultiTenancy();
    
    if (!canAccess(resource, action)) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to access this resource.
            </p>
          </div>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Hook for tenant-aware data fetching
export const useTenantQuery = (
  queryFn: (tenantId: string, options?: QueryOptions) => Promise<any>,
  options?: QueryOptions
) => {
  const { getTenantId, currentTenant } = useMultiTenancy();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const executeQuery = React.useCallback(async () => {
    if (!currentTenant) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await queryFn(currentTenant.id, options);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query failed');
    } finally {
      setLoading(false);
    }
  }, [currentTenant, queryFn, options]);

  React.useEffect(() => {
    executeQuery();
  }, [executeQuery]);

  return { data, loading, error, refetch: executeQuery };
}; 