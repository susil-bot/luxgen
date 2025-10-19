/**
 * Subdomain Mapping Configuration for Multi-Tenancy
 * Maps subdomains to tenant configurations
 */

export interface TenantConfig {
  id: string;
  name: string;
  slug: string;
  domain: string;
  subdomain: string;
  apiUrl: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
  };
  features: {
    analytics: boolean;
    notifications: boolean;
    chat: boolean;
    reports: boolean;
  };
  limits: {
    maxUsers: number;
    maxStorage: number;
    maxApiCalls: number;
  };
}

export const TENANT_CONFIGS: Record<string, TenantConfig> = {
  luxgen: {
    id: 'tenant_luxgen',
    name: 'LuxGen',
    slug: 'luxgen',
    domain: 'luxgen.com',
    subdomain: 'luxgen',
    apiUrl: process.env.REACT_APP_API_URL || 'https://luxgen-backend.netlify.app',
    theme: {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      logo: '/assets/logos/luxgen-logo.svg'
    },
    features: {
      analytics: true,
      notifications: true,
      chat: true,
      reports: true
    },
    limits: {
      maxUsers: 1000,
      maxStorage: 10000,
      maxApiCalls: 100000
    }
  },
  demo: {
    id: 'tenant_demo',
    name: 'Demo',
    slug: 'demo',
    domain: 'demo.luxgen.com',
    subdomain: 'demo',
    apiUrl: process.env.REACT_APP_API_URL || 'https://luxgen-backend.netlify.app',
    theme: {
      primaryColor: '#059669',
      secondaryColor: '#047857',
      logo: '/assets/logos/demo-logo.svg'
    },
    features: {
      analytics: true,
      notifications: false,
      chat: true,
      reports: false
    },
    limits: {
      maxUsers: 100,
      maxStorage: 1000,
      maxApiCalls: 10000
    }
  },
  test: {
    id: 'tenant_test',
    name: 'Test',
    slug: 'test',
    domain: 'test.luxgen.com',
    subdomain: 'test',
    apiUrl: process.env.REACT_APP_API_URL || 'https://luxgen-backend.netlify.app',
    theme: {
      primaryColor: '#dc2626',
      secondaryColor: '#b91c1c',
      logo: '/assets/logos/test-logo.svg'
    },
    features: {
      analytics: false,
      notifications: true,
      chat: false,
      reports: true
    },
    limits: {
      maxUsers: 50,
      maxStorage: 500,
      maxApiCalls: 5000
    }
  }
};

/**
 * Get tenant configuration by subdomain
 */
export const getTenantBySubdomain = (subdomain: string): TenantConfig | null => {
  return TENANT_CONFIGS[subdomain] || null;
};

/**
 * Get current tenant from window location
 */
export const getCurrentTenant = (): TenantConfig | null => {
  const hostname = window.location.hostname;
  
  // Extract subdomain from hostname
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    const subdomain = parts[0];
    return getTenantBySubdomain(subdomain);
  }
  
  // Fallback to luxgen for localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return TENANT_CONFIGS.luxgen;
  }
  
  return null;
};

/**
 * Get tenant configuration by slug
 */
export const getTenantBySlug = (slug: string): TenantConfig | null => {
  return Object.values(TENANT_CONFIGS).find(tenant => tenant.slug === slug) || null;
};

/**
 * Get all available tenants
 */
export const getAllTenants = (): TenantConfig[] => {
  return Object.values(TENANT_CONFIGS);
};

/**
 * Check if tenant has specific feature
 */
export const hasFeature = (tenant: TenantConfig, feature: keyof TenantConfig['features']): boolean => {
  return tenant.features[feature];
};

/**
 * Check if tenant is within limits
 */
export const isWithinLimits = (tenant: TenantConfig, usage: { users: number; storage: number; apiCalls: number }): boolean => {
  return (
    usage.users <= tenant.limits.maxUsers &&
    usage.storage <= tenant.limits.maxStorage &&
    usage.apiCalls <= tenant.limits.maxApiCalls
  );
};
