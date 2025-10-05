/**
 * LUXGEN DATA FLOW HOOK
 * Custom hook for data flow coordination between components
 */

import { useState, useCallback, useEffect } from 'react';
import { useWorkflow } from '../WorkflowProvider';
import { WorkflowContext, WorkflowResult } from '../types';

interface DataFlowHook {
  syncData: (source: string, target: string, payload: any) => Promise<void>;
  broadcastData: (source: string, payload: any) => Promise<void>;
  subscribeToData: (target: string, subscription: any) => Promise<void>;
  unsubscribeFromData: (target: string, subscription: any) => Promise<void>;
  loading: boolean;
  error: string | null;
  lastSync: string | null;
}

export function useDataFlow(): DataFlowHook {
  const { executeWorkflow, state } = useWorkflow();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const syncData = useCallback(async (source: string, target: string, payload: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await executeWorkflow('dataflow', {
        tenantId: state.tenant.currentTenant?.id || 'luxgen',
        data: {
          action: 'sync',
          source,
          target,
          payload
        }
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      setLastSync(new Date().toISOString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Data sync failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [executeWorkflow, state.tenant.currentTenant]);

  const broadcastData = useCallback(async (source: string, payload: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await executeWorkflow('dataflow', {
        tenantId: state.tenant.currentTenant?.id || 'luxgen',
        data: {
          action: 'broadcast',
          source,
          payload
        }
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      setLastSync(new Date().toISOString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Data broadcast failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [executeWorkflow, state.tenant.currentTenant]);

  const subscribeToData = useCallback(async (target: string, subscription: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await executeWorkflow('dataflow', {
        tenantId: state.tenant.currentTenant?.id || 'luxgen',
        data: {
          action: 'subscribe',
          target,
          subscription
        }
      });

      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscription failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [executeWorkflow, state.tenant.currentTenant]);

  const unsubscribeFromData = useCallback(async (target: string, subscription: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await executeWorkflow('dataflow', {
        tenantId: state.tenant.currentTenant?.id || 'luxgen',
        data: {
          action: 'unsubscribe',
          target,
          subscription
        }
      });

      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unsubscription failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [executeWorkflow, state.tenant.currentTenant]);

  // Auto-subscribe to global data updates when component mounts
  useEffect(() => {
    if (state.tenant.currentTenant) {
      subscribeToData('global', {
        type: 'global-updates',
        callback: (data: any) => {
          // Handle global update
        }
      });
    }

    // Cleanup subscription on unmount
    return () => {
      unsubscribeFromData('global', {
        type: 'global-updates'
      });
    };
  }, [state.tenant.currentTenant, subscribeToData, unsubscribeFromData]);

  return {
    syncData,
    broadcastData,
    subscribeToData,
    unsubscribeFromData,
    loading,
    error,
    lastSync
  };
}
