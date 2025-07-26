# Frontend API Integration Guide

## 🌐 API Server Configuration

### Server Details
- **IP Address**: `192.168.1.9`
- **Port**: `3001`
- **Base URL**: `http://192.168.1.9:3001`
- **API Version**: `v1`
- **Full API Base**: `http://192.168.1.9:3001/api/v1`

### Environment Variables
```bash
REACT_APP_API_BASE_URL=http://192.168.1.9:3001/api/v1
REACT_APP_API_HEALTH_URL=http://192.168.1.9:3001/health
REACT_APP_API_DOCS_URL=http://192.168.1.9:3001/docs
```

## 🔧 API Client Configuration

### Updated Files
1. **`src/services/apiClient.ts`** - Base API client with JWT token management
2. **`src/services/apiServices.ts`** - Service layer with all API endpoints
3. **`src/contexts/AuthContext.tsx`** - Authentication context using real API
4. **`src/components/auth/RegisterForm.tsx`** - Registration form using API services

### Base URL Configuration
```typescript
// src/services/apiClient.ts
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.1.9:3001/api/v1';
```

## 🔐 Authentication Endpoints

### User Registration
```typescript
// POST /registration/register
const registerUser = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  role?: string;
  marketingConsent?: boolean;
}) => {
  const response = await apiServices.register(userData);
  return response;
};
```

### User Login
```typescript
// POST /auth/login
const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await apiServices.login(credentials);
  return response;
};
```

### User Logout
```typescript
// POST /auth/logout
const logoutUser = async () => {
  const response = await apiServices.logout();
  return response;
};
```

### Get Current User
```typescript
// GET /auth/me
const getCurrentUser = async () => {
  const response = await apiServices.getCurrentUser();
  return response;
};
```

## 👥 User Management Endpoints

### Get All Users
```typescript
// GET /users
const getUsers = async () => {
  const response = await apiServices.getUsers();
  return response;
};
```

### Get User by ID
```typescript
// GET /users/:id
const getUser = async (userId: string) => {
  const response = await apiServices.getUser(userId);
  return response;
};
```

### Update User
```typescript
// PUT /users/:id
const updateUser = async (userId: string, userData: Partial<User>) => {
  const response = await apiServices.updateUser(userId, userData);
  return response;
};
```

### Delete User
```typescript
// DELETE /users/:id
const deleteUser = async (userId: string) => {
  const response = await apiServices.deleteUser(userId);
  return response;
};
```

## 🏢 Tenant Management Endpoints

### Create Tenant
```typescript
// POST /tenants/create
const createTenant = async (tenantData: any) => {
  const response = await apiServices.createTenant(tenantData);
  return response;
};
```

### Get All Tenants
```typescript
// GET /tenants
const getTenants = async () => {
  const response = await apiServices.getTenants();
  return response;
};
```

### Get Tenant by ID
```typescript
// GET /tenants/:id
const getTenant = async (tenantId: string) => {
  const response = await apiServices.getTenant(tenantId);
  return response;
};
```

### Update Tenant
```typescript
// PUT /tenants/:id
const updateTenant = async (tenantId: string, tenantData: any) => {
  const response = await apiServices.updateTenant(tenantId, tenantData);
  return response;
};
```

### Delete Tenant
```typescript
// DELETE /tenants/:id
const deleteTenant = async (tenantId: string) => {
  const response = await apiServices.deleteTenant(tenantId);
  return response;
};
```

## 📊 Polls Management Endpoints

### Get Polls for Tenant
```typescript
// GET /polls/:tenantId
const getPolls = async (tenantId: string) => {
  const response = await apiServices.getPolls(tenantId);
  return response;
};
```

### Get Poll by ID
```typescript
// GET /polls/:tenantId/:pollId
const getPoll = async (tenantId: string, pollId: string) => {
  const response = await apiServices.getPoll(tenantId, pollId);
  return response;
};
```

### Create Poll
```typescript
// POST /polls/:tenantId
const createPoll = async (tenantId: string, pollData: Partial<Poll>) => {
  const response = await apiServices.createPoll(tenantId, pollData);
  return response;
};
```

### Update Poll
```typescript
// PUT /polls/:tenantId/:pollId
const updatePoll = async (tenantId: string, pollId: string, pollData: Partial<Poll>) => {
  const response = await apiServices.updatePoll(tenantId, pollId, pollData);
  return response;
};
```

### Delete Poll
```typescript
// DELETE /polls/:tenantId/:pollId
const deletePoll = async (tenantId: string, pollId: string) => {
  const response = await apiServices.deletePoll(tenantId, pollId);
  return response;
};
```

### Get Poll Statistics
```typescript
// GET /polls/:tenantId/stats
const getPollStats = async (tenantId: string) => {
  const response = await apiServices.getPollStats(tenantId);
  return response;
};
```

## 📝 Poll Responses & Feedback

### Submit Poll Response
```typescript
// POST /polls/:tenantId/:pollId/response
const submitPollResponse = async (
  tenantId: string, 
  pollId: string, 
  response: Partial<PollResponse>
) => {
  const result = await apiServices.submitPollResponse(tenantId, pollId, response);
  return result;
};
```

