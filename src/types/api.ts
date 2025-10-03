/**
 * Comprehensive API Type Definitions
 * Replaces 'any' types with proper TypeScript interfaces
 */

// Base API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
  timestamp?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// User Management Types
export interface UserPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  darkMode: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
}

export interface UserSettings {
  preferences: UserPreferences;
  privacy: {
    profileVisibility: 'public' | 'private' | 'team';
    activityVisibility: 'public' | 'private' | 'team';
    contactVisibility: 'public' | 'private' | 'team';
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

export interface AccountSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
    bio?: string;
  };
  security: {
    twoFactorEnabled: boolean;
    passwordLastChanged: string;
    lastLogin: string;
    loginHistory: Array<{
      timestamp: string;
      ip: string;
      userAgent: string;
      location?: string;
    }>;
  };
  billing: {
    plan: string;
    billingCycle: 'monthly' | 'yearly';
    nextBillingDate: string;
    paymentMethod?: {
      type: 'card' | 'bank' | 'paypal';
      last4?: string;
      brand?: string;
    };
  };
}

// Tenant Management Types
export interface TenantSettings {
  features: {
    enableAuditLogs: boolean;
    enableAnalytics: boolean;
    enableMultiLanguage: boolean;
    enableCustomBranding: boolean;
    enableAdvancedSecurity: boolean;
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      preventCommonPasswords: boolean;
    };
    sessionPolicy: {
      maxSessionDuration: number;
      idleTimeout: number;
      maxConcurrentSessions: number;
    };
    mfaPolicy: {
      enabled: boolean;
      required: boolean;
      methods: Array<'sms' | 'email' | 'authenticator'>;
    };
  };
  branding: {
    logo?: string;
    favicon?: string;
    primaryColor: string;
    secondaryColor: string;
    customCss?: string;
  };
  integrations: {
    slack?: {
      enabled: boolean;
      webhookUrl?: string;
    };
    email?: {
      provider: 'smtp' | 'sendgrid' | 'mailgun';
      settings: Record<string, string>;
    };
  };
}

// Training and Content Types
export interface ContentGenerationOptions {
  maxTokens?: number;
  temperature?: number;
  tone?: 'professional' | 'casual' | 'formal' | 'friendly';
  length?: 'short' | 'medium' | 'long';
  style?: 'informative' | 'persuasive' | 'educational' | 'entertaining';
  language?: string;
  audience?: string;
  keywords?: string[];
}

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document';
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  metadata?: Record<string, unknown>;
}

export interface TrainingMaterial {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'module' | 'lesson' | 'assessment';
  content: ContentItem[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  learningObjectives: string[];
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  explanation?: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  timeLimit?: number;
  passingScore: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
}

// Analytics and Reporting Types
export interface AnalyticsData {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  metrics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    totalSessions: number;
    averageSessionDuration: number;
    completionRate: number;
    engagementScore: number;
  };
  trends: Array<{
    date: string;
    value: number;
    change: number;
  }>;
  breakdowns: {
    byUserType: Array<{ type: string; count: number }>;
    byContentType: Array<{ type: string; count: number }>;
    byDevice: Array<{ device: string; count: number }>;
    byLocation: Array<{ location: string; count: number }>;
  };
}

export interface PerformanceMetrics {
  userId: string;
  sessionId: string;
  startTime: string;
  endTime: string;
  duration: number;
  actions: Array<{
    type: string;
    timestamp: string;
    data?: Record<string, unknown>;
  }>;
  scores: {
    engagement: number;
    completion: number;
    accuracy: number;
    speed: number;
  };
  feedback?: {
    rating: number;
    comment?: string;
    timestamp: string;
  };
}

// Notification Types
export interface NotificationSettings {
  email: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    types: {
      system: boolean;
      training: boolean;
      social: boolean;
      marketing: boolean;
    };
  };
  push: {
    enabled: boolean;
    types: {
      system: boolean;
      training: boolean;
      social: boolean;
      marketing: boolean;
    };
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    types: {
      system: boolean;
      training: boolean;
      social: boolean;
      marketing: boolean;
    };
  };
}

// File Management Types
export interface FileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  category: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  url: string;
  thumbnailUrl?: string;
  permissions: {
    read: string[];
    write: string[];
    delete: string[];
  };
}

// Search Types
export interface SearchResult {
  id: string;
  type: 'user' | 'content' | 'training' | 'assessment' | 'file';
  title: string;
  description?: string;
  url: string;
  relevance: number;
  metadata?: Record<string, unknown>;
}

export interface SearchFilters {
  type?: string[];
  category?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  author?: string;
  status?: string[];
}

// Export/Import Types
export interface ExportOptions {
  format: 'json' | 'csv' | 'xlsx' | 'pdf';
  includeMetadata: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, unknown>;
}

export interface ImportOptions {
  format: 'json' | 'csv' | 'xlsx';
  updateExisting: boolean;
  validateData: boolean;
  onConflict: 'skip' | 'overwrite' | 'merge';
}

// System Settings Types
export interface SystemSettings {
  general: {
    appName: string;
    version: string;
    maintenanceMode: boolean;
    defaultLanguage: string;
    supportedLanguages: string[];
    timezone: string;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    requireMfa: boolean;
    allowedOrigins: string[];
  };
  performance: {
    cacheEnabled: boolean;
    cacheTtl: number;
    rateLimitEnabled: boolean;
    rateLimitRequests: number;
    rateLimitWindow: number;
  };
  integrations: {
    email: {
      provider: string;
      settings: Record<string, string>;
    };
    storage: {
      provider: 'local' | 's3' | 'azure' | 'gcp';
      settings: Record<string, string>;
    };
    analytics: {
      provider: string;
      settings: Record<string, string>;
    };
  };
}

// Generic Types
export type ApiConfig = Record<string, unknown>;
export type ApiData = Record<string, unknown>;
export type ApiParams = Record<string, string | number | boolean>;
export type ApiHeaders = Record<string, string>;

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Database and Health Check Types
export interface DatabaseStatus {
  status: {
    isConnected: boolean;
    databaseName: string;
    host: string;
    port: number;
    version: string;
    uptime: number;
  };
  health: {
    stats: {
      collections: number;
      dataSize: number;
      indexes: number;
      storageSize: number;
    };
    performance: {
      queryTime: number;
      connectionPool: {
        active: number;
        idle: number;
        total: number;
      };
    };
  };
  error?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  service: string;
  version: string;
  timestamp: string;
  uptime: number;
  checks: {
    database: {
      status: 'healthy' | 'unhealthy';
      responseTime: number;
    };
    redis: {
      status: 'healthy' | 'unhealthy';
      responseTime: number;
    };
    external: {
      status: 'healthy' | 'unhealthy';
      responseTime: number;
    };
  };
  environment: string;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

// Authentication Response Types
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    tenantId?: string;
  };
  refreshToken?: string;
  expiresIn: number;
  registrationId?: string;
} 