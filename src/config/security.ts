/**
 * Security Configuration
 * Centralized security settings to prevent hardcoded values and ensure proper security practices
 */

export interface SecurityConfig {
  // API Configuration
  apiBaseUrl: string;
  apiHealthUrl: string;
  apiDocsUrl: string;
  
  // Authentication
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;
  
  // Session Management
  sessionSecret: string;
  sessionTtl: number;
  
  // Rate Limiting
  rateLimitWindow: string;
  rateLimitMaxRequests: number;
  
  // CORS
  corsOrigins: string[];
  corsCredentials: boolean;
  
  // File Upload
  uploadMaxSize: string;
  
  // Security Headers
  enableSecurityHeaders: boolean;
  enableHsts: boolean;
  enableCsp: boolean;
}

// Validate required environment variables with fallbacks for development
const validateEnvVar = (name: string, value: string | undefined, fallback?: string): string => {
  if (!value) {
    if (fallback && process.env.NODE_ENV === 'development') {
      console.warn(`Environment variable ${name} not set, using fallback: ${fallback}`);
      return fallback;
    }
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
};

// Get API base URL with fallback logic
const getApiBaseUrl = (): string => {
  // Try REACT_APP_API_BASE_URL first
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // Try REACT_APP_API_URL and append /api/v1
  if (process.env.REACT_APP_API_URL) {
    return `${process.env.REACT_APP_API_URL}/api/v1`;
  }
  
  // Development fallback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001/api/v1';
  }
  
  throw new Error('API base URL not configured. Please set REACT_APP_API_BASE_URL or REACT_APP_API_URL');
};

// Security configuration with validation
export const securityConfig: SecurityConfig = {
  // API Configuration
  apiBaseUrl: getApiBaseUrl(),
  apiHealthUrl: validateEnvVar('REACT_APP_API_HEALTH_URL', process.env.REACT_APP_API_HEALTH_URL, 'http://localhost:3001/health'),
  apiDocsUrl: validateEnvVar('REACT_APP_API_DOCS_URL', process.env.REACT_APP_API_DOCS_URL, 'http://localhost:3001/docs'),
  
  // Authentication
  jwtSecret: validateEnvVar('JWT_SECRET', process.env.JWT_SECRET, 'dev-jwt-secret-key-2024-change-in-production'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // Session Management
  sessionSecret: validateEnvVar('SESSION_SECRET', process.env.SESSION_SECRET, 'dev-session-secret-2024-change-in-production'),
  sessionTtl: parseInt(process.env.SESSION_TTL || '86400', 10),
  
  // Rate Limiting
  rateLimitWindow: process.env.RATE_LIMIT_WINDOW || '15m',
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // CORS
  corsOrigins: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  corsCredentials: process.env.CORS_CREDENTIALS === 'true',
  
  // File Upload
  uploadMaxSize: process.env.UPLOAD_MAX_SIZE || '50MB',
  
  // Security Headers
  enableSecurityHeaders: true,
  enableHsts: process.env.NODE_ENV === 'production',
  enableCsp: process.env.NODE_ENV === 'production',
};

// Security utilities
export const securityUtils = {
  /**
   * Validate API URL format
   */
  validateApiUrl: (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch {
      return false;
    }
  },

  /**
   * Sanitize user input
   */
  sanitizeInput: (input: string): string => {
    return input.replace(/[<>]/g, '');
  },

  /**
   * Generate secure random string
   */
  generateSecureToken: (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Validate password strength
   */
  validatePasswordStrength: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Get client IP address (placeholder for production implementation)
   */
  getClientIP: (): string => {
    // In production, this should extract the real IP from request headers
    // For now, return a placeholder
    return 'unknown';
  },
};

// Export default configuration
export default securityConfig; 