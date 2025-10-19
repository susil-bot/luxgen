// Security Configuration for LuxGen Frontend
// =============================================

export const securityConfig = {
  // API Configuration
  apiBaseUrl: process.env.REACT_APP_API_URL || 'https://luxgen-backend.netlify.app',
  
  // JWT Configuration
  jwt: {
    tokenKey: 'authToken',
    refreshTokenKey: 'refreshToken',
    expiresIn: '24h',
    refreshExpiresIn: '7d'
  },
  
  // CORS Configuration
  cors: {
    allowedOrigins: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5000'
    ],
    credentials: true
  },
  
  // Security Headers
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  
  // Encryption
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16
  },
  
  // Session Configuration
  session: {
    name: 'luxgen-session',
    secret: process.env.REACT_APP_SESSION_SECRET || 'luxgen-secret-key',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const
  },
  
  // Multi-Tenant Security
  multiTenant: {
    tenantHeader: 'x-tenant-id',
    userHeader: 'x-user-id',
    roleHeader: 'x-user-role'
  },
  
  // API Endpoints
  endpoints: {
    auth: {
      register: '/api/v1/auth/register',
      login: '/api/v1/auth/login',
      logout: '/api/v1/auth/logout',
      refresh: '/api/v1/auth/refresh',
      me: '/api/v1/auth/me',
      forgotPassword: '/api/v1/auth/forgot-password',
      resetPassword: '/api/v1/auth/reset-password'
    },
    tenants: {
      list: '/api/v1/tenants',
      create: '/api/v1/tenants',
      get: '/api/v1/tenants/:id',
      update: '/api/v1/tenants/:id',
      delete: '/api/v1/tenants/:id'
    },
    health: {
      check: '/health',
      db: '/health/db'
    }
  },
  
  // Error Messages
  errors: {
    network: 'Network error. Please check your connection.',
    unauthorized: 'You are not authorized to perform this action.',
    forbidden: 'Access denied.',
    notFound: 'Resource not found.',
    serverError: 'Internal server error. Please try again later.',
    validation: 'Please check your input and try again.',
    timeout: 'Request timeout. Please try again.'
  },
  
  // Development Configuration
  development: {
    enableLogging: process.env.NODE_ENV === 'development',
    enableDebugMode: process.env.REACT_APP_DEBUG === 'true',
    mockApi: process.env.REACT_APP_MOCK_API === 'true'
  }
};

export default securityConfig;

// Security Utilities
export const securityUtils = {
  // Get client IP address
  getClientIP(): string {
    // In a real application, this would extract IP from request headers
    // For development, return a mock IP
    return '127.0.0.1';
  },
  
  // Generate secure random string
  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
  
  // Hash password (basic implementation)
  hashPassword(password: string): string {
    // In production, use bcrypt or similar
    return btoa(password); // Base64 encoding for demo
  },
  
  // Verify password
  verifyPassword(password: string, hash: string): boolean {
    return btoa(password) === hash;
  },
  
  // Generate JWT token (basic implementation)
  generateJWT(payload: any): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify(payload));
    const signature = btoa(`${header}.${body}`);
    return `${header}.${body}.${signature}`;
  },
  
  // Validate JWT token
  validateJWT(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch {
      return null;
    }
  },
  
  // Sanitize input
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .trim();
  },
  
  // Check if string is valid email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Check password strength
  checkPasswordStrength(password: string): {
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;
    
    if (password.length >= 8) score += 1;
    else feedback.push('Password should be at least 8 characters long');
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Password should contain lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Password should contain uppercase letters');
    
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Password should contain numbers');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Password should contain special characters');
    
    return { score, feedback };
  }
};
