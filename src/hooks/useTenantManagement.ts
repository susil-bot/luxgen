import { useCallback, useEffect, useState } from 'react';
import { useRobustTenant } from '../contexts/RobustTenantContext';

// Hook for managing tenant features
export function useTenantFeatures() {
  const { state, updateTenantConfig } = useRobustTenant();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFeatures = useCallback(async (features: string[]) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/tenants/features', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update features: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await updateTenantConfig({ features });
      } else {
        throw new Error(data.message || 'Failed to update tenant features');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [updateTenantConfig]);

  const enableFeature = useCallback(async (feature: string) => {
    const currentFeatures = state.currentTenant?.features || [];
    if (!currentFeatures.includes(feature)) {
      await updateFeatures([...currentFeatures, feature]);
    }
  }, [state.currentTenant?.features, updateFeatures]);

  const disableFeature = useCallback(async (feature: string) => {
    const currentFeatures = state.currentTenant?.features || [];
    await updateFeatures(currentFeatures.filter(f => f !== feature));
  }, [state.currentTenant?.features, updateFeatures]);

  return {
    features: state.tenantFeatures,
    loading,
    error,
    updateFeatures,
    enableFeature,
    disableFeature,
  };
}

// Hook for managing tenant branding
export function useTenantBranding() {
  const { state, updateTenantConfig } = useRobustTenant();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBranding = useCallback(async (branding: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/tenants/branding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ branding }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update branding: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await updateTenantConfig({ branding });
      } else {
        throw new Error(data.message || 'Failed to update tenant branding');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [updateTenantConfig]);

  const updateTheme = useCallback(async (theme: string) => {
    const currentBranding = state.currentTenant?.branding || {};
    await updateBranding({ ...currentBranding, theme });
  }, [state.currentTenant?.branding, updateBranding]);

  const updateColors = useCallback(async (colors: any) => {
    const currentBranding = state.currentTenant?.branding || {};
    await updateBranding({ ...currentBranding, colors });
  }, [state.currentTenant?.branding, updateBranding]);

  const updateFonts = useCallback(async (fonts: any) => {
    const currentBranding = state.currentTenant?.branding || {};
    await updateBranding({ ...currentBranding, fonts });
  }, [state.currentTenant?.branding, updateBranding]);

  return {
    branding: state.tenantBranding,
    loading,
    error,
    updateBranding,
    updateTheme,
    updateColors,
    updateFonts,
  };
}

// Hook for managing tenant limits
export function useTenantLimits() {
  const { state } = useRobustTenant();
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/tenants/limits');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch limits: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setUsage(data.data.usage);
      } else {
        throw new Error(data.message || 'Failed to fetch tenant limits');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const getRemainingLimit = useCallback((limit: string) => {
    if (!state.tenantLimits || !usage) return undefined;
    
    const limitValue = state.tenantLimits[limit];
    const usageValue = usage[limit];
    
    if (typeof limitValue === 'number' && typeof usageValue === 'number') {
      return Math.max(0, limitValue - usageValue);
    }
    
    return undefined;
  }, [state.tenantLimits, usage]);

  const isLimitExceeded = useCallback((limit: string) => {
    const remaining = getRemainingLimit(limit);
    return remaining !== undefined && remaining <= 0;
  }, [getRemainingLimit]);

  return {
    limits: state.tenantLimits,
    usage,
    loading,
    error,
    getRemainingLimit,
    isLimitExceeded,
    refreshUsage: fetchUsage,
  };
}

// Hook for managing tenant security
export function useTenantSecurity() {
  const { state, updateTenantConfig } = useRobustTenant();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSecurity = useCallback(async (security: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/tenants/security', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ security }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update security: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await updateTenantConfig({ security });
      } else {
        throw new Error(data.message || 'Failed to update tenant security');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [updateTenantConfig]);

  const updatePermissions = useCallback(async (permissions: string[]) => {
    const currentSecurity = state.currentTenant?.security || {};
    await updateSecurity({ ...currentSecurity, permissions });
  }, [state.currentTenant?.security, updateSecurity]);

  const updateSSO = useCallback(async (sso: boolean) => {
    const currentSecurity = state.currentTenant?.security || {};
    await updateSecurity({ ...currentSecurity, sso });
  }, [state.currentTenant?.security, updateSecurity]);

  const updateMFA = useCallback(async (mfa: boolean) => {
    const currentSecurity = state.currentTenant?.security || {};
    await updateSecurity({ ...currentSecurity, mfa });
  }, [state.currentTenant?.security, updateSecurity]);

  return {
    security: state.tenantSecurity,
    loading,
    error,
    updateSecurity,
    updatePermissions,
    updateSSO,
    updateMFA,
  };
}

// Hook for tenant analytics
export function useTenantAnalytics() {
  const { state } = useRobustTenant();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/tenants/analytics');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch tenant analytics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refreshAnalytics: fetchAnalytics,
  };
}

// Hook for tenant health monitoring
export function useTenantHealth() {
  const { state } = useRobustTenant();
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/tenants/health');
      
      if (!response.ok) {
        throw new Error(`Failed to check health: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setHealth(data.data);
      } else {
        throw new Error(data.message || 'Failed to check tenant health');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    
    // Check health every 5 minutes
    const interval = setInterval(checkHealth, 300000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    health,
    loading,
    error,
    checkHealth,
  };
}

// Hook for component transformation
export function useTenantTransformation() {
  const { transformComponent } = useRobustTenant();

  const transform = useCallback((component: any, transformationType: string = 'all') => {
    return transformComponent(component, transformationType);
  }, [transformComponent]);

  return {
    transform,
  };
}

// Hook for tenant settings
export function useTenantSettings() {
  const { state, updateTenantConfig } = useRobustTenant();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSettings = useCallback(async (settings: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);

      const currentSettings = state.currentTenant?.settings || {};
      const updatedSettings = { ...currentSettings, ...settings };

      await updateTenantConfig({ settings: updatedSettings });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [state.currentTenant?.settings, updateTenantConfig]);

  const getSetting = useCallback((key: string, defaultValue?: any) => {
    return state.currentTenant?.settings?.[key] || defaultValue;
  }, [state.currentTenant?.settings]);

  return {
    settings: state.currentTenant?.settings,
    loading,
    error,
    updateSettings,
    getSetting,
  };
}
