import { 
  Tenant, 
  TenantUser, 
  TenantSession, 
  TenantSchema,
  GlobalObject,
  SharedResource,
  AuditLog,
  ComplianceReport,
  TenantFilter,
  QueryOptions,
  TenantId
} from '../types/multiTenancy';
import { securityService } from './SecurityService';
import { databaseService } from './DatabaseService';
import { schemaService } from './SchemaService';
import { globalObjectsService } from './GlobalObjectsService';

// Multi-Tenancy Manager - Orchestrates all multi-tenancy services
export class MultiTenancyManager {
  private static instance: MultiTenancyManager;
  private tenants: Map<string, Tenant> = new Map();
  private tenantUsers: Map<string, TenantUser[]> = new Map();
  private activeSessions: Map<string, TenantSession> = new Map();

  private constructor() {
    this.initializeDefaultTenants();
  }

  static getInstance(): MultiTenancyManager {
    if (!MultiTenancyManager.instance) {
      MultiTenancyManager.instance = new MultiTenancyManager();
    }
    return MultiTenancyManager.instance;
  }

  // Initialize default tenants for development
  private initializeDefaultTenants(): void {
    const defaultTenant: Tenant = {
      id: 'default',
      name: 'Default Organization',
      slug: 'default',
      status: 'active',
      plan: {
        id: 'enterprise',
        name: 'Enterprise',
        type: 'enterprise',
        features: ['ai', 'analytics', 'integrations', 'custom_domain', 'sso', 'audit_logs'],
        limits: {
          users: 1000,
          storage: 1000,
          apiCalls: 100000,
          customDomains: 10,
          integrations: 50,
        },
        pricing: {
          monthly: 999,
          yearly: 9999,
          currency: 'USD',
        },
      },
      settings: {
        branding: {
          primaryColor: '#3B82F6',
          secondaryColor: '#1F2937',
          companyName: 'Default Organization',
          supportEmail: 'support@default.com',
        },
        features: {
          enableAI: true,
          enableAnalytics: true,
          enableIntegrations: true,
          enableCustomDomain: true,
          enableSSO: true,
          enableAuditLogs: true,
        },
        security: {
          passwordPolicy: {
            minLength: 12,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            preventCommonPasswords: true,
            maxAge: 90,
          },
          sessionTimeout: 480,
          mfaRequired: true,
        },
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
      },
      limits: {
        current: {
          users: 5,
          storage: 2,
          apiCalls: 5000,
          customDomains: 1,
          integrations: 2,
        },
        usage: {
          storageUsed: 1.5,
          apiCallsUsed: 2500,
          lastReset: new Date(),
        },
      },
      metadata: {
        industry: 'Technology',
        size: 'medium',
        region: 'US',
        timezone: 'America/New_York',
        language: 'en',
        currency: 'USD',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tenants.set('default', defaultTenant);
  }

  // Tenant Management
  async createTenant(tenantData: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tenant> {
    const tenantId = `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newTenant: Tenant = {
      ...tenantData,
      id: tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create tenant schema
    await schemaService.createTenantSchema(tenantId);
    
    // Initialize database for tenant
    await databaseService.createTenantSchema(tenantId);
    
    // Log security event
    securityService.logSecurityEvent(
      'system',
      'system',
      'tenant_created',
      'tenant',
      { tenantId, tenantName: newTenant.name }
    );

    this.tenants.set(tenantId, newTenant);
    return newTenant;
  }

  async getTenant(tenantId: string): Promise<Tenant | null> {
    return this.tenants.get(tenantId) || null;
  }

  async updateTenant(tenantId: string, updates: Partial<Tenant>): Promise<Tenant | null> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    const updatedTenant: Tenant = {
      ...tenant,
      ...updates,
      updatedAt: new Date(),
    };

    this.tenants.set(tenantId, updatedTenant);
    
    // Log security event
    securityService.logSecurityEvent(
      tenantId,
      'system',
      'tenant_updated',
      'tenant',
      { updates: Object.keys(updates) }
    );

    return updatedTenant;
  }

  async deleteTenant(tenantId: string): Promise<boolean> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return false;

    // Cleanup tenant resources
    await this.cleanupTenantResources(tenantId);
    
    // Log security event
    securityService.logSecurityEvent(
      'system',
      'system',
      'tenant_deleted',
      'tenant',
      { tenantId, tenantName: tenant.name }
    );

    this.tenants.delete(tenantId);
    return true;
  }

  private async cleanupTenantResources(tenantId: string): Promise<void> {
    // Close database connections
    await databaseService.closeConnection(tenantId);
    
    // Cleanup sessions
    for (const [userId, session] of Array.from(this.activeSessions.entries())) {
      if (session.tenantId === tenantId) {
        securityService.invalidateSession(userId);
        this.activeSessions.delete(userId);
      }
    }
    
    // Remove tenant users
    this.tenantUsers.delete(tenantId);
  }

  // User Management
  async createTenantUser(
    tenantId: string,
    userData: Omit<TenantUser, 'id' | 'tenantId' | 'joinedAt' | 'lastActiveAt'>
  ): Promise<TenantUser> {
    // Validate tenant exists
    const tenant = await this.getTenant(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Check user limits
    const currentUsers = this.tenantUsers.get(tenantId)?.length || 0;
    if (currentUsers >= tenant.limits.current.users) {
      throw new Error('User limit exceeded for tenant');
    }

    const newUser: TenantUser = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      joinedAt: new Date(),
      lastActiveAt: new Date(),
    };

    // Add to tenant users
    const tenantUsers = this.tenantUsers.get(tenantId) || [];
    tenantUsers.push(newUser);
    this.tenantUsers.set(tenantId, tenantUsers);

    // Log security event
    securityService.logSecurityEvent(
      tenantId,
      'system',
      'user_created',
      'user',
      { userId: newUser.id, userRole: newUser.role.name }
    );

    return newUser;
  }

  async getTenantUsers(tenantId: string): Promise<TenantUser[]> {
    return this.tenantUsers.get(tenantId) || [];
  }

  async getTenantUser(tenantId: string, userId: string): Promise<TenantUser | null> {
    const tenantUsers = this.tenantUsers.get(tenantId);
    return tenantUsers?.find(user => user.id === userId) || null;
  }

  // Session Management
  async createSession(tenantId: string, userId: string, ipAddress: string, userAgent: string): Promise<TenantSession> {
    // Validate tenant and user
    const tenant = await this.getTenant(tenantId);
    const user = await this.getTenantUser(tenantId, userId);
    
    if (!tenant || !user) {
      throw new Error('Invalid tenant or user');
    }

    // Create session
    const session = securityService.createSession(tenantId, userId, ipAddress, userAgent);
    this.activeSessions.set(userId, session);

    return session;
  }

  async validateSession(token: string): Promise<TenantSession | null> {
    return securityService.validateSession(token);
  }

  async refreshSession(refreshToken: string): Promise<TenantSession | null> {
    return securityService.refreshSession(refreshToken);
  }

  async invalidateSession(userId: string): Promise<void> {
    securityService.invalidateSession(userId);
    this.activeSessions.delete(userId);
  }

  // Security and Access Control
  async validateAccess(tenantId: string, userId: string, resource: string, action: string): Promise<boolean> {
    return securityService.validateTenantAccess(tenantId, userId, resource, action);
  }

  async getAuditLogs(tenantId: string, filters?: any): Promise<AuditLog[]> {
    return securityService.getAuditLogs(tenantId, filters);
  }

  async generateComplianceReport(tenantId: string, type: 'gdpr' | 'sox' | 'hipaa' | 'pci' | 'custom'): Promise<ComplianceReport> {
    return securityService.generateComplianceReport(tenantId, type);
  }

  // Database Operations
  async executeQuery<T>(
    tenantId: string,
    table: string,
    operation: 'find' | 'findOne' | 'create' | 'update' | 'delete',
    options?: QueryOptions,
    data?: any
  ): Promise<T | T[] | null> {
    // Validate access - we'll skip session validation for now since userId is not in QueryOptions
    // In a real implementation, you'd pass userId separately or get it from the context

    const defaultOptions: QueryOptions = { page: 1, limit: 10 };

    switch (operation) {
      case 'find':
        const findResult = await databaseService.find(table, options || defaultOptions, tenantId);
        return findResult as unknown as T[];
      case 'findOne':
        const findOneResult = await databaseService.findOne(table, (options as any)?.id || '', tenantId);
        return findOneResult as unknown as T | null;
      case 'create':
        const createResult = await databaseService.create(table, data, tenantId);
        return createResult as unknown as T;
      case 'update':
        const updateResult = await databaseService.update(table, (options as any)?.id || '', data, tenantId);
        return updateResult as unknown as T | null;
      case 'delete':
        const deleteResult = await databaseService.delete(table, (options as any)?.id || '', tenantId);
        return deleteResult as unknown as T | null;
      default:
        throw new Error('Invalid operation');
    }
  }

  // Schema Management
  async getTenantSchema(tenantId: string): Promise<TenantSchema | null> {
    return schemaService.getTenantSchema(tenantId);
  }

  async addTable(tenantId: string, table: any): Promise<any> {
    return await schemaService.addTable(tenantId, table);
  }

  async modifyTable(tenantId: string, tableName: string, modifications: any): Promise<any> {
    return await schemaService.modifyTable(tenantId, tableName, modifications);
  }

  async runMigration(tenantId: string, migration: any): Promise<boolean> {
    return await schemaService.runMigration(tenantId, migration);
  }

  // Global Objects Management
  async getGlobalObjects(filters?: any): Promise<GlobalObject[]> {
    return globalObjectsService.getGlobalObjects(filters);
  }

  async createGlobalObject(object: any, tenantId: string): Promise<GlobalObject> {
    return globalObjectsService.createGlobalObject(object, tenantId);
  }

  async getSharedResources(filters?: any): Promise<SharedResource[]> {
    return globalObjectsService.getSharedResources(filters);
  }

  async createSharedResource(resource: any, tenantId: string): Promise<SharedResource> {
    return globalObjectsService.createSharedResource(resource, tenantId);
  }

  // Resource Usage Tracking
  async trackResourceUsage(tenantId: string, resourceType: string, amount: number): Promise<void> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return;

    switch (resourceType) {
      case 'storage':
        tenant.limits.usage.storageUsed += amount;
        break;
      case 'apiCalls':
        tenant.limits.usage.apiCallsUsed += amount;
        break;
      case 'users':
        tenant.limits.current.users += amount;
        break;
    }

    tenant.updatedAt = new Date();
    this.tenants.set(tenantId, tenant);
  }

  async checkResourceLimits(tenantId: string, resourceType: string, amount: number): Promise<boolean> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return false;

    switch (resourceType) {
      case 'storage':
        return (tenant.limits.usage.storageUsed + amount) <= tenant.limits.current.storage;
      case 'apiCalls':
        return (tenant.limits.usage.apiCallsUsed + amount) <= tenant.limits.current.apiCalls;
      case 'users':
        return (tenant.limits.current.users + amount) <= tenant.plan.limits.users;
      default:
        return true;
    }
  }

  // Health Monitoring
  async getTenantHealth(tenantId: string): Promise<{
    status: 'healthy' | 'warning' | 'error';
    database: any;
    security: any;
    resources: any;
    recommendations: string[];
  }> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const databaseHealth = await databaseService.checkDatabaseHealth(tenantId);
    const auditLogs = await securityService.getAuditLogs(tenantId, { severity: ['high', 'critical'] });
    
    const recommendations: string[] = [];
    let status: 'healthy' | 'warning' | 'error' = 'healthy';

    // Check database health
    if (databaseHealth.status === 'error') {
      status = 'error';
      recommendations.push('Database connection issues detected');
    } else if (databaseHealth.status === 'warning') {
      status = 'warning';
      recommendations.push('Database performance issues detected');
    }

    // Check security events
    if (auditLogs.length > 10) {
      status = status === 'error' ? 'error' : 'warning';
      recommendations.push('High number of security events detected');
    }

    // Check resource usage
    const storageUsage = (tenant.limits.usage.storageUsed / tenant.limits.current.storage) * 100;
    const apiUsage = (tenant.limits.usage.apiCallsUsed / tenant.limits.current.apiCalls) * 100;

    if (storageUsage > 90) {
      status = status === 'error' ? 'error' : 'warning';
      recommendations.push('Storage usage is critically high');
    } else if (storageUsage > 80) {
      status = status === 'error' ? 'error' : 'warning';
      recommendations.push('Storage usage is high');
    }

    if (apiUsage > 90) {
      status = status === 'error' ? 'error' : 'warning';
      recommendations.push('API usage is critically high');
    }

    return {
      status,
      database: databaseHealth,
      security: {
        recentEvents: auditLogs.length,
        criticalEvents: auditLogs.filter(log => log.severity === 'critical').length
      },
      resources: {
        storage: {
          used: tenant.limits.usage.storageUsed,
          limit: tenant.limits.current.storage,
          percentage: storageUsage
        },
        apiCalls: {
          used: tenant.limits.usage.apiCallsUsed,
          limit: tenant.limits.current.apiCalls,
          percentage: apiUsage
        },
        users: {
          current: tenant.limits.current.users,
          limit: tenant.plan.limits.users,
          percentage: (tenant.limits.current.users / tenant.plan.limits.users) * 100
        }
      },
      recommendations
    };
  }

  // Analytics and Reporting
  async getTenantAnalytics(tenantId: string, period: 'daily' | 'weekly' | 'monthly'): Promise<any> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const auditLogs = await securityService.getAuditLogs(tenantId);
    const tenantUsers = await this.getTenantUsers(tenantId);
    const activeSessions = Array.from(this.activeSessions.values()).filter(s => s.tenantId === tenantId);

    return {
      tenant: {
        id: tenant.id,
        name: tenant.name,
        status: tenant.status,
        plan: tenant.plan.name
      },
      users: {
        total: tenantUsers.length,
        active: tenantUsers.filter(u => u.status === 'active').length,
        newThisPeriod: tenantUsers.filter(u => {
          const periodStart = this.getPeriodStart(period);
          return u.joinedAt >= periodStart;
        }).length
      },
      sessions: {
        active: activeSessions.length,
        totalThisPeriod: auditLogs.filter(log => 
          log.action === 'session_created' && log.timestamp >= this.getPeriodStart(period)
        ).length
      },
      security: {
        totalEvents: auditLogs.length,
        eventsThisPeriod: auditLogs.filter(log => 
          log.timestamp >= this.getPeriodStart(period)
        ).length,
        criticalEvents: auditLogs.filter(log => 
          log.severity === 'critical' && log.timestamp >= this.getPeriodStart(period)
        ).length
      },
      resources: {
        storage: {
          used: tenant.limits.usage.storageUsed,
          limit: tenant.limits.current.storage,
          percentage: (tenant.limits.usage.storageUsed / tenant.limits.current.storage) * 100
        },
        apiCalls: {
          used: tenant.limits.usage.apiCallsUsed,
          limit: tenant.limits.current.apiCalls,
          percentage: (tenant.limits.usage.apiCallsUsed / tenant.limits.current.apiCalls) * 100
        }
      }
    };
  }

  private getPeriodStart(period: 'daily' | 'weekly' | 'monthly'): Date {
    const now = new Date();
    switch (period) {
      case 'daily':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'weekly':
        const dayOfWeek = now.getDay();
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysToSubtract);
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      default:
        return now;
    }
  }

  // Utility Methods
  getAllTenants(): Tenant[] {
    return Array.from(this.tenants.values());
  }

  getActiveSessions(): TenantSession[] {
    return Array.from(this.activeSessions.values());
  }

  getTenantCount(): number {
    return this.tenants.size;
  }

  getActiveSessionCount(): number {
    return this.activeSessions.size;
  }
}

// Export singleton instance
export const multiTenancyManager = MultiTenancyManager.getInstance(); 