import { apiClient } from './apiClient';

export interface TenantInfo {
  id: string;
  slug: string;
  name: string;
  domain?: string;
  status: 'active' | 'suspended' | 'expired' | 'pending';
  features: Record<string, boolean>;
  limits: Record<string, number>;
  branding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
  settings: Record<string, any>;
}

export interface TenantIdentifier {
  type: 'subdomain' | 'domain' | 'path' | 'stored';
  identifier: string;
}

class TenantService {
  private cache = new Map<string, TenantInfo>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Get tenant information by identifier
   */
  async getTenant(identifier: TenantIdentifier): Promise<TenantInfo | null> {
    try {
      const cacheKey = `${identifier.type}:${identifier.identifier}`;
      
      // Check cache first
      const cached = this.cache.get(cacheKey);
      if (cached && this.isCacheValid(cached)) {
        return cached;
      }

      // Fetch from API
      const response = await apiClient.post('/api/v1/tenant/identify', {
        type: identifier.type,
        identifier: identifier.identifier
      });

      if (response.data.success) {
        const tenant = response.data.data;
        this.cache.set(cacheKey, tenant);
        return tenant;
      }

      return null;
    } catch (error) {
      console.error('Error fetching tenant:', error);
      return null;
    }
  }

  /**
   * Get tenant by subdomain
   */
  async getTenantBySubdomain(subdomain: string): Promise<TenantInfo | null> {
    return this.getTenant({ type: 'subdomain', identifier: subdomain });
  }

  /**
   * Get tenant by custom domain
   */
  async getTenantByDomain(domain: string): Promise<TenantInfo | null> {
    return this.getTenant({ type: 'domain', identifier: domain });
  }

  /**
   * Get tenant by slug
   */
  async getTenantBySlug(slug: string): Promise<TenantInfo | null> {
    return this.getTenant({ type: 'path', identifier: slug });
  }

  /**
   * Validate tenant access
   */
  async validateTenantAccess(tenantId: string, userId?: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/api/v1/tenant/validate-access', {
        tenantId,
        userId
      });
      return response.data.success;
    } catch (error) {
      console.error('Error validating tenant access:', error);
      return false;
    }
  }

  /**
   * Get tenant configuration
   */
  async getTenantConfig(tenantId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/v1/tenant/${tenantId}/config`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tenant config:', error);
      return null;
    }
  }

  /**
   * Update tenant configuration
   */
  async updateTenantConfig(tenantId: string, config: any): Promise<boolean> {
    try {
      const response = await apiClient.put(`/api/v1/tenant/${tenantId}/config`, config);
      return response.data.success;
    } catch (error) {
      console.error('Error updating tenant config:', error);
      return false;
    }
  }

  /**
   * Check if cache is still valid
   */
  private isCacheValid(tenant: TenantInfo): boolean {
    // For now, always return false to force fresh fetch
    // In production, you might want to implement timestamp-based cache validation
    return false;
  }

  /**
   * Clear tenant cache
   */
  clearCache(tenantId?: string): void {
    if (tenantId) {
      // Clear specific tenant cache
      for (const [key, value] of Array.from(this.cache.entries())) {
        if (value.id === tenantId) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }

  /**
   * Get tenant health status
   */
  async getTenantHealth(tenantId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/v1/tenant/${tenantId}/health`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tenant health:', error);
      return null;
    }
  }

  /**
   * Get tenant analytics
   */
  async getTenantAnalytics(tenantId: string, period: string = '30d'): Promise<any> {
    try {
      const response = await apiClient.get(`/api/v1/tenant/${tenantId}/analytics?period=${period}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tenant analytics:', error);
      return null;
    }
  }
}

export const tenantService = new TenantService();