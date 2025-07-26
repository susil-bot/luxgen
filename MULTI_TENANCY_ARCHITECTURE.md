# Multi-Tenancy Architecture Documentation

## Overview

The LuxGen platform now includes a comprehensive multi-tenancy architecture that provides secure, scalable, and isolated environments for different organizations (tenants). This architecture addresses the core missing components you identified: **Security**, **Global Objects**, **Shared Database**, and **Shared Schema**.

## Architecture Components

### 1. Security Layer (`SecurityService`)

**Location**: `src/services/SecurityService.ts`

The security layer provides comprehensive tenant isolation and security features:

#### Key Features:
- **Tenant Access Control**: Validates that users can only access resources within their tenant
- **Session Management**: Handles secure session creation, validation, and refresh
- **Audit Logging**: Comprehensive logging of all security events
- **Compliance Monitoring**: GDPR, SOX, HIPAA, and PCI compliance reporting
- **Password Policy Enforcement**: Configurable password policies per tenant
- **Rate Limiting**: Prevents abuse and ensures fair resource usage

#### Usage Example:
```typescript
import { securityService } from '../services/SecurityService';

// Validate tenant access
const hasAccess = securityService.validateTenantAccess(
  tenantId, 
  userId, 
  'users', 
  'read'
);

// Create secure session
const session = securityService.createSession(
  tenantId,
  userId,
  ipAddress,
  userAgent
);

// Generate compliance report
const report = securityService.generateComplianceReport(tenantId, 'gdpr');
```

### 2. Global Objects Management (`GlobalObjectsService`)

**Location**: `src/services/GlobalObjectsService.ts`

Manages shared resources and templates across tenants:

#### Key Features:
- **Template Management**: Training, presentation, and workflow templates
- **Shared Resources**: Files, images, documents accessible across tenants
- **Access Control**: Granular permissions for shared resources
- **Version Management**: Template versioning and rollback capabilities
- **Usage Analytics**: Track template usage and performance

#### Usage Example:
```typescript
import { globalObjectsService } from '../services/GlobalObjectsService';

// Get available templates
const templates = globalObjectsService.getTemplates('leadership');

// Clone and customize template
const customTemplate = globalObjectsService.cloneTemplate(
  'template_leadership_101',
  tenantId,
  { customBranding: true }
);

// Create shared resource
const resource = globalObjectsService.createSharedResource({
  name: 'Company Logo',
  type: 'image',
  path: '/assets/logo.png',
  isPublic: false
}, tenantId);
```

### 3. Shared Database Layer (`DatabaseService`)

**Location**: `src/services/DatabaseService.ts`

Provides tenant-aware database operations with proper isolation:

#### Key Features:
- **Tenant Isolation**: Automatic tenant filtering for all queries
- **Connection Pooling**: Efficient database connection management
- **Query Builder**: Tenant-aware query construction
- **Schema Management**: Dynamic schema creation and modification
- **Health Monitoring**: Database health checks and metrics

#### Usage Example:
```typescript
import { databaseService } from '../services/DatabaseService';

// Tenant-aware query execution
const users = await databaseService.find('users', {
  page: 1,
  limit: 10,
  filters: { isActive: true }
}, tenantId);

// Create new record with tenant isolation
const newUser = await databaseService.create('users', {
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe'
}, tenantId);

// Check database health
const health = await databaseService.checkDatabaseHealth(tenantId);
```

### 4. Shared Schema Management (`SchemaService`)

**Location**: `src/services/SchemaService.ts`

Manages dynamic schema creation and migration for tenants:

#### Key Features:
- **Dynamic Schema Creation**: Create tenant-specific schemas
- **Migration Management**: Version-controlled schema changes
- **Schema Validation**: Ensure schema integrity and consistency
- **Rollback Capabilities**: Revert schema changes if needed
- **Schema Comparison**: Compare schemas across versions

#### Usage Example:
```typescript
import { schemaService } from '../services/SchemaService';

// Create tenant schema
const schema = await schemaService.createTenantSchema(tenantId);

// Add new table
await schemaService.addTable(tenantId, {
  name: 'custom_fields',
  columns: [
    { name: 'id', type: 'uuid', nullable: false, isPrimary: true },
    { name: 'field_name', type: 'varchar(255)', nullable: false },
    { name: 'field_value', type: 'text', nullable: true }
  ]
});

// Run migration
const migration = {
  version: '1.1.0',
  name: 'Add custom fields table',
  sql: 'CREATE TABLE custom_fields...'
};
await schemaService.runMigration(tenantId, migration);
```

### 5. Multi-Tenancy Manager (`MultiTenancyManager`)

**Location**: `src/services/MultiTenancyManager.ts`

Orchestrates all multi-tenancy services and provides a unified interface:

#### Key Features:
- **Service Orchestration**: Coordinates all multi-tenancy services
- **Tenant Lifecycle Management**: Create, update, and delete tenants
- **Resource Usage Tracking**: Monitor and enforce tenant limits
- **Health Monitoring**: Comprehensive tenant health checks
- **Analytics**: Tenant usage analytics and reporting

#### Usage Example:
```typescript
import { multiTenancyManager } from '../services/MultiTenancyManager';

// Create new tenant
const tenant = await multiTenancyManager.createTenant({
  name: 'Acme Corporation',
  slug: 'acme',
  plan: { id: 'enterprise', name: 'Enterprise' },
  settings: { /* tenant settings */ }
});

// Track resource usage
await multiTenancyManager.trackResourceUsage(tenantId, 'storage', 1.5);

// Get tenant health
const health = await multiTenancyManager.getTenantHealth(tenantId);

// Get tenant analytics
const analytics = await multiTenancyManager.getTenantAnalytics(tenantId, 'monthly');
```

