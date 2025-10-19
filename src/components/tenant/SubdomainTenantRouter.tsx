import React, { useState, useEffect } from 'react';
import { getCurrentTenant, getTenantBySubdomain, TenantConfig } from '../../config/subdomainMapping';
import { TenantLoadingScreen } from './TenantLoadingScreen';
import TenantNotFound from './TenantNotFound';
import { TenantSuspended } from './TenantSuspended';
import { TenantExpired } from './TenantExpired';
import { TenantErrorBoundary } from './TenantErrorBoundary';

interface SubdomainTenantRouterProps {
  children: React.ReactNode;
}

interface TenantState {
  tenant: TenantConfig | null;
  loading: boolean;
  error: string | null;
  status: 'loading' | 'found' | 'not_found' | 'suspended' | 'expired' | 'error';
}

export const SubdomainTenantRouter: React.FC<SubdomainTenantRouterProps> = ({ children }) => {
  const [tenantState, setTenantState] = useState<TenantState>({
    tenant: null,
    loading: true,
    error: null,
    status: 'loading'
  });

  useEffect(() => {
    const identifyTenant = async () => {
      try {
        setTenantState(prev => ({ ...prev, loading: true, error: null }));

        // Get current tenant from subdomain
        const currentTenant = getCurrentTenant();
        
        if (!currentTenant) {
          setTenantState({
            tenant: null,
            loading: false,
            error: 'Tenant not found',
            status: 'not_found'
          });
          return;
        }

        // Simulate tenant validation (replace with actual API call)
        const isValid = await validateTenant(currentTenant);
        
        if (!isValid) {
          setTenantState({
            tenant: currentTenant,
            loading: false,
            error: 'Invalid tenant',
            status: 'suspended'
          });
          return;
        }

        // Apply tenant-specific theme
        applyTenantTheme(currentTenant);

        setTenantState({
          tenant: currentTenant,
          loading: false,
          error: null,
          status: 'found'
        });

      } catch (error) {
        console.error('Tenant identification error:', error);
        setTenantState({
          tenant: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 'error'
        });
      }
    };

    identifyTenant();
  }, []);

  const validateTenant = async (tenant: TenantConfig): Promise<boolean> => {
    // Simulate API call to validate tenant
    // In real implementation, this would call your backend API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate validation logic
        const isValid = tenant.slug === 'luxgen' || tenant.slug === 'demo' || tenant.slug === 'test';
        resolve(isValid);
      }, 1000);
    });
  };

  const applyTenantTheme = (tenant: TenantConfig) => {
    // Apply tenant-specific CSS variables
    document.documentElement.style.setProperty('--primary-color', tenant.theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', tenant.theme.secondaryColor);
    
    // Update page title
    document.title = `${tenant.name} - LuxGen Platform`;
    
    // Update favicon (if needed)
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = tenant.theme.logo;
    }
  };

  const renderContent = () => {
    switch (tenantState.status) {
      case 'loading':
        return <TenantLoadingScreen />;
      
      case 'not_found':
        return <TenantNotFound />;
      
      case 'suspended':
        return <TenantSuspended />;
      
      case 'expired':
        return <TenantExpired />;
      
      case 'error':
        return (
          <TenantErrorBoundary 
            error={tenantState.error || 'Unknown error occurred'}
            onRetry={() => window.location.reload()}
          >
            <div>Error occurred</div>
          </TenantErrorBoundary>
        );
      
      case 'found':
        return (
          <TenantErrorBoundary>
            {children}
          </TenantErrorBoundary>
        );
      
      default:
        return <TenantLoadingScreen />;
    }
  };

  return (
    <div className="subdomain-tenant-router">
      {renderContent()}
    </div>
  );
};

export default SubdomainTenantRouter;
