/**
 * ROBUST ERROR MANAGER
 * Centralized error handling with proper categorization and user feedback
 */

import { toast } from 'react-hot-toast';

// Error Types
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN = 'UNKNOWN',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Error Categories
export interface ErrorCategory {
  type: ErrorType;
  severity: ErrorSeverity;
  userMessage: string;
  action?: string;
  retryable: boolean;
  logLevel: 'info' | 'warn' | 'error' | 'fatal';
}

// Standardized Error
export interface StandardizedError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  action?: string;
  retryable: boolean;
  timestamp: string;
  context?: Record<string, any>;
  stack?: string;
}

// Error Categories Map
const ERROR_CATEGORIES: Record<string, ErrorCategory> = {
  // Network Errors
  'NETWORK_ERROR': {
    type: ErrorType.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Network connection failed. Please check your internet connection.',
    action: 'Check Connection',
    retryable: true,
    logLevel: 'warn',
  },
  'TIMEOUT': {
    type: ErrorType.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Request timed out. Please try again.',
    action: 'Retry',
    retryable: true,
    logLevel: 'warn',
  },

  // Authentication Errors
  'UNAUTHORIZED': {
    type: ErrorType.AUTHENTICATION,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Authentication failed. Please sign in again.',
    action: 'Sign In',
    retryable: false,
    logLevel: 'error',
  },
  'TOKEN_EXPIRED': {
    type: ErrorType.AUTHENTICATION,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Your session has expired. Please sign in again.',
    action: 'Sign In',
    retryable: false,
    logLevel: 'warn',
  },
  'INVALID_CREDENTIALS': {
    type: ErrorType.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Invalid email or password. Please check your credentials.',
    action: 'Check Credentials',
    retryable: true,
    logLevel: 'warn',
  },

  // Authorization Errors
  'FORBIDDEN': {
    type: ErrorType.AUTHORIZATION,
    severity: ErrorSeverity.HIGH,
    userMessage: 'You don\'t have permission to perform this action.',
    action: 'Contact Admin',
    retryable: false,
    logLevel: 'error',
  },
  'INSUFFICIENT_PERMISSIONS': {
    type: ErrorType.AUTHORIZATION,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Insufficient permissions to access this resource.',
    action: 'Request Access',
    retryable: false,
    logLevel: 'warn',
  },

  // Validation Errors
  'VALIDATION_ERROR': {
    type: ErrorType.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Please check your input and try again.',
    action: 'Check Input',
    retryable: true,
    logLevel: 'info',
  },
  'REQUIRED_FIELD': {
    type: ErrorType.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Please fill in all required fields.',
    action: 'Complete Form',
    retryable: true,
    logLevel: 'info',
  },
  'INVALID_FORMAT': {
    type: ErrorType.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Invalid format. Please check your input.',
    action: 'Check Format',
    retryable: true,
    logLevel: 'info',
  },

  // Not Found Errors
  'NOT_FOUND': {
    type: ErrorType.NOT_FOUND,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'The requested resource was not found.',
    action: 'Go Home',
    retryable: false,
    logLevel: 'warn',
  },
  'USER_NOT_FOUND': {
    type: ErrorType.NOT_FOUND,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'User not found.',
    action: 'Check User',
    retryable: false,
    logLevel: 'warn',
  },
  'TENANT_NOT_FOUND': {
    type: ErrorType.NOT_FOUND,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Tenant not found.',
    action: 'Select Tenant',
    retryable: false,
    logLevel: 'error',
  },

  // Server Errors
  'SERVER_ERROR': {
    type: ErrorType.SERVER,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Server error occurred. Please try again later.',
    action: 'Retry Later',
    retryable: true,
    logLevel: 'error',
  },
  'DATABASE_ERROR': {
    type: ErrorType.SERVER,
    severity: ErrorSeverity.CRITICAL,
    userMessage: 'Database error occurred. Please contact support.',
    action: 'Contact Support',
    retryable: false,
    logLevel: 'fatal',
  },
  'SERVICE_UNAVAILABLE': {
    type: ErrorType.SERVER,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Service temporarily unavailable. Please try again later.',
    action: 'Retry Later',
    retryable: true,
    logLevel: 'error',
  },

  // Rate Limiting
  'RATE_LIMIT_EXCEEDED': {
    type: ErrorType.CLIENT,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Too many requests. Please wait a moment and try again.',
    action: 'Wait and Retry',
    retryable: true,
    logLevel: 'warn',
  },

  // Unknown Errors
  'UNKNOWN_ERROR': {
    type: ErrorType.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'An unexpected error occurred. Please try again.',
    action: 'Retry',
    retryable: true,
    logLevel: 'error',
  },
};

