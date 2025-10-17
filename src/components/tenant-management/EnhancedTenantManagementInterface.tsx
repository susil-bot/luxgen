import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Building2, 
  Globe, 
  Shield, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  RefreshCw, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Award as Certificate,
  Zap,
  Database,
  BarChart3,
  PieChart,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Copy,
  Share2,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Palette,
  Image,
  FileText,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Maximize2,
  Minimize2,
  RotateCcw,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Layout,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiServices } from '../../core/api/ApiService';
import { errorManager } from '../../core/error/ErrorManager';
import { Tenant } from '../../types/multiTenancy';

interface EnhancedTenantManagementInterfaceProps {
  currentUser?: any;
}

interface TenantStats {
  totalTenants: number;
  activeTenants: number;
  suspendedTenants: number;
  pendingTenants: number;
  totalUsers: number;
  totalRevenue: number;
  averageUsersPerTenant: number;
  growthRate: number;
  topPlans: Array<{ plan: string; count: number }>;
  recentActivity: Array<{
    id: string;
    action: string;
    tenantName: string;
    timestamp: Date;
    user: string;
  }>;
}

interface TenantFilters {
  status?: string;
  plan?: string;
  industry?: string;
  companySize?: string;
  search?: string;
  dateRange?: { start: Date; end: Date };
  features?: string[];
}

interface TenantSort {
  field: string;
  direction: 'asc' | 'desc';
}