## Context Integration

### MultiTenancyContext

**Location**: `src/contexts/MultiTenancyContext.tsx`

The React context that provides multi-tenancy functionality to components:

#### Key Features:
- **State Management**: Centralized multi-tenancy state
- **Service Integration**: Easy access to all multi-tenancy services
- **Permission-Based Rendering**: HOCs for permission-based UI
- **Tenant-Aware Hooks**: Specialized hooks for common operations

#### Usage Example:
```typescript
import { useMultiTenancy, useTenant, usePermissions } from '../contexts/MultiTenancyContext';

const MyComponent = () => {
  const { currentTenant, canAccess, executeQuery } = useMultiTenancy();
  const tenant = useTenant();
  const { permissions } = usePermissions();

  // Check permissions
  if (!canAccess('users', 'read')) {
    return <AccessDenied />;
  }

  // Execute tenant-aware query
  const users = await executeQuery('users', 'find', { limit: 10 });

  return (
    <div>
      <h1>Welcome to {tenant?.name}</h1>
      {/* Component content */}
    </div>
  );
};
```

## Database Schema

### Core Tables

The multi-tenancy architecture includes these core tables:

#### 1. `tenants`
- Stores tenant information and settings
- Includes plan details, limits, and metadata

#### 2. `tenant_users`
- Links users to tenants with roles and permissions
- Tracks user status and activity

#### 3. `users` (tenant-aware)
- User profiles with automatic tenant isolation
- Includes authentication and profile data

#### 4. `groups` (tenant-aware)
- Training groups with tenant isolation
- Links to trainers and members

#### 5. `presentations` (tenant-aware)
- Presentation data with tenant isolation
- Includes file paths and metadata

### Schema Features

- **Automatic Tenant Filtering**: All queries automatically include tenant_id filtering
- **Foreign Key Constraints**: Proper relationships between tenant-aware tables
- **Indexes**: Optimized indexes for tenant-based queries
- **Audit Fields**: Created/updated timestamps and user tracking

## Security Features

### 1. Tenant Isolation
- Users can only access data within their tenant
- Automatic tenant filtering on all database queries
- Session validation ensures tenant consistency

### 2. Permission System
- Role-based access control (RBAC)
- Granular permissions (resource:action)
- Permission inheritance and delegation

### 3. Audit Logging
- Comprehensive logging of all security events
- Configurable log retention and archiving
- Real-time security monitoring

### 4. Compliance
- GDPR compliance reporting
- SOX compliance monitoring
- HIPAA and PCI compliance features
- Custom compliance frameworks

## Resource Management

### 1. Usage Tracking
- Storage usage monitoring
- API call tracking
- User count limits
- Custom resource types

### 2. Limits Enforcement
- Plan-based resource limits
- Automatic limit checking
- Graceful degradation when limits exceeded

### 3. Billing Integration
- Usage-based billing support
- Plan upgrades and downgrades
- Payment method management

## Best Practices

### 1. Tenant Creation
```typescript
// Always validate tenant data before creation
const tenant = await multiTenancyManager.createTenant({
  name: 'Valid Company Name',
  slug: 'valid-slug',
  plan: { id: 'professional' },
  settings: {
    security: {
      passwordPolicy: { minLength: 12 },
      mfaRequired: true
    }
  }
});
```

### 2. Data Access
```typescript
// Always use tenant-aware queries
const users = await executeQuery('users', 'find', {
  filters: { isActive: true },
  page: 1,
  limit: 10
});
```

### 3. Security Validation
```typescript
// Always validate access before operations
if (!await validateAccess('users', 'write')) {
  throw new Error('Insufficient permissions');
}
```

### 4. Resource Monitoring
```typescript
// Track resource usage for billing
await trackResourceUsage('storage', fileSize);
await trackResourceUsage('apiCalls', 1);
```

## Migration Guide

### From Single-Tenant to Multi-Tenant

1. **Data Migration**:
   - Add tenant_id to existing tables
   - Create tenant records for existing data
   - Update foreign key relationships

2. **Code Updates**:
   - Replace direct database calls with tenant-aware queries
   - Add permission checks to all operations
   - Update UI components to use multi-tenancy context

3. **Testing**:
   - Test tenant isolation
   - Verify permission enforcement
   - Validate audit logging

## Monitoring and Analytics

### 1. Health Monitoring
- Database connection health
- Service availability
- Resource usage alerts
- Security event monitoring

### 2. Analytics
- Tenant usage patterns
- Feature adoption rates
- Performance metrics
- Security analytics

### 3. Reporting
- Compliance reports
- Usage reports
- Billing reports
- Security reports

## Troubleshooting

### Common Issues

1. **Tenant Access Denied**:
   - Check user permissions
   - Verify tenant membership
   - Review session validity

2. **Resource Limit Exceeded**:
   - Check current usage vs limits
   - Consider plan upgrade
   - Review resource optimization

3. **Database Connection Issues**:
   - Check connection pool health
   - Verify tenant schema exists
   - Review database permissions

### Debug Tools

```typescript
// Get tenant health status
const health = await getTenantHealth();

// View audit logs
const logs = await getAuditLogs({ severity: ['high', 'critical'] });

// Check resource usage
const analytics = await getTenantAnalytics('daily');
```

## Conclusion

This comprehensive multi-tenancy architecture provides:

- **Security**: Robust tenant isolation and access control
- **Scalability**: Efficient resource management and usage tracking
- **Flexibility**: Dynamic schema management and global object sharing
- **Compliance**: Built-in compliance monitoring and reporting
- **Monitoring**: Comprehensive health monitoring and analytics

The architecture is designed to scale from small organizations to enterprise-level deployments while maintaining security, performance, and compliance requirements. 