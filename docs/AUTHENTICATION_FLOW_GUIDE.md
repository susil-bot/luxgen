# Authentication Flow Guide

## 🔐 Complete Authentication Flow Scenarios

This guide covers all authentication scenarios and user flows in the Trainer Platform.

## 📋 Flow Scenarios

### 1. **New User Registration Flow**

#### Scenario: User registers for the first time
```
1. User visits /register
2. Fills out registration form (3 steps)
3. Submits registration
4. API responds with success
5. If token provided → Auto-login → Dashboard
6. If no token → Email verification required → /verify-email
```

#### Implementation:
```typescript
// RegisterForm.tsx - handleSubmit
const response = await apiServices.register(userData);

if (response.success) {
  if (response.data?.token) {
    // Auto-login scenario
    toast('Registration successful! Welcome to the platform.');
    navigate('/dashboard');
  } else {
    // Email verification required
    toast('Registration successful! Please check your email for verification.');
    navigate('/verify-email', { 
      state: { email: formData.email, registrationId: response.data?.registrationId }
    });
  }
}
```

### 2. **Email Verification Flow**

#### Scenario: User needs to verify email after registration
```
1. User on /verify-email page
2. Checks email and clicks verification link
3. Returns to app and clicks "I've verified my email"
4. API confirms verification
5. Redirects to /login with success message
```

#### Implementation:
```typescript
// EmailVerification.tsx - handleCheckVerification
const response = await apiServices.checkEmailVerification(registrationId);

if (response.success && response.data?.isEmailVerified) {
  toast('Email verified successfully! You can now sign in.');
  navigate('/login', { 
    state: { 
      message: 'Email verified successfully! Please sign in with your credentials.',
      email: email 
    }
  });
}
```

### 3. **Login Flow**

#### Scenario: User signs in with verified account
```
1. User visits /login
2. Enters credentials
3. API validates and returns token
4. User redirected to dashboard
5. If new user → Onboarding flow
6. If returning user → Dashboard
```

#### Implementation:
```typescript
// AuthContext.tsx - login
const response = await apiServices.login({ email, password });

if (response.success && response.data) {
  const user = response.data.user;
  const token = response.data.token;
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
  return { success: true };
}
```

### 4. **Forgot Password Flow**

#### Scenario: User forgets password
```
1. User clicks "Forgot password?" on login page
2. Redirected to /forgot-password
3. Enters email address
4. API sends reset email
5. User checks email and clicks reset link
6. Redirected to /reset-password
7. Sets new password
8. Redirected to /login with success message
```

#### Implementation:
```typescript
// ForgotPassword.tsx - handleSubmit
const response = await apiServices.forgotPassword({ email });

if (response.success) {
  setIsSubmitted(true);
  toast('Password reset email sent! Check your inbox.');
}
```

### 5. **Password Reset Flow**

#### Scenario: User resets password via email link
```
1. User clicks reset link in email
2. Redirected to /reset-password?token=xxx
3. Enters new password
4. API validates token and updates password
5. Redirected to /login with success message
```

### 6. **Auto-Login Flow**

#### Scenario: User returns with valid token
```
1. App loads with existing token in localStorage
2. AuthContext validates token
3. If valid → Auto-login → Dashboard
4. If invalid → Clear token → Login page
```

#### Implementation:
```typescript
// AuthContext.tsx - useEffect
useEffect(() => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
}, []);
```

### 7. **Logout Flow**

#### Scenario: User signs out
```
1. User clicks logout
2. API call to invalidate token
3. Clear localStorage
4. Redirect to login page
```

#### Implementation:
```typescript
// AuthContext.tsx - logout
const logout = async () => {
  try {
    await apiServices.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  }
};
```

### 8. **Role-Based Access Flow**

#### Scenario: User accesses protected route
```
1. User tries to access admin/trainer route
2. AuthFlowHandler checks user role
3. If authorized → Allow access
4. If not authorized → Show error → Redirect to dashboard
```

#### Implementation:
```typescript
// AuthFlowHandler.tsx - Role-based access
useEffect(() => {
  if (isAuthenticated && user) {
    const currentPath = location.pathname;
    
    // Admin-only routes
    const adminRoutes = ['/admin', '/user-management', '/tenant-management'];
    const isAdminRoute = adminRoutes.some(route => currentPath.startsWith(route));
    
    if (isAdminRoute && !['admin', 'super_admin'].includes(user.role)) {
      toast('Access denied. Admin privileges required.');
      navigate('/dashboard');
    }
  }
}, [isAuthenticated, user, location.pathname, navigate]);
```

