import React, { useState } from 'react';
import { 
  X, 
  Edit, 
  Trash2, 
  Users, 
  Database, 
  Activity, 
  Settings, 
  Shield, 
  Globe, 
  CreditCard,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { Tenant } from '../../types/multiTenancy';

interface TenantDetailsModalProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
}

const TenantDetailsModal: React.FC<TenantDetailsModalProps> = ({
  tenant,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'settings' | 'security' | 'billing'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen || !tenant) return null;

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

  const calculateUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'usage', label: 'Usage & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-lg font-semibold text-primary-600">
                {tenant.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{tenant.name}</h2>
              <p className="text-sm text-gray-500">{tenant.domain}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => onEdit(tenant)}
              className="p-2 text-blue-600 hover:text-blue-700"
              title="Edit Tenant"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(tenant)}
              className="p-2 text-red-600 hover:text-red-700"
              title="Delete Tenant"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Status and Plan */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tenant.status)}`}>
                        {tenant.status}
                      </span>
                    </div>
                    {tenant.status === 'active' ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    )}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Plan</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(tenant.plan.type)}`}>
                        {tenant.plan.name}
                      </span>
                    </div>
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="text-sm font-medium text-gray-900">
                        {tenant.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Usage Overview */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Users</span>
                      <span className="text-sm font-medium text-gray-900">
                        {tenant.limits.current.users} / {tenant.plan.limits.users}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getUsageColor(calculateUsagePercentage(tenant.limits.current.users, tenant.plan.limits.users))}`}
                        style={{ width: `${calculateUsagePercentage(tenant.limits.current.users, tenant.plan.limits.users)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Storage</span>
                      <span className="text-sm font-medium text-gray-900">
                        {tenant.limits.usage.storageUsed}GB / {tenant.plan.limits.storage}GB
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getUsageColor(calculateUsagePercentage(tenant.limits.usage.storageUsed, tenant.plan.limits.storage))}`}
                        style={{ width: `${calculateUsagePercentage(tenant.limits.usage.storageUsed, tenant.plan.limits.storage)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">API Calls</span>
                      <span className="text-sm font-medium text-gray-900">
                        {tenant.limits.usage.apiCallsUsed.toLocaleString()} / {tenant.plan.limits.apiCalls.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getUsageColor(calculateUsagePercentage(tenant.limits.usage.apiCallsUsed, tenant.plan.limits.apiCalls))}`}
                        style={{ width: `${calculateUsagePercentage(tenant.limits.usage.apiCallsUsed, tenant.plan.limits.apiCalls)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Integrations</span>
                      <span className="text-sm font-medium text-gray-900">
                        {tenant.limits.current.integrations} / {tenant.plan.limits.integrations}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getUsageColor(calculateUsagePercentage(tenant.limits.current.integrations, tenant.plan.limits.integrations))}`}
                        style={{ width: `${calculateUsagePercentage(tenant.limits.current.integrations, tenant.plan.limits.integrations)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                    <p className="text-sm text-gray-900">{tenant.metadata.industry || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Size</label>
                    <p className="text-sm text-gray-900">{tenant.metadata.size || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Region</label>
                    <p className="text-sm text-gray-900">{tenant.metadata.region}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timezone</label>
                    <p className="text-sm text-gray-900">{tenant.metadata.timezone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{tenant.limits.current.users}</p>
                    <p className="text-sm text-gray-600">Active Users</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{tenant.limits.usage.storageUsed}GB</p>
                    <p className="text-sm text-gray-600">Storage Used</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{tenant.limits.usage.apiCallsUsed.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">API Calls</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New user registered</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">API call limit reached</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Storage usage warning</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Branding Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <p className="text-sm text-gray-900">{tenant.settings.branding.companyName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Support Email</label>
                    <p className="text-sm text-gray-900">{tenant.settings.branding.supportEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: tenant.settings.branding.primaryColor }}
                      ></div>
                      <span className="text-sm text-gray-900">{tenant.settings.branding.primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: tenant.settings.branding.secondaryColor }}
                      ></div>
                      <span className="text-sm text-gray-900">{tenant.settings.branding.secondaryColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={tenant.settings.features.enableAI}
                      disabled
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="text-sm text-gray-700">AI Features</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={tenant.settings.features.enableAnalytics}
                      disabled
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="text-sm text-gray-700">Analytics</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={tenant.settings.features.enableIntegrations}
                      disabled
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="text-sm text-gray-700">Integrations</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={tenant.settings.features.enableCustomDomain}
                      disabled
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="text-sm text-gray-700">Custom Domain</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={tenant.settings.features.enableSSO}
                      disabled
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="text-sm text-gray-700">SSO</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={tenant.settings.features.enableAuditLogs}
                      disabled
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="text-sm text-gray-700">Audit Logs</label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Session Timeout</label>
                    <p className="text-sm text-gray-900">{tenant.settings.security.sessionTimeout} minutes</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">MFA Required</label>
                    <p className="text-sm text-gray-900">{tenant.settings.security.mfaRequired ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password Policy</label>
                    <div className="text-sm text-gray-900 space-y-1">
                      <p>• Minimum length: {tenant.settings.security.passwordPolicy.minLength} characters</p>
                      <p>• Uppercase required: {tenant.settings.security.passwordPolicy.requireUppercase ? 'Yes' : 'No'}</p>
                      <p>• Numbers required: {tenant.settings.security.passwordPolicy.requireNumbers ? 'Yes' : 'No'}</p>
                      <p>• Special characters: {tenant.settings.security.passwordPolicy.requireSpecialChars ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Security Events</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Successful login</p>
                      <p className="text-xs text-gray-500">IP: 192.168.1.100 • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Failed login attempt</p>
                      <p className="text-xs text-gray-500">IP: 192.168.1.101 • 1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Password changed</p>
                      <p className="text-xs text-gray-500">User: john.doe • 3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Plan</label>
                    <p className="text-sm font-medium text-gray-900">{tenant.plan.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Monthly Cost</label>
                    <p className="text-sm font-medium text-gray-900">
                      ${tenant.plan.pricing.monthly} {tenant.plan.pricing.currency}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yearly Cost</label>
                    <p className="text-sm font-medium text-gray-900">
                      ${tenant.plan.pricing.yearly} {tenant.plan.pricing.currency}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Billing Cycle</label>
                    <p className="text-sm text-gray-900">Monthly</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Costs</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Base Plan</span>
                    <span className="text-sm font-medium text-gray-900">${tenant.plan.pricing.monthly}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Additional Users</span>
                    <span className="text-sm font-medium text-gray-900">$0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Additional Storage</span>
                    <span className="text-sm font-medium text-gray-900">$0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-900">Total</span>
                    <span className="text-sm font-medium text-gray-900">${tenant.plan.pricing.monthly}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantDetailsModal; 