// Error Manager Class
export class ErrorManager {
  private static instance: ErrorManager;
  private errorHistory: StandardizedError[] = [];
  private maxHistorySize = 100;

  private constructor() {}

  public static getInstance(): ErrorManager {
    if (!ErrorManager.instance) {
      ErrorManager.instance = new ErrorManager();
    }
    return ErrorManager.instance;
  }

  // Main error handling method
  public handleError(error: any, context?: string): StandardizedError {
    const standardizedError = this.standardizeError(error, context);
    this.logError(standardizedError);
    this.showUserFeedback(standardizedError);
    this.addToHistory(standardizedError);
    return standardizedError;
  }

  // Standardize error
  private standardizeError(error: any, context?: string): StandardizedError {
    const errorId = this.generateErrorId();
    const timestamp = new Date().toISOString();

    // Extract error information
    let message = 'An unknown error occurred';
    let type = ErrorType.UNKNOWN;
    let severity = ErrorSeverity.MEDIUM;
    let userMessage = 'An unexpected error occurred. Please try again.';
    let action = 'Retry';
    let retryable = true;
    let stack = undefined;

    // Handle different error types
    if (error?.response) {
      // Axios/HTTP error
      const { status, data } = error.response;
      message = data?.message || error.message || `HTTP ${status} Error`;
      
      // Determine error type based on status code
      switch (status) {
        case 400:
          type = ErrorType.VALIDATION;
          severity = ErrorSeverity.LOW;
          userMessage = 'Please check your input and try again.';
          action = 'Check Input';
          break;
        case 401:
          type = ErrorType.AUTHENTICATION;
          severity = ErrorSeverity.HIGH;
          userMessage = 'Authentication failed. Please sign in again.';
          action = 'Sign In';
          retryable = false;
          break;
        case 403:
          type = ErrorType.AUTHORIZATION;
          severity = ErrorSeverity.HIGH;
          userMessage = 'You don\'t have permission to perform this action.';
          action = 'Contact Admin';
          retryable = false;
          break;
        case 404:
          type = ErrorType.NOT_FOUND;
          severity = ErrorSeverity.MEDIUM;
          userMessage = 'The requested resource was not found.';
          action = 'Go Home';
          retryable = false;
          break;
        case 409:
          type = ErrorType.VALIDATION;
          severity = ErrorSeverity.LOW;
          userMessage = 'This resource already exists or conflicts with existing data.';
          action = 'Use Different Data';
          break;
        case 422:
          type = ErrorType.VALIDATION;
          severity = ErrorSeverity.LOW;
          userMessage = 'Please check your input and ensure all required fields are filled correctly.';
          action = 'Check Input';
          break;
        case 429:
          type = ErrorType.CLIENT;
          severity = ErrorSeverity.MEDIUM;
          userMessage = 'Too many requests. Please wait a moment and try again.';
          action = 'Wait and Retry';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          type = ErrorType.SERVER;
          severity = ErrorSeverity.HIGH;
          userMessage = 'Server error occurred. Please try again later.';
          action = 'Retry Later';
          break;
        default:
          type = ErrorType.UNKNOWN;
          severity = ErrorSeverity.MEDIUM;
          userMessage = 'An error occurred. Please try again.';
          action = 'Retry';
      }
    } else if (error?.request) {
      // Network error
      type = ErrorType.NETWORK;
      severity = ErrorSeverity.MEDIUM;
      message = 'Network error occurred';
      userMessage = 'Network connection failed. Please check your internet connection.';
      action = 'Check Connection';
    } else if (error instanceof Error) {
      // Standard JavaScript error
      message = error.message;
      stack = error.stack;
      
      // Try to categorize based on message
      if (message.includes('timeout')) {
        type = ErrorType.NETWORK;
        severity = ErrorSeverity.MEDIUM;
        userMessage = 'Request timed out. Please try again.';
        action = 'Retry';
      } else if (message.includes('permission') || message.includes('access')) {
        type = ErrorType.AUTHORIZATION;
        severity = ErrorSeverity.HIGH;
        userMessage = 'You don\'t have permission to perform this action.';
        action = 'Contact Admin';
        retryable = false;
      } else {
        type = ErrorType.UNKNOWN;
        severity = ErrorSeverity.MEDIUM;
        userMessage = 'An unexpected error occurred. Please try again.';
        action = 'Retry';
      }
    }

    return {
      id: errorId,
      type,
      severity,
      message,
      userMessage,
      action,
      retryable,
      timestamp,
      context: context ? { context } : undefined,
      stack,
    };
  }