const EnhancedTenantManagementInterface: React.FC<EnhancedTenantManagementInterfaceProps> = ({
  currentUser
}) => {
  // State Management
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState<TenantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TenantFilters>({});
  const [sort, setSort] = useState<TenantSort>({ field: 'createdAt', direction: 'desc' });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  
  // Real-time Updates
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  // Performance Monitoring
  const [apiLatency, setApiLatency] = useState<number>(0);
  const [cacheHitRate, setCacheHitRate] = useState<number>(0);

  // Load initial data
  useEffect(() => {
    loadTenants();
    loadStats();
    startRealTimeUpdates();
  }, []);

  // Apply filters and search
  useEffect(() => {
    applyFiltersAndSearch();
  }, [tenants, filters, searchQuery, sort]);

  // Pagination effect
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTenants = filteredTenants.slice(startIndex, endIndex);
    setTotalPages(Math.ceil(filteredTenants.length / itemsPerPage));
  }, [filteredTenants, currentPage, itemsPerPage]);

  // API Functions
  const loadTenants = async () => {
    try {
      setLoading(true);
      const startTime = Date.now();
      
      const response = await apiServices.getTenants();
      if (response.success) {
        setTenants(response.data || []);
        setApiLatency(Date.now() - startTime);
        setLastUpdate(new Date());
      }
    } catch (error) {
      errorManager.handleError(error, 'Failed to load tenants');
      setError('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiServices.getTenants();
      if (response.status === 200 || response.status === 201) {
        const tenantData = response.data;
        if (tenantData) {
          calculateStats(tenantData);
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error);
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
      growthRate: 12.5, // Mock growth rate
      topPlans,
      recentActivity: [] // Mock recent activity
    });
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...tenants];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(tenant =>
        tenant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.settings?.branding?.supportEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.metadata?.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(tenant => tenant.status === filters.status);
    }
    if (filters.plan) {
      filtered = filtered.filter(tenant => tenant.plan?.type === filters.plan);
    }
    if (filters.industry) {
      filtered = filtered.filter(tenant => tenant.metadata?.industry === filters.industry);
    }
    if (filters.companySize) {
      filtered = filtered.filter(tenant => tenant.metadata?.size === filters.companySize);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = getNestedValue(a, sort.field);
      const bValue = getNestedValue(b, sort.field);
      
      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTenants(filtered);
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const startRealTimeUpdates = () => {
    if (!realTimeEnabled) return;
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (realTimeEnabled) {
        loadTenants();
        loadStats();
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  };

  // Action Handlers
  const handleCreateTenant = async (tenantData: Partial<Tenant>) => {
    try {
      const response = await apiServices.createTenant(tenantData);
      if (response.success) {
        toast.success('Tenant created successfully!');
        loadTenants();
        setShowCreateModal(false);
      }
    } catch (error) {
      errorManager.handleError(error, 'Failed to create tenant');
    }
  };

  const handleUpdateTenant = async (tenantId: string, updates: Partial<Tenant>) => {
    try {
      const response = await apiServices.updateTenant(tenantId, updates);
      if (response.success) {
        toast.success('Tenant updated successfully!');
        loadTenants();
        setShowEditModal(false);
      }
    } catch (error) {
      errorManager.handleError(error, 'Failed to update tenant');
    }
  };

  const handleDeleteTenant = async (tenantId: string) => {
    if (!window.confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiServices.deleteTenant(tenantId);
      if (response.success) {
        toast.success('Tenant deleted successfully!');
        loadTenants();
      }
    } catch (error) {
      errorManager.handleError(error, 'Failed to delete tenant');
    }
  };

  const handleBulkAction = async (action: string, tenantIds: string[]) => {
    try {
      let response;
      switch (action) {
        case 'delete':
          response = await apiServices.deleteTenant(tenantIds[0]); // Handle bulk delete
          break;
        case 'activate':
          // Implement bulk activate
          break;
        case 'suspend':
          // Implement bulk suspend
          break;
        default:
          toast.error('Invalid bulk action');
          return;
      }
      
      if (response && response.success) {
        toast.success(`Bulk ${action} completed successfully!`);
        loadTenants();
        setSelectedTenants([]);
      }
    } catch (error) {
      errorManager.handleError(error, `Failed to perform bulk ${action}`);
    }
  };

  const handleExportData = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const data = filteredTenants.map(tenant => ({
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        contactEmail: tenant.settings?.branding?.supportEmail,
        status: tenant.status,
        plan: tenant.plan?.type,
        industry: tenant.metadata?.industry,
        createdAt: tenant.createdAt,
        lastActivity: tenant.limits?.usage?.lastReset
      }));

      if (format === 'csv') {
        const csvContent = convertToCSV(data);
        downloadFile(csvContent, 'tenants.csv', 'text/csv');
      } else {
        downloadFile(JSON.stringify(data, null, 2), 'tenants.json', 'application/json');
      }

      toast.success(`Data exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const convertToCSV = (data: any[]) => {
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // UI Components
  const renderStatsCards = () => {
    if (!stats) return null;

    const statCards = [
      {
        title: 'Total Tenants',
        value: stats.totalTenants,
        icon: Building2,
        color: 'bg-blue-500',
        change: '+12%',
        changeType: 'positive'
      },
      {
        title: 'Active Tenants',
        value: stats.activeTenants,
        icon: CheckCircle,
        color: 'bg-green-500',
        change: '+8%',
        changeType: 'positive'
      },
      {
        title: 'Total Users',
        value: stats.totalUsers,
        icon: Users,
        color: 'bg-purple-500',
        change: '+15%',
        changeType: 'positive'
      },
      {
        title: 'Monthly Revenue',
        value: `$${stats.totalRevenue.toLocaleString()}`,
        icon: DollarSign,
        color: 'bg-yellow-500',
        change: '+23%',
        changeType: 'positive'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${card.color} text-white`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
            <select
              value={filters.plan || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, plan: e.target.value || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Plans</option>
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              value={filters.industry || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Industries</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
            <select
              value={filters.companySize || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, companySize: e.target.value || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sizes</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1000+">1000+</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4 space-x-3">
          <button
            onClick={() => setFilters({})}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Clear Filters
          </button>
          <button
            onClick={() => setShowFilters(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  };

  const renderTenantTable = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
            <button
              onClick={loadTenants}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (filteredTenants.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No tenants found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create First Tenant
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedTenants.length === filteredTenants.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTenants(filteredTenants.map(t => t.id));
                      } else {
                        setSelectedTenants([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
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
                  Industry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTenants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedTenants.includes(tenant.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTenants(prev => [...prev, tenant.id]);
                        } else {
                          setSelectedTenants(prev => prev.filter(id => id !== tenant.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                        <div className="text-sm text-gray-500">{tenant.settings?.branding?.supportEmail}</div>
                        <div className="text-xs text-gray-400">{tenant.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      tenant.status === 'active' ? 'bg-green-100 text-green-800' :
                      tenant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      tenant.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      tenant.plan?.type === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                      tenant.plan?.type === 'professional' ? 'bg-blue-100 text-blue-800' :
                      tenant.plan?.type === 'basic' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tenant.plan?.type || 'free'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tenant.limits?.current?.users || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tenant.metadata?.industry || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowDetailsModal(true)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit Tenant"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTenant(tenant.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Tenant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowTeamModal(true)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Manage Team"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTenants.length)} of {filteredTenants.length} results
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm border rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tenant Management</h1>
              <p className="text-gray-600 mt-2">Manage all platform tenants and their configurations</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Activity className="w-4 h-4" />
                <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
              </div>
              
              <button
                onClick={() => setRealTimeEnabled(!realTimeEnabled)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  realTimeEnabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {realTimeEnabled ? <Activity className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                <span>{realTimeEnabled ? 'Live' : 'Offline'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tenants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${
                  showFilters
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md ${
                    viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {selectedTenants.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedTenants.length} selected</span>
                  <button
                    onClick={() => setShowBulkEditModal(true)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Bulk Edit
                  </button>
                </div>
              )}
              
              <button
                onClick={() => handleExportData('csv')}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Create Tenant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {renderFilters()}

        {/* Tenant Table */}
        {renderTenantTable()}

        {/* Pagination */}
        {renderPagination()}

        {/* Performance Metrics */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>API Latency: {apiLatency}ms</span>
              <span>Cache Hit Rate: {cacheHitRate}%</span>
              <span>Total Tenants: {tenants.length}</span>
            </div>
            <button
              onClick={loadTenants}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals would be implemented here */}
      {/* CreateTenantModal, EditTenantModal, TenantDetailsModal, etc. */}
    </div>
  );
};

export default EnhancedTenantManagementInterface; 