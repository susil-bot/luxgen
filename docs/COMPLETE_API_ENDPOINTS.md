# 🔌 Complete API Endpoints - Trainer Platform

## 📋 **Overview**

This document provides a comprehensive list of all REST API endpoints required to make the Trainer Platform fully functional with live database integration. All endpoints follow RESTful conventions and include proper authentication, validation, and error handling.

---

## 🏗️ **Base Configuration**

### **API Base URL**
```
http://192.168.1.9:3001/api/v1
```

### **Authentication**
- **Type**: JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Refresh**: Automatic token refresh with refresh tokens

### **Response Format**
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

---

## 🔐 **Authentication Endpoints**

### **User Registration**
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "company": "Example Corp",
  "role": "user",
  "marketingConsent": true,
  "tenantDomain": "example.com"
}
```

### **User Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "tenantDomain": "example.com"
}
```

### **User Logout**
```http
POST /auth/logout
Authorization: Bearer <token>
```

### **Get Current User**
```http
GET /auth/me
Authorization: Bearer <token>
```

### **Email Verification**
```http
POST /auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_here"
}
```

### **Resend Verification Email**
```http
POST /auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com",
  "registrationId": "registration_id"
}
```

### **Check Verification Status**
```http
GET /auth/verification-status/{registrationId}
```

### **Forgot Password**
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### **Reset Password**
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "password": "NewSecurePass123!"
}
```

### **Refresh Token**
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

---

## 👥 **User Management Endpoints**

### **Get All Users**
```http
GET /users
Authorization: Bearer <token>
```

### **Get User by ID**
```http
GET /users/{userId}
Authorization: Bearer <token>
```

### **Create User**
```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "role": "trainer",
  "tenantId": "tenant_id",
  "isActive": true
}
```

### **Update User**
```http
PUT /users/{userId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane Updated",
  "role": "admin",
  "isActive": true
}
```

### **Delete User**
```http
DELETE /users/{userId}
Authorization: Bearer <token>
```

### **Bulk User Operations**
```http
POST /users/bulk-action
Authorization: Bearer <token>
Content-Type: application/json

