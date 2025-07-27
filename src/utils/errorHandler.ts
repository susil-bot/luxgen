import { toast } from 'react-hot-toast';

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
  timestamp?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface NetworkError {
  message: string;
  isOffline?: boolean;
  retryAfter?: number;
}

// Error Categories
export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  SERVER_ERROR = 'server_error',
  RATE_LIMIT = 'rate_limit',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}

// Error Severity Levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Error Handler Class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorCount: Map<string, number> = new Map();
  private lastErrorTime: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Main error handling method
  handleError(error: any, context?: string): ApiError {
    const apiError = this.parseError(error);
    const category = this.categorizeError(apiError);
    const severity = this.determineSeverity(apiError, category);

    // Log error
    this.logError(apiError, category, severity, context);

    // Show user-friendly message
    this.showUserMessage(apiError, category, severity);

    // Handle specific error types
    this.handleSpecificError(apiError, category);

    return apiError;
  }

  // Parse different error types into standardized format
  private parseError(error: any): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: (error as any).code,
        status: (error as any).status,
        timestamp: new Date().toISOString()
      };
    }

    if (typeof error === 'string') {
      return {
        message: error,
        timestamp: new Date().toISOString()
      };
    }

    if (error && typeof error === 'object') {
      return {
        message: error.message || error.error || 'An unknown error occurred',
        code: error.code,
        status: error.status,
        details: error.details,
        timestamp: error.timestamp || new Date().toISOString()
      };
    }

    return {
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    };
  }

  // Categorize error based on status code and message
  private categorizeError(error: ApiError): ErrorCategory {
    if (!error.status) {
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return ErrorCategory.NETWORK;
      }
      return ErrorCategory.UNKNOWN;
    }

    switch (error.status) {
      case 400:
        return ErrorCategory.VALIDATION;
      case 401:
        return ErrorCategory.AUTHENTICATION;
      case 403:
        return ErrorCategory.AUTHORIZATION;
      case 404:
        return ErrorCategory.NOT_FOUND;
      case 408:
      case 504:
        return ErrorCategory.TIMEOUT;
      case 429:
        return ErrorCategory.RATE_LIMIT;
      case 500:
      case 502:
      case 503:
        return ErrorCategory.SERVER_ERROR;
      default:
        return ErrorCategory.UNKNOWN;
    }
  }

  // Determine error severity
  private determineSeverity(error: ApiError, category: ErrorCategory): ErrorSeverity {
    // Critical errors
    if (category === ErrorCategory.AUTHENTICATION || category === ErrorCategory.AUTHORIZATION) {
      return ErrorSeverity.CRITICAL;
    }

    // High severity errors
    if (category === ErrorCategory.SERVER_ERROR || category === ErrorCategory.NETWORK) {
      return ErrorSeverity.HIGH;
    }

    // Medium severity errors
    if (category === ErrorCategory.VALIDATION || category === ErrorCategory.RATE_LIMIT) {
      return ErrorSeverity.MEDIUM;
    }

    // Low severity errors
    if (category === ErrorCategory.NOT_FOUND || category === ErrorCategory.TIMEOUT) {
      return ErrorSeverity.LOW;
    }

    return ErrorSeverity.MEDIUM;
  }

  // Log error for debugging
  private logError(error: ApiError, category: ErrorCategory, severity: ErrorSeverity, context?: string) {
    const logData = {
      error,
      category,
      severity,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('Error Handler:', logData);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // this.sendToErrorTracking(logData);
    }
  }

  // Show user-friendly error message
  private showUserMessage(error: ApiError, category: ErrorCategory, severity: ErrorSeverity) {
    const message = this.getUserFriendlyMessage(error, category);
    const icon = this.getErrorIcon(severity);
    const duration = this.getToastDuration(severity);

    toast.error(
      `${icon} ${message}`,
      {
        duration,
        position: 'top-right',
        style: {
          background: this.getErrorColor(severity),
          color: 'white',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '500'
        }
      }
    );
  }

  // Get user-friendly error message
  private getUserFriendlyMessage(error: ApiError, category: ErrorCategory): string {
    switch (category) {
      case ErrorCategory.NETWORK:
        return 'Connection failed. Please check your internet connection and try again.';
      
      case ErrorCategory.AUTHENTICATION:
        return 'Your session has expired. Please log in again.';
      
      case ErrorCategory.AUTHORIZATION:
        return 'You don\'t have permission to perform this action.';
      
      case ErrorCategory.VALIDATION:
        return error.message || 'Please check your input and try again.';
      
      case ErrorCategory.NOT_FOUND:
        return 'The requested resource was not found.';
      
      case ErrorCategory.SERVER_ERROR:
        return 'Something went wrong on our end. Please try again later.';
      
      case ErrorCategory.RATE_LIMIT:
        return 'Too many requests. Please wait a moment and try again.';
      
      case ErrorCategory.TIMEOUT:
        return 'Request timed out. Please try again.';
      
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  // Get error icon based on severity
  private getErrorIcon(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return '🚨';
      case ErrorSeverity.HIGH:
        return '⚠️';
      case ErrorSeverity.MEDIUM:
        return '⚠️';
      case ErrorSeverity.LOW:
        return 'ℹ️';
      default:
        return '❌';
    }
  }

  // Get toast duration based on severity
  private getToastDuration(severity: ErrorSeverity): number {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return 8000; // 8 seconds
      case ErrorSeverity.HIGH:
        return 6000; // 6 seconds
      case ErrorSeverity.MEDIUM:
        return 4000; // 4 seconds
      case ErrorSeverity.LOW:
        return 3000; // 3 seconds
      default:
        return 4000;
    }
  }

  // Get error color based on severity
  private getErrorColor(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return '#dc2626'; // red-600
      case ErrorSeverity.HIGH:
        return '#ea580c'; // orange-600
      case ErrorSeverity.MEDIUM:
        return '#d97706'; // amber-600
      case ErrorSeverity.LOW:
        return '#059669'; // emerald-600
      default:
        return '#6b7280'; // gray-500
    }
  }

  // Handle specific error types
  private handleSpecificError(error: ApiError, category: ErrorCategory) {
    switch (category) {
      case ErrorCategory.AUTHENTICATION:
        this.handleAuthenticationError();
        break;
      
      case ErrorCategory.AUTHORIZATION:
        this.handleAuthorizationError();
        break;
      
      case ErrorCategory.NETWORK:
        this.handleNetworkError();
        break;
      
      case ErrorCategory.RATE_LIMIT:
        this.handleRateLimitError(error);
        break;
    }
  }

  // Handle authentication errors
  private handleAuthenticationError() {
    // Clear user data and redirect to login
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Redirect to login page
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }

  // Handle authorization errors
  private handleAuthorizationError() {
    // Show access denied message
    toast.error('Access denied. Please contact your administrator.', {
      duration: 5000,
      position: 'top-center'
    });
  }

  // Handle network errors
  private handleNetworkError() {
    // Check if offline
    if (!navigator.onLine) {
      toast.error('You are currently offline. Please check your connection.', {
        duration: 0, // Don't auto-dismiss
        position: 'top-center'
      });
    }
  }

  // Handle rate limit errors
  private handleRateLimitError(error: ApiError) {
    const retryAfter = error.details?.retryAfter || 60;
    
    toast.error(
      `Rate limit exceeded. Please wait ${retryAfter} seconds before trying again.`,
      {
        duration: 5000,
        position: 'top-center'
      }
    );
  }

  // Retry mechanism for failed requests
  async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          break;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
        
        // Show retry notification
        toast.error(`Request failed. Retrying... (${attempt}/${maxRetries})`, {
          duration: 2000,
          position: 'top-right'
        });
      }
    }

    throw lastError;
  }

  // Handle validation errors
  handleValidationErrors(errors: ValidationError[]): void {
    errors.forEach(error => {
      toast.error(`${error.field}: ${error.message}`, {
        duration: 4000,
        position: 'top-right'
      });
    });
  }

  // Handle API response errors
  handleApiResponse(response: any): boolean {
    if (!response.success) {
      this.handleError(response.error || response.message || 'API request failed');
      return false;
    }
    return true;
  }

  // Clear error count for specific error type
  clearErrorCount(errorType: string): void {
    this.errorCount.delete(errorType);
    this.lastErrorTime.delete(errorType);
  }

  // Get error count for specific error type
  getErrorCount(errorType: string): number {
    return this.errorCount.get(errorType) || 0;
  }

  // Check if error should be throttled
  shouldThrottleError(errorType: string, maxErrors: number = 5, timeWindow: number = 60000): boolean {
    const now = Date.now();
    const lastTime = this.lastErrorTime.get(errorType) || 0;
    const count = this.errorCount.get(errorType) || 0;

    // Reset count if time window has passed
    if (now - lastTime > timeWindow) {
      this.errorCount.set(errorType, 1);
      this.lastErrorTime.set(errorType, now);
      return false;
    }

    // Increment count
    this.errorCount.set(errorType, count + 1);
    this.lastErrorTime.set(errorType, now);

    return count >= maxErrors;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Export utility functions
export const handleApiError = (error: any, context?: string) => {
  return errorHandler.handleError(error, context);
};

export const retryRequest = <T>(
  requestFn: () => Promise<T>,
  maxRetries?: number,
  delay?: number
) => {
  return errorHandler.retryRequest(requestFn, maxRetries, delay);
};

export const handleValidationErrors = (errors: ValidationError[]) => {
  return errorHandler.handleValidationErrors(errors);
};

export const handleApiResponse = (response: any) => {
  return errorHandler.handleApiResponse(response);
};

// React hook for using error handler
export const useErrorHandler = () => {
  return {
    handleError: (error: any, context?: string) => errorHandler.handleError(error, context),
    handleValidationError: (errors: ValidationError[]) => errorHandler.handleValidationErrors(errors),
    handleAuthError: (error: any) => {
      const apiError = errorHandler.handleError(error, 'authentication');
      if (apiError.status === 401) {
        // Handle authentication errors specifically
        toast.error('Authentication failed. Please check your credentials.');
      }
      return apiError;
    },
    retryRequest: <T>(requestFn: () => Promise<T>, maxRetries?: number, delay?: number) => 
      errorHandler.retryRequest(requestFn, maxRetries, delay),
    handleApiResponse: (response: any) => errorHandler.handleApiResponse(response)
  };
}; 