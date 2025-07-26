import { ApiError } from './errorHandler';

// Authentication-specific error codes and messages
export interface AuthErrorDetails {
  code: string;
  message: string;
  userFriendlyMessage: string;
  action?: string;
  field?: string;
}

export const AUTH_ERROR_CODES: Record<string, AuthErrorDetails> = {
  // Login Errors
  'USER_NOT_FOUND': {
    code: 'USER_NOT_FOUND',
    message: 'User not found with the provided email',
    userFriendlyMessage: 'No account found with this email address. Please check your email or create a new account.',
    action: 'Create Account',
    field: 'email'
  },
  'INVALID_CREDENTIALS': {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid email or password',
    userFriendlyMessage: 'The email or password you entered is incorrect. Please try again.',
    action: 'Forgot Password?',
    field: 'password'
  },
  'ACCOUNT_LOCKED': {
    code: 'ACCOUNT_LOCKED',
    message: 'Account is locked due to multiple failed attempts',
    userFriendlyMessage: 'Your account has been temporarily locked due to multiple failed login attempts. Please try again in 15 minutes or reset your password.',
    action: 'Reset Password',
    field: 'password'
  },
  'ACCOUNT_DISABLED': {
    code: 'ACCOUNT_DISABLED',
    message: 'Account is disabled',
    userFriendlyMessage: 'Your account has been disabled. Please contact support for assistance.',
    action: 'Contact Support'
  },
  'EMAIL_NOT_VERIFIED': {
    code: 'EMAIL_NOT_VERIFIED',
    message: 'Email address not verified',
    userFriendlyMessage: 'Please verify your email address before signing in. Check your inbox for a verification link.',
    action: 'Resend Verification',
    field: 'email'
  },
  'TENANT_NOT_FOUND': {
    code: 'TENANT_NOT_FOUND',
    message: 'Tenant/organization not found',
    userFriendlyMessage: 'The organization domain you entered was not found. Please check the domain or contact your administrator.',
    action: 'Contact Admin',
    field: 'tenantDomain'
  },
  'TENANT_DISABLED': {
    code: 'TENANT_DISABLED',
    message: 'Tenant/organization is disabled',
    userFriendlyMessage: 'Your organization account has been disabled. Please contact your administrator.',
    action: 'Contact Admin'
  },

  // Registration Errors
  'EMAIL_ALREADY_EXISTS': {
    code: 'EMAIL_ALREADY_EXISTS',
    message: 'Email address already registered',
    userFriendlyMessage: 'An account with this email address already exists. Please sign in or use a different email.',
    action: 'Sign In',
    field: 'email'
  },
  'WEAK_PASSWORD': {
    code: 'WEAK_PASSWORD',
    message: 'Password does not meet security requirements',
    userFriendlyMessage: 'Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters.',
    action: 'Update Password',
    field: 'password'
  },
  'INVALID_EMAIL_FORMAT': {
    code: 'INVALID_EMAIL_FORMAT',
    message: 'Invalid email format',
    userFriendlyMessage: 'Please enter a valid email address.',
    action: 'Check Email',
    field: 'email'
  },
  'PHONE_ALREADY_EXISTS': {
    code: 'PHONE_ALREADY_EXISTS',
    message: 'Phone number already registered',
    userFriendlyMessage: 'An account with this phone number already exists. Please use a different phone number.',
    action: 'Use Different Phone',
    field: 'phone'
  },
  'INVALID_PHONE_FORMAT': {
    code: 'INVALID_PHONE_FORMAT',
    message: 'Invalid phone number format',
    userFriendlyMessage: 'Please enter a valid phone number.',
    action: 'Check Phone',
    field: 'phone'
  },
  'DOMAIN_NOT_ALLOWED': {
    code: 'DOMAIN_NOT_ALLOWED',
    message: 'Email domain not allowed for registration',
    userFriendlyMessage: 'Registration is not allowed with this email domain. Please use a different email address.',
    action: 'Use Different Email',
    field: 'email'
  },
  'REGISTRATION_DISABLED': {
    code: 'REGISTRATION_DISABLED',
    message: 'Registration is currently disabled',
    userFriendlyMessage: 'New account registration is temporarily disabled. Please try again later or contact support.',
    action: 'Contact Support'
  },
  'TERMS_NOT_ACCEPTED': {
    code: 'TERMS_NOT_ACCEPTED',
    message: 'Terms and conditions not accepted',
    userFriendlyMessage: 'You must accept the terms and conditions to create an account.',
    action: 'Accept Terms',
    field: 'agreeToTerms'
  },

  // Password Reset Errors
  'PASSWORD_RESET_EXPIRED': {
    code: 'PASSWORD_RESET_EXPIRED',
    message: 'Password reset token has expired',
    userFriendlyMessage: 'Your password reset link has expired. Please request a new password reset.',
    action: 'Request New Reset'
  },
  'INVALID_RESET_TOKEN': {
    code: 'INVALID_RESET_TOKEN',
    message: 'Invalid password reset token',
    userFriendlyMessage: 'The password reset link is invalid. Please request a new password reset.',
    action: 'Request New Reset'
  },
  'PASSWORD_TOO_SIMILAR': {
    code: 'PASSWORD_TOO_SIMILAR',
    message: 'New password too similar to old password',
    userFriendlyMessage: 'Your new password must be significantly different from your current password.',
    action: 'Choose Different Password',
    field: 'password'
  },

  // Email Verification Errors
  'VERIFICATION_EXPIRED': {
    code: 'VERIFICATION_EXPIRED',
    message: 'Email verification token has expired',
    userFriendlyMessage: 'Your email verification link has expired. Please request a new verification email.',
    action: 'Resend Verification'
  },
  'INVALID_VERIFICATION_TOKEN': {
    code: 'INVALID_VERIFICATION_TOKEN',
    message: 'Invalid email verification token',
    userFriendlyMessage: 'The email verification link is invalid. Please request a new verification email.',
    action: 'Resend Verification'
  },

  // Rate Limiting
  'RATE_LIMIT_EXCEEDED': {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests, please try again later',
    userFriendlyMessage: 'Too many attempts. Please wait a few minutes before trying again.',
    action: 'Try Again Later'
  },

  // Network/Server Errors
  'NETWORK_ERROR': {
    code: 'NETWORK_ERROR',
    message: 'Network connection failed',
    userFriendlyMessage: 'Unable to connect to the server. Please check your internet connection and try again.',
    action: 'Retry'
  },
  'SERVER_ERROR': {
    code: 'SERVER_ERROR',
    message: 'Internal server error',
    userFriendlyMessage: 'We\'re experiencing technical difficulties. Please try again in a few minutes.',
    action: 'Try Again'
  },
  'SERVICE_UNAVAILABLE': {
    code: 'SERVICE_UNAVAILABLE',
    message: 'Service temporarily unavailable',
    userFriendlyMessage: 'Our service is temporarily unavailable. Please try again later.',
    action: 'Try Again Later'
  }
};

