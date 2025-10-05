# 🚀 Trainer Platform - Complete Flow Testing Guide

This guide will help you verify that the entire application flow is working perfectly, including user registration, tenant styling, and user details management.

## 📋 Prerequisites

Before running the tests, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** (v8 or higher)
3. **PostgreSQL** running locally
4. **MongoDB** running locally (or MongoDB Atlas connection)
5. **Redis** running locally
6. **Backend service** running on port 3001

## 🛠️ Quick Setup

### 1. Environment Setup

```bash
# Copy environment file
cp backend/env.development backend/.env

# Edit .env file and update:
# - MONGODB_URL with your MongoDB Atlas connection string
# - Replace <db_password> with your actual password
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Start Services

```bash
# Terminal 1: Start database services
./dev-start-db.sh

# Terminal 2: Start backend
./dev-start-backend.sh

# Terminal 3: Start frontend
./dev-start-frontend.sh
```

## 🧪 Running Tests

### Option 1: Automated Setup and Test

```bash
cd backend
npm run test:setup
```

This will:
- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Wait for backend service
- ✅ Test database connections
- ✅ Seed database with demo data
- ✅ Test all API endpoints
- ✅ Test MongoDB collections
- ✅ Test user registration flow
- ✅ Test tenant styling flow
- 📊 Generate a comprehensive test report

### Option 2: Individual Test Scripts

```bash
# Test complete flow
npm run test:flow

# Test setup only
npm run test:setup

# Run all tests
npm run test:all
```

## 📊 Test Coverage

The tests cover the following areas:

### 🔐 Authentication & Registration
- [x] User registration with validation
- [x] Email verification flow
- [x] Password hashing and security
- [x] Multi-step registration process
- [x] Registration status tracking

### 🏢 Tenant Management
- [x] Tenant creation and configuration
- [x] Multi-tenant data isolation
- [x] Tenant-specific settings
- [x] Usage statistics tracking

### 🎨 Styling System
- [x] Dynamic tenant styling configuration
- [x] CSS variable generation
- [x] Real-time styling updates
- [x] Component-specific styling
- [x] Typography and spacing customization

### 👤 User Details
- [x] Extended user profiles
- [x] Skills and certifications
- [x] Work experience and education
- [x] Preferences and settings
- [x] Activity tracking

### 🗄️ Database Integration
- [x] PostgreSQL (primary data)
- [x] MongoDB (document data)
- [x] Redis (caching/sessions)
- [x] Data consistency across databases

## 🔍 Manual Testing

### 1. Health Checks

```bash
# Test backend health
curl http://localhost:3001/health

# Test database status
curl http://localhost:3001/api/database/status

# Test API info
curl http://localhost:3001/api
```

### 2. Tenant Styling

```bash
# Get demo tenant styling
curl http://localhost:3001/api/tenant-schema/demo-tenant-001/styling

# Update tenant styling
curl -X PUT http://localhost:3001/api/tenant-schema/demo-tenant-001/styling \
  -H "Content-Type: application/json" \
  -d '{
    "branding": {
      "primaryColor": "#FF1493",
      "secondaryColor": "#4B0082"
    }
  }'

# Get generated CSS
curl http://localhost:3001/api/tenant-schema/demo-tenant-001/css
```

### 3. User Registration

```bash
# Register a new user
curl -X POST http://localhost:3001/api/user-registration/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "confirmPassword": "testpassword123",
    "firstName": "Test",
    "lastName": "User",
    "tenantId": "demo-tenant-001",
    "termsAccepted": true,
    "privacyPolicyAccepted": true
  }'
```

### 4. User Details

```bash
# Update user details (requires authentication)
curl -X PUT http://localhost:3001/api/user-details/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "bio": "A passionate developer",
    "skills": [
      {
        "name": "JavaScript",
        "level": "expert",
        "yearsOfExperience": 5
      }
    ]
  }'
```

## 🎯 Expected Results

### ✅ Successful Test Run

When all tests pass, you should see:

```
🎉 ALL TESTS PASSED!
The application is ready for development.

📋 NEXT STEPS:
1. Start the frontend: npm start (in the frontend directory)
2. Access the application at: http://localhost:3000
3. Use demo credentials to login
4. Test the tenant styling features
```

### 📊 Test Report

A detailed test report will be saved to `test-report.json`:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "results": {
    "prerequisites": true,
    "dependencies": true,
    "backend": true,
    "database": true,
    "seeding": true,
    "apiEndpoints": true,
    "mongoCollections": true,
    "userRegistration": true,
    "stylingFlow": true
  },
  "summary": {
    "total": 9,
    "passed": 9,
    "failed": 0
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check if databases are running
   docker ps
   
   # Check database status
   npm run db:status
   ```

2. **Backend Not Responding**
   ```bash
   # Check if backend is running
   ps aux | grep node
   
   # Check backend logs
   tail -f logs/backend.log
   ```

3. **MongoDB Connection Issues**
   ```bash
   # Verify MongoDB Atlas connection
   # Check .env file for correct MONGODB_URL
   # Ensure IP whitelist includes your IP
   ```

4. **Port Conflicts**
   ```bash
   # Check if ports are in use
   lsof -i :3001
   lsof -i :3000
   ```

### Reset Everything

```bash
# Stop all services
docker-compose down

# Clear databases
docker volume prune

# Reset and restart
./dev-setup.sh
```

## 🔧 Development Workflow

### 1. Start Development Environment

```bash
# All-in-one setup
./dev-setup.sh

# Or step by step
./dev-start-db.sh
./dev-start-backend.sh
./dev-start-frontend.sh
```

### 2. Run Tests

```bash
# Quick test
npm run test:flow

# Full setup and test
npm run test:setup
```

### 3. Monitor Logs

```bash
# Backend logs
tail -f logs/backend.log

# Database logs
docker-compose logs -f mongodb
docker-compose logs -f mongodb
```

### 4. Access Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **pgAdmin**: http://localhost:5050
- **Redis Commander**: http://localhost:8081

## 📝 Demo Credentials

Use these credentials to test the application:

```
Super Admin: superadmin@trainer.com / password123
Admin: admin@trainer.com / password123
Trainer: trainer@trainer.com / password123
User: user@trainer.com / password123
```

## 🎨 Styling Features

The application supports dynamic tenant styling:

- **Colors**: Primary, secondary, accent, background, text colors
- **Typography**: Font family, sizes, weights
- **Spacing**: Custom spacing values
- **Border Radius**: Custom border radius values
- **Shadows**: Custom shadow configurations
- **Components**: Button, input, card styling

Changes to tenant styling apply globally to all users of that tenant.

## 📈 Performance Monitoring

The application includes:

- **Health checks** for all services
- **Database monitoring** with connection pooling
- **Request logging** with detailed metrics
- **Error tracking** with stack traces
- **Performance metrics** for API endpoints

## 🔒 Security Features

- **JWT authentication** with token refresh
- **Password hashing** with bcrypt
- **Rate limiting** on API endpoints
- **CORS protection** with configurable origins
- **Input validation** with Joi schemas
- **SQL injection protection** with parameterized queries

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs in the `logs/` directory
3. Run the test scripts to identify specific failures
4. Check the test report for detailed error information

---

**🎉 Congratulations!** Your Trainer Platform is now fully configured and tested. The complete flow is working perfectly with robust user registration, dynamic tenant styling, and comprehensive user details management. 