### Get Poll Responses
```typescript
// GET /polls/:tenantId/:pollId/responses
const getPollResponses = async (tenantId: string, pollId: string) => {
  const response = await apiServices.getPollResponses(tenantId, pollId);
  return response;
};
```

### Submit Poll Feedback
```typescript
// POST /polls/:tenantId/:pollId/feedback
const submitPollFeedback = async (
  tenantId: string, 
  pollId: string, 
  feedback: Partial<PollFeedback>
) => {
  const result = await apiServices.submitPollFeedback(tenantId, pollId, feedback);
  return result;
};
```

### Get Poll Feedback
```typescript
// GET /polls/:tenantId/:pollId/feedback
const getPollFeedback = async (tenantId: string, pollId: string) => {
  const response = await apiServices.getPollFeedback(tenantId, pollId);
  return response;
};
```

## 🔔 Notifications

### Get Notifications
```typescript
// GET /polls/:tenantId/notifications
const getNotifications = async (
  tenantId: string, 
  options?: { page?: number; limit?: number; unreadOnly?: boolean }
) => {
  const response = await apiServices.getNotifications(tenantId, options);
  return response;
};
```

### Mark Notification as Read
```typescript
// PUT /polls/:tenantId/notifications/:notificationId/read
const markNotificationAsRead = async (tenantId: string, notificationId: string) => {
  const response = await apiServices.markNotificationAsRead(tenantId, notificationId);
  return response;
};
```

## 📈 Analytics & Reporting

### Get Poll Analytics
```typescript
// GET /polls/:tenantId/:pollId/analytics
const getPollAnalytics = async (tenantId: string, pollId: string) => {
  const response = await apiServices.getPollAnalytics(tenantId, pollId);
  return response;
};
```

### Get Tenant Analytics
```typescript
// GET /analytics/:tenantId
const getTenantAnalytics = async (tenantId: string) => {
  const response = await apiServices.getTenantAnalytics(tenantId);
  return response;
};
```

## 🗄️ Database & Health

### Health Check
```typescript
// GET /health
const getHealth = async () => {
  const response = await apiServices.getHealth();
  return response;
};
```

### Database Status
```typescript
// GET /database/status
const getDatabaseStatus = async () => {
  const response = await apiServices.getDatabaseStatus();
  return response;
};
```

## 🧪 Testing API Connection

### Test Script
```typescript
import { testApiConnection, testHealthOnly } from '../utils/apiTest';

// Test all endpoints
const runFullTest = async () => {
  const result = await testApiConnection();
  console.log('Full API Test Result:', result);
};

// Test health only
const runHealthTest = async () => {
  const result = await testHealthOnly();
  console.log('Health Test Result:', result);
};
```

### Manual Testing
```bash
# Test health endpoint
curl http://192.168.1.9:3001/health

# Test registration endpoint
curl -X POST http://192.168.1.9:3001/api/v1/registration/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+1234567890",
    "company": "Test Company",
    "role": "user",
    "marketingConsent": true
  }'
```

## 🔐 JWT Token Management

### Automatic Token Handling
The API client automatically handles JWT tokens:

```typescript
// Token is automatically added to requests
const authenticatedRequest = async () => {
  const response = await apiServices.getUsers(); // Token added automatically
  return response;
};
```

### Manual Token Management
```typescript
// Set token manually
apiClient.setAuthToken('your-jwt-token');

// Get current token
const token = apiClient.getAuthToken();

// Remove token
apiClient.setAuthToken(null);
```

## 🚨 Error Handling

### Response Format
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
  timestamp?: string;
}
```

### Error Handling Example
```typescript
const handleApiCall = async () => {
  try {
    const response = await apiServices.getUsers();
    
    if (response.success) {
      console.log('Success:', response.data);
    } else {
      console.error('API Error:', response.message);
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
};
```

## 🔧 CORS Configuration

The API server accepts requests from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://192.168.1.9:3000`
- `http://192.168.1.9:3001`
- `http://192.168.1.9:8080`
- `http://192.168.1.9:5173`
- `http://192.168.1.9:4173`

## 📋 Quick Start Checklist

1. ✅ Update environment variables
2. ✅ Verify API client configuration
3. ✅ Test health endpoint
4. ✅ Test registration endpoint
5. ✅ Test login endpoint
6. ✅ Verify JWT token handling
7. ✅ Test protected endpoints
8. ✅ Implement error handling

## 🆘 Troubleshooting

### Common Issues

1. **CORS Error**: Check if your frontend URL is in the CORS configuration
2. **401 Unauthorized**: Verify JWT token is being sent correctly
3. **Network Error**: Check if API server is running on correct IP/port
4. **Validation Error**: Check request body format matches API specification

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('debug', 'api:*');

// Check API connection
const checkConnection = async () => {
  try {
    const health = await apiServices.getHealth();
    console.log('API Connection:', health.success ? 'OK' : 'Failed');
  } catch (error) {
    console.error('API Connection Failed:', error);
  }
};
```

## 📞 Support

For API-related issues:
1. Check the API documentation at `http://192.168.1.9:3001/docs`
2. Verify server status at `http://192.168.1.9:3001/health`
3. Check network connectivity to `192.168.1.9:3001`
4. Review server logs for detailed error information 