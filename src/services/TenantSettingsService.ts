import apiClient from './apiClient';
import { Tenant } from '../types/multiTenancy';

export interface TenantSettings {
  general: {
    companyName: string;
    domain?: string;
    subdomain?: string;
    timezone: string;
    language: string;
    currency: string;
    dateFormat: string;
    timeFormat: string;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    companyTagline: string;
    customCss?: string;
    enableCustomBranding: boolean;
  };
  security: {
    mfaRequired: boolean;
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      preventCommonPasswords: boolean;
      maxAge: number;
      preventReuse: number;
    };
    ipWhitelist: string[];
    allowedDomains: string[];
    enableAuditLogs: boolean;
    enableLoginNotifications: boolean;
    enableSuspiciousActivityAlerts: boolean;
  };
  notifications: {
    email: {
      enabled: boolean;
      smtpSettings?: {
        host: string;
        port: number;
        username: string;
        password: string;
        encryption: 'none' | 'ssl' | 'tls';
      };
      fromEmail: string;
      fromName: string;
    };
    sms: {
      enabled: boolean;
      provider: string;
      apiKey?: string;
      fromNumber?: string;
    };
    push: {
      enabled: boolean;
      webhookUrl?: string;
    };
    preferences: {
      welcomeEmail: boolean;
      passwordResetEmail: boolean;
      accountLockoutEmail: boolean;
      securityAlerts: boolean;
      weeklyDigest: boolean;
      monthlyReport: boolean;
    };
  };
  integrations: {
    slack: {
      enabled: boolean;
      webhookUrl?: string;
      channel?: string;
    };
    teams: {
      enabled: boolean;
      webhookUrl?: string;
    };
    webhook: {
      enabled: boolean;
      url?: string;
      events: string[];
    };
    api: {
      enabled: boolean;
      rateLimit: number;
      allowedOrigins: string[];
      enableApiKeys: boolean;
    };
  };
  billing: {
    plan: string;
    billingCycle: 'monthly' | 'yearly';
    autoRenew: boolean;
    paymentMethod?: {
      type: 'card' | 'bank' | 'paypal';
      last4?: string;
      expiryMonth?: number;
      expiryYear?: number;
    };
    billingAddress?: {
      name: string;
      company: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    invoices: {
      autoSend: boolean;
      includeTax: boolean;
      currency: string;
    };
  };
  limits: {
    users: {
      current: number;
      limit: number;
      allowOverage: boolean;
      overagePrice: number;
    };
    storage: {
      current: number;
      limit: number;
      allowOverage: boolean;
      overagePrice: number;
    };
    apiCalls: {
      current: number;
      limit: number;
      allowOverage: boolean;
      overagePrice: number;
    };
    customDomains: {
      current: number;
      limit: number;
    };
    integrations: {
      current: number;
      limit: number;
    };
  };
}

class TenantSettingsService {
  /**
   * Get tenant settings
   */
  async getTenantSettings(tenantId: string): Promise<TenantSettings> {
    try {
      const response = await apiClient.get(`/api/tenants/${tenantId}/settings`);
      return response.data as TenantSettings;
    } catch (error) {
      console.error('Error fetching tenant settings:', error);
      throw error;
    }
  }

  /**
   * Update tenant settings
   */
  async updateTenantSettings(tenantId: string, settings: Partial<TenantSettings>): Promise<Tenant> {
    try {
      const response = await apiClient.put(`/api/tenants/${tenantId}/settings`, settings);
      return response.data as Tenant;
    } catch (error) {
      console.error('Error updating tenant settings:', error);
      throw error;
    }
  }

  /**
   * Update specific setting category
   */
  async updateSettingCategory(
    tenantId: string, 
    category: keyof TenantSettings, 
    settings: Partial<TenantSettings[keyof TenantSettings]>
  ): Promise<Tenant> {
    try {
      const response = await apiClient.put(`/api/tenants/${tenantId}/settings/${category}`, settings);
      return response.data as Tenant;
    } catch (error) {
      console.error(`Error updating ${category} settings:`, error);
      throw error;
    }
  }

  /**
   * Reset settings to defaults
   */
  async resetSettings(tenantId: string): Promise<Tenant> {
    try {
      const response = await apiClient.post(`/api/tenants/${tenantId}/settings/reset`);
      return response.data as Tenant;
    } catch (error) {
      console.error('Error resetting tenant settings:', error);
      throw error;
    }
  }

  /**
   * Export settings as JSON
   */
  async exportSettings(tenantId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/api/tenants/${tenantId}/settings/export`);
      return response.data as Blob;
    } catch (error) {
      console.error('Error exporting tenant settings:', error);
      throw error;
    }
  }

  /**
   * Import settings from JSON
   */
  async importSettings(tenantId: string, settingsFile: File): Promise<Tenant> {
    try {
      const formData = new FormData();
      formData.append('settings', settingsFile);

      const response = await apiClient.post(`/api/tenants/${tenantId}/settings/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data as Tenant;
    } catch (error) {
      console.error('Error importing tenant settings:', error);
      throw error;
    }
  }

  /**
   * Validate settings before saving
   */
  async validateSettings(tenantId: string, settings: Partial<TenantSettings>): Promise<{
    valid: boolean;
    errors: Record<string, string[]>;
  }> {
    try {
      const response = await apiClient.post(`/api/tenants/${tenantId}/settings/validate`, settings);
      return response.data as {
        valid: boolean;
        errors: Record<string, string[]>;
      };
    } catch (error) {
      console.error('Error validating tenant settings:', error);
      throw error;
    }
  }

  /**
   * Get settings schema for validation
   */
  async getSettingsSchema(): Promise<any> {
    try {
      const response = await apiClient.get('/api/tenants/settings/schema');
      return response.data as any;
    } catch (error) {
      console.error('Error fetching settings schema:', error);
      throw error;
    }
  }

  /**
   * Test email configuration
   */
  async testEmailConfig(tenantId: string, emailConfig: TenantSettings['notifications']['email']): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await apiClient.post(`/api/tenants/${tenantId}/settings/test-email`, emailConfig);
      return response.data as {
        success: boolean;
        message: string;
      };
    } catch (error) {
      console.error('Error testing email configuration:', error);
      throw error;
    }
  }

  /**
   * Test SMS configuration
   */
  async testSmsConfig(tenantId: string, smsConfig: TenantSettings['notifications']['sms']): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await apiClient.post(`/api/tenants/${tenantId}/settings/test-sms`, smsConfig);
      return response.data as {
        success: boolean;
        message: string;
      };
    } catch (error) {
      console.error('Error testing SMS configuration:', error);
      throw error;
    }
  }

  /**
   * Test webhook configuration
   */
  async testWebhookConfig(tenantId: string, webhookConfig: TenantSettings['integrations']['webhook']): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await apiClient.post(`/api/tenants/${tenantId}/settings/test-webhook`, webhookConfig);
      return response.data as {
        success: boolean;
        message: string;
      };
    } catch (error) {
      console.error('Error testing webhook configuration:', error);
      throw error;
    }
  }

  /**
   * Get available timezones
   */
  async getTimezones(): Promise<Array<{ value: string; label: string }>> {
    try {
      const response = await apiClient.get('/api/tenants/settings/timezones');
      return response.data as Array<{ value: string; label: string }>;
    } catch (error) {
      console.error('Error fetching timezones:', error);
      throw error;
    }
  }

  /**
   * Get available languages
   */
  async getLanguages(): Promise<Array<{ value: string; label: string }>> {
    try {
      const response = await apiClient.get('/api/tenants/settings/languages');
      return response.data as Array<{ value: string; label: string }>;
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw error;
    }
  }

  /**
   * Get available currencies
   */
  async getCurrencies(): Promise<Array<{ value: string; label: string; symbol: string }>> {
    try {
      const response = await apiClient.get('/api/tenants/settings/currencies');
      return response.data as Array<{ value: string; label: string; symbol: string }>;
    } catch (error) {
      console.error('Error fetching currencies:', error);
      throw error;
    }
  }

  /**
   * Get available date formats
   */
  async getDateFormats(): Promise<Array<{ value: string; label: string; example: string }>> {
    try {
      const response = await apiClient.get('/api/tenants/settings/date-formats');
      return response.data as Array<{ value: string; label: string; example: string }>;
    } catch (error) {
      console.error('Error fetching date formats:', error);
      throw error;
    }
  }

  /**
   * Get available time formats
   */
  async getTimeFormats(): Promise<Array<{ value: string; label: string; example: string }>> {
    try {
      const response = await apiClient.get('/api/tenants/settings/time-formats');
      return response.data as Array<{ value: string; label: string; example: string }>;
    } catch (error) {
      console.error('Error fetching time formats:', error);
      throw error;
    }
  }

  /**
   * Get available SMS providers
   */
  async getSmsProviders(): Promise<Array<{ value: string; label: string; configFields: string[] }>> {
    try {
      const response = await apiClient.get('/api/tenants/settings/sms-providers');
      return response.data as Array<{ value: string; label: string; configFields: string[] }>;
    } catch (error) {
      console.error('Error fetching SMS providers:', error);
      throw error;
    }
  }

  /**
   * Get available webhook events
   */
  async getWebhookEvents(): Promise<Array<{ value: string; label: string; description: string }>> {
    try {
      const response = await apiClient.get('/api/tenants/settings/webhook-events');
      return response.data as Array<{ value: string; label: string; description: string }>;
    } catch (error) {
      console.error('Error fetching webhook events:', error);
      throw error;
    }
  }

  /**
   * Get settings audit log
   */
  async getSettingsAuditLog(tenantId: string, options?: {
    page?: number;
    limit?: number;
    category?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    logs: Array<{
      id: string;
      category: string;
      action: string;
      oldValue: any;
      newValue: any;
      userId: string;
      userName: string;
      timestamp: string;
      ipAddress: string;
    }>;
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const params = new URLSearchParams();
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.category) params.append('category', options.category);
      if (options?.action) params.append('action', options.action);
      if (options?.startDate) params.append('startDate', options.startDate);
      if (options?.endDate) params.append('endDate', options.endDate);
      
      const queryString = params.toString();
      const endpoint = `/api/tenants/${tenantId}/settings/audit-log${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data as {
        logs: Array<{
          id: string;
          category: string;
          action: string;
          oldValue: any;
          newValue: any;
          userId: string;
          userName: string;
          timestamp: string;
          ipAddress: string;
        }>;
        total: number;
        page: number;
        limit: number;
      };
    } catch (error) {
      console.error('Error fetching settings audit log:', error);
      throw error;
    }
  }

  /**
   * Revert settings to a specific audit log entry
   */
  async revertSettings(tenantId: string, auditLogId: string): Promise<Tenant> {
    try {
      const response = await apiClient.post(`/api/tenants/${tenantId}/settings/revert/${auditLogId}`);
      return response.data as Tenant;
    } catch (error) {
      console.error('Error reverting tenant settings:', error);
      throw error;
    }
  }
}

export default new TenantSettingsService(); 