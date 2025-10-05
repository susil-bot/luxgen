import React, { useState } from 'react';
import { useTenant } from '../../workflow/hooks/useTenant';
import { Globe, Building, Users, Settings, ArrowRight, Copy, Check } from 'lucide-react';

/**
 * Tenant Demo Component
 * Demonstrates multi-tenancy functionality with examples
 */
export const TenantDemo: React.FC = () => {
  const { currentTenant } = useTenant();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const tenantExamples = [
    {
      id: 'luxgen',
      name: 'LuxGen Corporation',
      slug: 'luxgen',
      domain: 'luxgen.com',
      description: 'Main corporate tenant with full features',
      features: ['AI Chatbot', 'Group Management', 'Analytics', 'Advanced Reporting'],
      branding: 'Corporate Blue Theme',
      users: 'Corporate Employees',
      url: 'https://luxgen.com',
      devUrl: 'http://localhost:3000/tenant/luxgen'
    },
    {
      id: 'test',
      name: 'Test Company',
      slug: 'test',
      domain: 'test.luxgen.com',
      description: 'Testing and development tenant',
      features: ['AI Chatbot', 'Analytics'],
      branding: 'Test Green Theme',
      users: 'Test Users & Developers',
      url: 'https://test.luxgen.com',
      devUrl: 'http://localhost:3000/tenant/test'
    },
    {
      id: 'demo',
      name: 'Demo Organization',
      slug: 'demo',
      domain: 'demo.luxgen.com',
      description: 'Demo and showcase tenant',
      features: ['Analytics'],
      branding: 'Demo Purple Theme',
      users: 'Demo Users',
      url: 'https://demo.luxgen.com',
      devUrl: 'http://localhost:3000/tenant/demo'
    }
  ];

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(type);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const switchToTenant = (tenant: any) => {
    if (window.location.hostname.includes('localhost')) {
      window.location.href = tenant.devUrl;
    } else {
      window.location.href = tenant.url;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Multi-Tenancy Frontend Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Demonstrates how the frontend handles multiple tenants with different URLs, features, and configurations.
        </p>
      </div>

      {/* Current Tenant Status */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Building className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Current Tenant
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tenant Name</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {currentTenant?.name || 'Not identified'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current URL</p>
            <p className="font-medium text-gray-900 dark:text-white font-mono text-sm">
              {window.location.href}
            </p>
          </div>
        </div>
      </div>

      {/* Tenant Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tenantExamples.map((tenant) => (
          <div key={tenant.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {tenant.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tenant.description}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Features</p>
                <div className="flex flex-wrap gap-1">
                  {tenant.features.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branding</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tenant.branding}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Users</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tenant.users}</p>
              </div>
            </div>

            {/* URLs */}
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Production URL</p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-sm rounded border">
                    {tenant.url}
                  </code>
                  <button
                    onClick={() => copyToClipboard(tenant.url, `prod-${tenant.id}`)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    {copiedUrl === `prod-${tenant.id}` ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Development URL</p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-sm rounded border">
                    {tenant.devUrl}
                  </code>
                  <button
                    onClick={() => copyToClipboard(tenant.devUrl, `dev-${tenant.id}`)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    {copiedUrl === `dev-${tenant.id}` ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Switch Button */}
            <button
              onClick={() => switchToTenant(tenant)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>Switch to {tenant.name}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          How Multi-Tenancy Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">1. Tenant Identification</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Subdomain: test.luxgen.com → 'test' tenant</li>
              <li>• Domain: company.com → lookup tenant</li>
              <li>• Path: /tenant/slug → 'slug' tenant</li>
              <li>• localStorage: development fallback</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">2. Tenant Isolation</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Separate user data per tenant</li>
              <li>• Isolated API endpoints</li>
              <li>• Tenant-specific features</li>
              <li>• Custom branding and themes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDemo;
