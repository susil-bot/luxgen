/**
 * Production Subdomain Mapping for Multi-Tenancy
 * This handles dynamic subdomain routing in production
 */

export interface ProductionTenantConfig {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  domain: string;
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

// Production tenant configurations
export const PRODUCTION_TENANT_CONFIGS: Record<string, ProductionTenantConfig> = {
  luxgen: {
    id: 'tenant_luxgen',
    name: 'LuxGen',
    slug: 'luxgen',
    subdomain: 'luxgen',
    domain: 'luxgen.vercel.app',
    apiUrl: 'https://luxgen-backend.netlify.app/api/v1',
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
    subdomain: 'demo',
    domain: 'demo-luxgen.vercel.app',
    apiUrl: 'https://luxgen-backend.netlify.app/api/v1',
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
    subdomain: 'test',
    domain: 'test-luxgen.vercel.app',
    apiUrl: 'https://luxgen-backend.netlify.app/api/v1',
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
 * Get tenant configuration by subdomain in production
 */
export const getProductionTenantBySubdomain = (subdomain: string): ProductionTenantConfig | null => {
  return PRODUCTION_TENANT_CONFIGS[subdomain] || null;
};

/**
 * Get current tenant from production domain
 */
export const getCurrentProductionTenant = (): ProductionTenantConfig | null => {
  const hostname = window.location.hostname;
  
  // Handle Vercel production domains
  if (hostname.includes('vercel.app')) {
    const subdomain = hostname.split('.')[0];
    return getProductionTenantBySubdomain(subdomain);
  }
  
  // Handle custom domains (if configured)
  if (hostname.includes('luxgen.com')) {
    const subdomain = hostname.split('.')[0];
    return getProductionTenantBySubdomain(subdomain);
  }
  
  // Fallback to luxgen for localhost/development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return PRODUCTION_TENANT_CONFIGS.luxgen;
  }
  
  return null;
};

/**
 * Get tenant configuration by slug
 */
export const getProductionTenantBySlug = (slug: string): ProductionTenantConfig | null => {
  return Object.values(PRODUCTION_TENANT_CONFIGS).find(tenant => tenant.slug === slug) || null;
};

/**
 * Get all available production tenants
 */
export const getAllProductionTenants = (): ProductionTenantConfig[] => {
  return Object.values(PRODUCTION_TENANT_CONFIGS);
};

/**
 * Check if current domain is a production tenant
 */
export const isProductionTenant = (): boolean => {
  const tenant = getCurrentProductionTenant();
  return tenant !== null;
};

/**
 * Get production API URL for current tenant
 */
export const getProductionApiUrl = (): string => {
  const tenant = getCurrentProductionTenant();
  return tenant?.apiUrl || 'https://luxgen-backend.netlify.app/api/v1';
};
