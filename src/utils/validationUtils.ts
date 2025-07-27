// Validation utility functions for forms

export interface FieldValidation {
  isValid: boolean;
  message?: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: string[];
}

// Email validation
export const validateEmail = (email: string | undefined): FieldValidation => {
  if (!email || !email.trim()) {
    return { isValid: false, message: 'Email is required', severity: 'error' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address', severity: 'error' };
  }
  
  // Check for common email issues
  if (email.length > 254) {
    return { isValid: false, message: 'Email address is too long', severity: 'error' };
  }
  
  if (email.includes('..') || email.includes('--')) {
    return { isValid: false, message: 'Email contains invalid characters', severity: 'error' };
  }
  
  return { isValid: true, severity: 'info' };
};

// Password validation
export const validatePassword = (password: string | undefined): FieldValidation => {
  if (!password) {
    return { isValid: false, message: 'Password is required', severity: 'error' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long', severity: 'error' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password is too long', severity: 'error' };
  }
  
  // Check for common weak password patterns
  if (/^[a-zA-Z]+$/.test(password)) {
    return { isValid: true, message: 'Consider adding numbers and symbols for better security', severity: 'warning' };
  }
  
  if (/^[0-9]+$/.test(password)) {
    return { isValid: true, message: 'Consider adding letters and symbols for better security', severity: 'warning' };
  }
  
  return { isValid: true, severity: 'info' };
};

// Domain validation
export const validateDomain = (domain: string | undefined): FieldValidation => {
  if (!domain || !domain.trim()) {
    return { isValid: true, severity: 'info' }; // Optional field
  }
  
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!domainRegex.test(domain)) {
    return { isValid: false, message: 'Please enter a valid domain name', severity: 'error' };
  }
  
  if (domain.length > 253) {
    return { isValid: false, message: 'Domain name is too long', severity: 'error' };
  }
  
  if (domain.startsWith('-') || domain.endsWith('-')) {
    return { isValid: false, message: 'Domain cannot start or end with a hyphen', severity: 'error' };
  }
  
  return { isValid: true, severity: 'info' };
};

// Rate limiting validation
export const validateRateLimit = (attemptCount: number, lastAttemptTime: number): FieldValidation => {
  const now = Date.now();
  const timeSinceLastAttempt = now - lastAttemptTime;
  
  if (attemptCount >= 3 && timeSinceLastAttempt < 300000) { // 5 minutes
    const remainingTime = Math.ceil((300000 - timeSinceLastAttempt) / 1000 / 60);
    return { 
      isValid: false, 
      message: `Too many login attempts. Please wait ${remainingTime} minutes before trying again.`, 
      severity: 'error' 
    };
  }
  
  return { isValid: true, severity: 'info' };
};

// Comprehensive form validation
export const validateLoginForm = (
  email: string,
  password: string,
  domain: string | undefined,
  attemptCount: number = 0,
  lastAttemptTime: number = 0
): ValidationResult => {
  const errors: Record<string, string> = {};
  const warnings: string[] = [];

  // Email validation
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message || 'Invalid email';
  }

  // Password validation
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message || 'Invalid password';
  } else if (passwordValidation.severity === 'warning' && passwordValidation.message) {
    warnings.push(passwordValidation.message);
  }

  // Domain validation
  const domainValidation = validateDomain(domain);
  if (!domainValidation.isValid) {
    errors.tenantDomain = domainValidation.message || 'Invalid domain';
  }

  // Rate limiting validation
  const rateLimitValidation = validateRateLimit(attemptCount, lastAttemptTime);
  if (!rateLimitValidation.isValid) {
    errors.general = rateLimitValidation.message || 'Rate limited';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
};

// Get validation icon based on field state
export const getValidationIcon = (validation?: FieldValidation, hasError?: boolean) => {
  if (hasError) {
    return 'error';
  }
  
  if (validation?.severity === 'warning') {
    return 'warning';
  }
  
  if (validation?.isValid && validation.severity === 'info') {
    return 'success';
  }
  
  return null;
};

// Get field CSS classes based on validation state
export const getFieldClasses = (
  baseClass: string,
  validation?: FieldValidation,
  hasError?: boolean
): string => {
  if (hasError) {
    return `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`;
  }
  
  if (validation?.severity === 'warning') {
    return `${baseClass} border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500`;
  }
  
  if (validation?.isValid && validation.severity === 'info') {
    return `${baseClass} border-green-300 focus:ring-green-500 focus:border-green-500`;
  }
  
  return `${baseClass} border-gray-300 focus:ring-primary-500 focus:border-primary-500`;
}; 