import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { TenantConfiguration, TenantFeatures, TenantBranding, TenantLimits, TenantSecurity } from '../types/tenant';

// Enhanced Tenant Types - using imported types from ../types/tenant




// Context State
interface RobustTenantState {
  currentTenant: TenantConfiguration | null;
  tenantFeatures: TenantFeatures | null;
  tenantBranding: TenantBranding | null;
  tenantLimits: TenantLimits | null;
  tenantSecurity: TenantSecurity | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  lastUpdated: Date | null;
}

// Action Types
type RobustTenantAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TENANT_CONFIG'; payload: TenantConfiguration }
  | { type: 'SET_TENANT_FEATURES'; payload: TenantFeatures }
  | { type: 'SET_TENANT_BRANDING'; payload: TenantBranding }
  | { type: 'SET_TENANT_LIMITS'; payload: TenantLimits }
  | { type: 'SET_TENANT_SECURITY'; payload: TenantSecurity }
  | { type: 'UPDATE_TENANT_SETTINGS'; payload: Partial<TenantConfiguration> }
  | { type: 'CLEAR_TENANT_DATA' }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_LAST_UPDATED'; payload: Date };

// Initial State
const initialState: RobustTenantState = {
  currentTenant: null,
  tenantFeatures: null,
  tenantBranding: null,
  tenantLimits: null,
  tenantSecurity: null,
  loading: false,
  error: null,
  initialized: false,
  lastUpdated: null,
};

// Reducer
function robustTenantReducer(state: RobustTenantState, action: RobustTenantAction): RobustTenantState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_TENANT_CONFIG':
      return {
        ...state,
        currentTenant: action.payload,
        loading: false,
        error: null,
        initialized: true,
        lastUpdated: new Date(),
      };
    case 'SET_TENANT_FEATURES':
      return { ...state, tenantFeatures: action.payload };
    case 'SET_TENANT_BRANDING':
      return { ...state, tenantBranding: action.payload };
    case 'SET_TENANT_LIMITS':
      return { ...state, tenantLimits: action.payload };
    case 'SET_TENANT_SECURITY':
      return { ...state, tenantSecurity: action.payload };
    case 'UPDATE_TENANT_SETTINGS':
      return {
        ...state,
        currentTenant: state.currentTenant ? { ...state.currentTenant, ...action.payload } : null,
        lastUpdated: new Date(),
      };
    case 'CLEAR_TENANT_DATA':
      return initialState;
    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload };
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    default:
      return state;
  }
}

// Context
const RobustTenantContext = createContext<{
  state: RobustTenantState;
  dispatch: React.Dispatch<RobustTenantAction>;
  loadTenantConfig: (tenantSlug: string) => Promise<void>;
  updateTenantConfig: (updates: Partial<TenantConfiguration>) => Promise<void>;
  transformComponent: (component: any, transformationType?: string) => any;
  getTenantFeature: (feature: string) => boolean;
  getTenantSetting: (key: string, defaultValue?: any) => any;
  getTenantLimit: (limit: string) => number | undefined;
  getTenantBranding: () => TenantBranding | null;
  getTenantSecurity: () => TenantSecurity | null;
  clearTenantData: () => void;
  refreshTenantData: () => Promise<void>;
} | null>(null);

// Provider Component
interface RobustTenantProviderProps {
  children: ReactNode;
  tenantSlug?: string;
}