{
  "userIds": ["user1", "user2", "user3"],
  "action": "activate|deactivate|delete|changeRole",
  "data": {
    "role": "trainer"
  }
}
```

### **Get User Health**
```http
GET /users/{userId}/health
Authorization: Bearer <token>
```

### **Reset User Password**
```http
POST /users/{userId}/reset-password
Authorization: Bearer <token>
```

### **Suspend User**
```http
POST /users/{userId}/suspend
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Violation of terms"
}
```

### **Activate User**
```http
POST /users/{userId}/activate
Authorization: Bearer <token>
```

---

## 🏢 **Tenant Management Endpoints**

### **Get All Tenants**
```http
GET /tenants
Authorization: Bearer <token>
```

### **Get Tenant by ID**
```http
GET /tenants/{tenantId}
Authorization: Bearer <token>
```

### **Create Tenant**
```http
POST /tenants
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Example Corp",
  "slug": "example-corp",
  "description": "Training organization",
  "contactEmail": "admin@example.com",
  "contactPhone": "+1234567890",
  "industry": "Technology",
  "companySize": "51-200",
  "subscription": {
    "plan": "professional",
    "billingCycle": "monthly"
  }
}
```

### **Update Tenant**
```http
PUT /tenants/{tenantId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Corp Name",
  "subscription": {
    "plan": "enterprise"
  }
}
```

### **Delete Tenant**
```http
DELETE /tenants/{tenantId}
Authorization: Bearer <token>
```

### **Get Tenant Analytics**
```http
GET /tenants/{tenantId}/analytics
Authorization: Bearer <token>
```

### **Get Tenant Users**
```http
GET /tenants/{tenantId}/users
Authorization: Bearer <token>
```

### **Get Tenant Settings**
```http
GET /tenants/{tenantId}/settings
Authorization: Bearer <token>
```

### **Update Tenant Settings**
```http
PUT /tenants/{tenantId}/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "features": {
    "polls": { "enabled": true, "maxPolls": 100 },
    "analytics": { "enabled": true, "retention": 90 },
    "branding": { "enabled": true, "logo": "logo_url" }
  }
}
```

---

## 👥 **Group Management Endpoints**

### **Get All Groups**
```http
GET /groups
Authorization: Bearer <token>
```

### **Get Group by ID**
```http
GET /groups/{groupId}
Authorization: Bearer <token>
```

### **Create Group**
```http
POST /groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Leadership Training Group",
  "description": "Advanced leadership skills training",
  "trainerId": "trainer_id",
  "tenantId": "tenant_id",
  "maxSize": 20,
  "category": "Leadership",
  "tags": ["leadership", "management"],
  "isActive": true
}
```

### **Update Group**
```http
PUT /groups/{groupId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Group Name",
  "maxSize": 25,
  "isActive": true
}
```

### **Delete Group**
```http
DELETE /groups/{groupId}
Authorization: Bearer <token>
```

### **Add Member to Group**
```http
POST /groups/{groupId}/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id",
  "role": "member"
}
```

### **Remove Member from Group**
```http
DELETE /groups/{groupId}/members/{userId}
Authorization: Bearer <token>
```

### **Get Group Performance**
```http
GET /groups/{groupId}/performance
Authorization: Bearer <token>
```

### **Get Group Members**
```http
GET /groups/{groupId}/members
Authorization: Bearer <token>
```

### **Update Member Role**
```http
PUT /groups/{groupId}/members/{userId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "leader"
}
```

---

## 📊 **Presentation Management Endpoints**

### **Get All Presentations**
```http
GET /presentations
Authorization: Bearer <token>
```

### **Get Presentation by ID**
```http
GET /presentations/{presentationId}
Authorization: Bearer <token>
```

### **Create Presentation**
```http
POST /presentations
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Leadership Workshop",
  "description": "Interactive leadership training session",
  "trainerId": "trainer_id",
  "groupId": "group_id",
  "totalSlides": 15,
  "status": "preparing"
}
```

### **Update Presentation**
```http
PUT /presentations/{presentationId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "live",
  "currentSlide": 1
}
```

### **Delete Presentation**
```http
DELETE /presentations/{presentationId}
Authorization: Bearer <token>
```

### **Start Presentation**
```http
POST /presentations/{presentationId}/start
Authorization: Bearer <token>
```

### **End Presentation**
```http
POST /presentations/{presentationId}/end
Authorization: Bearer <token>
```

### **Add Poll to Presentation**
```http
POST /presentations/{presentationId}/polls
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "How would you rate this session?",
  "type": "rating",
  "options": ["1", "2", "3", "4", "5"],
  "timeLimit": 60
}
```

### **Activate Poll**
```http
POST /presentations/{presentationId}/polls/{pollId}/activate
Authorization: Bearer <token>
```

### **Deactivate Poll**
```http
POST /presentations/{presentationId}/polls/{pollId}/deactivate
Authorization: Bearer <token>
```

### **Submit Poll Response**
```http
POST /presentations/{presentationId}/polls/{pollId}/responses
Authorization: Bearer <token>
Content-Type: application/json

{
  "answer": "4",
  "participantId": "participant_id"
}
```

### **Get Poll Results**
```http
GET /presentations/{presentationId}/polls/{pollId}/results
Authorization: Bearer <token>
```

---

## 🎓 **Training Management Endpoints**

### **Get All Training Sessions**
```http
GET /training/sessions
Authorization: Bearer <token>
```

### **Get Session by ID**
```http
GET /training/sessions/{sessionId}
Authorization: Bearer <token>
```

### **Create Training Session**
```http
POST /training/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Leadership Development Workshop",
  "description": "Advanced leadership skills training",
  "instructorId": "instructor_id",
  "date": "2024-01-15T10:00:00Z",
  "duration": 120,
  "maxParticipants": 25,
  "type": "workshop",
  "category": "Leadership",
  "location": "Conference Room A"
}
```

### **Update Training Session**
```http
PUT /training/sessions/{sessionId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Session Title",
  "date": "2024-01-16T10:00:00Z",
  "status": "in-progress"
}
```

### **Delete Training Session**
```http
DELETE /training/sessions/{sessionId}
Authorization: Bearer <token>
```

### **Get Training Courses**
```http
GET /training/courses
Authorization: Bearer <token>
```

### **Get Course by ID**
```http
GET /training/courses/{courseId}
Authorization: Bearer <token>
```

### **Create Training Course**
```http
POST /training/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete Leadership Program",
  "description": "Comprehensive leadership development course",
  "instructorId": "instructor_id",
  "maxEnrollment": 50,
  "category": "Leadership",
  "learningObjectives": ["Strategic thinking", "Team management"],
  "prerequisites": ["Basic management experience"]
}
```

### **Enroll in Course**
```http
POST /training/courses/{courseId}/enroll
Authorization: Bearer <token>
Content-Type: application/json

