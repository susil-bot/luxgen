import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Copy, 
  Trash2,
  Eye,
  Settings,
  Users,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Building,
  Globe,
  Shield,
  Zap,
  RefreshCw,
  Download,
  Upload,
  BarChart3,
  PieChart,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  Archive,
  ArchiveRestore,
  Key,
  Lock,
  Unlock,
  Wifi,
  Database,
  Server,
  Monitor,
  Cpu,
  HardDrive,
  Network,
  Cloud,
  HelpCircle,
  MessageCircle,
  BookOpen,
  Rocket,
  Target,
  Award,
  Trophy,
  Medal,
  Badge,
  Crown,
  Diamond,
  Gem,
  Sparkles,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  X
} from 'lucide-react';
import { Tenant } from '../../types/multiTenancy';
import { apiServices } from '../../core/api/ApiService';
import { errorManager } from '../../core/error/ErrorManager';
import { toast } from 'react-hot-toast';
import TenantSettingsManager from './TenantSettingsManager';

interface TenantStats {
  totalTenants: number;
  activeTenants: number;
  suspendedTenants: number;
  pendingTenants: number;
  totalUsers: number;
  totalRevenue: number;
  averageUsersPerTenant: number;
  topPlans: Array<{ plan: string; count: number }>;
  growthRate: number;
}

const TenantManagementInterface: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showSettingsManager, setShowSettingsManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
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

  // Load tenants from API
  const loadTenants = async () => {
    try {
      setLoading(true);
      const response = await apiServices.getTenants();
      
      if (response.success) {
        setTenants(response.data || []);
        setFilteredTenants(response.data || []);
        calculateStats(response.data || []);
      }
    } catch (error) {
      errorManager.handleError(error, 'Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tenantData: Tenant[]) => {
    const totalTenants = tenantData.length;
    const activeTenants = tenantData.filter(t => t.status === 'active').length;
    const suspendedTenants = tenantData.filter(t => t.status === 'suspended').length;
    const pendingTenants = tenantData.filter(t => t.status === 'pending').length;
    
    const totalUsers = tenantData.reduce((sum, tenant) => sum + (tenant.limits?.current?.users || 0), 0);
    const totalRevenue = tenantData.reduce((sum, tenant) => {
      const planPrice = tenant.plan?.pricing?.monthly || 0;
      return sum + planPrice;
    }, 0);
    
    const averageUsersPerTenant = totalTenants > 0 ? Math.round(totalUsers / totalTenants) : 0;
    
    const planCounts = tenantData.reduce((acc, tenant) => {
      const planType = tenant.plan?.type || 'unknown';
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
      growthRate: 12.5 // Mock growth rate
    });
  };

  const createTenant = async (tenantData: Partial<Tenant>) => {
    try {
      const response = await apiServices.createTenant(tenantData);
      if (response.success) {
        toast.success('Tenant created successfully!');
        loadTenants();
      }
    } catch (error) {
      errorManager.handleError(error, 'Failed to create tenant');
    }
  };

  const updateTenant = async (tenantId: string, updates: Partial<Tenant>) => {
    try {
      const response = await apiServices.updateTenant(tenantId, updates);
      if (response.success) {
        toast.success('Tenant updated successfully!');
        loadTenants();
      }
    } catch (error) {
      errorManager.handleError(error, 'Failed to update tenant');
    }
  };

  const deleteTenant = async (tenantId: string) => {
    if (window.confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      try {
        const response = await apiServices.deleteTenant(tenantId);
        if (response.success) {
          toast.success('Tenant deleted successfully!');
          loadTenants();
        }
      } catch (error) {
        errorManager.handleError(error, 'Failed to delete tenant');
      }
    }
  };

  const suspendTenant = async (tenantId: string) => {
    try {
      const response = await apiServices.updateTenant(tenantId, { status: 'suspended' });
      if (response.success) {
        toast.success('Tenant suspended successfully!');
        loadTenants();
      }
    } catch (error) {
      errorManager.handleError(error, 'Failed to suspend tenant');
    }
  };

  const activateTenant = async (tenantId: string) => {
    try {
      const response = await apiServices.updateTenant(tenantId, { status: 'active' });
      if (response.success) {
        toast.success('Tenant activated successfully!');
        loadTenants();
      }
    } catch (error) {
      errorManager.handleError(error, 'Failed to activate tenant');
    }
  };

  const handleSettingsUpdate = (updatedTenant: Tenant) => {
    setTenants(prev => prev.map(t => t.id === updatedTenant.id ? updatedTenant : t));
    setFilteredTenants(prev => prev.map(t => t.id === updatedTenant.id ? updatedTenant : t));
    toast.success('Tenant settings updated successfully!');
  };

  // Filter and sort tenants
  useEffect(() => {
    let filtered = tenants;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(tenant =>
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.domain?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(tenant => tenant.status === filterStatus);
    }

    // Apply plan filter
    if (filterPlan !== 'all') {
      filtered = filtered.filter(tenant => tenant.plan?.type === filterPlan);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'plan':
          aValue = a.plan?.type || '';
          bValue = b.plan?.type || '';
          break;
        case 'users':
          aValue = a.limits?.current?.users || 0;
          bValue = b.limits?.current?.users || 0;
          break;
        case 'created':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTenants(filtered);
  }, [tenants, searchTerm, filterStatus, filterPlan, sortBy, sortOrder]);

  useEffect(() => {
    loadTenants();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'suspended': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'inactive': return <Archive className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'enterprise': return 'text-purple-600 bg-purple-100';
      case 'professional': return 'text-blue-600 bg-blue-100';
      case 'basic': return 'text-green-600 bg-green-100';
      case 'free': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
          <p className="text-gray-600">Manage your multi-tenant platform</p>
        </div>
        <button
          onClick={() => toast('Create tenant functionality coming soon!')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Tenant
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTenants}</p>
            </div>
            <Building className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tenants</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeTenants}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow border">
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>

          <button
            onClick={loadTenants}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
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
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Building className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No tenants found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <Building className="w-5 h-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                          <div className="text-sm text-gray-500">{tenant.slug || 'No slug'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
                        {getStatusIcon(tenant.status)}
                        <span className="ml-1">{tenant.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(tenant.plan?.type || 'unknown')}`}>
                        {tenant.plan?.type || 'No plan'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tenant.limits?.current?.users || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tenant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTenant(tenant);
                            setShowSettingsManager(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                          title="Settings"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toast('View details coming soon!')}
                          className="text-gray-600 hover:text-gray-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toast('Edit tenant coming soon!')}
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTenant(tenant.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settings Manager Modal */}
      {selectedTenant && (
        <TenantSettingsManager
          tenant={selectedTenant}
          isOpen={showSettingsManager}
          onClose={() => {
            setShowSettingsManager(false);
            setSelectedTenant(null);
          }}
          onUpdate={handleSettingsUpdate}
        />
      )}
    </div>
  );
};

export default TenantManagementInterface; 