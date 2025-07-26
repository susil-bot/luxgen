import React from 'react';
import { useNotifications } from '../components/common/NotificationSystem';

// Error Types
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface NetworkError {
  message: string;
  code?: string;
  retryable: boolean;
}

// Error Categories
export type ErrorCategory = 
  | 'network'
  | 'authentication'
  | 'authorization'
  | 'validation'
  | 'server'
  | 'client'
  | 'unknown';

// Error Handler Class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private notifications: any;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  setNotifications(notifications: any) {
    this.notifications = notifications;
  }

  // Handle API errors
  handleApiError(error: any, context?: string): ApiError {
    let apiError: ApiError = {
      status: 500,
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    };

    if (error.response) {
      // Server responded with error status
      apiError = {
        status: error.response.status,
        message: error.response.data?.message || this.getDefaultErrorMessage(error.response.status),
        code: error.response.data?.code,
        details: error.response.data?.details,
        timestamp: new Date().toISOString(),
      };
    } else if (error.request) {
      // Network error
      apiError = {
        status: 0,
        message: 'Network error - please check your connection',
        code: 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
      };
    } else {
      // Other error
      apiError = {
        status: 500,
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString(),
      };
    }

    this.logError(apiError, context);
    this.showErrorNotification(apiError, context);
    
    return apiError;
  }

  // Handle validation errors
  handleValidationError(errors: ValidationError[], context?: string): void {
    const errorMessages = errors.map(error => `${error.field}: ${error.message}`).join(', ');
    
    if (this.notifications) {
      this.notifications.showError(
        'Validation Error',
        errorMessages,
        { duration: 6000 }
      );
    }

    console.error('Validation errors:', { errors, context });
  }

  // Handle network errors
  handleNetworkError(error: NetworkError, context?: string): void {
    if (this.notifications) {
      this.notifications.showError(
        'Connection Error',
        error.message,
        {
          duration: 8000,
          action: error.retryable ? {
            label: 'Retry',
            onClick: () => this.retryOperation(context)
          } : undefined
        }
      );
    }

    console.error('Network error:', { error, context });
  }

  // Handle authentication errors
  handleAuthError(error: ApiError, context?: string): void {
    if (this.notifications) {
      this.notifications.showError(
        'Authentication Error',
        error.message,
        {
          duration: 5000,
          action: {
            label: 'Sign In',
            onClick: () => window.location.href = '/login'
          }
        }
      );
    }

    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.error('Authentication error:', { error, context });
  }

  // Handle authorization errors
  handleAuthzError(error: ApiError, context?: string): void {
    if (this.notifications) {
      this.notifications.showError(
        'Access Denied',
        'You do not have permission to perform this action',
        {
          duration: 5000,
          action: {
            label: 'Go to Dashboard',
            onClick: () => window.location.href = '/dashboard'
          }
        }
      );
    }

    console.error('Authorization error:', { error, context });
  }

  // Handle server errors
  handleServerError(error: ApiError, context?: string): void {
    if (this.notifications) {
      this.notifications.showError(
        'Server Error',
        'Our servers are experiencing issues. Please try again later.',
        {
          duration: 10000,
          action: {
            label: 'Report Issue',
            onClick: () => this.reportIssue(error, context)
          }
        }
      );
    }

    console.error('Server error:', { error, context });
  }

  // Handle client errors
  handleClientError(error: ApiError, context?: string): void {
    if (this.notifications) {
      this.notifications.showError(
        'Error',
        error.message,
        { duration: 5000 }
      );
    }

    console.error('Client error:', { error, context });
  }

  // Generic error handler
  handleError(error: any, context?: string): void {
    const category = this.categorizeError(error);
    
    switch (category) {
      case 'authentication':
        this.handleAuthError(this.handleApiError(error, context), context);
        break;
      case 'authorization':
        this.handleAuthzError(this.handleApiError(error, context), context);
        break;
      case 'network':
        this.handleNetworkError({
          message: error.message || 'Network connection failed',
          retryable: true
        }, context);
        break;
      case 'server':
        this.handleServerError(this.handleApiError(error, context), context);
        break;
      case 'validation':
        if (Array.isArray(error)) {
          this.handleValidationError(error, context);
        } else {
          this.handleClientError(this.handleApiError(error, context), context);
        }
        break;
      default:
        this.handleClientError(this.handleApiError(error, context), context);
    }
  }

  // Categorize error based on status code and content
  private categorizeError(error: any): ErrorCategory {
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401) return 'authentication';
      if (status === 403) return 'authorization';
      if (status >= 500) return 'server';
      if (status >= 400) return 'validation';
    }
    
    if (error.request) return 'network';
    if (error.name === 'ValidationError') return 'validation';
    
    return 'unknown';
  }

  // Get default error message based on status code
  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Bad request - please check your input';
      case 401:
        return 'Authentication required - please sign in';
      case 403:
        return 'Access denied - insufficient permissions';
      case 404:
        return 'Resource not found';
      case 409:
        return 'Conflict - resource already exists';
      case 422:
        return 'Validation failed - please check your input';
      case 429:
        return 'Too many requests - please try again later';
      case 500:
        return 'Internal server error - please try again later';
      case 502:
        return 'Bad gateway - please try again later';
      case 503:
        return 'Service unavailable - please try again later';
      case 504:
        return 'Gateway timeout - please try again later';
      default:
        return 'An unexpected error occurred';
    }
  }

  // Log error to console and potentially external service
  private logError(error: ApiError, context?: string): void {
    const logData = {
      error,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    console.error('Application Error:', logData);

    // TODO: Send to external logging service (Sentry, LogRocket, etc.)
    // this.sendToLoggingService(logData);
  }

  // Show error notification
  private showErrorNotification(error: ApiError, context?: string): void {
    if (!this.notifications) return;

    const title = this.getErrorTitle(error.status);
    const message = error.message;

    this.notifications.showError(title, message, {
      duration: error.status >= 500 ? 10000 : 6000,
      action: this.getErrorAction(error, context)
    });
  }

  // Get error title based on status
  private getErrorTitle(status: number): string {
    if (status >= 500) return 'Server Error';
    if (status === 401) return 'Authentication Required';
    if (status === 403) return 'Access Denied';
    if (status === 404) return 'Not Found';
    if (status === 422) return 'Validation Error';
    if (status === 429) return 'Rate Limited';
    return 'Error';
  }

  // Get error action based on error type
  private getErrorAction(error: ApiError, context?: string): any {
    if (error.status === 401) {
      return {
        label: 'Sign In',
        onClick: () => window.location.href = '/login'
      };
    }
    
    if (error.status === 403) {
      return {
        label: 'Go to Dashboard',
        onClick: () => window.location.href = '/dashboard'
      };
    }
    
    if (error.status >= 500) {
      return {
        label: 'Report Issue',
        onClick: () => this.reportIssue(error, context)
      };
    }
    
    return undefined;
  }

  // Retry operation
  private retryOperation(context?: string): void {
    if (this.notifications) {
      this.notifications.showInfo(
        'Retrying',
        'Attempting to reconnect...',
        { duration: 3000 }
      );
    }
    
    // TODO: Implement retry logic based on context
    console.log('Retrying operation:', context);
  }

  // Report issue
  private reportIssue(error: ApiError, context?: string): void {
    const issueData = {
      error: error.message,
      status: error.status,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    // TODO: Send to issue tracking system
    console.log('Reporting issue:', issueData);
    
    if (this.notifications) {
      this.notifications.showInfo(
        'Issue Reported',
        'Thank you for reporting this issue. We will investigate.',
        { duration: 5000 }
      );
    }
  }
}

// Hook for using error handler with notifications
export const useErrorHandler = () => {
  const notifications = useNotifications();
  const errorHandler = ErrorHandler.getInstance();
  
  // Set notifications when hook is used
  React.useEffect(() => {
    errorHandler.setNotifications(notifications);
  }, [notifications]);

  return {
    handleError: (error: any, context?: string) => errorHandler.handleError(error, context),
    handleApiError: (error: any, context?: string) => errorHandler.handleApiError(error, context),
    handleValidationError: (errors: ValidationError[], context?: string) => 
      errorHandler.handleValidationError(errors, context),
    handleNetworkError: (error: NetworkError, context?: string) => 
      errorHandler.handleNetworkError(error, context),
    handleAuthError: (error: ApiError, context?: string) => 
      errorHandler.handleAuthError(error, context),
    handleAuthzError: (error: ApiError, context?: string) => 
      errorHandler.handleAuthzError(error, context),
    handleServerError: (error: ApiError, context?: string) => 
      errorHandler.handleServerError(error, context),
    handleClientError: (error: ApiError, context?: string) => 
      errorHandler.handleClientError(error, context),
  };
};

// Utility functions for common error patterns
export const createValidationError = (field: string, message: string, value?: any): ValidationError => ({
  field,
  message,
  value,
});

export const createNetworkError = (message: string, retryable: boolean = true): NetworkError => ({
  message,
  retryable,
});

export const isNetworkError = (error: any): boolean => {
  return !error.response && error.request;
};

export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401;
};

export const isAuthzError = (error: any): boolean => {
  return error.response?.status === 403;
};

export const isServerError = (error: any): boolean => {
  return error.response?.status >= 500;
};

export const isClientError = (error: any): boolean => {
  return error.response?.status >= 400 && error.response?.status < 500;
};

export const isValidationError = (error: any): boolean => {
  return error.response?.status === 422 || Array.isArray(error);
}; 