  // Log error
  private logError(error: StandardizedError): void {
    const logMessage = `[${error.type}] ${error.message}`;
    const context = error.context ? ` Context: ${JSON.stringify(error.context)}` : '';
    
    switch (error.severity) {
      case ErrorSeverity.LOW:
        console.info(logMessage + context);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn(logMessage + context);
        break;
      case ErrorSeverity.HIGH:
        console.error(logMessage + context);
        break;
      case ErrorSeverity.CRITICAL:
        console.error(`[CRITICAL] ${logMessage}${context}`);
        break;
    }
  }

  // Show user feedback
  private showUserFeedback(error: StandardizedError): void {
    switch (error.severity) {
      case ErrorSeverity.LOW:
        // Don't show toast for low severity errors
        break;
      case ErrorSeverity.MEDIUM:
        toast.error(error.userMessage);
        break;
      case ErrorSeverity.HIGH:
        toast.error(error.userMessage);
        break;
      case ErrorSeverity.CRITICAL:
        toast.error(error.userMessage, {
          duration: 10000, // Show longer for critical errors
        });
        break;
    }
  }

  // Add to history
  private addToHistory(error: StandardizedError): void {
    this.errorHistory.unshift(error);
    
    // Keep only the most recent errors
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize);
    }
  }

  // Generate error ID
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get error history
  public getErrorHistory(): StandardizedError[] {
    return [...this.errorHistory];
  }

  // Clear error history
  public clearErrorHistory(): void {
    this.errorHistory = [];
  }

  // Get errors by type
  public getErrorsByType(type: ErrorType): StandardizedError[] {
    return this.errorHistory.filter(error => error.type === type);
  }

  // Get errors by severity
  public getErrorsBySeverity(severity: ErrorSeverity): StandardizedError[] {
    return this.errorHistory.filter(error => error.severity === severity);
  }

  // Check if error is retryable
  public isRetryable(error: any): boolean {
    const standardizedError = this.standardizeError(error);
    return standardizedError.retryable;
  }

  // Get retry delay based on error type
  public getRetryDelay(error: any): number {
    const standardizedError = this.standardizeError(error);
    
    switch (standardizedError.type) {
      case ErrorType.NETWORK:
        return 1000; // 1 second
      case ErrorType.SERVER:
        return 5000; // 5 seconds
      case ErrorType.RATE_LIMIT:
        return 10000; // 10 seconds
      default:
        return 2000; // 2 seconds
    }
  }
}

// Export singleton instance
export const errorManager = ErrorManager.getInstance();
export default errorManager;
