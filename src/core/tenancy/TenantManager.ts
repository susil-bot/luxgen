/**
 * ROBUST TENANT MANAGER
 * Centralized tenant management with proper error handling and type safety
 */

import apiClient, { ApiResponse } from '../api/ApiClient';

// Core Tenant Types
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  subdomain?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  settings: TenantSettings;
  features: TenantFeatures;
  limits: TenantLimits;
  branding: TenantBranding;
  createdAt: string;
  updatedAt: string;
}

export interface TenantSettings {
  general: {
    timezone: string;
    language: string;
    currency: string;
    dateFormat: string;
    timeFormat: string;
  };
  security: {
    passwordPolicy: PasswordPolicy;
    sessionPolicy: SessionPolicy;
    mfaPolicy: MfaPolicy;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  integrations: {
    [key: string]: any;
  };
}

export interface TenantFeatures {
  enableAuditLogs: boolean;
  enableAnalytics: boolean;
  enableMultiLanguage: boolean;
  enableCustomBranding: boolean;
  enableAdvancedSecurity: boolean;
  enableApiAccess: boolean;
  enableWebhooks: boolean;
  enableSSO: boolean;
  enableMFA: boolean;
}

export interface TenantLimits {
  maxUsers: number;
  maxStorage: number; // in MB
  maxApiCalls: number; // per month
  maxConcurrentSessions: number;
  dataRetentionDays: number;
  maxFileSize: number; // in MB
  maxProjects: number;
  maxTeams: number;
}

export interface TenantBranding {
  logo?: string;
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
  customCss?: string;
  customHtml?: string;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventCommonPasswords: boolean;
  maxAge: number; // in days
}

export interface SessionPolicy {
  maxDuration: number; // in minutes
  idleTimeout: number; // in minutes
  maxConcurrent: number;
  requireReauth: boolean;
}

export interface MfaPolicy {
  enabled: boolean;
  required: boolean;
  methods: Array<'sms' | 'email' | 'authenticator' | 'backup'>;
  backupCodes: boolean;
}

export interface TenantUser {
  id: string;
  tenantId: string;
  userId: string;
  role: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  joinedAt: string;
  lastActiveAt: string;
}

export interface TenantContext {
  tenant: Tenant;
  user: TenantUser;
  permissions: string[];
  isAdmin: boolean;
  isOwner: boolean;
}

// Tenant Manager Class
export class TenantManager {
  private static instance: TenantManager;
  private currentTenant: Tenant | null = null;
  private currentUser: TenantUser | null = null;
  private permissions: string[] = [];
  private listeners: Array<(context: TenantContext | null) => void> = [];

  private constructor() {
    this.initializeFromStorage();
  }

  public static getInstance(): TenantManager {
    if (!TenantManager.instance) {
      TenantManager.instance = new TenantManager();
    }
    return TenantManager.instance;
  }

  // Initialization
  private initializeFromStorage(): void {
    try {
      const storedTenant = localStorage.getItem('currentTenant');
      const storedUser = localStorage.getItem('currentTenantUser');
      const storedPermissions = localStorage.getItem('currentTenantPermissions');

      if (storedTenant) {
        this.currentTenant = JSON.parse(storedTenant);
      }

      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }

      if (storedPermissions) {
        this.permissions = JSON.parse(storedPermissions);
      }
    } catch (error) {
      console.error('Failed to initialize tenant from storage:', error);
      this.clearContext();
    }
  }