export function RobustTenantProvider({ children, tenantSlug }: RobustTenantProviderProps) {
  const [state, dispatch] = useReducer(robustTenantReducer, initialState);

  // Load tenant configuration
  const loadTenantConfig = useCallback(async (slug: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await fetch(`/api/v1/tenants/config?tenant=${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load tenant config: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const config = data.data.config;
        dispatch({ type: 'SET_TENANT_CONFIG', payload: config });
        
        // Extract and set individual components
        if (config.features) {
          dispatch({ type: 'SET_TENANT_FEATURES', payload: {
            enabled: config.features,
            disabled: getDisabledFeatures(config.features),
            available: getAllAvailableFeatures(),
          }});
        }
        
        if (config.branding) {
          dispatch({ type: 'SET_TENANT_BRANDING', payload: config.branding });
        }
        
        if (config.limits) {
          dispatch({ type: 'SET_TENANT_LIMITS', payload: config.limits });
        }
        
        if (config.security) {
          dispatch({ type: 'SET_TENANT_SECURITY', payload: config.security });
        }
      } else {
        throw new Error(data.message || 'Failed to load tenant configuration');
      }
    } catch (error) {
      console.error('Failed to load tenant config:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, []);

  // Update tenant configuration
  const updateTenantConfig = useCallback(async (updates: Partial<TenantConfiguration>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch('/api/v1/tenants/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update tenant config: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        dispatch({ type: 'UPDATE_TENANT_SETTINGS', payload: updates });
      } else {
        throw new Error(data.message || 'Failed to update tenant configuration');
      }
    } catch (error) {
      console.error('Failed to update tenant config:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, []);

  // Transform component based on tenant configuration
  const transformComponent = useCallback((component: any, transformationType: string = 'all') => {
    if (!state.currentTenant) {
      return component;
    }

    try {
      const response = fetch('/api/v1/tenants/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ component, transformationType }),
      });

      // For now, return the component with tenant context
      return {
        ...component,
        tenantContext: {
          tenant: state.currentTenant.slug,
          features: state.tenantFeatures,
          branding: state.tenantBranding,
          limits: state.tenantLimits,
          security: state.tenantSecurity,
        },
      };
    } catch (error) {
      console.error('Failed to transform component:', error);
      return component;
    }
  }, [state.currentTenant, state.tenantFeatures, state.tenantBranding, state.tenantLimits, state.tenantSecurity]);

  // Get tenant feature status
  const getTenantFeature = useCallback((feature: string): boolean => {
    return state.tenantFeatures?.enabled.includes(feature) || false;
  }, [state.tenantFeatures]);

  // Get tenant setting
  const getTenantSetting = useCallback((key: string, defaultValue?: any) => {
    return state.currentTenant?.settings?.[key] || defaultValue;
  }, [state.currentTenant]);

  // Get tenant limit
  const getTenantLimit = useCallback((limit: string): number | undefined => {
    return state.tenantLimits?.[limit];
  }, [state.tenantLimits]);

  // Get tenant branding
  const getTenantBranding = useCallback((): TenantBranding | null => {
    return state.tenantBranding;
  }, [state.tenantBranding]);

  // Get tenant security
  const getTenantSecurity = useCallback((): TenantSecurity | null => {
    return state.tenantSecurity;
  }, [state.tenantSecurity]);

  // Clear tenant data
  const clearTenantData = useCallback(() => {
    dispatch({ type: 'CLEAR_TENANT_DATA' });
  }, []);

  // Refresh tenant data
  const refreshTenantData = useCallback(async () => {
    if (state.currentTenant?.slug) {
      await loadTenantConfig(state.currentTenant.slug);
    }
  }, [state.currentTenant?.slug, loadTenantConfig]);

  // Initialize tenant on mount
  useEffect(() => {
    if (tenantSlug && !state.initialized) {
      loadTenantConfig(tenantSlug);
    }
  }, [tenantSlug, state.initialized, loadTenantConfig]);

  // Auto-refresh tenant data periodically
  useEffect(() => {
    if (state.currentTenant) {
      const interval = setInterval(() => {
        refreshTenantData();
      }, 300000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [state.currentTenant, refreshTenantData]);

  const contextValue = {
    state,
    dispatch,
    loadTenantConfig,
    updateTenantConfig,
    transformComponent,
    getTenantFeature,
    getTenantSetting,
    getTenantLimit,
    getTenantBranding,
    getTenantSecurity,
    clearTenantData,
    refreshTenantData,
  };

  return (
    <RobustTenantContext.Provider value={contextValue}>
      {children}
    </RobustTenantContext.Provider>
  );
}

// Hook to use the context
export function useRobustTenant() {
  const context = useContext(RobustTenantContext);
  if (!context) {
    throw new Error('useRobustTenant must be used within a RobustTenantProvider');
  }
  return context;
}

// Helper functions
function getDisabledFeatures(enabledFeatures: string[]): string[] {
  const allFeatures = ['ai', 'analytics', 'integrations', 'custom_domain', 'sso', 'audit_logs'];
  return allFeatures.filter(feature => !enabledFeatures.includes(feature));
}

function getAllAvailableFeatures(): string[] {
  return ['ai', 'analytics', 'integrations', 'custom_domain', 'sso', 'audit_logs'];
}

// Higher-order component for tenant transformation
export function withTenantTransformation<P extends object>(
  Component: React.ComponentType<P>,
  transformationType: string = 'all'
) {
  return function TenantTransformedComponent(props: P) {
    const { transformComponent } = useRobustTenant();
    const transformedProps = transformComponent(props, transformationType);
    
    return <Component {...transformedProps} />;
  };
}

// Hook for tenant features
export function useTenantFeature(feature: string) {
  const { getTenantFeature } = useRobustTenant();
  return getTenantFeature(feature);
}

// Hook for tenant settings
export function useTenantSetting(key: string, defaultValue?: any) {
  const { getTenantSetting } = useRobustTenant();
  return getTenantSetting(key, defaultValue);
}

// Hook for tenant branding
export function useTenantBranding() {
  const { getTenantBranding } = useRobustTenant();
  return getTenantBranding();
}

// Hook for tenant security
export function useTenantSecurity() {
  const { getTenantSecurity } = useRobustTenant();
  return getTenantSecurity();
}

export default RobustTenantContext;
