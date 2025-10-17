# API Requirements Summary for Backend and Testing Teams

## Overview
This document provides a comprehensive list of all API endpoints required by the LuxGen frontend application. The frontend is built with React, TypeScript, and uses a centralized API service architecture.

## Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.luxgen.com/api`

## Authentication
All protected endpoints require the `Authorization: Bearer <token>` header.

## Response Format
All API responses follow this standardized format:
```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": string,
  "timestamp": string,
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "pages": number,
    "hasNext": boolean,
    "hasPrev": boolean
  }
}
```

## API Categories

### 1. Authentication (8 endpoints)
- User login/logout
- User registration
- Password reset/change
- Email verification
- Token refresh

### 2. User Management (7 endpoints)
- Get current user profile
- Update user profile
- Change password
- User CRUD operations (admin only)

### 3. Tenant Management (5 endpoints)
- Tenant CRUD operations
- Tenant settings and configuration
- Multi-tenancy support

### 4. Job Management (6 endpoints)
- Job posting CRUD
- Job applications
- Candidate management

### 5. Content Management (5 endpoints)
- Generic content CRUD
- Content type filtering
- Content metadata

### 6. Feed Management (7 endpoints)
- Social feed posts
- Like/comment/share functionality
- Post interactions

### 7. Training Management (6 endpoints)
- Training programs
- Enrollment and completion
- Progress tracking

### 8. Assessment Management (6 endpoints)
- Assessment CRUD
- Assessment taking
- Results and scoring

### 9. Analytics (6 endpoints)
- Dashboard metrics
- Performance analytics
- User analytics
- Custom reports

### 10. Notifications (5 endpoints)
- Notification CRUD
- Read/unread status
- Notification management

### 11. Search (1 endpoint)
- Global search across all content types

### 12. File Management (3 endpoints)
- File upload/download
- Resume management

### 13. Health Check (3 endpoints)
- System health monitoring
- Database status
- API connectivity

## Total Endpoints: 68

## Key Features Required

### Multi-Tenancy Support
- All endpoints must support tenant isolation
- Tenant ID should be extracted from JWT token or request headers
- Data filtering by tenant is required

### Pagination
- All list endpoints must support pagination
- Standard pagination parameters: `page`, `limit`
- Response includes pagination metadata

### Error Handling
- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for debugging

### File Upload Support
- Resume file uploads
- Image attachments for posts
- File type validation
- File size limits

### Real-time Features
- WebSocket support for notifications
- Live updates for feed posts
- Real-time collaboration features

## Testing Requirements

### Unit Tests
- Test all API endpoints with valid/invalid data
- Test authentication and authorization
- Test error handling scenarios

### Integration Tests
- Test complete user workflows
- Test multi-tenant data isolation
- Test file upload/download functionality

### Performance Tests
- Load testing for concurrent users
- Database query optimization
- API response time benchmarks

### Security Tests
- JWT token validation
- SQL injection prevention
- XSS protection
- CSRF protection

## Database Requirements

### Core Tables
- `users` - User accounts and profiles
- `tenants` - Multi-tenant organizations
- `content` - Generic content storage
- `jobs` - Job postings and applications
- `notifications` - User notifications
- `analytics` - Performance and usage metrics

### Relationships
- Users belong to tenants
- Content is tenant-scoped
- Jobs are tenant-specific
- Notifications are user-specific

## Environment Variables Required

```env
# Database
DATABASE_URL=mongodb://localhost:27017/luxgen
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# File Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# API
API_BASE_URL=http://localhost:3000/api
CORS_ORIGIN=http://localhost:3000
```

## Priority Implementation Order

### Phase 1 (Critical - Week 1)
1. Authentication endpoints
2. User management
3. Basic content management
4. Health check endpoints

### Phase 2 (High Priority - Week 2)
1. Tenant management
2. Job management
3. Feed management
4. File upload/download

### Phase 3 (Medium Priority - Week 3)
1. Training management
2. Assessment management
3. Analytics endpoints
4. Search functionality

### Phase 4 (Nice to Have - Week 4)
1. Advanced analytics
2. Custom reports
3. Performance optimizations
4. Real-time features

## Notes for Backend Team

1. **Consistency**: All endpoints must follow the same response format
2. **Validation**: Implement proper input validation and sanitization
3. **Logging**: Log all API requests and responses for debugging
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Caching**: Use Redis for caching frequently accessed data
6. **Documentation**: Maintain up-to-date API documentation

## Notes for Testing Team

1. **Test Data**: Create comprehensive test datasets for all scenarios
2. **Edge Cases**: Test with invalid data, missing fields, and boundary conditions
3. **Performance**: Monitor response times and memory usage
4. **Security**: Test for common vulnerabilities and security issues
5. **Compatibility**: Test with different browsers and devices

## Contact Information

- **Frontend Team**: [Your contact details]
- **Backend Team**: [Backend team contact]
- **Testing Team**: [Testing team contact]

---

*This document was generated automatically from the frontend codebase and should be reviewed and updated as the API evolves.*
