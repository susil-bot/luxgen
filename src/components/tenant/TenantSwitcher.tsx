import React, { useState, useEffect } from 'react';
import { useTenant } from '../../workflow/hooks/useTenant';
import { tenantService } from '../../services/TenantService';
import { ChevronDown, Globe, Building, Users, Settings } from 'lucide-react';

interface TenantSwitcherProps {
  className?: string;
}

/**
 * Tenant Switcher Component
 * Allows users to switch between different tenants
 * Demonstrates multi-tenancy functionality
 */
export const TenantSwitcher: React.FC<TenantSwitcherProps> = ({ className = '' }) => {
  const { currentTenant, switchTenant } = useTenant();
  const [isOpen, setIsOpen] = useState(false);
  const [availableTenants, setAvailableTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailableTenants();
  }, []);

  const loadAvailableTenants = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from API
    //@TODO   use real data from the API instead of hardcoded data
      const tenants = [
        {
          id: 'luxgen',
          name: 'LuxGen Corporation',
          slug: 'luxgen',
          domain: 'luxgen.com',
          logo: '/logos/luxgen.png',
          description: 'Main corporate tenant',
          features: ['ai-chatbot', 'group-management', 'analytics'],
          status: 'active'
        },
        {
          id: 'test',
          name: 'Test Company',
          slug: 'test',
          domain: 'test.luxgen.com',
          logo: '/logos/test.png',
          description: 'Testing and development tenant',
          features: ['ai-chatbot', 'analytics'],
          status: 'active'
        },
        {
          id: 'demo',
          name: 'Demo Organization',
          slug: 'demo',
          domain: 'demo.luxgen.com',
          logo: '/logos/demo.png',
          description: 'Demo and showcase tenant',
          features: ['analytics'],
          status: 'active'
        }
      ];
      setAvailableTenants(tenants);
    } catch (error) {
      console.error('Error loading tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTenantSwitch = async (tenant: any) => {
    try {
      await switchTenant(tenant);
      setIsOpen(false);
      
      // Show success message
      console.log(`Switched to ${tenant.name}`);
    } catch (error) {
      console.error('Error switching tenant:', error);
    }
  };

  const getCurrentUrl = () => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    
    if (hostname.includes('localhost')) {
      return `${protocol}//${hostname}${port ? ':' + port : ''}`;
    }
    
    return `${protocol}//${hostname}`;
  };

  const generateTenantUrl = (tenant: any) => {
    const baseUrl = getCurrentUrl();
    
    if (hostname.includes('localhost')) {
      // Development: Use path-based routing
      return `${baseUrl}/tenant/${tenant.slug}`;
    } else {
      // Production: Use subdomain routing
      return `${protocol}//${tenant.slug}.${hostname.replace(/^[^.]+\./, '')}`;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Building className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {currentTenant?.name || 'Select Tenant'}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Switch Tenant
            </h3>
            
            <div className="space-y-2">
              {availableTenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => handleTenantSwitch(tenant)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    currentTenant?.id === tenant.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {tenant.name}
                      </p>
                      {tenant.status === 'active' && (
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {tenant.description}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Globe className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {generateTenantUrl(tenant)}
                      </span>
                    </div>
                  </div>
                  
                  {currentTenant?.id === tenant.id && (
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p className="mb-1">Current URL: {window.location.href}</p>
                <p>Tenant: {currentTenant?.slug || 'None'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantSwitcher;
