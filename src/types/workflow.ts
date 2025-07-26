// Workflow Core Types
export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  category: WorkflowCategory;
  tags: string[];
  tenantId: string;
  isActive: boolean;
  isPublic: boolean;
  isSystem: boolean;
  
  // Workflow Structure
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  
  // Execution Settings
  executionSettings: WorkflowExecutionSettings;
  
  // Metadata
  metadata: WorkflowMetadata;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastExecutedAt?: Date;
  executionCount: number;
}

export type WorkflowCategory = 
  | 'onboarding'
  | 'training'
  | 'assessment'
  | 'compliance'
  | 'notification'
  | 'approval'
  | 'automation'
  | 'integration'
  | 'custom';

// Workflow Steps
export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: WorkflowStepType;
  order: number;
  isRequired: boolean;
  isParallel: boolean;
  timeout?: number; // in seconds
  
  // Step Configuration
  config: WorkflowStepConfig;
  
  // Dependencies
  dependsOn: string[]; // step IDs this step depends on
  conditions: WorkflowCondition[];
  
  // Actions
  onSuccess: WorkflowAction[];
  onFailure: WorkflowAction[];
  onTimeout: WorkflowAction[];
  
  // UI Configuration
  uiConfig?: WorkflowStepUIConfig;
}

export type WorkflowStepType = 
  | 'task'
  | 'approval'
  | 'notification'
  | 'integration'
  | 'decision'
  | 'delay'
  | 'webhook'
  | 'script'
  | 'form'
  | 'email'
  | 'sms'
  | 'slack'
  | 'database'
  | 'file_upload'
  | 'api_call';

export interface WorkflowStepConfig {
  // Task Configuration
  assignee?: string | string[];
  dueDate?: Date | string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  
  // Notification Configuration
  channels?: ('email' | 'sms' | 'push' | 'slack' | 'webhook')[];
  template?: string;
  recipients?: string[];
  
  // Integration Configuration
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  
  // Decision Configuration
  criteria?: DecisionCriteria[];
  
  // Form Configuration
  formFields?: FormField[];
  
  // Script Configuration
  script?: string;
  language?: 'javascript' | 'python' | 'sql';
  
  // Database Configuration
  query?: string;
  operation?: 'select' | 'insert' | 'update' | 'delete';
  
  // File Configuration
  allowedTypes?: string[];
  maxSize?: number;
  destination?: string;
}

export interface WorkflowStepUIConfig {
  title: string;
  description: string;
  icon?: string;
  color?: string;
  showProgress?: boolean;
  allowSkip?: boolean;
  allowRetry?: boolean;
  customComponent?: string;
}

// Workflow Triggers
export interface WorkflowTrigger {
  id: string;
  name: string;
  type: WorkflowTriggerType;
  isActive: boolean;
  config: WorkflowTriggerConfig;
  conditions: WorkflowCondition[];
}

export type WorkflowTriggerType = 
  | 'manual'
  | 'scheduled'
  | 'event'
  | 'webhook'
  | 'api'
  | 'database'
  | 'file'
  | 'user_action'
  | 'system_event';

export interface WorkflowTriggerConfig {
  // Scheduled Trigger
  schedule?: {
    type: 'once' | 'recurring';
    startDate: Date;
    endDate?: Date;
    cronExpression?: string;
    timezone: string;
  };
  
  // Event Trigger
  event?: {
    source: string;
    eventType: string;
    filters?: Record<string, any>;
  };
  
  // Webhook Trigger
  webhook?: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    secret?: string;
  };
  
  // API Trigger
  api?: {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    authentication?: {
      type: 'bearer' | 'basic' | 'oauth';
      token?: string;
      username?: string;
      password?: string;
    };
  };
}

// Workflow Conditions
export interface WorkflowCondition {
  id: string;
  name: string;
  type: 'if' | 'else' | 'elseif' | 'switch';
  operator: ConditionOperator;
  field: string;
  value: any;
  logicalOperator?: 'and' | 'or';
  conditions?: WorkflowCondition[]; // for nested conditions
}

export type ConditionOperator = 
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'in'
  | 'not_in'
  | 'is_null'
  | 'is_not_null'
  | 'regex';

// Workflow Actions
export interface WorkflowAction {
  id: string;
  name: string;
  type: WorkflowActionType;
  config: WorkflowActionConfig;
  order: number;
  isAsync: boolean;
  retryConfig?: RetryConfig;
}

export type WorkflowActionType = 
  | 'send_notification'
  | 'update_record'
  | 'create_record'
  | 'delete_record'
  | 'send_email'
  | 'send_sms'
  | 'webhook_call'
  | 'api_call'
  | 'file_operation'
  | 'script_execution'
  | 'workflow_trigger'
  | 'status_update'
  | 'variable_set'
  | 'log_entry'
  | 'approval_request'
  | 'delay'
  | 'condition_check';

export interface WorkflowActionConfig {
  // Notification Actions
  notification?: {
    channels: ('email' | 'sms' | 'push' | 'slack')[];
    template: string;
    recipients: string[];
    data?: Record<string, any>;
  };
  
  // Database Actions
  database?: {
    table: string;
    operation: 'insert' | 'update' | 'delete';
    data?: Record<string, any>;
    where?: Record<string, any>;
  };
  
  // API Actions
  api?: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
  };
  
  // File Actions
  file?: {
    operation: 'upload' | 'download' | 'delete' | 'move' | 'copy';
    source?: string;
    destination?: string;
    options?: Record<string, any>;
  };
  
  // Script Actions
  script?: {
    code: string;
    language: 'javascript' | 'python' | 'sql';
    timeout?: number;
    variables?: Record<string, any>;
  };
  
  // Variable Actions
  variable?: {
    name: string;
    value: any;
    scope: 'workflow' | 'step' | 'global';
  };
}

