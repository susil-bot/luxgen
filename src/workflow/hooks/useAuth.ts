/**
 * LUXGEN AUTHENTICATION HOOK
 * Custom hook for authentication operations
 */

import { useState, useCallback } from 'react';
import { useWorkflow } from '../WorkflowProvider';
import { WorkflowContext, WorkflowResult, UserContext } from '../types';

interface AuthHook {
  login: (email: string, password: string, tenantId: string) => Promise<void>;
  register: (userData: any, tenantId: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  loading: boolean;
  error: string | null;
  user: UserContext | null;
  isAuthenticated: boolean;
}

export function useAuth(): AuthHook {
  const { state, login: loginAction, register: registerAction, logout: logoutAction, executeWorkflow } = useWorkflow();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string, tenantId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await loginAction(email, password, tenantId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loginAction]);

  const register = useCallback(async (userData: any, tenantId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await registerAction(userData, tenantId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [registerAction]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await logoutAction();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [logoutAction]);

  const refreshToken = useCallback(async () => {
    if (!state.auth.token || !state.tenant.currentTenant) {
      throw new Error('No token or tenant available for refresh');
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await executeWorkflow('auth', {
        tenantId: state.tenant.currentTenant.id,
        data: {
          action: 'refresh',
          token: state.auth.token
        }
      });

      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Token refresh failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [executeWorkflow, state.auth.token, state.tenant.currentTenant]);

  return {
    login,
    register,
    logout,
    refreshToken,
    loading: loading || state.auth.loading,
    error: error || state.auth.error,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated
  };
}
