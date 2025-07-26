# Notification & Error Handling System

## 🎯 Overview

This document describes the comprehensive notification and error handling system implemented in the Trainer Platform. The system provides robust user feedback, error management, and success handling across all authentication flows.

## 📋 Table of Contents

1. [Notification System](#notification-system)
2. [Error Handling System](#error-handling-system)
3. [Success Handling System](#success-handling-system)
4. [Integration Guide](#integration-guide)
5. [Usage Examples](#usage-examples)
6. [Configuration](#configuration)
7. [Best Practices](#best-practices)

## 🔔 Notification System

### Features

- **Multiple Types**: Success, Error, Warning, Info
- **Customizable Duration**: Different durations for different notification types
- **Action Buttons**: Clickable actions within notifications
- **Sound Support**: Audio feedback for notifications
- **Persistent History**: Notification history with timestamps
- **Auto-cleanup**: Automatic cleanup of old notifications
- **Toggle Controls**: Enable/disable notifications and sounds

### Components

#### 1. NotificationProvider
```typescript
import { NotificationProvider } from './components/common/NotificationSystem';

// Wrap your app
<NotificationProvider>
  <YourApp />
</NotificationProvider>
```

#### 2. useNotifications Hook
```typescript
import { useNotifications } from './components/common/NotificationSystem';

const { showSuccess, showError, showWarning, showInfo } = useNotifications();
```

#### 3. NotificationBell Component
```typescript
import { NotificationBell } from './components/common/NotificationSystem';

// Display notification bell with unread count
<NotificationBell />
```

#### 4. NotificationList Component
```typescript
import { NotificationList } from './components/common/NotificationSystem';

// Display notification history
<NotificationList />
```

### Notification Types

#### Success Notifications
```typescript
showSuccess(
  'Welcome Back!',
  'Successfully signed in as user@example.com',
  { 
    duration: 4000,
    action: {
      label: 'View Profile',
      onClick: () => navigate('/profile')
    }
  }
);
```

#### Error Notifications
```typescript
showError(
  'Login Failed',
  'Invalid email or password. Please try again.',
  { duration: 6000 }
);
```

#### Warning Notifications
```typescript
showWarning(
  'Session Expiring',
  'Your session will expire in 5 minutes.',
  { 
    duration: 8000,
    action: {
      label: 'Extend Session',
      onClick: () => extendSession()
    }
  }
);
```

#### Info Notifications
```typescript
showInfo(
  'Processing',
  'Please wait while we process your request...',
  { duration: 3000 }
);
```

## ❌ Error Handling System

### Features

- **Error Categorization**: Automatic categorization of errors
- **Context-Aware Handling**: Different handling based on error context
- **Retry Mechanisms**: Automatic retry for network errors
- **User-Friendly Messages**: Clear, actionable error messages
- **Logging**: Comprehensive error logging for debugging
- **Issue Reporting**: Built-in issue reporting system

### Error Categories

1. **Network Errors**: Connection issues, timeouts
2. **Authentication Errors**: Invalid credentials, expired tokens
3. **Authorization Errors**: Insufficient permissions
4. **Validation Errors**: Form validation failures
5. **Server Errors**: 5xx HTTP status codes
6. **Client Errors**: 4xx HTTP status codes

### Components

#### 1. ErrorHandler Class
```typescript
import { ErrorHandler } from './utils/errorHandler';

const errorHandler = ErrorHandler.getInstance();
```

#### 2. useErrorHandler Hook
```typescript
import { useErrorHandler } from './utils/errorHandler';

const { handleError, handleApiError, handleAuthError } = useErrorHandler();
```

### Error Handling Methods

#### Generic Error Handling
```typescript
try {
  const response = await apiCall();
} catch (error) {
  handleError(error, 'api-call-context');
}
```

#### API Error Handling
```typescript
try {
  const response = await apiCall();
} catch (error) {
  const apiError = handleApiError(error, 'api-call-context');
  // Handle specific API error
}
```

#### Authentication Error Handling
```typescript
try {
  const response = await login(credentials);
} catch (error) {
  handleAuthError(error, 'login-form');
}
```

#### Validation Error Handling
```typescript
const validationErrors = [
  { field: 'email', message: 'Invalid email format' },
  { field: 'password', message: 'Password too short' }
];

handleValidationError(validationErrors, 'registration-form');
```

## ✅ Success Handling System

### Features

- **Context-Aware Success Messages**: Different messages for different operations
- **Action Buttons**: Quick actions after successful operations
- **Consistent Messaging**: Standardized success message format
- **User Guidance**: Clear next steps after success

### Components

#### 1. SuccessHandler Class
```typescript
import { SuccessHandler } from './utils/successHandler';

const successHandler = SuccessHandler.getInstance();
```

#### 2. useSuccessHandler Hook
```typescript
import { useSuccessHandler } from './utils/successHandler';

const { handleAuthSuccess, handleRegistrationSuccess } = useSuccessHandler();
```

### Success Handling Methods

#### Authentication Success
```typescript
handleAuthSuccess(user, 'login-form');
```

#### Registration Success
```typescript
handleRegistrationSuccess(user, requiresVerification);
```

#### Profile Update Success
```typescript
handleProfileUpdateSuccess('email');
```

#### Data Operation Success
```typescript
handleDataSuccess('Created', 'new poll');
```

## 🔧 Integration Guide

### 1. Setup in App.tsx

```typescript
import { NotificationProvider } from './components/common/NotificationSystem';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          {/* Your app components */}
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};
```

### 2. Using in Components

```typescript
import React from 'react';
import { useNotifications } from '../common/NotificationSystem';
import { useErrorHandler } from '../../utils/errorHandler';
import { useSuccessHandler } from '../../utils/successHandler';

const MyComponent: React.FC = () => {
  const { showSuccess, showError } = useNotifications();
  const { handleError } = useErrorHandler();
  const { handleAuthSuccess } = useSuccessHandler();

  const handleSubmit = async () => {
    try {
      const response = await apiCall();
      if (response.success) {
        showSuccess('Success', 'Operation completed successfully');
        handleAuthSuccess(response.user);
      } else {
        showError('Error', response.message);
      }
    } catch (error) {
      handleError(error, 'my-component');
    }
  };

  return (
    // Your component JSX
  );
};
```

### 3. Error Boundary Integration

```typescript
import { ErrorBoundary } from 'react-error-boundary';
import { useNotifications } from './components/common/NotificationSystem';

const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => {
  const { showError } = useNotifications();
  
  React.useEffect(() => {
    showError(
      'Application Error',
      'Something went wrong. Please refresh the page.',
      { duration: 10000 }
    );
  }, [error]);

  return (
    <div className="error-boundary">
      <h2>Something went wrong</h2>
      <button onClick={() => window.location.reload()}>
        Refresh Page
      </button>
    </div>
  );
};

// Wrap your app
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <YourApp />
</ErrorBoundary>
```

## 📝 Usage Examples

### Authentication Flow

```typescript
const LoginForm: React.FC = () => {
  const { showSuccess, showError, showInfo } = useNotifications();
  const { handleError } = useErrorHandler();

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      showInfo('Signing In', 'Please wait while we authenticate...', { duration: 3000 });
      
      const response = await login(credentials);
      
      if (response.success) {
        showSuccess(
          'Welcome Back!',
          `Successfully signed in as ${credentials.email}`,
          { 
            duration: 4000,
            action: {
              label: 'View Profile',
              onClick: () => navigate('/profile')
            }
          }
        );
        navigate('/dashboard');
      } else {
        showError(
          'Login Failed',
          response.message || 'Please check your credentials.',
          { duration: 6000 }
        );
      }
    } catch (error) {
      handleError(error, 'login-form');
    }
  };

  return (
    // Form JSX
  );
};
```

### Registration Flow

```typescript
const RegisterForm: React.FC = () => {
  const { showSuccess, showError } = useNotifications();
  const { handleError } = useErrorHandler();

  const handleRegistration = async (userData: RegisterData) => {
    try {
      const response = await register(userData);
      
      if (response.success) {
        if (response.data?.token) {
          showSuccess(
            'Welcome to Trainer Platform!',
            'Your account has been created successfully.',
            { 
              duration: 5000,
              action: {
                label: 'Get Started',
                onClick: () => navigate('/dashboard')
              }
            }
          );
          navigate('/dashboard');
        } else {
          showSuccess(
            'Account Created Successfully!',
            'Please check your email for verification.',
            { 
              duration: 6000,
              action: {
                label: 'Resend Email',
                onClick: () => resendVerificationEmail()
              }
            }
          );
          navigate('/verify-email');
        }
      } else {
        showError(
          'Registration Failed',
          response.message || 'Unable to create account.',
          { duration: 6000 }
        );
      }
    } catch (error) {
      handleError(error, 'registration-form');
    }
  };

  return (
    // Form JSX
  );
};
```

### API Error Handling

```typescript
const ApiComponent: React.FC = () => {
  const { handleError, handleApiError } = useErrorHandler();

  const fetchData = async () => {
    try {
      const response = await api.getData();
      // Handle success
    } catch (error) {
      // Automatic error categorization and handling
      handleError(error, 'data-fetch');
      
      // Or handle specific API errors
      const apiError = handleApiError(error, 'data-fetch');
      if (apiError.status === 401) {
        // Handle authentication error specifically
      }
    }
  };

  return (
    // Component JSX
  );
};
```

## ⚙️ Configuration

### Notification Configuration

```typescript
// Custom notification durations
const notificationConfig = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 3000
};

// Custom notification positions
const toastConfig = {
  position: 'top-right',
  duration: 4000,
  style: {
    background: '#333',
    color: '#fff',
    borderRadius: '8px',
    padding: '16px'
  }
};
```

### Error Handling Configuration

```typescript
// Custom error messages
const errorMessages = {
  400: 'Bad request - please check your input',
  401: 'Authentication required - please sign in',
  403: 'Access denied - insufficient permissions',
  404: 'Resource not found',
  500: 'Internal server error - please try again later'
};

// Retry configuration
const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2
};
```

## 🎯 Best Practices

### 1. Error Handling

- **Always use try-catch blocks** for async operations
- **Provide context** when handling errors
- **Use specific error handlers** for different error types
- **Log errors** for debugging purposes
- **Show user-friendly messages** instead of technical details

### 2. Success Handling

- **Be specific** about what succeeded
- **Provide next steps** when appropriate
- **Use consistent messaging** across the application
- **Include relevant data** in success messages

### 3. Notification Management

- **Don't overwhelm users** with too many notifications
- **Use appropriate durations** for different notification types
- **Provide actionable buttons** when relevant
- **Group related notifications** when possible

### 4. Performance

- **Debounce rapid notifications** to avoid spam
- **Clean up old notifications** automatically
- **Use efficient error categorization**
- **Minimize notification re-renders**

### 5. Accessibility

- **Provide keyboard navigation** for notifications
- **Use appropriate ARIA labels**
- **Ensure color contrast** meets WCAG guidelines
- **Support screen readers** with proper announcements

## 🔍 Debugging

### Enable Debug Mode

```typescript
// Enable debug logging
const DEBUG_MODE = process.env.NODE_ENV === 'development';

if (DEBUG_MODE) {
  console.log('Notification System:', notificationState);
  console.log('Error Handler:', errorHandler);
}
```

### Error Logging

```typescript
// Custom error logging
const logError = (error: any, context: string) => {
  console.error('Application Error:', {
    error: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });
};
```

### Notification Debugging

```typescript
// Debug notification state
const debugNotifications = () => {
  const { state } = useNotifications();
  console.log('Notification State:', state);
  
  // Test notifications
  showSuccess('Debug', 'Test success notification');
  showError('Debug', 'Test error notification');
  showWarning('Debug', 'Test warning notification');
  showInfo('Debug', 'Test info notification');
};
```

## 📊 Monitoring

### Error Tracking

```typescript
// Send errors to external service (Sentry, LogRocket, etc.)
const trackError = (error: any, context: string) => {
  // Example with Sentry
  if (window.Sentry) {
    window.Sentry.captureException(error, {
      tags: { context },
      extra: {
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    });
  }
};
```

### Performance Monitoring

```typescript
// Monitor notification performance
const monitorNotifications = () => {
  const startTime = performance.now();
  
  showSuccess('Test', 'Performance test');
  
  const endTime = performance.now();
  console.log(`Notification render time: ${endTime - startTime}ms`);
};
```

This comprehensive notification and error handling system ensures a robust, user-friendly experience across all authentication flows and application features. 