### 9. **Onboarding Flow**

#### Scenario: New user completes registration
```
1. User completes registration and login
2. Check if onboarding completed
3. If not → Redirect to /onboarding
4. User completes onboarding steps
5. Mark onboarding as completed
6. Redirect to dashboard
```

#### Implementation:
```typescript
// AuthFlowHandler.tsx - Onboarding check
if (['/login', '/register', '/verify-email'].includes(currentPath)) {
  const onboardingCompleted = localStorage.getItem('onboardingCompleted');
  if (!onboardingCompleted && user.role === 'user') {
    navigate('/onboarding');
    toast('Welcome! Let\'s set up your profile.');
  } else {
    navigate('/dashboard');
    toast(`Welcome back, ${user.firstName}!`);
  }
}
```

## 🔧 API Endpoints Used

### Authentication Endpoints
```typescript
// Registration
POST /registration/register
POST /registration/resend-verification
GET /registration/status/:registrationId
POST /registration/verify-email

// Login/Logout
POST /auth/login
POST /auth/logout
GET /auth/me

// Password Reset
POST /auth/forgot-password
POST /auth/reset-password
```

### Response Formats
```typescript
// Success Response
{
  success: true,
  data: {
    user: User,
    token: string,
    registrationId?: string
  },
  message: string
}

// Error Response
{
  success: false,
  message: string,
  error?: string
}
```

## 🎯 User Experience Features

### 1. **Success Messages**
- Registration success with next steps
- Email verification success
- Login welcome message
- Password reset success

### 2. **Error Handling**
- Validation errors with specific messages
- Network error handling
- API error responses
- User-friendly error messages

### 3. **Loading States**
- Form submission loading
- API call loading indicators
- Button disabled states
- Spinner animations

### 4. **Navigation Flow**
- Automatic redirects after actions
- Return to original page after login
- Breadcrumb navigation
- Back button functionality

### 5. **Token Management**
- Automatic token inclusion in requests
- Token refresh handling
- Token expiration handling
- Secure token storage

## 🚨 Error Scenarios

### 1. **Registration Errors**
```typescript
// Email already exists
{
  success: false,
  message: "User with this email already exists"
}

// Validation errors
{
  success: false,
  message: "Missing required fields: email, password, firstName, lastName"
}
```

### 2. **Login Errors**
```typescript
// Invalid credentials
{
  success: false,
  message: "Invalid email or password"
}

// Account not verified
{
  success: false,
  message: "Please verify your email before signing in"
}
```

### 3. **Token Errors**
```typescript
// Token expired
{
  success: false,
  message: "Session expired. Please sign in again"
}

// Invalid token
{
  success: false,
  message: "Invalid authentication token"
}
```

## 📱 Mobile Responsiveness

All authentication components are fully responsive:
- Mobile-first design
- Touch-friendly buttons
- Proper keyboard handling
- Screen reader accessibility

## 🔒 Security Features

### 1. **Password Requirements**
- Minimum 8 characters
- Uppercase and lowercase letters
- Numbers required
- Special characters recommended

### 2. **Token Security**
- JWT tokens with expiration
- Secure localStorage usage
- Automatic token cleanup
- HTTPS enforcement

### 3. **Input Validation**
- Client-side validation
- Server-side validation
- XSS protection
- CSRF protection

## 🧪 Testing Scenarios

### 1. **Happy Path Testing**
- Complete registration flow
- Email verification flow
- Login/logout flow
- Password reset flow

### 2. **Error Path Testing**
- Invalid email format
- Weak password
- Non-existent user
- Expired tokens

### 3. **Edge Case Testing**
- Network disconnection
- Server errors
- Browser refresh
- Multiple tabs

## 📋 Implementation Checklist

- [x] Registration form with validation
- [x] Email verification component
- [x] Login form with forgot password
- [x] Password reset flow
- [x] Auto-login handling
- [x] Role-based access control
- [x] Onboarding flow
- [x] Error handling
- [x] Loading states
- [x] Success messages
- [x] Token management
- [x] Mobile responsiveness
- [x] Security features
- [x] Testing scenarios

## 🚀 Quick Start

1. **Set up routes** in your router
2. **Wrap app** with AuthFlowHandler
3. **Configure API endpoints** in apiServices
4. **Test all flows** with the provided scenarios
5. **Customize styling** to match your brand
6. **Add analytics** for user behavior tracking

This comprehensive authentication flow ensures a smooth user experience across all scenarios while maintaining security and providing clear feedback to users. 