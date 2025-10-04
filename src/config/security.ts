// Security Configuration for LuxGen Frontend
export const securityConfig = {
  // API Configuration
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1',
  
  // Authentication Configuration
  auth: {
    tokenKey: 'luxgen_auth_token',
    refreshTokenKey: 'luxgen_refresh_token',
    tokenExpiryBuffer: 5 * 60 * 1000, // 5 minutes before expiry
    refreshThreshold: 10 * 60 * 1000, // 10 minutes
  },

  // Security Headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },

  // CORS Configuration
  cors: {
    credentials: 'include',
    mode: 'cors' as RequestMode,
  },

  // Rate Limiting
  rateLimit: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  // Security Policies
  policies: {
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: false,
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },

  // Multi-Tenant Configuration
  multiTenant: {
    defaultTenantId: 'luxgen',
    tenantHeader: 'X-Tenant-ID',
    tenantCookie: 'luxgen_tenant_id',
  },

  // API Endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      register: '/auth/register',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
    },
    users: {
      profile: '/users/profile',
      update: '/users/update',
      changePassword: '/users/change-password',
    },
    jobs: {
      list: '/jobs',
      create: '/jobs',
      update: '/jobs',
      delete: '/jobs',
      apply: '/jobs/apply',
    },
    feed: {
      posts: '/feed/posts',
      create: '/feed/posts',
      like: '/feed/posts/like',
      comment: '/feed/posts/comment',
      share: '/feed/posts/share',
    },
    tenants: {
      info: '/tenants/info',
      settings: '/tenants/settings',
      branding: '/tenants/branding',
    },
  },

  // Development Configuration
  development: {
    enableLogging: process.env.NODE_ENV === 'development',
    enableDebugMode: process.env.NODE_ENV === 'development',
    mockApiResponses: false,
  },

  // Production Configuration
  production: {
    enableLogging: true,
    enableDebugMode: false,
    enableAnalytics: true,
  },
};

// Utility functions for security
export const securityUtils = {
  // Get client IP (for server-side usage)
  getClientIP: (): string => {
    // This would typically be implemented on the server side
    return '127.0.0.1';
  },

  // Generate secure random string
  generateSecureToken: (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  validatePassword: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const config = securityConfig.policies;

    if (password.length < config.passwordMinLength) {
      errors.push(`Password must be at least ${config.passwordMinLength} characters long`);
    }

    if (config.passwordRequireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (config.passwordRequireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (config.passwordRequireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (config.passwordRequireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  // Sanitize input
  sanitizeInput: (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/[&]/g, '&amp;') // Escape ampersands
      .trim();
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp < now;
    } catch {
      return true;
    }
  },

  // Get token expiry time
  getTokenExpiry: (token: string): Date | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  },
};

export default securityConfig;
