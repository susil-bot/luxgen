import { 
  Tenant, 
  TenantUser, 
  AuditLog, 
  ComplianceReport, 
  TenantSession,
  Permission,
  TenantFilter
} from '../types/multiTenancy';

// Security Service for Multi-Tenancy
export class SecurityService {
  private static instance: SecurityService;
  private auditLogs: AuditLog[] = [];
  private complianceReports: ComplianceReport[] = [];
  private activeSessions: Map<string, TenantSession> = new Map();

  private constructor() {}

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // Tenant Isolation and Access Control
  validateTenantAccess(tenantId: string, userId: string, resource: string, action: string): boolean {
    // Check if user belongs to tenant
    const session = this.getActiveSession(userId);
    if (!session || session.tenantId !== tenantId) {
      this.logSecurityEvent(tenantId, userId, 'access_denied', resource, {
        reason: 'tenant_mismatch',
        requestedTenant: tenantId,
        userTenant: session?.tenantId
      });
      return false;
    }

    // Check permissions
    const hasPermission = this.checkPermission(tenantId, userId, resource, action);
    if (!hasPermission) {
      this.logSecurityEvent(tenantId, userId, 'permission_denied', resource, {
        action,
        reason: 'insufficient_permissions'
      });
    }

    return hasPermission;
  }

  private checkPermission(tenantId: string, userId: string, resource: string, action: string): boolean {
    // This would typically check against the user's permissions in the database
    // For now, we'll simulate permission checking
    const session = this.getActiveSession(userId);
    if (!session) return false;

    // Simulate permission check based on user role
    const userRole = this.getUserRole(tenantId, userId);
    const requiredPermission = `${resource}:${action}`;

    // System admins have all permissions
    if (userRole === 'System Admin') return true;

    // Tenant admins have most permissions within their tenant
    if (userRole === 'Tenant Admin') {
      return !['system:admin', 'tenant:create', 'tenant:delete'].includes(requiredPermission);
    }

    // Regular users have limited permissions
    const userPermissions = [
      'profile:read',
      'profile:write',
      'training:read',
      'groups:read',
      'presentations:read'
    ];

    return userPermissions.includes(requiredPermission);
  }

  private getUserRole(tenantId: string, userId: string): string {
    // This would typically fetch from database
    // For now, return a simulated role
    return 'Tenant Admin';
  }

  // Session Management
  createSession(tenantId: string, userId: string, ipAddress: string, userAgent: string): TenantSession {
    const session: TenantSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      userId,
      token: this.generateToken(),
      refreshToken: this.generateToken(),
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
      createdAt: new Date(),
      lastActivityAt: new Date()
    };

    this.activeSessions.set(userId, session);
    this.logSecurityEvent(tenantId, userId, 'session_created', 'auth', {
      sessionId: session.id,
      ipAddress,
      userAgent
    });

