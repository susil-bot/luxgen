import React, { useState, useEffect } from 'react';
import { useTenant } from '../../core/tenancy/TenantProvider';
import { useTenantFeatures, useTenantBranding, useTenantLimits, useTenantSecurity, useTenantAnalytics, useTenantHealth } from '../../hooks/useTenantManagement';
import { TenantHealth, TenantAnalytics } from '../../types/tenant';

const TenantDashboard: React.FC = () => {
  const { tenant, loading, error } = useTenant();
  const { features } = useTenantFeatures();
  const { branding } = useTenantBranding();
  const { limits, usage, getRemainingLimit, isLimitExceeded } = useTenantLimits();
  const { security } = useTenantSecurity();
  const { analytics } = useTenantAnalytics();
  const { health } = useTenantHealth();

  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {tenant?.name || 'Tenant Dashboard'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your tenant configuration and settings
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'features', name: 'Features' },
              { id: 'branding', name: 'Branding' },
              { id: 'limits', name: 'Limits' },
              { id: 'security', name: 'Security' },
              { id: 'analytics', name: 'Analytics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && <OverviewTab health={health} analytics={analytics} />}
          {activeTab === 'features' && <FeaturesTab features={features} />}
          {activeTab === 'branding' && <BrandingTab branding={branding} />}
          {activeTab === 'limits' && <LimitsTab limits={limits} usage={usage} getRemainingLimit={getRemainingLimit} isLimitExceeded={isLimitExceeded} />}
          {activeTab === 'security' && <SecurityTab security={security} />}
          {activeTab === 'analytics' && <AnalyticsTab analytics={analytics} />}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ health: TenantHealth | null; analytics: TenantAnalytics | null }> = ({ health, analytics }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">H</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Health Status</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {health?.status === 'healthy' ? 'Healthy' : 'Unhealthy'}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">F</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Features</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {analytics?.features || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">S</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Settings</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {analytics?.settings || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Features Tab Component
const FeaturesTab: React.FC<{ features: any }> = ({ features }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Tenant Features</h3>
        <div className="mt-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features?.enabled?.map((feature: string) => (
              <div key={feature} className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {feature.replace('_', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Branding Tab Component
const BrandingTab: React.FC<{ branding: any }> = ({ branding }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Tenant Branding</h3>
        <div className="mt-5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Theme</dt>
              <dd className="mt-1 text-sm text-gray-900">{branding?.theme || 'Default'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Primary Color</dt>
              <dd className="mt-1 text-sm text-gray-900">{branding?.colors?.primary || 'Not set'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Secondary Color</dt>
              <dd className="mt-1 text-sm text-gray-900">{branding?.colors?.secondary || 'Not set'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Logo</dt>
              <dd className="mt-1 text-sm text-gray-900">{branding?.logo || 'Not set'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

// Limits Tab Component
const LimitsTab: React.FC<{ limits: any; usage: any; getRemainingLimit: (limit: string) => number | undefined; isLimitExceeded: (limit: string) => boolean }> = ({ limits, usage, getRemainingLimit, isLimitExceeded }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Tenant Limits</h3>
        <div className="mt-5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {Object.entries(limits || {}).map(([key, limit]) => (
              <div key={key}>
                <dt className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {usage?.[key] || 0} / {limit}
                  {isLimitExceeded(key) && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Limit Exceeded
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

// Security Tab Component
const SecurityTab: React.FC<{ security: any }> = ({ security }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Security Settings</h3>
        <div className="mt-5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">SSO</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {security?.sso ? 'Enabled' : 'Disabled'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">MFA</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {security?.mfa ? 'Enabled' : 'Disabled'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Session Timeout</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {security?.sessionTimeout ? `${security.sessionTimeout}s` : 'Not set'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Permissions</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {security?.permissions?.join(', ') || 'Not set'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab: React.FC<{ analytics: TenantAnalytics | null }> = ({ analytics }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Analytics</h3>
        <div className="mt-5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Features</dt>
              <dd className="mt-1 text-sm text-gray-900">{analytics?.features || 0}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Settings</dt>
              <dd className="mt-1 text-sm text-gray-900">{analytics?.settings || 0}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Integrations</dt>
              <dd className="mt-1 text-sm text-gray-900">{analytics?.integrations || 0}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {analytics?.lastUpdated ? new Date(analytics.lastUpdated).toLocaleString() : 'Never'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
