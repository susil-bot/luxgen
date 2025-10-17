import React, { useState } from 'react';
import { X, Save, Globe, Users, Database, Shield } from 'lucide-react';
import { Tenant, TenantPlan } from '../../types/multiTenancy';
import apiClient from '../../core/api/ApiClient';

interface CreateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const CreateTenantModal: React.FC<CreateTenantModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    domain: '',
    subdomain: '',
    status: 'active' as const,
    planType: 'professional' as const,
    industry: '',
    size: 'medium' as const,
    region: 'North America',
    timezone: 'America/New_York',
    language: 'en',
    currency: 'USD',
    primaryColor: '#3B82F6',
    secondaryColor: '#1F2937',
    supportEmail: '',
    enableAI: true,
    enableAnalytics: true,
    enableIntegrations: true,
    enableCustomDomain: false,
    enableSSO: false,
    enableAuditLogs: false,
    mfaRequired: false,
    sessionTimeout: 240,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const planOptions: Record<string, TenantPlan> = {
    free: {
      id: 'free',
      name: 'Free',
      type: 'free',
      features: ['basic'],
      limits: {
        users: 5,
        storage: 10,
        apiCalls: 1000,
        customDomains: 0,
        integrations: 2,
      },
      pricing: {
        monthly: 0,
        yearly: 0,
        currency: 'USD',
      },
    },
    basic: {
      id: 'basic',
      name: 'Basic',
      type: 'basic',
      features: ['basic', 'analytics'],
      limits: {
        users: 25,
        storage: 50,
        apiCalls: 5000,
        customDomains: 1,
        integrations: 5,
      },
      pricing: {
        monthly: 29,
        yearly: 290,
        currency: 'USD',
      },
    },
    professional: {
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
    enterprise: {
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
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tenant name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (formData.domain && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.domain)) {
      newErrors.domain = 'Please enter a valid domain';
    }

    if (formData.subdomain && !/^[a-z0-9-]+$/.test(formData.subdomain)) {
      newErrors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.supportEmail.trim()) {
      newErrors.supportEmail = 'Support email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supportEmail)) {
      newErrors.supportEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedPlan = planOptions[formData.planType];
      
      const payload = {
        name: formData.name,
        slug: formData.slug,
        domain: formData.domain || undefined,
        subdomain: formData.subdomain || undefined,
        status: formData.status,
        plan: selectedPlan,
        settings: {
          branding: {
            primaryColor: formData.primaryColor,
            secondaryColor: formData.secondaryColor,
            companyName: formData.name,
            supportEmail: formData.supportEmail,
          },
          features: {
            enableAI: formData.enableAI,
            enableAnalytics: formData.enableAnalytics,
            enableIntegrations: formData.enableIntegrations,
            enableCustomDomain: formData.enableCustomDomain,
            enableSSO: formData.enableSSO,
            enableAuditLogs: formData.enableAuditLogs,
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
            sessionTimeout: formData.sessionTimeout,
            mfaRequired: formData.mfaRequired,
          },
          notifications: {
            email: formData.emailNotifications,
            sms: formData.smsNotifications,
            push: formData.pushNotifications,
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
            lastReset: new Date(),
          },
        },
        metadata: {
          industry: formData.industry,
          size: formData.size,
          region: formData.region,
          timezone: formData.timezone,
          language: formData.language,
          currency: formData.currency,
        },
      };

      // Call backend API directly
      const response = await apiClient.post('/api/tenants/create', payload);
      if (response.success) {
        onSave(response.data as Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>); // Pass the created tenant back
        handleClose();
      } else {
        alert(response.message || 'Failed to create tenant');
      }
    } catch (error) {
      console.error('Error creating tenant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      slug: '',
      domain: '',
      subdomain: '',
      status: 'active',
      planType: 'professional',
      industry: '',
      size: 'medium',
      region: 'North America',
      timezone: 'America/New_York',
      language: 'en',
      currency: 'USD',
      primaryColor: '#3B82F6',
      secondaryColor: '#1F2937',
      supportEmail: '',
      enableAI: true,
      enableAnalytics: true,
      enableIntegrations: true,
      enableCustomDomain: false,
      enableSSO: false,
      enableAuditLogs: false,
      mfaRequired: false,
      sessionTimeout: 240,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Tenant</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tenant Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter tenant name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value.toLowerCase())}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tenant-slug"
                />
                {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domain
                </label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => handleInputChange('domain', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.domain ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="example.com"
                />
                {errors.domain && <p className="text-red-500 text-sm mt-1">{errors.domain}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subdomain
                </label>
                <input
                  type="text"
                  value={formData.subdomain}
                  onChange={(e) => handleInputChange('subdomain', e.target.value.toLowerCase())}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.subdomain ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tenant"
                />
                {errors.subdomain && <p className="text-red-500 text-sm mt-1">{errors.subdomain}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Email *
                </label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.supportEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="support@company.com"
                />
                {errors.supportEmail && <p className="text-red-500 text-sm mt-1">{errors.supportEmail}</p>}
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Plan Selection
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(planOptions).map(([key, plan]) => (
                <div
                  key={key}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    formData.planType === key
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('planType', key)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{plan.name}</h4>
                    <span className="text-sm font-medium text-gray-900">
                      ${plan.pricing.monthly}/mo
                    </span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {plan.limits.users} users</li>
                    <li>• {plan.limits.storage}GB storage</li>
                    <li>• {plan.limits.apiCalls.toLocaleString()} API calls</li>
                    <li>• {plan.limits.integrations} integrations</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Company Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Technology, Healthcare, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size
                </label>
                <select
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="startup">Startup (1-10)</option>
                  <option value="small">Small (11-50)</option>
                  <option value="medium">Medium (51-200)</option>
                  <option value="large">Large (201-1000)</option>
                  <option value="enterprise">Enterprise (1000+)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                  <option value="Latin America">Latin America</option>
                  <option value="Middle East">Middle East</option>
                  <option value="Africa">Africa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Asia/Shanghai">Shanghai</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security & Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={formData.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="15"
                  max="1440"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="mfaRequired"
                  checked={formData.mfaRequired}
                  onChange={(e) => handleInputChange('mfaRequired', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="mfaRequired" className="text-sm font-medium text-gray-700">
                  Require Multi-Factor Authentication
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Feature Toggles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableAI"
                    checked={formData.enableAI}
                    onChange={(e) => handleInputChange('enableAI', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="enableAI" className="text-sm text-gray-700">Enable AI Features</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableAnalytics"
                    checked={formData.enableAnalytics}
                    onChange={(e) => handleInputChange('enableAnalytics', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="enableAnalytics" className="text-sm text-gray-700">Enable Analytics</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableIntegrations"
                    checked={formData.enableIntegrations}
                    onChange={(e) => handleInputChange('enableIntegrations', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="enableIntegrations" className="text-sm text-gray-700">Enable Integrations</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableCustomDomain"
                    checked={formData.enableCustomDomain}
                    onChange={(e) => handleInputChange('enableCustomDomain', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="enableCustomDomain" className="text-sm text-gray-700">Enable Custom Domain</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableSSO"
                    checked={formData.enableSSO}
                    onChange={(e) => handleInputChange('enableSSO', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="enableSSO" className="text-sm text-gray-700">Enable SSO</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableAuditLogs"
                    checked={formData.enableAuditLogs}
                    onChange={(e) => handleInputChange('enableAuditLogs', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="enableAuditLogs" className="text-sm text-gray-700">Enable Audit Logs</label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Notification Preferences</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="emailNotifications" className="text-sm text-gray-700">Email Notifications</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={formData.smsNotifications}
                    onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="smsNotifications" className="text-sm text-gray-700">SMS Notifications</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    checked={formData.pushNotifications}
                    onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="pushNotifications" className="text-sm text-gray-700">Push Notifications</label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Creating...' : 'Create Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTenantModal; 