// Extract error code from API response
export const extractErrorCode = (error: any): string => {
  if (error?.response?.data?.code) {
    return error.response.data.code;
  }
  
  if (error?.code) {
    return error.code;
  }
  
  if (error?.response?.status) {
    return `HTTP_${error.response.status}`;
  }
  
  return 'UNKNOWN_ERROR';
};

// Get user-friendly error message
export const getAuthErrorMessage = (error: any): AuthErrorDetails => {
  const errorCode = extractErrorCode(error);
  
  // Check if we have a specific error code
  if (AUTH_ERROR_CODES[errorCode]) {
    return AUTH_ERROR_CODES[errorCode];
  }
  
  // Handle HTTP status codes
  switch (error?.response?.status) {
    case 400:
      return {
        code: 'BAD_REQUEST',
        message: 'Bad request',
        userFriendlyMessage: 'Please check your input and try again.',
        action: 'Check Input'
      };
    case 401:
      return {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
        userFriendlyMessage: 'Please sign in to continue.',
        action: 'Sign In'
      };
    case 403:
      return {
        code: 'FORBIDDEN',
        message: 'Access denied',
        userFriendlyMessage: 'You don\'t have permission to perform this action.',
        action: 'Contact Admin'
      };
    case 404:
      return {
        code: 'NOT_FOUND',
        message: 'Resource not found',
        userFriendlyMessage: 'The requested resource was not found.',
        action: 'Go Home'
      };
    case 409:
      return {
        code: 'CONFLICT',
        message: 'Resource conflict',
        userFriendlyMessage: 'This resource already exists or conflicts with existing data.',
        action: 'Use Different Data'
      };
    case 422:
      return {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        userFriendlyMessage: 'Please check your input and ensure all required fields are filled correctly.',
        action: 'Check Input'
      };
    case 429:
      return AUTH_ERROR_CODES['RATE_LIMIT_EXCEEDED'];
    case 500:
      return AUTH_ERROR_CODES['SERVER_ERROR'];
    case 502:
    case 503:
    case 504:
      return AUTH_ERROR_CODES['SERVICE_UNAVAILABLE'];
    default:
      return {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        userFriendlyMessage: 'Something went wrong. Please try again or contact support if the problem persists.',
        action: 'Contact Support'
      };
  }
};

// Check if error is related to a specific field
export const getErrorField = (error: any): string | undefined => {
  const errorDetails = getAuthErrorMessage(error);
  return errorDetails.field;
};

// Get suggested action for the error
export const getErrorAction = (error: any): { label: string; action: string } | undefined => {
  const errorDetails = getAuthErrorMessage(error);
  if (errorDetails.action) {
    return {
      label: errorDetails.action,
      action: errorDetails.code
    };
  }
  return undefined;
};

// Format error for display in forms
export const formatFormError = (error: any, context: 'login' | 'register' | 'password-reset' = 'login'): {
  message: string;
  field?: string;
  action?: { label: string; action: string };
  severity: 'error' | 'warning' | 'info';
} => {
  const errorDetails = getAuthErrorMessage(error);
  const action = getErrorAction(error);
  
  // Determine severity based on error type
  let severity: 'error' | 'warning' | 'info' = 'error';
  if (['RATE_LIMIT_EXCEEDED', 'SERVICE_UNAVAILABLE'].includes(errorDetails.code)) {
    severity = 'warning';
  } else if (['EMAIL_NOT_VERIFIED'].includes(errorDetails.code)) {
    severity = 'info';
  }
  
  return {
    message: errorDetails.userFriendlyMessage,
    field: errorDetails.field,
    action,
    severity
  };
};

// Create field-specific error messages
export const createFieldError = (field: string, message: string): ValidationError => ({
  field,
  message,
  value: undefined
});

// Validation error interface
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
} 