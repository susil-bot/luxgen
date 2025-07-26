# Authentication Error Handling System

## Overview

This document describes the comprehensive error handling system implemented for authentication flows (login, registration, password reset, etc.) in the platform. The system provides user-friendly error messages, appropriate actions, and visual feedback for all possible error scenarios.

## Features

### ✅ **Comprehensive Error Coverage**
- **Login Errors**: User not found, invalid credentials, account locked, email not verified, tenant not found
- **Registration Errors**: Email already exists, weak password, domain not allowed, phone already exists
- **System Errors**: Network issues, rate limiting, server errors, service unavailable
- **Password Reset Errors**: Expired tokens, invalid tokens, password too similar
- **Email Verification Errors**: Expired tokens, invalid tokens

### ✅ **User-Friendly Messages**
- Clear, actionable error messages
- Context-aware suggestions
- Field-specific error indicators
- Severity-based styling (error, warning, info)

### ✅ **Smart Actions**
- Automatic navigation to relevant pages
- Field clearing for retry
- Step navigation in multi-step forms
- Retry mechanisms for transient errors

### ✅ **Visual Design**
- Color-coded severity levels
- Field-specific icons
- Dismissible error messages
- Responsive design

## Architecture

### Core Components

#### 1. **AuthErrorHandler** (`src/utils/authErrorHandler.ts`)
```typescript
// Error code definitions
export const AUTH_ERROR_CODES: Record<string, AuthErrorDetails> = {
  'USER_NOT_FOUND': {
    code: 'USER_NOT_FOUND',
    message: 'User not found with the provided email',
    userFriendlyMessage: 'No account found with this email address...',
    action: 'Create Account',
    field: 'email'
  },
  // ... more error codes
};

// Error formatting functions
export const formatFormError = (error: any, context: 'login' | 'register' | 'password-reset')
```

#### 2. **ErrorDisplay Component** (`src/components/common/ErrorDisplay.tsx`)
```typescript
interface ErrorDisplayProps {
  error: any;
  context?: 'login' | 'register' | 'password-reset';
  onDismiss?: () => void;
  onAction?: (action: string) => void;
  className?: string;
}
```

#### 3. **Enhanced Forms**
- **LoginForm**: Uses `ErrorDisplay` with login-specific actions
- **RegisterForm**: Uses `ErrorDisplay` with registration-specific actions
- **ErrorDemo**: Interactive demo showcasing all error scenarios

## Error Categories

### 🔐 **Login Errors**

| Error Code | HTTP Status | User Message | Action |
|------------|-------------|--------------|---------|
| `USER_NOT_FOUND` | 404 | "No account found with this email address" | Create Account |
| `INVALID_CREDENTIALS` | 401 | "The email or password you entered is incorrect" | Forgot Password |
| `ACCOUNT_LOCKED` | 423 | "Your account has been temporarily locked" | Reset Password |
| `EMAIL_NOT_VERIFIED` | 403 | "Please verify your email address before signing in" | Resend Verification |
| `TENANT_NOT_FOUND` | 404 | "The organization domain you entered was not found" | Contact Admin |

### 📝 **Registration Errors**

| Error Code | HTTP Status | User Message | Action |
|------------|-------------|--------------|---------|
| `EMAIL_ALREADY_EXISTS` | 409 | "An account with this email address already exists" | Sign In |
| `WEAK_PASSWORD` | 400 | "Password must be at least 8 characters..." | Update Password |
| `DOMAIN_NOT_ALLOWED` | 403 | "Registration is not allowed with this email domain" | Use Different Email |
| `PHONE_ALREADY_EXISTS` | 409 | "An account with this phone number already exists" | Use Different Phone |
| `TERMS_NOT_ACCEPTED` | 400 | "You must accept the terms and conditions" | Accept Terms |

### 🔄 **Password Reset Errors**

| Error Code | HTTP Status | User Message | Action |
|------------|-------------|--------------|---------|
| `PASSWORD_RESET_EXPIRED` | 400 | "Your password reset link has expired" | Request New Reset |
| `INVALID_RESET_TOKEN` | 400 | "The password reset link is invalid" | Request New Reset |
| `PASSWORD_TOO_SIMILAR` | 400 | "Your new password must be significantly different" | Choose Different Password |

### 📧 **Email Verification Errors**

| Error Code | HTTP Status | User Message | Action |
|------------|-------------|--------------|---------|
| `VERIFICATION_EXPIRED` | 400 | "Your email verification link has expired" | Resend Verification |
| `INVALID_VERIFICATION_TOKEN` | 400 | "The email verification link is invalid" | Resend Verification |

### 🌐 **System Errors**