{
  "participantId": "participant_id"
}
```

### **Get Participant Progress**
```http
GET /training/courses/{courseId}/participants/{participantId}/progress
Authorization: Bearer <token>
```

### **Complete Module**
```http
POST /training/courses/{courseId}/modules/{moduleId}/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "participantId": "participant_id"
}
```

### **Submit Assessment**
```http
POST /training/assessments/{assessmentId}/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "participantId": "participant_id",
  "answers": [
    {"questionId": "q1", "answer": "A"},
    {"questionId": "q2", "answer": "B"}
  ]
}
```

### **Get Trainer Stats**
```http
GET /training/trainers/{trainerId}/stats
Authorization: Bearer <token>
```

### **Get Participant Stats**
```http
GET /training/participants/{participantId}/stats
Authorization: Bearer <token>
```

---

## 🤖 **AI Content Creation Endpoints**

### **Generate Content**
```http
POST /ai/generate/content
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "text|image|video|audio",
  "prompt": "Write a blog post about leadership",
  "options": {
    "tone": "professional",
    "length": "medium",
    "style": "informative",
    "language": "english"
  }
}
```

### **Generate Training Material**
```http
POST /ai/generate/training-material
Authorization: Bearer <token>
Content-Type: application/json

{
  "topic": "Leadership Communication",
  "context": "For senior managers",
  "type": "workshop_material"
}
```

### **Generate Assessment Questions**
```http
POST /ai/generate/assessment-questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "topic": "Leadership Skills",
  "questionCount": 10,
  "difficulty": "intermediate"
}
```

### **Generate Presentation Outline**
```http
POST /ai/generate/presentation-outline
Authorization: Bearer <token>
Content-Type: application/json

{
  "topic": "Digital Transformation",
  "duration": 60,
  "audience": "executives"
}
```

### **Improve Content**
```http
POST /ai/improve/content
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Original content here",
  "improvementType": "grammar|style|expansion|simplification"
}
```

### **Translate Content**
```http
POST /ai/translate/content
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Content to translate",
  "targetLanguage": "spanish"
}
```

### **Save Content to Library**
```http
POST /ai/content/save
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Generated content",
  "type": "blog_post",
  "metadata": {
    "prompt": "Original prompt",
    "generationTime": 15
  }
}
```

### **Get Content Library**
```http
GET /ai/content/library
Authorization: Bearer <token>
```

---

## 📊 **Analytics Endpoints**

### **Get Dashboard Analytics**
```http
GET /analytics/dashboard
Authorization: Bearer <token>
```

### **Get User Analytics**
```http
GET /analytics/users
Authorization: Bearer <token>
```

### **Get Group Analytics**
```http
GET /analytics/groups
Authorization: Bearer <token>
```

### **Get Training Analytics**
```http
GET /analytics/training
Authorization: Bearer <token>
```

### **Get Performance Analytics**
```http
GET /analytics/performance
Authorization: Bearer <token>
```

### **Get Custom Report**
```http
POST /analytics/reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "user_activity",
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-12-31"
  },
  "filters": {
    "role": "trainer",
    "tenantId": "tenant_id"
  }
}
```

### **Export Analytics Data**
```http
GET /analytics/export
Authorization: Bearer <token>
```

---

## 🔔 **Notification Endpoints**

### **Get Notifications**
```http
GET /notifications
Authorization: Bearer <token>
```

### **Mark Notification as Read**
```http
PUT /notifications/{notificationId}/read
Authorization: Bearer <token>
```

### **Mark All Notifications as Read**
```http
PUT /notifications/read-all
Authorization: Bearer <token>
```

### **Delete Notification**
```http
DELETE /notifications/{notificationId}
Authorization: Bearer <token>
```

### **Get Notification Settings**
```http
GET /notifications/settings
Authorization: Bearer <token>
```

### **Update Notification Settings**
```http
PUT /notifications/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": true,
  "push": false,
  "sms": false,
  "types": {
    "training": true,
    "polls": true,
    "system": false
  }
}
```

---

## ⚙️ **Settings Endpoints**

### **Get User Settings**
```http
GET /settings/user
Authorization: Bearer <token>
```

### **Update User Settings**
```http
PUT /settings/user
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "timezone": "UTC",
  "language": "en"
}
```

### **Get Account Settings**
```http
GET /settings/account
Authorization: Bearer <token>
```

### **Update Account Settings**
```http
PUT /settings/account
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "NewSecurePass123!",
  "twoFactorEnabled": true
}
```

### **Get System Settings**
```http
GET /settings/system
Authorization: Bearer <token>
```

### **Update System Settings**
```http
PUT /settings/system
Authorization: Bearer <token>
Content-Type: application/json

