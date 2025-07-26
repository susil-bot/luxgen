# Real API Authentication Setup

## 🚀 New Branch: `feature/real-api-authentication`

This branch removes all hardcoded authentication flows and implements real API integration for the Trainer Platform.

## ✅ Changes Made

### 1. **Removed Hardcoded Demo Credentials**
- ❌ Removed demo credentials from LoginForm
- ❌ Removed hardcoded user detection in AuthContext
- ✅ Now uses real API endpoints for all authentication

### 2. **Real API Integration**
- ✅ Updated `apiClient.ts` to use `http://192.168.1.9:3001/api/v1`
- ✅ All authentication flows now call real API endpoints
- ✅ Proper JWT token handling
- ✅ Error handling for API failures

### 3. **API Endpoints Used**
```typescript
// Authentication
POST /registration/register
POST /auth/login
POST /auth/logout
GET /auth/me

// Email Verification
POST /registration/resend-verification
GET /registration/status/:registrationId
POST /registration/verify-email

// Password Reset
POST /auth/forgot-password
POST /auth/reset-password

// Health Check
GET /health
```

## 🧪 Testing the Real API

### 1. **API Connection Test**
```javascript
// In browser console
await testApiConnection()
```

### 2. **Registration Flow Test**
```javascript
// In browser console
await testRegistrationFlow()
```

### 3. **Run All Tests**
```javascript
// In browser console
await runAllApiTests()
```

### 4. **Manual Testing**
```bash
# Test health endpoint
curl http://192.168.1.9:3001/health

# Test registration endpoint
curl -X POST http://192.168.1.9:3001/api/v1/registration/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+1234567890",
    "company": "Test Company",
    "role": "user",
    "marketingConsent": true
  }'
```

## 🔧 Environment Setup

### 1. **Create .env file**
```bash
cp env.example .env
```

### 2. **Configure API URLs**
```bash
# .env file
REACT_APP_API_BASE_URL=http://192.168.1.9:3001/api/v1
REACT_APP_API_HEALTH_URL=http://192.168.1.9:3001/health
REACT_APP_API_DOCS_URL=http://192.168.1.9:3001/docs
```

### 3. **Start the Application**
```bash
npm start
```

## 🔐 Authentication Flows

### 1. **Registration Flow**
```
1. User fills registration form
2. API call to /registration/register
3. If token returned → Auto-login → Dashboard
4. If no token → Email verification required
```

### 2. **Email Verification Flow**
```
1. User receives verification email
2. Clicks verification link
3. Returns to app → Checks verification status
4. Success → Redirects to login with message
```

### 3. **Login Flow**
```
1. User enters credentials
2. API call to /auth/login
3. Success → JWT token stored → Dashboard
4. Failure → Error message displayed
```

### 4. **Password Reset Flow**
```
1. User clicks "Forgot password"
2. Enters email → API call to /auth/forgot-password
3. Receives reset email → Clicks link
4. Sets new password → API call to /auth/reset-password
5. Success → Redirects to login
```

## 🚨 Error Handling

### 1. **Network Errors**
- Connection timeout handling
- API server down detection
- User-friendly error messages

### 2. **Validation Errors**
- Form validation feedback
- API validation error display
- Field-specific error highlighting

### 3. **Authentication Errors**
- Invalid credentials
- Account locked
- Email not verified
- Token expired

## 📱 User Experience

### 1. **Loading States**
- Form submission loading
- API call indicators
- Button disabled states

### 2. **Success Messages**
- Registration success
- Email verification success
- Login welcome message
- Password reset success

### 3. **Error Messages**
- Clear error descriptions
- Actionable error messages
- Helpful suggestions

## 🔒 Security Features

### 1. **JWT Token Management**
- Secure token storage
- Automatic token inclusion
- Token expiration handling
- Secure logout

### 2. **Input Validation**
- Client-side validation
- Server-side validation
- XSS protection
- CSRF protection

### 3. **Rate Limiting**
- API rate limiting
- Login attempt limiting
- Brute force protection

## 🧪 Testing Checklist

- [ ] API server is running on `192.168.1.9:3001`
- [ ] Health endpoint responds successfully
- [ ] Registration endpoint works
- [ ] Login endpoint works
- [ ] Email verification works
- [ ] Password reset works
- [ ] JWT tokens are properly handled
- [ ] Error handling works correctly
- [ ] Loading states display properly
- [ ] Success messages show correctly

## 🚀 Deployment

### 1. **Build the Application**
```bash
npm run build
```

### 2. **Environment Variables**
Ensure all environment variables are set correctly for production.

### 3. **API Server**
Make sure the API server is running and accessible.

## 📞 Support

If you encounter issues:

1. **Check API Connection**
   ```javascript
   await testApiConnection()
   ```

2. **Check Browser Console**
   - Look for network errors
   - Check API response format
   - Verify CORS settings

3. **Verify Environment**
   - Check .env file configuration
   - Ensure API server is running
   - Verify network connectivity

4. **Test Individual Endpoints**
   - Use curl commands above
   - Check API documentation at `http://192.168.1.9:3001/docs`

This branch is now ready for production use with real API integration! 