/**
 * Tenant Types for Robust Multi-Tenant Architecture
 */

export interface TenantConfiguration {
  id: string;
  slug: string;
  name: string;
  domain: string;
  settings: Record<string, any>;
  features: string[];
  limits: TenantLimits;
  branding: TenantBranding;
  security: TenantSecurity;
  integrations: Record<string, any>;
  customFields: Record<string, any>;
  lastUpdated: Date;
}

export interface TenantLimits {
  users?: number;
  storage?: number;
  apiCalls?: number;
  customFields?: number;
  [key: string]: number | undefined;
}

export interface TenantBranding {
  theme?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  fonts?: {
    primary?: string;
    secondary?: string;
    sizes?: Record<string, string>;
  };
  logo?: string;
  favicon?: string;
}

export interface TenantSecurity {
  permissions?: string[];
  sso?: boolean;
  mfa?: boolean;
  sessionTimeout?: number;
  ipWhitelist?: string[];
  [key: string]: any;
}

export interface TenantFeatures {
  enabled: string[];
  disabled: string[];
  available: string[];
}

export interface TenantUsage {
  users: number;
  storage: number;
  apiCalls: number;
  lastActivity: Date;
}

export interface TenantHealth {
  tenant: string;
  status: 'healthy' | 'unhealthy';
  lastUpdated: Date;
  features: number;
  settings: number;
  integrations: number;
  timestamp: string;
  error?: string;
}

export interface TenantAnalytics {
  tenant: string;
  features: number;
  settings: number;
  integrations: number;
  lastUpdated: Date;
  timestamp: string;
}

export interface TransformationRule {
  name: string;
  transform: (component: any, tenantConfig: TenantConfiguration) => any;
  priority: number;
}

export interface TenantContext {
  tenant: string;
  id: string;
  name: string;
  domain: string;
  lastUpdated: Date;
}
