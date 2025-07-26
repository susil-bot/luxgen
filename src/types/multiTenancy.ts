// Multi-Tenancy Core Types
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  subdomain?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  plan: TenantPlan;
  settings: TenantSettings;
  limits: TenantLimits;
  metadata: TenantMetadata;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface TenantPlan {
  id: string;
  name: string;
  type: 'free' | 'basic' | 'professional' | 'enterprise' | 'custom';
  features: string[];
  limits: {
    users: number;
    storage: number; // in GB
    apiCalls: number;
    customDomains: number;
    integrations: number;
  };
  pricing: {
    monthly: number;
    yearly: number;
    currency: string;
  };
}

export interface TenantSettings {
  branding: {
    logo?: string;
    favicon?: string;
    primaryColor: string;
    secondaryColor: string;
    companyName: string;
    supportEmail: string;
  };
  features: {
    enableAI: boolean;
    enableAnalytics: boolean;
    enableIntegrations: boolean;
    enableCustomDomain: boolean;
    enableSSO: boolean;
    enableAuditLogs: boolean;
  };
  security: {
    passwordPolicy: PasswordPolicy;
    sessionTimeout: number; // in minutes
    mfaRequired: boolean;
    ipWhitelist?: string[];
    allowedOrigins?: string[];
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    webhook?: string;
  };
}

export interface TenantLimits {
  current: {
    users: number;
    storage: number;
    apiCalls: number;
    customDomains: number;
    integrations: number;
  };
  usage: {
    storageUsed: number;
    apiCallsUsed: number;
    lastReset: Date;
  };
}

export interface TenantMetadata {
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  region?: string;
  timezone: string;
  language: string;
  currency: string;
  customFields?: Record<string, any>;
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

// Security and Authentication
export interface TenantUser {
  id: string;
  tenantId: string;
  userId: string;
  role: TenantRole;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: Date;
  lastActiveAt?: Date;
  metadata?: Record<string, any>;
}

export interface TenantRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'eq' | 'ne' | 'in' | 'not_in' | 'gt' | 'lt' | 'gte' | 'lte';
  value: any;
}

export interface TenantSession {
  id: string;
  tenantId: string;
  userId: string;
  token: string;
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: Date;
  createdAt: Date;
  lastActivityAt: Date;
}