    return session;
  }

  validateSession(token: string): TenantSession | null {
    for (const session of Array.from(this.activeSessions.values())) {
      if (session.token === token && session.expiresAt > new Date()) {
        session.lastActivityAt = new Date();
        return session;
      }
    }
    return null;
  }

  refreshSession(refreshToken: string): TenantSession | null {
    for (const session of Array.from(this.activeSessions.values())) {
      if (session.refreshToken === refreshToken) {
        session.token = this.generateToken();
        session.refreshToken = this.generateToken();
        session.expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
        session.lastActivityAt = new Date();
        return session;
      }
    }
    return null;
  }

  invalidateSession(userId: string): void {
    const session = this.activeSessions.get(userId);
    if (session) {
      this.logSecurityEvent(session.tenantId, userId, 'session_invalidated', 'auth', {
        sessionId: session.id
      });
      this.activeSessions.delete(userId);
    }
  }

  private getActiveSession(userId: string): TenantSession | undefined {
    return this.activeSessions.get(userId);
  }

  private generateToken(): string {
    return Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
  }

  // Audit Logging
  logSecurityEvent(
    tenantId: string, 
    userId: string, 
    action: string, 
    resource: string, 
    details: Record<string, any>
  ): void {
    const auditLog: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      userId,
      action,
      resource,
      details,
      ipAddress: this.getClientIP(),
      userAgent: this.getClientUserAgent(),
      timestamp: new Date(),
      severity: this.determineSeverity(action)
    };

    this.auditLogs.push(auditLog);
    console.log('Security Audit Log:', auditLog);
  }

  getAuditLogs(tenantId: string, filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    severity?: string[];
  }): AuditLog[] {
    let logs = this.auditLogs.filter(log => log.tenantId === tenantId);

    if (filters) {
      if (filters.userId) {
        logs = logs.filter(log => log.userId === filters.userId);
      }
      if (filters.action) {
        logs = logs.filter(log => log.action === filters.action);
      }
      if (filters.resource) {
        logs = logs.filter(log => log.resource === filters.resource);
      }
      if (filters.startDate) {
        logs = logs.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        logs = logs.filter(log => log.timestamp <= filters.endDate!);
      }
      if (filters.severity) {
        logs = logs.filter(log => filters.severity!.includes(log.severity));
      }
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private determineSeverity(action: string): 'low' | 'medium' | 'high' | 'critical' {
    const criticalActions = ['login_failed', 'permission_escalation', 'data_breach'];
    const highActions = ['access_denied', 'permission_denied', 'session_invalidated'];
    const mediumActions = ['session_created', 'profile_updated', 'settings_changed'];

    if (criticalActions.includes(action)) return 'critical';
    if (highActions.includes(action)) return 'high';
    if (mediumActions.includes(action)) return 'medium';
    return 'low';
  }

  // Compliance Monitoring
  generateComplianceReport(tenantId: string, type: 'gdpr' | 'sox' | 'hipaa' | 'pci' | 'custom'): ComplianceReport {
    const auditLogs = this.getAuditLogs(tenantId);
    const findings = this.analyzeCompliance(auditLogs, type);

    const report: ComplianceReport = {
      id: `compliance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      type,
      status: findings.length === 0 ? 'completed' : 'in_progress',
      findings,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    };

    this.complianceReports.push(report);
    return report;
  }

  private analyzeCompliance(auditLogs: AuditLog[], type: string): any[] {
    const findings = [];

    // GDPR Compliance Checks
    if (type === 'gdpr') {
      const dataAccessLogs = auditLogs.filter(log => 
        log.resource === 'user_data' || log.resource === 'personal_data'
      );

      if (dataAccessLogs.length > 100) {
        findings.push({
          id: `finding_${Date.now()}_1`,
          category: 'data_access',
          severity: 'medium',
          description: 'High volume of personal data access detected',
          recommendation: 'Review data access patterns and implement additional controls',
          status: 'open',
          createdAt: new Date()
        });
      }
    }

    // SOX Compliance Checks
    if (type === 'sox') {
      const adminActions = auditLogs.filter(log => 
        log.action.includes('admin') || log.action.includes('settings')
      );

      if (adminActions.length > 50) {
        findings.push({
          id: `finding_${Date.now()}_2`,
          category: 'administrative_controls',
          severity: 'high',
          description: 'High number of administrative actions detected',
          recommendation: 'Implement additional approval workflows for administrative changes',
          status: 'open',
          createdAt: new Date()
        });
      }
    }

    return findings;
  }

  getComplianceReports(tenantId: string): ComplianceReport[] {
    return this.complianceReports
      .filter(report => report.tenantId === tenantId)
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  // Security Policy Enforcement
  validatePasswordPolicy(password: string, tenant: Tenant): { valid: boolean; errors: string[] } {
    const policy = tenant.settings.security.passwordPolicy;
    const errors: string[] = [];

    if (password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters long`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    if (policy.preventCommonPasswords) {
      const commonPasswords = ['password', '123456', 'qwerty', 'admin'];
      if (commonPasswords.includes(password.toLowerCase())) {
        errors.push('Password cannot be a common password');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Rate Limiting
  private rateLimitMap: Map<string, { count: number; resetTime: number }> = new Map();

  checkRateLimit(identifier: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const key = `rate_limit_${identifier}`;
    const current = this.rateLimitMap.get(key);

    if (!current || now > current.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (current.count >= limit) {
      return false;
    }

    current.count++;
    return true;
  }

  // Utility Methods
  private getClientIP(): string {
    // This would typically get the real IP from request headers
    return '127.0.0.1';
  }

  private getClientUserAgent(): string {
    // This would typically get the real user agent from request headers
    return navigator.userAgent;
  }

  // Cleanup expired sessions
  cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [userId, session] of Array.from(this.activeSessions.entries())) {
      if (session.expiresAt < now) {
        this.activeSessions.delete(userId);
        this.logSecurityEvent(session.tenantId, userId, 'session_expired', 'auth', {
          sessionId: session.id
        });
      }
    }
  }
}

// Export singleton instance
export const securityService = SecurityService.getInstance(); 