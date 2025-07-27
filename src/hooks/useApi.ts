import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import apiClient from '../services/apiClient';
import apiServices from '../services/apiServices';
import { ApiResponse } from '../types/api';
import { DatabaseMonitorData, HealthCheck } from '../services/apiServices';

// API State Interface
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  timestamp: string | null;
}

// API Options Interface
export interface ApiOptions {
  autoFetch?: boolean;
  showToast?: boolean;
  showLoading?: boolean;
  retry?: boolean;
  timeout?: number;
  cache?: boolean;
  cacheTime?: number;
}

// Cache Interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Cache Store
const cacheStore = new Map<string, CacheEntry<unknown>>();

// Custom Hook for API State Management
export function useApi<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
) {
  const {
    autoFetch = false,
    showToast = true,
    showLoading = true,
    retry = true,
    timeout,
    cache = false,
    cacheTime = 5 * 60 * 1000, // 5 minutes default
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
    timestamp: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheKey = cache ? endpoint : null;

  // Check cache
  const getCachedData = useCallback((): T | null => {
    if (!cacheKey || !cache) return null;
    
    const cached = cacheStore.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data as T;
    }
    
    if (cached) {
      cacheStore.delete(cacheKey);
    }
    return null;
  }, [cacheKey, cache]);

  // Set cache
  const setCachedData = useCallback((data: T) => {
    if (!cacheKey || !cache) return;
    
    cacheStore.set(cacheKey, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + cacheTime,
    });
  }, [cacheKey, cache, cacheTime]);

  // Fetch data
  const fetchData = useCallback(async (config?: any): Promise<ApiResponse<T>> => {
    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      setState({
        data: cachedData,
        loading: false,
        error: null,
        success: true,
        timestamp: new Date().toISOString(),
      });
      return {
        success: true,
        data: cachedData,
        timestamp: new Date().toISOString(),
      };
    }

    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false,
    }));

    try {
      const response = await apiClient.get<T>(endpoint, {
        ...config,
        showToast,
        showLoading,
        retry,
        timeout,
        headers: {
          ...config?.headers,
          // Add abort signal if supported
          ...(abortControllerRef.current && {
            signal: abortControllerRef.current.signal,
          }),
        },
      });

      if (response.success && response.data) {
        setCachedData(response.data);
      }

      setState({
        data: response.data || null,
        loading: false,
        error: response.error || null,
        success: response.success,
        timestamp: response.timestamp || new Date().toISOString(),
      });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching data';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        success: false,
        timestamp: new Date().toISOString(),
      });

      if (showToast) {
        toast.error(errorMessage);
      }

      return {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      };
    }
  }, [endpoint, showToast, showLoading, retry, timeout, getCachedData, setCachedData]);

  // Clear cache
  const clearCache = useCallback(() => {
    if (cacheKey) {
      cacheStore.delete(cacheKey);
    }
  }, [cacheKey]);

  // Refresh data (ignore cache)
  const refresh = useCallback(async (config?: Record<string, unknown>) => {
    clearCache();
    return fetchData(config);
  }, [fetchData, clearCache]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, fetchData]);

  return {
    ...state,
    fetchData,
    refresh,
    clearCache,
    isLoading: state.loading,
  };
}

// Hook for API Services
export function useApiServices() {
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(new Map());

  // Listen to API loading state changes
  useEffect(() => {
    const handleLoadingState = (event: CustomEvent) => {
      const { endpoint, loading } = event.detail;
      setLoadingStates(prev => {
        const newMap = new Map(prev);
        if (loading) {
          newMap.set(endpoint, true);
        } else {
          newMap.delete(endpoint);
        }
        return newMap;
      });
    };

    window.addEventListener('apiLoadingState', handleLoadingState as EventListener);
    
    return () => {
      window.removeEventListener('apiLoadingState', handleLoadingState as EventListener);
    };
  }, []);

  // Check if any API call is loading
  const isAnyLoading = loadingStates.size > 0;

  // Check if specific endpoint is loading
  const isLoading = useCallback((endpoint: string) => {
    return loadingStates.has(endpoint);
  }, [loadingStates]);

  return {
    apiServices,
    isAnyLoading,
    isLoading,
    loadingStates: new Map(loadingStates),
  };
}

// Hook for API Connection Status
export function useApiConnection() {
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    lastCheck: string | null;
    error: string | null;
  }>({
    connected: false,
    lastCheck: null,
    error: null,
  });

  const checkConnection = useCallback(async () => {
    try {
      const response = await apiServices.checkApiConnection();
      setConnectionStatus({
        connected: response.success,
        lastCheck: new Date().toISOString(),
        error: response.error || null,
      });
      return response.success;
    } catch (error: any) {
      setConnectionStatus({
        connected: false,
        lastCheck: new Date().toISOString(),
        error: error.message || 'Connection check failed',
      });
      return false;
    }
  }, []);

  // Auto-check connection on mount and every 30 seconds
  useEffect(() => {
    checkConnection();
    
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, [checkConnection]);

  return {
    ...connectionStatus,
    checkConnection,
  };
}

// Hook for Database Status
export function useDatabaseStatus() {
  const [dbStatus, setDbStatus] = useState<DatabaseMonitorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDbStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiServices.getDatabaseStatus();
      if (response.success && response.data) {
        setDbStatus(response.data);
      } else {
        setError(response.error || 'Failed to fetch database status');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Database status check failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch database status every 30 seconds
  useEffect(() => {
    fetchDbStatus();
    
    const interval = setInterval(fetchDbStatus, 30000);
    
    return () => clearInterval(interval);
  }, [fetchDbStatus]);

  return {
    dbStatus,
    loading,
    error,
    fetchDbStatus,
  };
}

// Hook for Health Check
export function useHealthCheck() {
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiServices.getDetailedHealth();
      if (response.success && response.data) {
        setHealth(response.data);
      } else {
        setError(response.error || 'Health check failed');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Health check failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-check health every 60 seconds
  useEffect(() => {
    checkHealth();
    
    const interval = setInterval(checkHealth, 60000);
    
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    health,
    loading,
    error,
    checkHealth,
  };
} 