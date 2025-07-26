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
DATABASE_URL=postgresql://trainer_user:trainer_password_2024@postgres:5432/trainer_platform
REDIS_URL=redis://:redis_password_2024@redis:6379
MONGODB_URL=mongodb://trainer_admin:mongo_password_2024@mongodb:27017/trainer_platform?authSource=admin

# Multi-tenancy strategy
TENANT_ISOLATION_STRATEGY=database_per_tenant

# Security
JWT_SECRET=your_jwt_secret_key_here_2024_change_in_production
```

### 3. Deploy

```bash
# Full deployment
./deploy.sh

# Or step by step
./deploy.sh start
./deploy.sh status
./deploy.sh logs
```

## 📊 Multi-Tenancy Strategies

### 1. Database-Per-Tenant (Recommended)

**Pros:**
- Complete data isolation
- Independent scaling
- Custom schemas per tenant
- Easy backup/restore per tenant

**Cons:**
- Higher resource usage
- More complex management

**Implementation:**
```sql
-- Each tenant gets their own database
CREATE DATABASE tenant_company_a;
CREATE DATABASE tenant_company_b;
```

### 2. Schema-Per-Tenant

**Pros:**
- Shared database resources
- Easier management
- Lower resource usage

**Cons:**
- Less isolation
- Potential for data leakage

**Implementation:**
```sql
-- Each tenant gets their own schema
CREATE SCHEMA tenant_company_a;
CREATE SCHEMA tenant_company_b;
```

### 3. Row-Level Security (RLS)

**Pros:**
- Maximum resource sharing
- Single database
- Built-in PostgreSQL feature

**Cons:**
- Complex setup
- Performance overhead
- Risk of data leakage

**Implementation:**
```sql
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY tenant_isolation ON users
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

## 🔧 Database Configuration

### PostgreSQL Setup

```yaml
# docker-compose.yml
postgres:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: trainer_platform
    POSTGRES_USER: trainer_user
    POSTGRES_PASSWORD: trainer_password_2024
  volumes:
    - postgres_data:/var/lib/postgresql/data
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
docker-compose exec postgres pg_isready -U trainer_user

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
postgres-replica:
  image: postgres:15-alpine
  command: postgres -c hot_standby=on
  depends_on:
    - postgres
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps postgres
   
   # Check logs
   docker-compose logs postgres
   ```

2. **Memory Issues**
   ```bash
   # Increase Docker memory limit
   # Docker Desktop > Settings > Resources > Memory: 4GB+
   ```

3. **Port Conflicts**
   ```bash
   # Check port usage
   lsof -i :3000
   lsof -i :5432
   
   # Change ports in docker-compose.yml
   ```

### Performance Issues

```bash
# Check resource usage
docker stats

# Database performance
docker-compose exec postgres psql -U trainer_user -d trainer_platform -c "
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE schemaname = 'public' 
ORDER BY n_distinct DESC;
"
```

## 📚 Additional Resources

### Documentation
- [PostgreSQL Multi-Tenancy](https://www.postgresql.org/docs/current/ddl-schemas.html)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Nginx Configuration](https://nginx.org/en/docs/)

### Tools
- **pgAdmin**: Database management (http://localhost:5050)
- **Redis Commander**: Redis management (http://localhost:8081)
- **Grafana**: Monitoring dashboards

### Support
- Check logs: `./deploy.sh logs`
- Service status: `./deploy.sh status`
- Backup data: `./deploy.sh backup`

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database backups scheduled
- [ ] Monitoring configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Logging configured
- [ ] Health checks implemented
- [ ] Performance optimized
- [ ] Disaster recovery plan

---

**Need Help?** Check the logs with `./deploy.sh logs` or review the troubleshooting section above. 