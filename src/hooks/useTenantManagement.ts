import { useCallback, useEffect, useState } from 'react';
import { useTenant } from '../core/tenancy/TenantProvider';

// Hook for managing tenant features
export function useTenantFeatures() {
  const { tenant, switchTenant } = useTenant();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFeatures = useCallback(async (features: Record<string, boolean>) => {
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
        // TODO: Implement tenant config update
        console.log('Features updated:', features);
      } else {
        throw new Error(data.message || 'Failed to update tenant features');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const enableFeature = useCallback(async (feature: string) => {
    const currentFeatures = tenant?.features || {};
    if (!currentFeatures[feature as keyof typeof currentFeatures]) {
      await updateFeatures({ ...currentFeatures, [feature]: true });
    }
  }, [tenant?.features, updateFeatures]);

  const disableFeature = useCallback(async (feature: string) => {
    const currentFeatures = tenant?.features || {};
    await updateFeatures({ ...currentFeatures, [feature]: false });
  }, [tenant?.features, updateFeatures]);

  return {
    features: tenant?.features,
    loading,
    error,
    updateFeatures,
    enableFeature,
    disableFeature,
  };
}

// Hook for managing tenant branding
export function useTenantBranding() {
  const { tenant, switchTenant } = useTenant();
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
        // TODO: Implement tenant config update
        console.log('Branding updated:', branding);
      } else {
        throw new Error(data.message || 'Failed to update tenant branding');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTheme = useCallback(async (theme: string) => {
    const currentBranding = tenant?.branding || {};
    await updateBranding({ ...currentBranding, theme });
  }, [tenant?.branding, updateBranding]);

  const updateColors = useCallback(async (colors: any) => {
    const currentBranding = tenant?.branding || {};
    await updateBranding({ ...currentBranding, colors });
  }, [tenant?.branding, updateBranding]);

  const updateFonts = useCallback(async (fonts: any) => {
    const currentBranding = tenant?.branding || {};
    await updateBranding({ ...currentBranding, fonts });
  }, [tenant?.branding, updateBranding]);

  return {
    branding: tenant?.branding,
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
  const { tenant } = useTenant();
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
    if (!tenant?.limits || !usage) return undefined;
    
    const limitValue = (tenant.limits as any)[limit];
    const usageValue = usage[limit];
    
    if (typeof limitValue === 'number' && typeof usageValue === 'number') {
      return Math.max(0, limitValue - usageValue);
    }
    
    return undefined;
  }, [tenant?.limits, usage]);

  const isLimitExceeded = useCallback((limit: string) => {
    const remaining = getRemainingLimit(limit);
    return remaining !== undefined && remaining <= 0;
  }, [getRemainingLimit]);

  return {
    limits: tenant?.limits,
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
  const { tenant, switchTenant } = useTenant();
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
        // TODO: Implement tenant config update
        console.log('Security updated:', security);
      } else {
        throw new Error(data.message || 'Failed to update tenant security');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePermissions = useCallback(async (permissions: string[]) => {
    const currentSecurity = (tenant as any)?.security || {};
    await updateSecurity({ ...currentSecurity, permissions });
  }, [(tenant as any)?.security, updateSecurity]);

  const updateSSO = useCallback(async (sso: boolean) => {
    const currentSecurity = (tenant as any)?.security || {};
    await updateSecurity({ ...currentSecurity, sso });
  }, [(tenant as any)?.security, updateSecurity]);

  const updateMFA = useCallback(async (mfa: boolean) => {
    const currentSecurity = (tenant as any)?.security || {};
    await updateSecurity({ ...currentSecurity, mfa });
  }, [(tenant as any)?.security, updateSecurity]);

  return {
    security: (tenant as any)?.security,
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
  const { tenant } = useTenant();
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
  const { tenant } = useTenant();
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
  const { tenant } = useTenant();

  const transform = useCallback((component: any, transformationType: string = 'all') => {
    // TODO: Implement component transformation logic
    return component;
  }, []);

  return {
    transform,
  };
}

// Hook for tenant settings
export function useTenantSettings() {
  const { tenant, switchTenant } = useTenant();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSettings = useCallback(async (settings: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);

      const currentSettings = (tenant as any)?.settings || {};
      const updatedSettings = { ...currentSettings, ...settings };

      // TODO: Implement tenant config update
      console.log('Settings updated:', updatedSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [(tenant as any)?.settings]);

  const getSetting = useCallback((key: string, defaultValue?: any) => {
    return (tenant as any)?.settings?.[key] || defaultValue;
  }, [(tenant as any)?.settings]);

  return {
    settings: (tenant as any)?.settings,
    loading,
    error,
    updateSettings,
    getSetting,
  };
}
