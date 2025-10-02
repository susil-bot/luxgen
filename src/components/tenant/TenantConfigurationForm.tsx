import React, { useState, useEffect } from 'react';
import { useRobustTenant } from '../../contexts/RobustTenantContext';
import { useTenantFeatures, useTenantBranding, useTenantSecurity, useTenantSettings } from '../../hooks/useTenantManagement';

interface TenantConfigurationFormProps {
  onSave?: () => void;
  onCancel?: () => void;
}

const TenantConfigurationForm: React.FC<TenantConfigurationFormProps> = ({ onSave, onCancel }) => {
  const { state, updateTenantConfig } = useRobustTenant();
  const { updateFeatures } = useTenantFeatures();
  const { updateBranding } = useTenantBranding();
  const { updateSecurity } = useTenantSecurity();
  const { updateSettings } = useTenantSettings();

  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    features: [] as string[],
    branding: {
      theme: '',
      colors: {
        primary: '',
        secondary: '',
        accent: '',
        background: '',
        text: ''
      },
      fonts: {
        primary: '',
        secondary: '',
        sizes: {}
      },
      logo: '',
      favicon: ''
    },
    security: {
      permissions: [] as string[],
      sso: false,
      mfa: false,
      sessionTimeout: 3600,
      ipWhitelist: [] as string[]
    },
    settings: {} as Record<string, any>
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.currentTenant) {
      setFormData({
        name: state.currentTenant.name || '',
        domain: state.currentTenant.domain || '',
        features: state.currentTenant.features || [],
        branding: state.currentTenant.branding || {
          theme: '',
          colors: { primary: '', secondary: '', accent: '', background: '', text: '' },
          fonts: { primary: '', secondary: '', sizes: {} },
          logo: '',
          favicon: ''
        },
        security: state.currentTenant.security || {
          permissions: [],
          sso: false,
          mfa: false,
          sessionTimeout: 3600,
          ipWhitelist: []
        },
        settings: state.currentTenant.settings || {}
      });
    }
  }, [state.currentTenant]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      security: {
        ...prev.security,
        permissions: prev.security.permissions.includes(permission)
          ? prev.security.permissions.filter(p => p !== permission)
          : [...prev.security.permissions, permission]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Update tenant configuration
      await updateTenantConfig({
        name: formData.name,
        domain: formData.domain,
        features: formData.features,
        branding: formData.branding,
        security: formData.security,
        settings: formData.settings
      });

      onSave?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const availableFeatures = [
    'ai', 'analytics', 'integrations', 'custom_domain', 'sso', 'audit_logs'
  ];

  const availablePermissions = [
    'read', 'write', 'admin', 'user_management', 'tenant_management'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tenant Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
              Domain
            </label>
            <input
              type="text"
              name="domain"
              id="domain"
              value={formData.domain}
              onChange={(e) => handleInputChange('domain', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Features</h3>
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableFeatures.map((feature) => (
            <div key={feature} className="flex items-center">
              <input
                id={`feature-${feature}`}
                name="features"
                type="checkbox"
                checked={formData.features.includes(feature)}
                onChange={() => handleFeatureToggle(feature)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`feature-${feature}`} className="ml-3 text-sm font-medium text-gray-700">
                {feature.replace('_', ' ').toUpperCase()}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Branding */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Branding</h3>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              value={formData.branding.theme}
              onChange={(e) => handleNestedInputChange('branding', 'theme', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select theme</option>
              <option value="default">Default</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
              Logo URL
            </label>
            <input
              type="url"
              name="logo"
              id="logo"
              value={formData.branding.logo}
              onChange={(e) => handleNestedInputChange('branding', 'logo', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="primary-color" className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <input
              type="color"
              name="primary-color"
              id="primary-color"
              value={formData.branding.colors.primary}
              onChange={(e) => handleNestedInputChange('branding', 'colors', { ...formData.branding.colors, primary: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="secondary-color" className="block text-sm font-medium text-gray-700">
              Secondary Color
            </label>
            <input
              type="color"
              name="secondary-color"
              id="secondary-color"
              value={formData.branding.colors.secondary}
              onChange={(e) => handleNestedInputChange('branding', 'colors', { ...formData.branding.colors, secondary: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Security</h3>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div className="flex items-center">
            <input
              id="sso"
              name="sso"
              type="checkbox"
              checked={formData.security.sso}
              onChange={(e) => handleNestedInputChange('security', 'sso', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="sso" className="ml-3 text-sm font-medium text-gray-700">
              Single Sign-On (SSO)
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="mfa"
              name="mfa"
              type="checkbox"
              checked={formData.security.mfa}
              onChange={(e) => handleNestedInputChange('security', 'mfa', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="mfa" className="ml-3 text-sm font-medium text-gray-700">
              Multi-Factor Authentication (MFA)
            </label>
          </div>
          <div>
            <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700">
              Session Timeout (seconds)
            </label>
            <input
              type="number"
              name="session-timeout"
              id="session-timeout"
              value={formData.security.sessionTimeout}
              onChange={(e) => handleNestedInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {availablePermissions.map((permission) => (
              <div key={permission} className="flex items-center">
                <input
                  id={`permission-${permission}`}
                  name="permissions"
                  type="checkbox"
                  checked={formData.security.permissions.includes(permission)}
                  onChange={() => handlePermissionToggle(permission)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`permission-${permission}`} className="ml-3 text-sm font-medium text-gray-700">
                  {permission.replace('_', ' ').toUpperCase()}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </form>
  );
};

export default TenantConfigurationForm;
