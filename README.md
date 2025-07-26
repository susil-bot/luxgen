# Trainer Platform - Robust Multi-Tenant Training Solution

A comprehensive, enterprise-grade training platform built with modern technologies and robust architecture for scalability, security, and performance.

## 🏗️ Architecture Overview

### Multi-Database Architecture
- **PostgreSQL**: Primary relational database for structured data
- **MongoDB**: Document database for flexible data storage
- **Redis**: Caching and session management
- **Connection Pooling**: Optimized database connections with health monitoring

### Backend Architecture
- **Node.js/Express**: Robust API server with comprehensive middleware
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Role-Based Access Control**: Granular permissions system
- **Multi-Tenancy**: Isolated tenant data and configurations
- **Validation**: Comprehensive input validation with Joi
- **Logging**: Structured logging with Winston and multiple transports
- **Monitoring**: Real-time metrics, health checks, and alerting
- **Error Handling**: Graceful error handling with custom error classes

### Frontend Architecture
- **React 19**: Modern React with TypeScript
- **Error Boundaries**: Comprehensive error handling and recovery
- **API Client**: Robust HTTP client with retry logic and caching
- **State Management**: Context-based state management
- **Performance**: Optimized rendering and lazy loading
- **Security**: XSS protection and secure data handling

## 🚀 Features

### Core Features
- **Multi-Tenant Support**: Isolated tenant environments
- **User Management**: Role-based user management
- **Polling System**: Real-time polling and voting
- **Presentation Management**: Interactive presentations
- **Analytics Dashboard**: Comprehensive reporting
- **AI Integration**: AI-powered content generation
- **Real-time Updates**: WebSocket-based real-time features

### Security Features
- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based and resource-based access control
- **Input Validation**: Comprehensive validation and sanitization
- **Rate Limiting**: Protection against abuse
- **CORS**: Secure cross-origin resource sharing
- **Helmet**: Security headers and protection
- **Audit Logging**: Complete audit trail

### Performance Features
- **Caching**: Redis-based caching strategy
- **Database Optimization**: Connection pooling and query optimization
- **Compression**: Response compression
- **CDN Ready**: Static asset optimization
- **Monitoring**: Real-time performance monitoring
- **Health Checks**: Comprehensive health monitoring

## 📋 Prerequisites

- **Node.js**: 18.x or higher
- **Docker**: 20.x or higher
- **Docker Compose**: 2.x or higher
- **PostgreSQL**: 15.x (via Docker)
- **MongoDB**: 7.x (via Docker)
- **Redis**: 7.x (via Docker)

## 📚 Documentation

For comprehensive documentation, guides, and implementation details, please visit the **[docs](./docs/)** directory:

- **[📖 Documentation Index](./docs/README.md)** - Complete documentation overview
- **[🚀 Development Guide](./docs/DEVELOPMENT_GUIDE.md)** - Quick start for developers
- **[🏗️ Architecture](./docs/DATABASE_ARCHITECTURE.md)** - System architecture and design
- **[🧪 Testing Guide](./docs/TESTING_GUIDE.md)** - Testing strategies and implementation
- **[🔧 API Integration](./docs/FRONTEND_API_GUIDE.md)** - Frontend API client setup

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd trainer-platform
```

### 2. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit environment variables
nano .env
```

### 3. Docker Setup
```bash
# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 4. Database Initialization
```bash
# The database will be automatically initialized on first startup
# Check logs to verify initialization
docker-compose logs backend
```

### 5. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm start
```

### 6. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

### Environment Variables

#### Database Configuration
```env
# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=trainer_platform
POSTGRES_USER=trainer_user
POSTGRES_PASSWORD=trainer_password_2024

# MongoDB
MONGODB_URL=mongodb://trainer_admin:mongo_password_2024@localhost:27017/trainer_platform?authSource=admin

# Redis
REDIS_URL=redis://:redis_password_2024@localhost:6379
```

#### Security Configuration
```env
# JWT
JWT_SECRET=your_jwt_secret_key_here_2024
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

#### Application Configuration
```env
# Server
NODE_ENV=development
PORT=3001
LOG_LEVEL=info

# Features
ENABLE_AI_FEATURES=true
ENABLE_REAL_TIME=true
ENABLE_ANALYTICS=true
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Start all services
docker-compose up -d

# Start frontend (in one terminal)
npm start

# Start backend (in another terminal)
cd backend && npm run dev
```

### Production Mode
```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up -d

# Or use the deployment script
./deploy.sh
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- **Basic Health**: `GET /health`
- **Detailed Health**: `GET /health/detailed`
- **Database Status**: `GET /api/database/status`
- **Metrics**: `GET /api/metrics`