// Database and Schema Management
export interface TenantDatabase {
  id: string;
  tenantId: string;
  name: string;
  type: 'shared' | 'isolated' | 'hybrid';
  connectionString?: string;
  schema: string;
  status: 'active' | 'migrating' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSchema {
  id: string;
  tenantId: string;
  name: string;
  version: string;
  tables: SchemaTable[];
  migrations: SchemaMigration[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
  indexes: SchemaIndex[];
  constraints: SchemaConstraint[];
}

export interface SchemaColumn {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: any;
  isPrimary: boolean;
  isUnique: boolean;
  isIndexed: boolean;
}

export interface SchemaIndex {
  name: string;
  columns: string[];
  type: 'btree' | 'hash' | 'gin' | 'gist';
  unique: boolean;
}

export interface SchemaConstraint {
  name: string;
  type: 'foreign_key' | 'check' | 'unique';
  definition: string;
}

export interface SchemaMigration {
  id: string;
  version: string;
  name: string;
  sql: string;
  appliedAt: Date;
  checksum: string;
}

// Global Objects and Shared Resources
export interface GlobalObject {
  id: string;
  type: 'template' | 'integration' | 'workflow' | 'report' | 'component';
  name: string;
  description: string;
  category: string;
  tags: string[];
  data: any;
  metadata: Record<string, any>;
  isPublic: boolean;
  isSystem: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

export interface SharedResource {
  id: string;
  type: 'file' | 'image' | 'document' | 'template' | 'configuration';
  name: string;
  path: string;
  size: number;
  mimeType: string;
  checksum: string;
  isPublic: boolean;
  accessControl: AccessControl[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AccessControl {
  type: 'tenant' | 'role' | 'user' | 'public';
  id?: string;
  permissions: ('read' | 'write' | 'delete' | 'admin')[];
}

// Audit and Compliance
export interface AuditLog {
  id: string;
  tenantId: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ComplianceReport {
  id: string;
  tenantId: string;
  type: 'gdpr' | 'sox' | 'hipaa' | 'pci' | 'custom';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  findings: ComplianceFinding[];
  generatedAt: Date;
  expiresAt: Date;
}

export interface ComplianceFinding {
  id: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  status: 'open' | 'in_progress' | 'resolved' | 'false_positive';
  createdAt: Date;
  resolvedAt?: Date;
}

// API and Integration
export interface TenantAPI {
  id: string;
  tenantId: string;
  name: string;
  key: string;
  secret: string;
  permissions: string[];
  rateLimit: number;
  isActive: boolean;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantIntegration {
  id: string;
  tenantId: string;
  name: string;
  type: 'oauth' | 'api_key' | 'webhook' | 'custom';
  provider: string;
  config: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Billing and Usage
export interface TenantBilling {
  id: string;
  tenantId: string;
  planId: string;
  status: 'active' | 'past_due' | 'canceled' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  amount: number;
  currency: string;
  paymentMethod?: PaymentMethod;
  invoices: Invoice[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  dueDate: Date;
  paidAt?: Date;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  metadata?: Record<string, any>;
}

// Multi-tenancy Context
export interface MultiTenancyContext {
  currentTenant: Tenant | null;
  currentUser: TenantUser | null;
  permissions: string[];
  isSystemAdmin: boolean;
  isTenantAdmin: boolean;
  canAccess: (resource: string, action: string) => boolean;
  getTenantId: () => string;
  switchTenant: (tenantId: string) => Promise<void>;
  // Enhanced methods
  logout: () => Promise<void>;
  updateTenantSettings: (settings: Partial<Tenant>) => Promise<void>;
  clearError: () => void;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  // New service methods
  createSession: (userId: string, ipAddress: string, userAgent: string) => Promise<TenantSession>;
  validateSession: (token: string) => Promise<TenantSession | null>;
  refreshSession: (refreshToken: string) => Promise<TenantSession | null>;
  validateAccess: (resource: string, action: string) => Promise<boolean>;
  executeQuery: (
    table: string,
    operation: 'find' | 'findOne' | 'create' | 'update' | 'delete',
    options?: QueryOptions,
    data?: any
  ) => Promise<any>;
  getGlobalObjects: (filters?: any) => Promise<GlobalObject[]>;
  createGlobalObject: (object: any) => Promise<GlobalObject>;
  getAuditLogs: (filters?: any) => Promise<AuditLog[]>;
  generateComplianceReport: (type: 'gdpr' | 'sox' | 'hipaa' | 'pci' | 'custom') => Promise<ComplianceReport>;
  getTenantHealth: () => Promise<any>;
  getTenantAnalytics: (period: 'daily' | 'weekly' | 'monthly') => Promise<any>;
  trackResourceUsage: (resourceType: string, amount: number) => Promise<void>;
  checkResourceLimits: (resourceType: string, amount: number) => Promise<boolean>;
  // State data
  auditLogs: AuditLog[];
  complianceReports: ComplianceReport[];
  globalObjects: GlobalObject[];
  sharedResources: SharedResource[];
  tenantHealth: any;
  tenantAnalytics: any;
}

// Utility Types
export type TenantId = string;
export type UserId = string;
export type ResourceId = string;

export interface TenantAwareEntity {
  tenantId: TenantId;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: UserId;
  updatedBy?: UserId;
}

export interface TenantFilter {
  tenantId?: TenantId;
  includeSystem?: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface QueryOptions extends PaginationOptions {
  filters?: Record<string, any>;
  includes?: string[];
  tenantFilter?: TenantFilter;
} 