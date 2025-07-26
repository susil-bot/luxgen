import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Database, 
  Settings, 
  Activity,
  Shield,
  Globe,
  CreditCard,
  BarChart3,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Clock,
  Star
} from 'lucide-react';
import { useMultiTenancy } from '../../contexts/MultiTenancyContext';
import { useAuth } from '../../contexts/AuthContext';
import { Tenant, TenantPlan } from '../../types/multiTenancy';
import { tenantManagementService, TenantStats } from '../../services/TenantManagementService';
import CreateTenantModal from './CreateTenantModal';
import TenantDetailsModal from './TenantDetailsModal';



const TenantManagementInterface: React.FC = () => {
  const { currentTenant } = useMultiTenancy();
  const { user } = useAuth();
  const isSystemAdmin = user?.role === 'super_admin';
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState<TenantStats>({
    totalTenants: 0,
    activeTenants: 0,
    suspendedTenants: 0,
    pendingTenants: 0,
    totalUsers: 0,
    totalRevenue: 0,
    averageUsersPerTenant: 0,
    topPlans: [],
    growthRate: 0
  });

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockTenants: Tenant[] = [
      {
        id: 'tenant_1',
        name: 'Acme Corporation',
        slug: 'acme',
        domain: 'acme.example.com',
        subdomain: 'acme',
        status: 'active',
        plan: {
          id: 'enterprise',
          name: 'Enterprise',
          type: 'enterprise',
          features: ['ai', 'analytics', 'integrations', 'custom_domain', 'sso', 'audit_logs'],
          limits: {
            users: 1000,
            storage: 1000,
            apiCalls: 100000,
            customDomains: 10,
            integrations: 50,
          },
          pricing: {
            monthly: 999,
            yearly: 9999,
            currency: 'USD',
          },
        },
        settings: {
          branding: {
            primaryColor: '#3B82F6',
            secondaryColor: '#1F2937',
            companyName: 'Acme Corporation',
            supportEmail: 'support@acme.com',
          },
          features: {
            enableAI: true,
            enableAnalytics: true,
            enableIntegrations: true,
            enableCustomDomain: true,
            enableSSO: true,
            enableAuditLogs: true,
          },
          security: {
            passwordPolicy: {
              minLength: 12,
              requireUppercase: true,
              requireLowercase: true,
              requireNumbers: true,
              requireSpecialChars: true,
              preventCommonPasswords: true,
              maxAge: 90,
            },
            sessionTimeout: 480,
            mfaRequired: true,
          },
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
        },
        limits: {
          current: {
            users: 45,
            storage: 125,
            apiCalls: 15000,
            customDomains: 2,
            integrations: 8,
          },
          usage: {
            storageUsed: 125,
            apiCallsUsed: 15000,
            lastReset: new Date('2024-01-01'),
          },
        },
        metadata: {
          industry: 'Technology',
          size: 'large',
          region: 'North America',
          timezone: 'America/New_York',
          language: 'en',
          currency: 'USD',
        },
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: 'tenant_2',
        name: 'StartupXYZ',
        slug: 'startupxyz',
        domain: 'startupxyz.example.com',
        subdomain: 'startupxyz',
        status: 'active',
        plan: {
          id: 'professional',
          name: 'Professional',
          type: 'professional',
          features: ['ai', 'analytics', 'integrations'],
          limits: {
            users: 100,
            storage: 100,
            apiCalls: 10000,
            customDomains: 2,
            integrations: 10,
          },
          pricing: {
            monthly: 99,
            yearly: 999,
            currency: 'USD',
          },
        },
        settings: {
          branding: {
            primaryColor: '#10B981',
            secondaryColor: '#059669',
            companyName: 'StartupXYZ',
            supportEmail: 'support@startupxyz.com',
          },
          features: {
            enableAI: true,
            enableAnalytics: true,
            enableIntegrations: true,
            enableCustomDomain: false,
            enableSSO: false,
            enableAuditLogs: false,
          },
          security: {
            passwordPolicy: {
              minLength: 8,
              requireUppercase: true,
              requireLowercase: true,
              requireNumbers: true,
              requireSpecialChars: false,
              preventCommonPasswords: true,
              maxAge: 90,
            },
            sessionTimeout: 240,
            mfaRequired: false,
          },
          notifications: {
            email: true,
            sms: false,
            push: true,
          },
        },
        limits: {
          current: {
            users: 12,
            storage: 25,
            apiCalls: 2500,
            customDomains: 1,
            integrations: 3,
          },
          usage: {
            storageUsed: 25,
            apiCallsUsed: 2500,
            lastReset: new Date('2024-01-01'),
          },
        },
        metadata: {
          industry: 'SaaS',
          size: 'startup',
          region: 'North America',
          timezone: 'America/Los_Angeles',
          language: 'en',
          currency: 'USD',
        },
        createdAt: new Date('2023-06-20'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        id: 'tenant_3',
        name: 'Global Enterprises',
        slug: 'global',
        domain: 'global.example.com',
        subdomain: 'global',
        status: 'suspended',
        plan: {
          id: 'enterprise',
          name: 'Enterprise',
          type: 'enterprise',
          features: ['ai', 'analytics', 'integrations', 'custom_domain', 'sso', 'audit_logs'],
          limits: {
            users: 1000,
            storage: 1000,
            apiCalls: 100000,
            customDomains: 10,
            integrations: 50,
          },
          pricing: {
            monthly: 999,
            yearly: 9999,
            currency: 'USD',
          },
        },
        settings: {
          branding: {
            primaryColor: '#8B5CF6',
            secondaryColor: '#7C3AED',
            companyName: 'Global Enterprises',
            supportEmail: 'support@global.com',
          },
          features: {
            enableAI: true,
            enableAnalytics: true,
            enableIntegrations: true,
            enableCustomDomain: true,
            enableSSO: true,
            enableAuditLogs: true,
          },
          security: {
            passwordPolicy: {
              minLength: 12,
              requireUppercase: true,
              requireLowercase: true,
              requireNumbers: true,
              requireSpecialChars: true,
              preventCommonPasswords: true,
              maxAge: 90,
            },
            sessionTimeout: 480,
            mfaRequired: true,
          },
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
        },
        limits: {
          current: {
            users: 0,
            storage: 0,
            apiCalls: 0,
            customDomains: 0,
            integrations: 0,
          },
          usage: {
            storageUsed: 0,
            apiCallsUsed: 0,
            lastReset: new Date('2024-01-01'),
          },
        },
        metadata: {
          industry: 'Manufacturing',
          size: 'enterprise',
          region: 'Europe',
          timezone: 'Europe/London',
          language: 'en',
          currency: 'EUR',
        },
        createdAt: new Date('2023-03-10'),
        updatedAt: new Date('2024-01-05'),
      }
    ];

    setTenants(mockTenants);
    setFilteredTenants(mockTenants);
    
    // Calculate stats
    const totalTenants = mockTenants.length;
    const activeTenants = mockTenants.filter(t => t.status === 'active').length;
    const suspendedTenants = mockTenants.filter(t => t.status === 'suspended').length;
    const pendingTenants = mockTenants.filter(t => t.status === 'pending').length;
    const totalUsers = mockTenants.reduce((sum, t) => sum + t.limits.current.users, 0);
    const totalRevenue = mockTenants.reduce((sum, t) => sum + t.plan.pricing.monthly, 0);
    const averageUsersPerTenant = totalTenants > 0 ? totalUsers / totalTenants : 0;
    
    // Calculate top plans
    const planCounts = mockTenants.reduce((acc, tenant) => {
      const planType = tenant.plan.type;
      acc[planType] = (acc[planType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPlans = Object.entries(planCounts)
      .map(([plan, count]) => ({ plan, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    setStats({
      totalTenants,
      activeTenants,
      suspendedTenants,
      pendingTenants,
      totalUsers,
      totalRevenue,
      averageUsersPerTenant,
      topPlans,
      growthRate: 12.5
    });
    
    setLoading(false);
  }, []);

  // Filter tenants based on search and filters
  useEffect(() => {
    let filtered = tenants;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tenant =>
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.domain?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tenant => tenant.status === statusFilter);
    }

    // Plan filter
    if (planFilter !== 'all') {
      filtered = filtered.filter(tenant => tenant.plan.type === planFilter);
    }

    setFilteredTenants(filtered);
  }, [tenants, searchTerm, statusFilter, planFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'suspended':
        return 'text-red-600 bg-red-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'enterprise':
        return 'text-purple-600 bg-purple-100';
      case 'professional':
        return 'text-blue-600 bg-blue-100';
      case 'basic':
        return 'text-green-600 bg-green-100';
      case 'free':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleCreateTenant = () => {
    setShowCreateModal(true);
  };

  const handleEditTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowEditModal(true);
  };

  const handleViewDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowDetailsModal(true);
  };

  const handleDeleteTenant = async (tenant: Tenant) => {
    if (window.confirm(`Are you sure you want to delete tenant "${tenant.name}"? This action cannot be undone.`)) {
      try {
        await tenantManagementService.deleteTenant(tenant.id);
        setTenants(tenants.filter(t => t.id !== tenant.id));
      } catch (error) {
        console.error('Error deleting tenant:', error);
        alert(`Failed to delete tenant: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleSaveTenant = async (tenantData: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTenant = await tenantManagementService.createTenant(tenantData);
      setTenants([...tenants, newTenant]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating tenant:', error);
      alert(`Failed to create tenant: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!isSystemAdmin) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600">
            You need system administrator privileges to access tenant management.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading tenants...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
          <p className="text-gray-600">Manage all tenants and their configurations</p>
        </div>
        <button
          onClick={handleCreateTenant}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Tenant
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTenants}</p>
            </div>
            <Globe className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Tenants</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeTenants}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-red-600">{stats.suspendedTenants}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {tenant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                        <div className="text-sm text-gray-500">{tenant.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tenant.status)}`}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(tenant.plan.type)}`}>
                      {tenant.plan.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tenant.limits.current.users} / {tenant.plan.limits.users}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Storage: {tenant.limits.usage.storageUsed}GB / {tenant.plan.limits.storage}GB
                    </div>
                    <div className="text-sm text-gray-500">
                      API: {tenant.limits.usage.apiCallsUsed.toLocaleString()} / {tenant.plan.limits.apiCalls.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(tenant)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditTenant(tenant)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit Tenant"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTenant(tenant)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Tenant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTenants.length === 0 && (
          <div className="text-center py-8">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No tenants found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTenantModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveTenant}
      />

      <TenantDetailsModal
        tenant={selectedTenant}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onEdit={handleEditTenant}
        onDelete={handleDeleteTenant}
      />
    </div>
  );
};

export default TenantManagementInterface; 