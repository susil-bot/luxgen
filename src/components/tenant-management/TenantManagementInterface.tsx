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
  StarOff,
  Archive,
  ArchiveRestore,
  Key,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  Database,
  Server,
  Monitor,
  Cpu,
  HardDrive,
  Network,
  Cloud,
  CloudOff
} from 'lucide-react';
import { Tenant } from '../../types';
import apiServices from '../../services/apiServices';
import { handleApiError, handleApiResponse } from '../../utils/errorHandler';
import { toast } from 'react-hot-toast';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
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
      
      if (handleApiResponse(response)) {
        setTenants(response.data || []);
        setFilteredTenants(response.data || []);
        calculateStats(response.data || []);
      }
    } catch (error) {
      handleApiError(error, 'Loading tenants');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from tenant data
  const calculateStats = (tenantData: Tenant[]) => {
    const totalTenants = tenantData.length;
    const activeTenants = tenantData.filter(t => t.status === 'active').length;
    const suspendedTenants = tenantData.filter(t => t.status === 'suspended').length;
    const pendingTenants = tenantData.filter(t => t.status === 'pending').length;
    const totalUsers = tenantData.reduce((sum, t) => sum + (t.limits?.current?.users || 0), 0);
    const totalRevenue = tenantData.reduce((sum, t) => sum + (t.plan?.pricing?.monthly || 0), 0);
    const averageUsersPerTenant = totalTenants > 0 ? totalUsers / totalTenants : 0;
    
    // Calculate top plans
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
      growthRate: 12.5 // This would come from analytics API
    });
  };

  // Create new tenant
  const createTenant = async (tenantData: Partial<Tenant>) => {
    try {
      const response = await apiServices.createTenant(tenantData);
      
      if (handleApiResponse(response)) {
        toast.success('Tenant created successfully');
        setShowCreateModal(false);
        loadTenants(); // Reload tenants
      }
    } catch (error) {
      handleApiError(error, 'Creating tenant');
    }
  };

  // Update tenant
  const updateTenant = async (tenantId: string, updates: Partial<Tenant>) => {
    try {
      const response = await apiServices.updateTenant(tenantId, updates);
      
      if (handleApiResponse(response)) {
        toast.success('Tenant updated successfully');
        setShowDetailsModal(false);
        loadTenants(); // Reload tenants
      }
    } catch (error) {
      handleApiError(error, 'Updating tenant');
    }
  };

  // Delete tenant
  const deleteTenant = async (tenantId: string) => {
    if (!window.confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiServices.deleteTenant(tenantId);
      
      if (handleApiResponse(response)) {
        toast.success('Tenant deleted successfully');
        loadTenants(); // Reload tenants
      }
    } catch (error) {
      handleApiError(error, 'Deleting tenant');
    }
  };

  // Suspend tenant
  const suspendTenant = async (tenantId: string) => {
    try {
      const response = await apiServices.updateTenant(tenantId, { status: 'suspended' });
      
      if (handleApiResponse(response)) {
        toast.success('Tenant suspended successfully');
        loadTenants(); // Reload tenants
      }
    } catch (error) {
      handleApiError(error, 'Suspending tenant');
    }
  };

  // Activate tenant
  const activateTenant = async (tenantId: string) => {
    try {
      const response = await apiServices.updateTenant(tenantId, { status: 'active' });
      
      if (handleApiResponse(response)) {
        toast.success('Tenant activated successfully');
        loadTenants(); // Reload tenants
      }
    } catch (error) {
      handleApiError(error, 'Activating tenant');
    }
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
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'users':
          aValue = a.limits?.current?.users || 0;
          bValue = b.limits?.current?.users || 0;
          break;
        case 'revenue':
          aValue = a.plan?.pricing?.monthly || 0;
          bValue = b.plan?.pricing?.monthly || 0;
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

  // Load tenants on component mount
  useEffect(() => {
    loadTenants();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'suspended': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'suspended': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'enterprise': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900';
      case 'professional': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
      case 'basic': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tenants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tenant Management
              </h1>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {stats.totalTenants} Tenants
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {stats.activeTenants} Active
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  ${stats.totalRevenue.toLocaleString()}/mo
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadTenants}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Tenant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Tenants
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stats.totalTenants}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Users
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {stats.totalUsers.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Monthly Revenue
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      ${stats.totalRevenue.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Growth Rate
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      +{stats.growthRate}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1 max-w-lg">
                <label htmlFor="search" className="sr-only">Search tenants</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Search tenants..."
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700"
                >
                  <option value="all">All Plans</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="professional">Professional</option>
                  <option value="basic">Basic</option>
                </select>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="users-desc">Most Users</option>
                  <option value="revenue-desc">Highest Revenue</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tenants List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTenants.length === 0 ? (
              <li className="px-6 py-12 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  {searchTerm || filterStatus !== 'all' || filterPlan !== 'all' 
                    ? 'No tenants match your filters.' 
                    : 'No tenants found.'}
                </div>
              </li>
            ) : (
              filteredTenants.map((tenant) => (
                <li key={tenant.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <Building className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {tenant.name}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
                            {getStatusIcon(tenant.status)}
                            <span className="ml-1">{tenant.status}</span>
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(tenant.plan?.type || 'unknown')}`}>
                            {tenant.plan?.name || 'Unknown Plan'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Globe className="w-4 h-4 mr-1" />
                            {tenant.domain || 'No domain'}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {tenant.limits?.current?.users || 0} users
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Created {new Date(tenant.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setShowDetailsModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setShowDetailsModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      {tenant.status === 'active' ? (
                        <button
                          onClick={() => suspendTenant(tenant.id)}
                          className="inline-flex items-center px-3 py-1 border border-yellow-300 dark:border-yellow-600 shadow-sm text-xs font-medium rounded text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900 hover:bg-yellow-100 dark:hover:bg-yellow-800"
                        >
                          <Lock className="w-3 h-3 mr-1" />
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => activateTenant(tenant.id)}
                          className="inline-flex items-center px-3 py-1 border border-green-300 dark:border-green-600 shadow-sm text-xs font-medium rounded text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800"
                        >
                          <Unlock className="w-3 h-3 mr-1" />
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => deleteTenant(tenant.id)}
                        className="inline-flex items-center px-3 py-1 border border-red-300 dark:border-red-600 shadow-sm text-xs font-medium rounded text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Modals would go here - CreateTenantModal and TenantDetailsModal */}
      {/* For now, we'll show a placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Create Tenant</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tenant creation modal would go here
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedTenant && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tenant Details</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Details for {selectedTenant.name}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagementInterface; 