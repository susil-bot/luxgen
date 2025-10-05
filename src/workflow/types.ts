/**
 * LUXGEN FRONTEND WORKFLOW TYPES
 * Type definitions for the frontend workflow system
 */

export interface WorkflowContext {
  tenantId: string;
  userId?: string;
  userRole?: string;
  data: any;
  metadata?: {
    [key: string]: any;
  };
}

export interface WorkflowResult<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: WorkflowError[];
  statusCode?: number;
  metadata?: Record<string, any>;
}

export interface WorkflowError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface Workflow<T = any> {
  id: string;
  name: string;
  execute(context: WorkflowContext): Promise<WorkflowResult<T>>;
}

export interface TenantConfig {
  id: string;
  slug: string;
  name: string;
  domain: string;
  features: string[];
  limits: {
    maxUsers: number;
    maxStorage: number;
    maxApiCalls: number;
    maxConcurrentSessions: number;
    dataRetentionDays: number;
    maxJobPosts: number;
    maxTrainingPrograms: number;
    maxAssessments: number;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    favicon: string;
    customCSS: string | null;
  };
  security: {
    encryptionEnabled: boolean;
    ssoEnabled: boolean;
    mfaRequired: boolean;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      maxAge: number;
    };
    sessionTimeout: number;
    ipWhitelist: string[];
    allowedDomains: string[];
  };
}

export interface UserContext {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  tenantId: string;
  tenantName: string;
  lastLogin: string;
  token: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserContext | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface TenantState {
  currentTenant: TenantConfig | null;
  availableTenants: TenantConfig[];
  loading: boolean;
  error: string | null;
}

export interface GlobalState {
  auth: AuthState;
  tenant: TenantState;
  ui: {
    theme: 'light' | 'dark';
    sidebarCollapsed: boolean;
    notifications: any[];
  };
}

export interface WorkflowManager {
  register(workflow: Workflow): void;
  execute<T>(workflowId: string, context: WorkflowContext): Promise<WorkflowResult<T>>;
  getWorkflow(workflowId: string): Workflow | null;
  getAllWorkflows(): Workflow[];
}

export interface WorkflowProviderProps {
  children: React.ReactNode;
  initialContext?: Partial<WorkflowContext>;
}

export interface WorkflowHook<T = any> {
  execute: (context: WorkflowContext) => Promise<WorkflowResult<T>>;
  loading: boolean;
  error: string | null;
  result: WorkflowResult<T> | null;
}
