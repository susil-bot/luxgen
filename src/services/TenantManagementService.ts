import { 
  Tenant, 
  TenantUser, 
  TenantPlan, 
  AuditLog, 
  ComplianceReport,
  TenantFilter,
  QueryOptions
} from '../types/multiTenancy';
import { multiTenancyManager } from './MultiTenancyManager';
import { databaseService } from './DatabaseService';
import { securityService } from './SecurityService';

export interface TenantStats {
  totalTenants: number;
  activeTenants: number;
  suspendedTenants: number;
  pendingTenants: number;
  totalUsers: number;
  totalRevenue: number;
  averageUsersPerTenant: number;
  topPlans: { plan: string; count: number }[];
  growthRate: number;
}

export interface TenantAnalytics {
  tenantId: string;
  period: 'daily' | 'weekly' | 'monthly';
  userGrowth: { date: string; users: number }[];
  apiUsage: { date: string; calls: number }[];
  storageUsage: { date: string; storage: number }[];
  activeUsers: { date: string; active: number }[];
  revenue: { date: string; amount: number }[];
}

export interface TenantHealth {
  tenantId: string;
  status: 'healthy' | 'warning' | 'critical';
  score: number; // 0-100
  issues: string[];
  recommendations: string[];
  lastChecked: Date;
  metrics: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    resourceUsage: number;
  };
}

export interface TenantBilling {
  tenantId: string;
  currentPlan: TenantPlan;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: Date;
  amount: number;
  currency: string;
  paymentMethod?: {
    type: string;
    last4?: string;
    brand?: string;
  };
  invoices: {
    id: string;
    number: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    dueDate: Date;
    paidAt?: Date;
  }[];
}

export class TenantManagementService {
  private static instance: TenantManagementService;

  private constructor() {}

  static getInstance(): TenantManagementService {
    if (!TenantManagementService.instance) {
      TenantManagementService.instance = new TenantManagementService();
    }
    return TenantManagementService.instance;
  }