| Error Code | HTTP Status | User Message | Action |
|------------|-------------|--------------|---------|
| `NETWORK_ERROR` | - | "Unable to connect to the server" | Retry |
| `RATE_LIMIT_EXCEEDED` | 429 | "Too many attempts. Please wait a few minutes" | Try Again Later |
| `SERVER_ERROR` | 500 | "We're experiencing technical difficulties" | Try Again |
| `SERVICE_UNAVAILABLE` | 503 | "Our service is temporarily unavailable" | Try Again Later |

## Implementation Examples

### Login Form Error Handling

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  try {
    const response = await login(formData.email, formData.password, formData.tenantDomain);
    
    if (response.success) {
      // Success handling
    } else {
      // Create error object for consistent handling
      const errorObj = {
        response: {
          status: 401,
          data: {
            message: response.message || 'Invalid email or password',
            code: 'INVALID_CREDENTIALS'
          }
        }
      };
      setError(errorObj);
    }
  } catch (err: any) {
    setError(err);
  }
};
```

### Error Display in Forms

```typescript
{error && (
  <ErrorDisplay
    error={error}
    context="login"
    onDismiss={() => setError(null)}
    onAction={(action) => {
      switch (action) {
        case 'USER_NOT_FOUND':
          window.location.href = '/register';
          break;
        case 'EMAIL_NOT_VERIFIED':
          window.location.href = '/verify-email';
          break;
        case 'INVALID_CREDENTIALS':
          window.location.href = '/forgot-password';
          break;
        // ... more actions
      }
    }}
  />
)}
```

## Visual Design

### Severity Levels

#### 🔴 **Error (Red)**
- Invalid credentials
- User not found
- Email already exists
- Server errors

#### 🟡 **Warning (Yellow)**
- Rate limiting
- Service unavailable
- Account locked

#### 🔵 **Info (Blue)**
- Email not verified
- Terms not accepted

### Field-Specific Icons

- **Email**: Mail icon
- **Password**: Lock icon
- **Name**: User icon
- **Phone**: Phone icon
- **Company**: Building icon

## Testing

### Error Demo Page

Visit `/error-demo` to see all error scenarios in action:

1. **Interactive Error Selector**: Choose from different error types
2. **Context Switching**: See how errors appear in login vs registration contexts
3. **Action Testing**: Test error actions and navigation
4. **Visual Feedback**: Observe different severity levels and styling

### Manual Testing

```bash
# Test login errors
curl -X POST /api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@example.com","password":"wrong"}' \
  # Expected: USER_NOT_FOUND error

# Test registration errors
curl -X POST /api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"existing@example.com","password":"weak"}' \
  # Expected: EMAIL_ALREADY_EXISTS or WEAK_PASSWORD error
```

## Best Practices

### ✅ **Do's**
- Always provide user-friendly error messages
- Include actionable suggestions
- Clear errors when user starts typing
- Use appropriate severity levels
- Test all error scenarios

### ❌ **Don'ts**
- Don't expose internal error details
- Don't use technical jargon
- Don't leave users without next steps
- Don't ignore network errors
- Don't forget to handle edge cases

## Future Enhancements

### 🚀 **Planned Features**
- **Multi-language Support**: Internationalized error messages
- **Error Analytics**: Track error frequency and user behavior
- **Smart Suggestions**: AI-powered error resolution suggestions
- **Progressive Enhancement**: Graceful degradation for network issues
- **Error Recovery**: Automatic retry mechanisms for transient errors

### 🔧 **Technical Improvements**
- **Error Caching**: Cache common errors to reduce API calls
- **Offline Support**: Handle errors when offline
- **Error Reporting**: Send error reports to monitoring services
- **A/B Testing**: Test different error message variations

## Integration Guide

### Adding New Error Types

1. **Define Error Code** in `AUTH_ERROR_CODES`:
```typescript
'NEW_ERROR_TYPE': {
  code: 'NEW_ERROR_TYPE',
  message: 'Technical error message',
  userFriendlyMessage: 'User-friendly message',
  action: 'Suggested Action',
  field: 'affectedField'
}
```

2. **Update Error Display** if needed:
```typescript
// Add new field icon if applicable
const getFieldIcon = (field?: string) => {
  switch (field) {
    case 'newField':
      return <NewIcon className="w-4 h-4" />;
    // ... existing cases
  }
};
```

3. **Handle in Forms**:
```typescript
onAction={(action) => {
  switch (action) {
    case 'NEW_ERROR_TYPE':
      // Handle the new error
      break;
    // ... existing cases
  }
}}
```

### Customizing Error Messages

```typescript
// Override default messages for specific contexts
const customErrorMessages = {
  'USER_NOT_FOUND': {
    userFriendlyMessage: 'Custom message for this context',
    action: 'Custom Action'
  }
};
```

## Support

For questions or issues with the error handling system:

1. **Check the Error Demo**: Visit `/error-demo` to see examples
2. **Review Error Codes**: See `src/utils/authErrorHandler.ts` for all supported errors
3. **Test Scenarios**: Use the demo page to test different error conditions
4. **Report Issues**: Create an issue with error details and context

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team 