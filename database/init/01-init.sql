-- PostgreSQL initialization script for Trainer Platform
-- Multi-tenancy setup with proper isolation

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schemas for multi-tenancy
CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA IF NOT EXISTS tenant_management;

-- Enable Row Level Security (RLS)
ALTER DATABASE trainer_platform SET "app.jwt_secret" TO 'your_jwt_secret_key_here_2024';

-- Create tenant management tables
CREATE TABLE IF NOT EXISTS tenant_management.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    plan_type VARCHAR(50) DEFAULT 'basic' CHECK (plan_type IN ('basic', 'professional', 'enterprise')),
    max_users INTEGER DEFAULT 10,
    max_storage_gb INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}'
);

-- Create tenant users table
CREATE TABLE IF NOT EXISTS tenant_management.tenant_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant_management.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'trainer', 'participant', 'user')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, user_id)
);

-- Create tenant databases table for database-per-tenant strategy
CREATE TABLE IF NOT EXISTS tenant_management.tenant_databases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant_management.tenants(id) ON DELETE CASCADE,
    database_name VARCHAR(100) NOT NULL,
    connection_string TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, database_name)
);

-- Create audit log table
CREATE TABLE IF NOT EXISTS tenant_management.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenant_management.tenants(id) ON DELETE SET NULL,
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenant_management.tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_domain ON tenant_management.tenants(domain);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenant_management.tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_id ON tenant_management.tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user_id ON tenant_management.tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON tenant_management.audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON tenant_management.audit_logs(created_at);

-- Create functions for tenant management
CREATE OR REPLACE FUNCTION tenant_management.set_tenant_context(tenant_id UUID)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_tenant_id', tenant_id::text, false);
END;
$$ LANGUAGE plpgsql;

-- Function to get current tenant ID
CREATE OR REPLACE FUNCTION tenant_management.get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN current_setting('app.current_tenant_id', true)::UUID;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenant_management.tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_users_updated_at
    BEFORE UPDATE ON tenant_management.tenant_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default tenant
INSERT INTO tenant_management.tenants (id, name, slug, domain, plan_type, max_users, max_storage_gb, settings)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Default Tenant',
    'default',
    'localhost',
    'enterprise',
    1000,
    100,
    '{"features": {"multi_tenancy": true, "ai_assistant": true, "advanced_analytics": true}}'
) ON CONFLICT (slug) DO NOTHING;

-- Create default admin user for default tenant
INSERT INTO tenant_management.tenant_users (tenant_id, user_id, role, permissions)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'super_admin',
    '["*"]'
) ON CONFLICT (tenant_id, user_id) DO NOTHING;

-- Grant permissions
GRANT USAGE ON SCHEMA tenant_management TO trainer_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA tenant_management TO trainer_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA tenant_management TO trainer_user;

-- Create a function to create tenant-specific schemas
CREATE OR REPLACE FUNCTION tenant_management.create_tenant_schema(tenant_slug VARCHAR)
RETURNS VOID AS $$
DECLARE
    schema_name VARCHAR;
BEGIN
    schema_name := 'tenant_' || tenant_slug;
    
    -- Create tenant schema
    EXECUTE 'CREATE SCHEMA IF NOT EXISTS ' || schema_name;
    
    -- Create tenant-specific tables (example)
    EXECUTE 'CREATE TABLE IF NOT EXISTS ' || schema_name || '.users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT "user",
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )';
    
    EXECUTE 'CREATE TABLE IF NOT EXISTS ' || schema_name || '.training_sessions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        instructor_id UUID REFERENCES ' || schema_name || '.users(id),
        start_date TIMESTAMP WITH TIME ZONE,
        end_date TIMESTAMP WITH TIME ZONE,
        max_participants INTEGER DEFAULT 20,
        status VARCHAR(50) DEFAULT "scheduled",
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )';
    
    -- Grant permissions to trainer_user
    EXECUTE 'GRANT USAGE ON SCHEMA ' || schema_name || ' TO trainer_user';
    EXECUTE 'GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ' || schema_name || ' TO trainer_user';
    EXECUTE 'GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA ' || schema_name || ' TO trainer_user';
    
END;
$$ LANGUAGE plpgsql;

-- Create default tenant schema
SELECT tenant_management.create_tenant_schema('default'); 