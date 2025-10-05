# 🚀 Trainer Platform - Multi-Tenancy Deployment Guide

## 📋 Overview

This guide provides comprehensive instructions for deploying the Trainer Platform as a multi-tenancy application using Docker Compose with production-ready database configurations.

## 🗄️ Database Recommendations

### Primary Database: **PostgreSQL** (Recommended)

**Why PostgreSQL for Multi-Tenancy?**

✅ **ACID Compliance**: Ensures data integrity across tenants  
✅ **Row-Level Security (RLS)**: Built-in tenant isolation  
✅ **JSONB Support**: Flexible schema for tenant-specific data  
✅ **Performance**: Excellent for complex queries and analytics  
✅ **Scalability**: Handles large datasets efficiently  
✅ **Schema Isolation**: Separate schemas per tenant  
✅ **Backup & Recovery**: Robust backup solutions  

### Secondary Database: **MongoDB** (Optional)

**Use Cases:**
- Document-based data (course materials, user preferences)
- Flexible schema requirements
- Analytics and reporting data
- File metadata storage

### Caching Layer: **Redis**

**Use Cases:**
- Session management
- API response caching
- Real-time features
- Rate limiting

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Nginx Proxy   │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Load Bal.)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │     Redis       │    │    MongoDB      │
│   (Primary DB)  │    │   (Caching)     │    │  (Documents)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- 4GB+ RAM available
- 10GB+ disk space
- Git

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd trainer-platform

# Make deployment script executable
chmod +x deploy.sh
```

### 2. Configure Environment

```bash
# Copy environment template
cp env.example .env

# Edit environment variables
nano .env
```

**Key Configuration Variables:**
```bash
# Database URLs
  environment:
    POSTGRES_DB: trainer_platform
    POSTGRES_USER: trainer_user
    POSTGRES_PASSWORD: trainer_password_2024
  volumes:
    - mongodb_data:/var/lib/mongodbql/data
    - ./database/init:/docker-entrypoint-initdb.d
  ports:
    - "5432:5432"
```

### Performance Tuning

```sql
-- PostgreSQL configuration for production
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
```

### Backup Strategy

```bash
# Automated backups
0 2 * * * /path/to/backup-script.sh

# Manual backup
./deploy.sh backup

# Restore from backup
./deploy.sh restore
```

## 🔒 Security Configuration

### Database Security

```sql
-- Create read-only user for reporting
CREATE USER readonly_user WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE trainer_platform TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- Enable SSL
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_cert_file = '/etc/ssl/certs/server.crt';
ALTER SYSTEM SET ssl_key_file = '/etc/ssl/private/server.key';
```

### Network Security

```yaml
# docker-compose.yml
networks:
  trainer_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
    driver_opts:
      com.docker.network.bridge.name: trainer_bridge
```

## 📈 Monitoring & Health Checks

### Health Check Endpoints

```bash
# Application health
curl http://localhost:3001/health

# Database health
docker-compose exec mongodb pg_isready -U trainer_user

# Redis health
docker-compose exec redis redis-cli ping
```

### Monitoring Tools

```yaml
# Add to docker-compose.yml for monitoring
prometheus:
  image: prom/prometheus
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
```

## 🔄 Scaling Strategies

### Horizontal Scaling

```yaml
# Scale backend services
docker-compose up -d --scale backend=3

# Load balancer configuration
nginx:
  image: nginx:alpine
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf
```

### Database Scaling

```yaml
# PostgreSQL with read replicas
mongodb-replica:
