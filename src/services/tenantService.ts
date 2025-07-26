import apiClient, { ApiResponse } from './apiClient';

// Tenant Types
export interface Tenant {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  industry?: string;
  companySize?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  timezone: string;
  language: string;
  subscription: {
    plan: 'free' | 'basic' | 'professional' | 'enterprise';
    status: 'active' | 'trial' | 'expired' | 'cancelled' | 'suspended';
    startDate: string;
    endDate?: string;
    trialEndDate: string;
    billingCycle: 'monthly' | 'yearly';
    amount: number;
    currency: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  };
  features: {
    polls: {
      enabled: boolean;
      maxPolls: number;
      maxRecipients: number;
    };
    analytics: {
      enabled: boolean;
      retention: number;
    };
    integrations: {
      slack: boolean;
      teams: boolean;
      email: boolean;
    };
    branding: {
      enabled: boolean;
      logo?: string;
      colors: {
        primary: string;
        secondary: string;
      };
    };
    security: {
      sso: boolean;
      mfa: boolean;
      ipWhitelist?: string[];
    };
  };
  usage: {
    pollsCreated: number;
    totalRecipients: number;
    totalResponses: number;
    lastActivity: string;
  };
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  isVerified: boolean;
  settings: {
    allowPublicPolls: boolean;
    requireEmailVerification: boolean;
    autoArchivePolls: boolean;
    archiveAfterDays: number;
    notificationPreferences: {
      email: boolean;
      inApp: boolean;
      slack: boolean;
    };
  };
  metadata?: {
    source?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TenantStats {
  basic: {
    name: string;
    slug: string;
    status: string;
    isVerified: boolean;
    createdAt: string;
    lastActivity: string;
  };
  subscription: {
    plan: string;
    status: string;
    isActive: boolean;
    isInTrial: boolean;
    trialDaysRemaining: number;
    startDate: string;
    endDate?: string;
  };
  usage: {
    pollsCreated: number;
    totalRecipients: number;
    totalResponses: number;
    lastActivity: string;
  };
  features: {
    polls: {
      enabled: boolean;
      maxPolls: number;
      maxRecipients: number;
    };
    analytics: {
      enabled: boolean;
      retention: number;
    };
    integrations: {
      slack: boolean;
      teams: boolean;
      email: boolean;
    };
    branding: {
      enabled: boolean;
      logo?: string;
      colors: {
        primary: string;
        secondary: string;
      };
    };
  };
}

export interface TenantAnalytics {
  overview: {
    totalTenants: number;
    activeTenants: number;
    verifiedTenants: number;
    trialTenants: number;
    totalPolls: number;
    totalRecipients: number;
    totalResponses: number;
  };
  dailySignups: Array<{
    _id: string;
    count: number;
  }>;
  subscriptionDistribution: Array<{
    _id: string;
    count: number;
  }>;
  period: string;
}

export interface TenantFilters {
  page?: number;
  limit?: number;
  status?: string;
  subscriptionStatus?: string;
  industry?: string;
  companySize?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
  verified?: boolean;
}

export interface TenantCreateData {
  name: string;
  slug?: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  industry?: string;
  companySize?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  timezone?: string;
  language?: string;
  subscription?: {
    plan?: 'free' | 'basic' | 'professional' | 'enterprise';
    status?: 'active' | 'trial' | 'expired' | 'cancelled' | 'suspended';
    billingCycle?: 'monthly' | 'yearly';
    amount?: number;
    currency?: string;
  };
  features?: {
    polls?: {
      enabled?: boolean;
      maxPolls?: number;
      maxRecipients?: number;
    };
    analytics?: {
      enabled?: boolean;
      retention?: number;
    };
    integrations?: {
      slack?: boolean;
      teams?: boolean;
      email?: boolean;
    };
    branding?: {
      enabled?: boolean;
      logo?: string;
      colors?: {
        primary?: string;
        secondary?: string;
      };
    };
    security?: {
      sso?: boolean;
      mfa?: boolean;
      ipWhitelist?: string[];
    };
  };
  settings?: {
    allowPublicPolls?: boolean;
    requireEmailVerification?: boolean;
    autoArchivePolls?: boolean;
    archiveAfterDays?: number;
    notificationPreferences?: {
      email?: boolean;
      inApp?: boolean;
      slack?: boolean;
    };
  };
  metadata?: {
    source?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

export interface TenantUpdateData extends Partial<TenantCreateData> {}

export interface SubscriptionUpdateData {
  plan?: 'free' | 'basic' | 'professional' | 'enterprise';
  status?: 'active' | 'trial' | 'expired' | 'cancelled' | 'suspended';
  billingCycle?: 'monthly' | 'yearly';
  amount?: number;
  currency?: string;
  endDate?: string;
}

export interface FeaturesUpdateData {
  polls?: {
    enabled?: boolean;
    maxPolls?: number;
    maxRecipients?: number;
  };
  analytics?: {
    enabled?: boolean;
    retention?: number;
  };
  integrations?: {
    slack?: boolean;
    teams?: boolean;
    email?: boolean;
  };
  branding?: {
    enabled?: boolean;
    logo?: string;
    colors?: {
      primary?: string;
      secondary?: string;
    };
  };
  security?: {
    sso?: boolean;
    mfa?: boolean;
    ipWhitelist?: string[];
  };
}

// Tenant Service Class
class TenantService {
  // Create tenant
  async createTenant(data: TenantCreateData): Promise<ApiResponse<Tenant>> {
    return apiClient.post('/api/tenants/create', data);
  }

  // Get all tenants with filtering and pagination
  async getTenants(filters?: TenantFilters): Promise<ApiResponse<{
    data: Tenant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.subscriptionStatus) params.append('subscriptionStatus', filters.subscriptionStatus);
    if (filters?.industry) params.append('industry', filters.industry);
    if (filters?.companySize) params.append('companySize', filters.companySize);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.verified !== undefined) params.append('verified', filters.verified.toString());

    const queryString = params.toString();
    const endpoint = `/api/tenants${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(endpoint);
  }

  // Get tenant by ID
  async getTenantById(id: string): Promise<ApiResponse<Tenant>> {
    return apiClient.get(`/api/tenants/${id}`);
  }

  // Get tenant by slug
  async getTenantBySlug(slug: string): Promise<ApiResponse<Tenant>> {
    return apiClient.get(`/api/tenants/slug/${slug}`);
  }

  // Update tenant
  async updateTenant(id: string, data: TenantUpdateData): Promise<ApiResponse<Tenant>> {
    return apiClient.put(`/api/tenants/${id}`, data);
  }

  // Delete tenant
  async deleteTenant(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/tenants/${id}`);
  }

  // Verify tenant
  async verifyTenant(token: string): Promise<ApiResponse<{
    id: string;
    name: string;
    slug: string;
    isVerified: boolean;
  }>> {
    return apiClient.get(`/api/tenants/verify/${token}`);
  }

  // Resend verification email
  async resendVerification(id: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/api/tenants/${id}/resend-verification`);
  }

  // Update subscription
  async updateSubscription(id: string, data: SubscriptionUpdateData): Promise<ApiResponse<{
    id: string;
    subscription: Tenant['subscription'];
  }>> {
    return apiClient.put(`/api/tenants/${id}/subscription`, data);
  }

  // Update features
  async updateFeatures(id: string, data: FeaturesUpdateData): Promise<ApiResponse<{
    id: string;
    features: Tenant['features'];
  }>> {
    return apiClient.put(`/api/tenants/${id}/features`, data);
  }

  // Get tenant statistics
  async getTenantStats(id: string): Promise<ApiResponse<TenantStats>> {
    return apiClient.get(`/api/tenants/${id}/stats`);
  }

  // Get all tenant statistics (admin)
  async getAllTenantStats(): Promise<ApiResponse<{
    overview: {
      totalTenants: number;
      activeTenants: number;
      verifiedTenants: number;
      totalPolls: number;
      totalRecipients: number;
      totalResponses: number;
      avgResponseRate: number;
    };
    subscriptions: Array<{
      _id: string;
      count: number;
    }>;
    industries: Array<{
      _id: string;
      count: number;
    }>;
  }>> {
    return apiClient.get('/api/tenants/stats');
  }

  // Advanced search
  async searchTenants(filters: TenantFilters): Promise<ApiResponse<{
    data: Tenant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters: TenantFilters;
  }>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = `/api/tenants/search/advanced${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(endpoint);
  }

  // Get tenant analytics
  async getTenantAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<ApiResponse<TenantAnalytics>> {
    return apiClient.get(`/api/tenants/analytics/overview?period=${period}`);
  }

  // Bulk operations
  async bulkUpdateTenants(tenantIds: string[], updates: TenantUpdateData): Promise<ApiResponse<{
    matched: number;
    modified: number;
  }>> {
    return apiClient.post('/api/tenants/bulk/update', { tenantIds, updates });
  }

  async bulkDeleteTenants(tenantIds: string[]): Promise<ApiResponse<{
    deleted: number;
  }>> {
    return apiClient.post('/api/tenants/bulk/delete', { tenantIds });
  }

  // Export tenants
  async exportTenants(format: 'csv' = 'csv', filters?: {
    status?: string;
    subscriptionStatus?: string;
    industry?: string;
  }): Promise<ApiResponse<string>> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.subscriptionStatus) params.append('subscriptionStatus', filters.subscriptionStatus);
    if (filters?.industry) params.append('industry', filters.industry);

    const queryString = params.toString();
    const endpoint = `/api/tenants/export/${format}${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(endpoint, { showToast: false });
  }

  // Utility methods
  async checkTenantExists(slug: string): Promise<boolean> {
    try {
      const response = await this.getTenantBySlug(slug);
      return response.success;
    } catch {
      return false;
    }
  }

  async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    
    while (await this.checkTenantExists(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  }

  // Feature access methods
  async checkFeatureAccess(tenantId: string, feature: 'polls' | 'analytics' | 'branding'): Promise<boolean> {
    try {
      const response = await this.getTenantById(tenantId);
      if (!response.success || !response.data) return false;
      
      const tenant = response.data;
      return tenant.features[feature]?.enabled || false;
    } catch {
      return false;
    }
  }

  async checkUsageLimit(tenantId: string, feature: keyof Tenant['features'], currentUsage: number): Promise<boolean> {
    try {
      const response = await this.getTenantById(tenantId);
      if (!response.success || !response.data) return false;
      
      const tenant = response.data;
      const featureConfig = tenant.features[feature] as any;
      const limit = featureConfig?.maxPolls || featureConfig?.maxRecipients;
      return currentUsage < limit;
    } catch {
      return false;
    }
  }

  // Subscription helpers
  async isSubscriptionActive(tenantId: string): Promise<boolean> {
    try {
      const response = await this.getTenantStats(tenantId);
      if (!response.success || !response.data) return false;
      
      return response.data.subscription.isActive;
    } catch {
      return false;
    }
  }

  async isInTrial(tenantId: string): Promise<boolean> {
    try {
      const response = await this.getTenantStats(tenantId);
      if (!response.success || !response.data) return false;
      
      return response.data.subscription.isInTrial;
    } catch {
      return false;
    }
  }

  async getTrialDaysRemaining(tenantId: string): Promise<number> {
    try {
      const response = await this.getTenantStats(tenantId);
      if (!response.success || !response.data) return 0;
      
      return response.data.subscription.trialDaysRemaining;
    } catch {
      return 0;
    }
  }
}

// Create singleton instance
const tenantService = new TenantService();

export default tenantService; 