  // Tenant Operations
  async getTenant(tenantId: string): Promise<Tenant | null> {
    try {
      const response = await apiClient.get<Tenant>(`/api/tenants/${tenantId}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.error || 'Failed to fetch tenant');
    } catch (error) {
      console.error('Error fetching tenant:', error);
      throw error;
    }
  }

  async createTenant(tenantData: Partial<Tenant>): Promise<Tenant> {
    try {
      const response = await apiClient.post<Tenant>('/api/tenants', tenantData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.error || 'Failed to create tenant');
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  }

  async updateTenant(tenantId: string, updates: Partial<Tenant>): Promise<Tenant> {
    try {
      const response = await apiClient.put<Tenant>(`/api/tenants/${tenantId}`, updates);
      
      if (response.success && response.data) {
        // Update current tenant if it's the same
        if (this.currentTenant?.id === tenantId) {
          this.setCurrentTenant(response.data);
        }
        return response.data;
      }
      
      throw new Error(response.error || 'Failed to update tenant');
    } catch (error) {
      console.error('Error updating tenant:', error);
      throw error;
    }
  }

  async deleteTenant(tenantId: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/api/tenants/${tenantId}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete tenant');
      }

      // Clear context if current tenant was deleted
      if (this.currentTenant?.id === tenantId) {
        this.clearContext();
      }
    } catch (error) {
      console.error('Error deleting tenant:', error);
      throw error;
    }
  }

  // User Operations
  async getTenantUsers(tenantId: string): Promise<TenantUser[]> {
    try {
      const response = await apiClient.get<TenantUser[]>(`/api/tenants/${tenantId}/users`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.error || 'Failed to fetch tenant users');
    } catch (error) {
      console.error('Error fetching tenant users:', error);
      throw error;
    }
  }

  async addUserToTenant(tenantId: string, userId: string, role: string): Promise<TenantUser> {
    try {
      const response = await apiClient.post<TenantUser>(`/api/tenants/${tenantId}/users`, {
        userId,
        role,
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.error || 'Failed to add user to tenant');
    } catch (error) {
      console.error('Error adding user to tenant:', error);
      throw error;
    }
  }

  async removeUserFromTenant(tenantId: string, userId: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/api/tenants/${tenantId}/users/${userId}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to remove user from tenant');
      }
    } catch (error) {
      console.error('Error removing user from tenant:', error);
      throw error;
    }
  }

  // Context Management
  setCurrentTenant(tenant: Tenant): void {
    this.currentTenant = tenant;
    localStorage.setItem('currentTenant', JSON.stringify(tenant));
    this.notifyListeners();
  }

  setCurrentUser(user: TenantUser): void {
    this.currentUser = user;
    localStorage.setItem('currentTenantUser', JSON.stringify(user));
    this.notifyListeners();
  }

  setPermissions(permissions: string[]): void {
    this.permissions = permissions;
    localStorage.setItem('currentTenantPermissions', JSON.stringify(permissions));
    this.notifyListeners();
  }

  getCurrentContext(): TenantContext | null {
    if (!this.currentTenant || !this.currentUser) {
      return null;
    }

    return {
      tenant: this.currentTenant,
      user: this.currentUser,
      permissions: this.permissions,
      isAdmin: this.permissions.includes('admin'),
      isOwner: this.permissions.includes('owner'),
    };
  }

  clearContext(): void {
    this.currentTenant = null;
    this.currentUser = null;
    this.permissions = [];
    
    localStorage.removeItem('currentTenant');
    localStorage.removeItem('currentTenantUser');
    localStorage.removeItem('currentTenantPermissions');
    
    this.notifyListeners();
  }

  // Permission Checking
  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission) || this.permissions.includes('admin');
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  canAccess(resource: string, action: string): boolean {
    const permission = `${resource}:${action}`;
    return this.hasPermission(permission);
  }

  // Event Listeners
  addListener(listener: (context: TenantContext | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    const context = this.getCurrentContext();
    this.listeners.forEach(listener => listener(context));
  }

  // Utility Methods
  getCurrentTenant(): Tenant | null {
    return this.currentTenant;
  }

  getCurrentUser(): TenantUser | null {
    return this.currentUser;
  }

  getCurrentPermissions(): string[] {
    return [...this.permissions];
  }

  isInitialized(): boolean {
    return this.currentTenant !== null && this.currentUser !== null;
  }

  // Tenant Detection
  detectTenantFromUrl(): string | null {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    // Skip common subdomains
    if (['www', 'app', 'admin', 'api', 'localhost', '127.0.0.1'].includes(subdomain)) {
      return null;
    }
    
    return subdomain;
  }

  detectTenantFromParams(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tenant');
  }

  async switchTenant(tenantId: string): Promise<void> {
    try {
      const tenant = await this.getTenant(tenantId);
      if (!tenant) {
        throw new Error('Tenant not found');
      }

      // Get user for this tenant
      const users = await this.getTenantUsers(tenantId);
      const user = users.find(u => u.status === 'active');
      
      if (!user) {
        throw new Error('No active user found for this tenant');
      }

      // Set new context
      this.setCurrentTenant(tenant);
      this.setCurrentUser(user);
      this.setPermissions(user.permissions);

      // Update API client tenant context
      apiClient.setTenantId(tenantId);
    } catch (error) {
      console.error('Error switching tenant:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const tenantManager = TenantManager.getInstance();
export default tenantManager;