  // CRUD Operations
  async createTenant(tenantData: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tenant> {
    try {
      // Validate tenant data
      this.validateTenantData(tenantData);

      // Check if slug/domain is unique
      await this.checkTenantUniqueness(tenantData.slug, tenantData.domain);

      // Create tenant using multi-tenancy manager
      const tenant = await multiTenancyManager.createTenant(tenantData);

      // Create audit log
      await this.createAuditLog({
        tenantId: tenant.id,
        action: 'tenant_created',
        resource: 'tenant',
        resourceId: tenant.id,
        details: { tenantName: tenant.name, plan: tenant.plan.name },
        ipAddress: 'system',
        userAgent: 'tenant-management-service',
        severity: 'low'
      });

      return tenant;
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  }

  async updateTenant(tenantId: string, updates: Partial<Tenant>): Promise<Tenant | null> {
    try {
      // Validate updates
      this.validateTenantUpdates(updates);

      // Update tenant
      const updatedTenant = await multiTenancyManager.updateTenant(tenantId, updates);

      if (updatedTenant) {
        // Create audit log
        await this.createAuditLog({
          tenantId: tenantId,
          action: 'tenant_updated',
          resource: 'tenant',
          resourceId: tenantId,
          details: { updates: Object.keys(updates) },
          ipAddress: 'system',
          userAgent: 'tenant-management-service',
          severity: 'low'
        });
      }

      return updatedTenant;
    } catch (error) {
      console.error('Error updating tenant:', error);
      throw error;
    }
  }

  async deleteTenant(tenantId: string): Promise<boolean> {
    try {
      // Check if tenant has active users
      const users = await multiTenancyManager.getTenantUsers(tenantId);
      const activeUsers = users.filter(u => u.status === 'active');
      
      if (activeUsers.length > 0) {
        throw new Error(`Cannot delete tenant with ${activeUsers.length} active users`);
      }

      // Delete tenant
      const deleted = await multiTenancyManager.deleteTenant(tenantId);

      if (deleted) {
        // Create audit log
        await this.createAuditLog({
          tenantId: tenantId,
          action: 'tenant_deleted',
          resource: 'tenant',
          resourceId: tenantId,
          details: { reason: 'admin_deletion' },
          ipAddress: 'system',
          userAgent: 'tenant-management-service',
          severity: 'high'
        });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting tenant:', error);
      throw error;
    }
  }

  async getTenant(tenantId: string): Promise<Tenant | null> {
    return await multiTenancyManager.getTenant(tenantId);
  }

  async getAllTenants(filter?: TenantFilter): Promise<Tenant[]> {
    const tenants = multiTenancyManager.getAllTenants();
    
    if (!filter) return tenants;

    return tenants.filter(tenant => {
      if (filter.tenantId && tenant.id !== filter.tenantId) return false;
      if (filter.includeSystem === false && tenant.settings.features.enableAuditLogs) return false;
      return true;
    });
  }

  // Analytics and Statistics
  async getTenantStats(): Promise<TenantStats> {
    const tenants = multiTenancyManager.getAllTenants();
    
    const totalTenants = tenants.length;
    const activeTenants = tenants.filter(t => t.status === 'active').length;
    const suspendedTenants = tenants.filter(t => t.status === 'suspended').length;
    const pendingTenants = tenants.filter(t => t.status === 'pending').length;
    
    const totalUsers = tenants.reduce((sum, t) => sum + t.limits.current.users, 0);
    const totalRevenue = tenants.reduce((sum, t) => sum + t.plan.pricing.monthly, 0);
    const averageUsersPerTenant = totalTenants > 0 ? totalUsers / totalTenants : 0;

    // Calculate top plans
    const planCounts = tenants.reduce((acc, tenant) => {
      const planType = tenant.plan.type;
      acc[planType] = (acc[planType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPlans = Object.entries(planCounts)
      .map(([plan, count]) => ({ plan, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate growth rate (mock data)
    const growthRate = 12.5; // 12.5% monthly growth

    return {
      totalTenants,
      activeTenants,
      suspendedTenants,
      pendingTenants,
      totalUsers,
      totalRevenue,
      averageUsersPerTenant,
      topPlans,
      growthRate
    };
  }

  async getTenantAnalytics(tenantId: string, period: 'daily' | 'weekly' | 'monthly'): Promise<TenantAnalytics> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Generate mock analytics data
    const now = new Date();
    const dataPoints = period === 'daily' ? 30 : period === 'weekly' ? 12 : 6;
    
    const userGrowth = Array.from({ length: dataPoints }, (_, i) => ({
      date: new Date(now.getTime() - (dataPoints - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      users: Math.floor(Math.random() * 20) + tenant.limits.current.users - 10
    }));

    const apiUsage = Array.from({ length: dataPoints }, (_, i) => ({
      date: new Date(now.getTime() - (dataPoints - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      calls: Math.floor(Math.random() * 5000) + tenant.limits.usage.apiCallsUsed - 2500
    }));

    const storageUsage = Array.from({ length: dataPoints }, (_, i) => ({
      date: new Date(now.getTime() - (dataPoints - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      storage: Math.floor(Math.random() * 50) + tenant.limits.usage.storageUsed - 25
    }));

    const activeUsers = Array.from({ length: dataPoints }, (_, i) => ({
      date: new Date(now.getTime() - (dataPoints - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: Math.floor(Math.random() * tenant.limits.current.users)
    }));

    const revenue = Array.from({ length: dataPoints }, (_, i) => ({
      date: new Date(now.getTime() - (dataPoints - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: tenant.plan.pricing.monthly
    }));

    return {
      tenantId,
      period,
      userGrowth,
      apiUsage,
      storageUsage,
      activeUsers,
      revenue
    };
  }

  async getTenantHealth(tenantId: string): Promise<TenantHealth> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Calculate health score based on various metrics
    const usagePercentage = (tenant.limits.usage.storageUsed / tenant.plan.limits.storage) * 100;
    const apiUsagePercentage = (tenant.limits.usage.apiCallsUsed / tenant.plan.limits.apiCalls) * 100;
    
    let score = 100;
    let issues: string[] = [];
    let recommendations: string[] = [];

    // Check storage usage
    if (usagePercentage > 90) {
      score -= 30;
      issues.push('Storage usage is critical');
      recommendations.push('Consider upgrading storage plan or cleaning up unused files');
    } else if (usagePercentage > 75) {
      score -= 15;
      issues.push('Storage usage is high');
      recommendations.push('Monitor storage usage and consider optimization');
    }

    // Check API usage
    if (apiUsagePercentage > 90) {
      score -= 25;
      issues.push('API usage is critical');
      recommendations.push('Consider upgrading API limits or optimizing API calls');
    } else if (apiUsagePercentage > 75) {
      score -= 10;
      issues.push('API usage is high');
      recommendations.push('Monitor API usage patterns');
    }

    // Check user count
    const userPercentage = (tenant.limits.current.users / tenant.plan.limits.users) * 100;
    if (userPercentage > 90) {
      score -= 20;
      issues.push('User limit is nearly reached');
      recommendations.push('Consider upgrading user limit or removing inactive users');
    }

    // Determine status
    let status: 'healthy' | 'warning' | 'critical';
    if (score >= 80) {
      status = 'healthy';
    } else if (score >= 60) {
      status = 'warning';
    } else {
      status = 'critical';
    }

    return {
      tenantId,
      status,
      score,
      issues,
      recommendations,
      lastChecked: new Date(),
      metrics: {
        uptime: 99.9,
        responseTime: 150,
        errorRate: 0.1,
        resourceUsage: usagePercentage
      }
    };
  }

  async getTenantBilling(tenantId: string): Promise<TenantBilling> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Generate mock billing data
    const nextBillingDate = new Date();
    nextBillingDate.setDate(nextBillingDate.getDate() + 15); // 15 days from now

    const invoices = [
      {
        id: 'inv_001',
        number: 'INV-2024-001',
        amount: tenant.plan.pricing.monthly,
        status: 'paid' as const,
        dueDate: new Date('2024-01-01'),
        paidAt: new Date('2024-01-01')
      },
      {
        id: 'inv_002',
        number: 'INV-2024-002',
        amount: tenant.plan.pricing.monthly,
        status: 'pending' as const,
        dueDate: nextBillingDate
      }
    ];

    return {
      tenantId,
      currentPlan: tenant.plan,
      billingCycle: 'monthly',
      nextBillingDate,
      amount: tenant.plan.pricing.monthly,
      currency: tenant.plan.pricing.currency,
      paymentMethod: {
        type: 'card',
        last4: '4242',
        brand: 'visa'
      },
      invoices
    };
  }

  // User Management
  async getTenantUsers(tenantId: string): Promise<TenantUser[]> {
    return await multiTenancyManager.getTenantUsers(tenantId);
  }

  async createTenantUser(
    tenantId: string,
    userData: Omit<TenantUser, 'id' | 'tenantId' | 'joinedAt' | 'lastActiveAt'>
  ): Promise<TenantUser> {
    return await multiTenancyManager.createTenantUser(tenantId, userData);
  }

  async updateTenantUser(
    tenantId: string,
    userId: string,
    updates: Partial<TenantUser>
  ): Promise<TenantUser | null> {
    const users = await multiTenancyManager.getTenantUsers(tenantId);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return null;

    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;

    // In a real implementation, you would update the database
    return updatedUser;
  }

  async deleteTenantUser(tenantId: string, userId: string): Promise<boolean> {
    const users = await multiTenancyManager.getTenantUsers(tenantId);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return false;

    users.splice(userIndex, 1);
    return true;
  }

  // Compliance and Auditing
  async getTenantAuditLogs(tenantId: string, filters?: any): Promise<AuditLog[]> {
    return await multiTenancyManager.getAuditLogs(tenantId, filters);
  }

  async generateComplianceReport(
    tenantId: string,
    type: 'gdpr' | 'sox' | 'hipaa' | 'pci' | 'custom'
  ): Promise<ComplianceReport> {
    return await multiTenancyManager.generateComplianceReport(tenantId, type);
  }

  async createAuditLog(auditLog: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const newAuditLog: AuditLog = {
      ...auditLog,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    // In a real implementation, you would save to database
    return newAuditLog;
  }

  // Resource Management
  async checkResourceLimits(tenantId: string, resourceType: string, amount: number): Promise<boolean> {
    return await multiTenancyManager.checkResourceLimits(tenantId, resourceType, amount);
  }

  async trackResourceUsage(tenantId: string, resourceType: string, amount: number): Promise<void> {
    await multiTenancyManager.trackResourceUsage(tenantId, resourceType, amount);
  }

  // Validation Methods
  private validateTenantData(tenantData: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (!tenantData.name || tenantData.name.trim().length === 0) {
      throw new Error('Tenant name is required');
    }

    if (!tenantData.slug || tenantData.slug.trim().length === 0) {
      throw new Error('Tenant slug is required');
    }

    if (!/^[a-z0-9-]+$/.test(tenantData.slug)) {
      throw new Error('Slug can only contain lowercase letters, numbers, and hyphens');
    }

    if (tenantData.domain && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(tenantData.domain)) {
      throw new Error('Invalid domain format');
    }

    if (!tenantData.settings.branding.supportEmail || 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenantData.settings.branding.supportEmail)) {
      throw new Error('Valid support email is required');
    }
  }

  private validateTenantUpdates(updates: Partial<Tenant>): void {
    if (updates.slug && !/^[a-z0-9-]+$/.test(updates.slug)) {
      throw new Error('Slug can only contain lowercase letters, numbers, and hyphens');
    }

    if (updates.domain && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(updates.domain)) {
      throw new Error('Invalid domain format');
    }

    if (updates.settings?.branding?.supportEmail && 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.settings.branding.supportEmail)) {
      throw new Error('Invalid support email format');
    }
  }

  private async checkTenantUniqueness(slug: string, domain?: string): Promise<void> {
    const tenants = multiTenancyManager.getAllTenants();
    
    const slugExists = tenants.some(t => t.slug === slug);
    if (slugExists) {
      throw new Error('Tenant slug already exists');
    }

    if (domain) {
      const domainExists = tenants.some(t => t.domain === domain);
      if (domainExists) {
        throw new Error('Domain already exists');
      }
    }
  }

  // Bulk Operations
  async bulkUpdateTenants(tenantIds: string[], updates: Partial<Tenant>): Promise<{ success: string[], failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    for (const tenantId of tenantIds) {
      try {
        await this.updateTenant(tenantId, updates);
        success.push(tenantId);
      } catch (error) {
        console.error(`Failed to update tenant ${tenantId}:`, error);
        failed.push(tenantId);
      }
    }

    return { success, failed };
  }

  async bulkDeleteTenants(tenantIds: string[]): Promise<{ success: string[], failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    for (const tenantId of tenantIds) {
      try {
        const deleted = await this.deleteTenant(tenantId);
        if (deleted) {
          success.push(tenantId);
        } else {
          failed.push(tenantId);
        }
      } catch (error) {
        console.error(`Failed to delete tenant ${tenantId}:`, error);
        failed.push(tenantId);
      }
    }

    return { success, failed };
  }

  // Export/Import
  async exportTenantData(tenantId: string): Promise<string> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const users = await this.getTenantUsers(tenantId);
    const auditLogs = await this.getTenantAuditLogs(tenantId);

    const exportData = {
      tenant,
      users,
      auditLogs,
      exportedAt: new Date().toISOString()
    };

    return JSON.stringify(exportData, null, 2);
  }

  async importTenantData(data: string): Promise<Tenant> {
    try {
      const importData = JSON.parse(data);
      
      if (!importData.tenant) {
        throw new Error('Invalid import data: tenant information missing');
      }

      // Validate the imported data
      this.validateTenantData(importData.tenant);

      // Create the tenant
      const tenant = await this.createTenant(importData.tenant);

      // Import users if present
      if (importData.users && Array.isArray(importData.users)) {
        for (const userData of importData.users) {
          try {
            await this.createTenantUser(tenant.id, userData);
          } catch (error) {
            console.warn(`Failed to import user ${userData.id}:`, error);
          }
        }
      }

      return tenant;
    } catch (error) {
      console.error('Error importing tenant data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const tenantManagementService = TenantManagementService.getInstance(); 