/**
 * LUXGEN TENANT HOOK
 * Custom hook for tenant management operations
 */

import { useState, useCallback } from 'react';
import { useWorkflow } from '../WorkflowProvider';
import { WorkflowContext, WorkflowResult, TenantConfig } from '../types';

interface TenantHook {
  switchTenant: (tenantId: string) => Promise<void>;
  getCurrentTenant: () => Promise<void>;
  getAllTenants: () => Promise<void>;
  updateTenantConfig: (config: Partial<TenantConfig>) => Promise<void>;
  loading: boolean;
  error: string | null;
  currentTenant: TenantConfig | null;
  availableTenants: TenantConfig[];
}

export function useTenant(): TenantHook {
  const { state, switchTenant: switchTenantAction, getCurrentTenant: getCurrentTenantAction, getAllTenants: getAllTenantsAction, executeWorkflow } = useWorkflow();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchTenant = useCallback(async (tenantId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await switchTenantAction(tenantId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tenant switch failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [switchTenantAction]);

  const getCurrentTenant = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await getCurrentTenantAction();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current tenant');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCurrentTenantAction]);

  const getAllTenants = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await getAllTenantsAction();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get tenants');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllTenantsAction]);

  const updateTenantConfig = useCallback(async (config: Partial<TenantConfig>) => {
    if (!state.tenant.currentTenant) {
      throw new Error('No current tenant to update');
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await executeWorkflow('tenant', {
        tenantId: state.tenant.currentTenant.id,
        data: {
          action: 'updateTenantConfig',
          config
        }
      });

      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tenant configuration');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [executeWorkflow, state.tenant.currentTenant]);

  return {
    switchTenant,
    getCurrentTenant,
    getAllTenants,
    updateTenantConfig,
    loading: loading || state.tenant.loading,
    error: error || state.tenant.error,
    currentTenant: state.tenant.currentTenant,
    availableTenants: state.tenant.availableTenants
  };
}