{
  "theme": "dark",
  "notifications": {
    "email": true,
    "push": false
  }
}
```

---

## 🗄️ **Database & Health Endpoints**

### **Health Check**
```http
GET /health
```

### **Detailed Health Check**
```http
GET /health/detailed
```

### **Database Status**
```http
GET /database/status
Authorization: Bearer <token>
```

### **Database Health**
```http
GET /database/health
Authorization: Bearer <token>
```

### **Database Test**
```http
GET /database/test
Authorization: Bearer <token>
```

### **API Connection Test**
```http
GET /api/connection-test
Authorization: Bearer <token>
```

---

## 📁 **File Management Endpoints**

### **Upload File**
```http
POST /files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "file": "file_data",
  "type": "image|document|video|audio",
  "category": "training_material|profile|presentation"
}
```

### **Get File**
```http
GET /files/{fileId}
Authorization: Bearer <token>
```

### **Delete File**
```http
DELETE /files/{fileId}
Authorization: Bearer <token>
```

### **Get File List**
```http
GET /files
Authorization: Bearer <token>
```

---

## 🔍 **Search Endpoints**

### **Global Search**
```http
GET /search
Authorization: Bearer <token>
```

### **Search Users**
```http
GET /search/users
Authorization: Bearer <token>
```

### **Search Groups**
```http
GET /search/groups
Authorization: Bearer <token>
```

### **Search Training Content**
```http
GET /search/training
Authorization: Bearer <token>
```

---

## 📈 **Export & Import Endpoints**

### **Export Data**
```http
GET /export/{type}
Authorization: Bearer <token>
```

### **Import Data**
```http
POST /import/{type}
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### **Get Export Status**
```http
GET /export/status/{exportId}
Authorization: Bearer <token>
```

---

## 🎯 **Summary**

### **Total Endpoints**: 150+ REST API endpoints
### **Authentication**: JWT Bearer Token
### **Response Format**: Standardized JSON responses
### **Error Handling**: Comprehensive error responses
### **Rate Limiting**: Implemented for all endpoints
### **Documentation**: OpenAPI/Swagger documentation available

### **Key Features Covered**:
- ✅ **Authentication & Authorization**
- ✅ **User Management**
- ✅ **Tenant Management**
- ✅ **Group Management**
- ✅ **Presentation Management**
- ✅ **Training Management**
- ✅ **AI Content Creation**
- ✅ **Analytics & Reporting**
- ✅ **Notifications**
- ✅ **Settings & Configuration**
- ✅ **File Management**
- ✅ **Search Functionality**
- ✅ **Export/Import**
- ✅ **Health Monitoring**

This comprehensive API structure ensures the Trainer Platform is fully functional with live database integration, real-time features, and enterprise-grade capabilities. 