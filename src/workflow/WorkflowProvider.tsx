/**
 * LUXGEN WORKFLOW PROVIDER
 * React context provider for the workflow system
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { WorkflowContext, GlobalState, AuthState, TenantState, UserContext, TenantConfig } from './types';
import { workflowManager } from './WorkflowManager';
import { AuthWorkflow } from './AuthWorkflow';
import { TenantWorkflow } from './TenantWorkflow';
import { DataFlowWorkflow } from './DataFlowWorkflow';

// Initial state
const initialState: GlobalState = {
  auth: {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  },
  tenant: {
    currentTenant: null,
    availableTenants: [],
    loading: false,
    error: null
  },
  ui: {
    theme: 'light',
    sidebarCollapsed: false,
    notifications: []
  }
};

// Action types
type Action =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: UserContext; token: string; tenantConfig: any } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'TENANT_START' }
  | { type: 'TENANT_SUCCESS'; payload: { currentTenant: TenantConfig; availableTenants: TenantConfig[] } }
  | { type: 'TENANT_FAILURE'; payload: string }
  | { type: 'UI_TOGGLE_SIDEBAR' }
  | { type: 'UI_SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'UI_ADD_NOTIFICATION'; payload: any }
  | { type: 'UI_REMOVE_NOTIFICATION'; payload: string };

// Reducer
function workflowReducer(state: GlobalState, action: Action): GlobalState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: true,
          error: null
        }
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        auth: {
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
          loading: false,
          error: null
        },
        tenant: {
          ...state.tenant,
          currentTenant: action.payload.tenantConfig
        }
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        auth: {
          ...state.auth,
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: action.payload
        }
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        auth: {
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null
        }
      };

    case 'TENANT_START':
      return {
        ...state,
        tenant: {
          ...state.tenant,
          loading: true,
          error: null
        }
      };

    case 'TENANT_SUCCESS':
      return {
        ...state,
        tenant: {
          currentTenant: action.payload.currentTenant,
          availableTenants: action.payload.availableTenants,
          loading: false,
          error: null
        }
      };

    case 'TENANT_FAILURE':
      return {
        ...state,
        tenant: {
          ...state.tenant,
          loading: false,
          error: action.payload
        }
      };

    case 'UI_TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarCollapsed: !state.ui.sidebarCollapsed
        }
      };

    case 'UI_SET_THEME':
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: action.payload
        }
      };

    case 'UI_ADD_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, action.payload]
        }
      };

    case 'UI_REMOVE_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== action.payload)
        }
      };

    default:
      return state;
  }
}

// Context
interface WorkflowContextType {
  state: GlobalState;
  dispatch: React.Dispatch<Action>;
  executeWorkflow: <T>(workflowId: string, context: WorkflowContext) => Promise<any>;
  login: (email: string, password: string, tenantId: string) => Promise<void>;
  register: (userData: any, tenantId: string) => Promise<void>;
  logout: () => Promise<void>;
  switchTenant: (tenantId: string) => Promise<void>;
  getCurrentTenant: () => Promise<void>;
  getAllTenants: () => Promise<void>;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

// Provider component
interface WorkflowProviderProps {
  children: ReactNode;
  initialContext?: Partial<WorkflowContext>;
}

export function WorkflowProvider({ children, initialContext }: WorkflowProviderProps) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  // Initialize workflows
  useEffect(() => {
    // Register core workflows
    workflowManager.register(new AuthWorkflow());
    workflowManager.register(new TenantWorkflow());
    workflowManager.register(new DataFlowWorkflow());

    // Load initial data from localStorage
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    const tenantId = localStorage.getItem('current_tenant_id') || 'luxgen';

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user,
            token,
            tenantConfig: null
          }
        });
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
      }
    }

    // Load tenant configuration
    if (tenantId) {
      getCurrentTenant();
    }
  }, []);

  // Execute workflow function
  const executeWorkflow = async <T,>(workflowId: string, context: WorkflowContext) => {
    try {
      const result = await workflowManager.execute<T>(workflowId, context);
      return result;
    } catch (error) {
      console.error('Workflow execution failed:', error);
      throw error;
    }
  };

  // Authentication functions
  const login = async (email: string, password: string, tenantId: string) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const result = await executeWorkflow('auth', {
        tenantId,
        data: { email, password, action: 'login' }
      });

      if (result.success) {
        // Store in localStorage
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('user_data', JSON.stringify(result.data.user));
        localStorage.setItem('current_tenant_id', tenantId);

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: result.data
        });
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: result.message
        });
        throw new Error(result.message);
      }
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : 'Login failed'
      });
      throw error;
    }
  };

  const register = async (userData: any, tenantId: string) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const result = await executeWorkflow('auth', {
        tenantId,
        data: { ...userData, action: 'register' }
      });

      if (result.success) {
        // Store in localStorage
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('user_data', JSON.stringify(result.data.user));
        localStorage.setItem('current_tenant_id', tenantId);

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: result.data
        });
      } else {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: result.message
        });
        throw new Error(result.message);
      }
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : 'Registration failed'
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await executeWorkflow('auth', {
        tenantId: state.tenant.currentTenant?.id || 'luxgen',
        data: { action: 'logout' }
      });

      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('current_tenant_id');

      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear the state even if the API call fails
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Tenant functions
  const switchTenant = async (tenantId: string) => {
    dispatch({ type: 'TENANT_START' });

    try {
      const result = await executeWorkflow('tenant', {
        tenantId,
        data: { action: 'switchTenant' }
      });

      if (result.success) {
        localStorage.setItem('current_tenant_id', tenantId);
        dispatch({
          type: 'TENANT_SUCCESS',
          payload: {
            currentTenant: result.data.currentTenant,
            availableTenants: result.data.availableTenants
          }
        });
      } else {
        dispatch({
          type: 'TENANT_FAILURE',
          payload: result.message
        });
        throw new Error(result.message);
      }
    } catch (error) {
      dispatch({
        type: 'TENANT_FAILURE',
        payload: error instanceof Error ? error.message : 'Tenant switch failed'
      });
      throw error;
    }
  };

  const getCurrentTenant = async () => {
    const tenantId = localStorage.getItem('current_tenant_id') || 'luxgen';
    dispatch({ type: 'TENANT_START' });

    try {
      const result = await executeWorkflow('tenant', {
        tenantId,
        data: { action: 'getCurrentTenant' }
      });

      if (result.success) {
        dispatch({
          type: 'TENANT_SUCCESS',
          payload: {
            currentTenant: result.data.currentTenant,
            availableTenants: result.data.availableTenants
          }
        });
      } else {
        dispatch({
          type: 'TENANT_FAILURE',
          payload: result.message
        });
      }
    } catch (error) {
      dispatch({
        type: 'TENANT_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to get tenant'
      });
    }
  };

  const getAllTenants = async () => {
    dispatch({ type: 'TENANT_START' });

    try {
      const result = await executeWorkflow('tenant', {
        tenantId: 'luxgen',
        data: { action: 'getAllTenants' }
      });

      if (result.success) {
        dispatch({
          type: 'TENANT_SUCCESS',
          payload: {
            currentTenant: state.tenant.currentTenant,
            availableTenants: result.data.availableTenants
          }
        });
      } else {
        dispatch({
          type: 'TENANT_FAILURE',
          payload: result.message
        });
      }
    } catch (error) {
      dispatch({
        type: 'TENANT_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to get tenants'
      });
    }
  };

  const contextValue: WorkflowContextType = {
    state,
    dispatch,
    executeWorkflow,
    login,
    register,
    logout,
    switchTenant,
    getCurrentTenant,
    getAllTenants
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
}

// Hook to use the workflow context
export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}