### Monitoring Dashboard
Access the monitoring dashboard at:
- **pgAdmin**: http://localhost:5050 (PostgreSQL management)
- **Redis Commander**: http://localhost:8081 (Redis management)

### Logs
```bash
# View application logs
docker-compose logs -f backend

# View database logs
docker-compose logs -f postgres

# View all logs
docker-compose logs -f
```

## 🔒 Security Features

### Authentication Flow
1. **Login**: User credentials validated against database
2. **Token Generation**: JWT access and refresh tokens issued
3. **Token Validation**: Middleware validates tokens on protected routes
4. **Token Refresh**: Automatic token refresh using refresh tokens
5. **Logout**: Tokens blacklisted in Redis

### Authorization Levels
- **Super Admin**: Full system access
- **Admin**: Tenant-level administration
- **Trainer**: Content creation and management
- **User**: Basic platform access

### Data Protection
- **Encryption**: Passwords hashed with bcrypt
- **Validation**: Input sanitization and validation
- **Rate Limiting**: Protection against brute force attacks
- **Audit Logging**: Complete audit trail for all actions

## 🗄️ Database Schema

### Core Tables
- **users**: User accounts and profiles
- **tenants**: Multi-tenant organizations
- **polls**: Polling and voting system
- **poll_responses**: User poll responses
- **sessions**: User sessions and tokens
- **audit_log**: Complete audit trail

### Indexes and Optimization
- **Primary Keys**: Auto-incrementing IDs
- **Foreign Keys**: Referential integrity
- **Indexes**: Optimized for common queries
- **Partitioning**: Large table partitioning strategy

## 🔧 API Documentation

### Authentication Endpoints
```http
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### User Management
```http
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id
```

### Poll Management
```http
GET /api/polls
POST /api/polls
PUT /api/polls/:id
DELETE /api/polls/:id
POST /api/polls/:id/responses
```

### Tenant Management
```http
GET /api/tenants
POST /api/tenants
PUT /api/tenants/:id
DELETE /api/tenants/:id
```

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
npm test

# E2E tests
npm run test:e2e
```

### Test Coverage
```bash
# Generate coverage report
npm run test:coverage
```

## 📈 Performance Optimization

### Database Optimization
- **Connection Pooling**: Optimized connection management
- **Query Optimization**: Indexed queries and efficient joins
- **Caching**: Redis-based query result caching
- **Monitoring**: Slow query detection and alerting

### Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Caching**: API response caching
- **Compression**: Gzip compression for static assets
- **CDN**: Content delivery network ready

### Backend Optimization
- **Compression**: Response compression middleware
- **Rate Limiting**: API rate limiting
- **Caching**: Redis-based caching strategy
- **Monitoring**: Performance metrics and alerting

## 🚀 Deployment

### Docker Deployment
```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d

# With custom configuration
docker-compose -f docker-compose.prod.yml -f docker-compose.override.yml up -d
```

### Manual Deployment
```bash
# Build frontend
npm run build

# Start backend
cd backend && npm start

# Configure reverse proxy (nginx)
# Set up SSL certificates
# Configure environment variables
```

### Environment-Specific Configurations
- **Development**: Hot reloading, debug logging
- **Staging**: Production-like environment
- **Production**: Optimized for performance and security

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database status
docker-compose ps

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

#### Authentication Issues
```bash
# Check JWT configuration
echo $JWT_SECRET

# Verify database users
docker-compose exec postgres psql -U trainer_user -d trainer_platform -c "SELECT * FROM users;"
```

#### Performance Issues
```bash
# Check system resources
docker stats

# View application metrics
curl http://localhost:3001/api/metrics

# Check slow queries
docker-compose logs backend | grep "slow query"
```

### Log Analysis
```bash
# View error logs
docker-compose logs backend | grep ERROR

# View access logs
docker-compose logs backend | grep "HTTP Request"

# View performance logs
docker-compose logs backend | grep "Slow"
```

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Code Standards
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Testing**: Unit and integration tests

### Commit Guidelines
```
feat: add new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- **API Documentation**: `/api/docs`
- **Architecture Guide**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)

### Contact
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: support@trainer.com
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)

## 🔄 Changelog

### Version 1.0.0
- **Initial Release**: Complete multi-tenant training platform
- **Robust Architecture**: Enterprise-grade security and performance
- **Comprehensive Monitoring**: Real-time metrics and health checks
- **Scalable Design**: Ready for production deployment

---

**Built with ❤️ for modern training platforms**
