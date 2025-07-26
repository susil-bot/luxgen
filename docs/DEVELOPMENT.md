# 🚀 Development Environment Setup

This guide will help you set up and run the Trainer Platform in development mode with a demo tenant and sample data.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Docker & Docker Compose** - For database services
- **Node.js** (v18+) - For running the application
- **npm** (v8+) - For package management

## 🎯 Quick Start (All-in-One)

The easiest way to get started is using the all-in-one development setup script:

```bash
# Make sure you're in the trainer-platform directory
cd trainer-platform

# Run the development setup script
./dev-setup.sh
```

This script will:
1. ✅ Check prerequisites
2. ✅ Create environment configuration
3. ✅ Install dependencies
4. ✅ Start database services (PostgreSQL, Redis, MongoDB)
5. ✅ Seed the database with demo data
6. ✅ Start backend service
7. ✅ Start frontend service
8. ✅ Start monitoring tools

## 🔧 Manual Setup (Individual Services)

If you prefer to run services individually in separate terminals:

### Terminal 1: Database Services
```bash
cd trainer-platform
./dev-start-db.sh
```

### Terminal 2: Backend Service
```bash
cd trainer-platform
./dev-start-backend.sh
```

### Terminal 3: Frontend Service
```bash
cd trainer-platform
./dev-start-frontend.sh
```

## 🏢 Demo Tenant & Data

The development environment includes a pre-configured demo tenant with sample data:

### Demo Tenant
- **Name**: Demo Training Organization
- **Domain**: demo.trainer.com
- **Subdomain**: demo
- **Plan**: Premium (all features enabled)

### Demo Users

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Super Admin** | `superadmin@trainer.com` | `password123` | Full system access |
| **Admin** | `admin@trainer.com` | `password123` | User & poll management |
| **Trainer** | `trainer@trainer.com` | `password123` | Create & manage polls |
| **User** | `user@trainer.com` | `password123` | Respond to polls |

### Sample Data
- **2 Active Polls**: Leadership Training & Sales Performance
- **1 Poll Response**: Sample feedback from user
- **1 Feedback Entry**: User feedback on training
- **Complete Audit Trail**: All actions logged

## 🌐 Service URLs

Once all services are running, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend API** | http://localhost:3001 | REST API |
| **API Health** | http://localhost:3001/health | Health check |
| **API Docs** | http://localhost:3001/api | API documentation |
| **pgAdmin** | http://localhost:5050 | PostgreSQL management |
| **Redis Commander** | http://localhost:8081 | Redis management |

### Database Access
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **MongoDB**: localhost:27017

## 🛠️ Development Commands

### Backend Commands
```bash
cd backend

# Start development server
npm run dev

# Seed database with demo data
npm run dev:seed

# Reset database
npm run db:reset

# Check database status
npm run db:status

# Run tests
npm test
```

### Frontend Commands
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Docker Commands
```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f postgres
docker-compose logs -f redis
docker-compose logs -f mongodb

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

## 🔍 Database Management

### pgAdmin Access
- **URL**: http://localhost:5050
- **Email**: admin@trainer.com
- **Password**: pgadmin_password_2024

### Redis Commander Access
- **URL**: http://localhost:8081
- **No authentication required** (development only)

### Direct Database Access
```bash
# PostgreSQL
docker-compose exec postgres psql -U trainer_user -d trainer_platform

# Redis
docker-compose exec redis redis-cli

# MongoDB
docker-compose exec mongodb mongosh -u trainer_admin -p mongo_password_2024
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001
lsof -i :5432

# Kill the process
kill -9 <PID>
```

#### 2. Database Connection Issues
```bash
# Check if database services are running
docker-compose ps

# Restart database services
docker-compose restart postgres redis mongodb

# Check database logs
docker-compose logs postgres
```

#### 3. Node Modules Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For backend
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..
```

#### 4. Environment Variables
```bash
# Check if .env file exists
ls -la .env

# Create .env file if missing
cp env.example .env
```

### Reset Everything
```bash
# Stop all services
docker-compose down -v

# Clear node modules
rm -rf node_modules backend/node_modules

# Reinstall dependencies
npm install
cd backend && npm install && cd ..

# Start fresh
./dev-setup.sh
```

## 📊 Development Features

### Hot Reloading
- **Frontend**: React development server with hot reload
- **Backend**: Nodemon with automatic restart on file changes

### Debugging
- **Backend**: Console logs with structured formatting
- **Frontend**: React Developer Tools
- **Database**: pgAdmin and Redis Commander for data inspection

### Environment Variables
All development configuration is in the `.env` file:
- Database connections
- JWT secrets
- API endpoints
- Logging levels

## 🔒 Security Notes

⚠️ **Development Only**: The demo environment uses simplified security settings:
- Weak JWT secrets (for development only)
- No SSL/TLS
- Default passwords
- Debug logging enabled

**Never use these settings in production!**

## 📝 Next Steps

1. **Explore the Application**:
   - Login with different user roles
   - Create and manage polls
   - Test the multi-tenant features
   - Explore the AI chatbot

2. **Understand the Architecture**:
   - Read the main README.md
   - Check the API documentation
   - Review the database schema

3. **Start Developing**:
   - Modify the frontend components
   - Add new API endpoints
   - Extend the database schema
   - Add new features

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs: `docker-compose logs -f`
3. Check the health endpoints: http://localhost:3001/health
4. Verify database connectivity
5. Ensure all prerequisites are installed

Happy coding! 🎉 