export interface RetryConfig {
  maxAttempts: number;
  delay: number; // in seconds
  backoffMultiplier: number;
  maxDelay: number; // in seconds
}

// Workflow Execution
export interface WorkflowExecution {
  id: string;
  workflowId: string;
  tenantId: string;
  status: WorkflowExecutionStatus;
  currentStep?: string;
  progress: number; // 0-100
  
  // Execution Data
  input: Record<string, any>;
  output: Record<string, any>;
  variables: Record<string, any>;
  
  // Execution History
  steps: WorkflowStepExecution[];
  logs: WorkflowExecutionLog[];
  
  // Metadata
  startedBy: string;
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // in seconds
  error?: string;
  
  // Context
  context: WorkflowExecutionContext;
}

export type WorkflowExecutionStatus = 
  | 'pending'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'timed_out';

export interface WorkflowStepExecution {
  id: string;
  stepId: string;
  status: WorkflowStepStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  
  // Step Data
  input: Record<string, any>;
  output: Record<string, any>;
  
  // Execution Details
  assignee?: string;
  comments?: string;
  attachments?: string[];
  
  // Error Handling
  error?: string;
  retryCount: number;
  maxRetries: number;
}

export type WorkflowStepStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'skipped'
  | 'cancelled'
  | 'waiting_for_approval'
  | 'approved'
  | 'rejected';

export interface WorkflowExecutionLog {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warning' | 'error';
  message: string;
  stepId?: string;
  data?: Record<string, any>;
}

export interface WorkflowExecutionContext {
  tenantId: string;
  userId: string;
  userRole: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  requestId: string;
  environment: 'development' | 'staging' | 'production';
}

// Workflow Execution Settings
export interface WorkflowExecutionSettings {
  // Execution Control
  maxDuration: number; // in seconds
  allowParallel: boolean;
  allowRetry: boolean;
  maxRetries: number;
  
  // Notifications
  notifyOnStart: boolean;
  notifyOnComplete: boolean;
  notifyOnError: boolean;
  notifyRecipients: string[];
  
  // Error Handling
  continueOnError: boolean;
  rollbackOnError: boolean;
  
  // Performance
  timeout: number; // in seconds
  concurrencyLimit: number;
  
  // Security
  requireApproval: boolean;
  approvalWorkflow?: string;
  auditLogging: boolean;
}

// Workflow Metadata
export interface WorkflowMetadata {
  // Business Context
  businessUnit?: string;
  department?: string;
  project?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Compliance
  complianceFrameworks?: string[];
  dataClassification?: 'public' | 'internal' | 'confidential' | 'restricted';
  retentionPolicy?: string;
  
  // Performance
  expectedDuration: number; // in minutes
  complexity: 'simple' | 'moderate' | 'complex';
  
  // Custom Fields
  customFields?: Record<string, any>;
}

// Form Fields for Workflow Steps
export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  defaultValue?: any;
  validation?: FormFieldValidation;
  options?: FormFieldOption[];
  uiConfig?: FormFieldUIConfig;
}

export type FormFieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'signature'
  | 'rating'
  | 'slider';

export interface FormFieldValidation {
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
  customValidation?: string;
  errorMessage?: string;
}

export interface FormFieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormFieldUIConfig {
  placeholder?: string;
  helpText?: string;
  width?: string;
  height?: string;
  rows?: number;
  cols?: number;
  step?: number;
  min?: number;
  max?: number;
}

// Decision Criteria
export interface DecisionCriteria {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: any;
  weight?: number;
  logicalOperator?: 'and' | 'or';
}

// Workflow Templates
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  tags: string[];
  isPublic: boolean;
  isSystem: boolean;
  
  // Template Data
  workflowDefinition: Omit<WorkflowDefinition, 'id' | 'tenantId' | 'createdBy' | 'createdAt' | 'updatedAt'>;
  
  // Usage
  usageCount: number;
  rating: number;
  reviews: WorkflowTemplateReview[];
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

export interface WorkflowTemplateReview {
  id: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// Workflow Analytics
export interface WorkflowAnalytics {
  workflowId: string;
  tenantId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  
  // Execution Metrics
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageDuration: number;
  successRate: number;
  
  // Step Metrics
  stepMetrics: WorkflowStepMetric[];
  
  // Performance Metrics
  averageStepDuration: number;
  bottleneckSteps: string[];
  completionRate: number;
  
  // User Metrics
  activeUsers: number;
  topUsers: WorkflowUserMetric[];
  
  // Error Analysis
  commonErrors: WorkflowErrorMetric[];
  
  // Generated At
  generatedAt: Date;
}

export interface WorkflowStepMetric {
  stepId: string;
  stepName: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageDuration: number;
  successRate: number;
  averageWaitTime: number;
}

export interface WorkflowUserMetric {
  userId: string;
  userName: string;
  executionsStarted: number;
  executionsCompleted: number;
  averageCompletionTime: number;
}

export interface WorkflowErrorMetric {
  errorType: string;
  errorMessage: string;
  occurrenceCount: number;
  affectedSteps: string[];
  lastOccurrence: Date;
}

// Utility Types
export type WorkflowId = string;
export type WorkflowExecutionId = string;
export type WorkflowStepId = string;

export interface WorkflowFilter {
  category?: WorkflowCategory;
  status?: WorkflowExecutionStatus;
  createdBy?: string;
  tags?: string[];
  isActive?: boolean;
  isPublic?: boolean;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export interface WorkflowExecutionFilter {
  workflowId?: string;
  status?: WorkflowExecutionStatus;
  startedBy?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export interface WorkflowQueryOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: WorkflowFilter;
  includes?: string[];
} 