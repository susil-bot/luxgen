import React, { useState, useEffect, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { TenantProvider } from '../../core/tenancy/TenantProvider';
import { TenantLoadingScreen } from './TenantLoadingScreen';
import { TenantErrorBoundary } from './TenantErrorBoundary';
import { TenantNotFound } from './TenantNotFound';
import { TenantSuspended } from './TenantSuspended';
import { TenantExpired } from './TenantExpired';
import { getCurrentTenant } from '../../config/subdomainMapping';

interface TenantRouterProps {
  children: React.ReactNode;
}

type TenantState = {
  status: 'loading' | 'identified' | 'not_found' | 'suspended' | 'expired' | 'error';
  tenant?: any;
  error?: string;
};

export const TenantRouter: React.FC<TenantRouterProps> = ({ children }) => {
  const [tenantState, setTenantState] = useState<TenantState>({ status: 'loading' });
  const location = useLocation();

  useEffect(() => {
    initializeTenant();
  }, [location]);

  const initializeTenant = async () => {
    try {
      setTenantState({ status: 'loading' });

      // Get current tenant from subdomain/URL
      const currentTenant = getCurrentTenant();
      
      if (!currentTenant) {
        setTenantState({ status: 'not_found' });
        return;
      }

      // Simulate tenant validation
      const isValid = await validateTenant(currentTenant);
      
      if (!isValid) {
        setTenantState({ status: 'suspended' });
        return;
      }

      // Apply tenant theme
      applyTenantTheme(currentTenant);

      setTenantState({ 
        status: 'identified', 
        tenant: currentTenant 
      });

    } catch (error) {
      console.error('Tenant initialization error:', error);
      setTenantState({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const validateTenant = async (tenant: any): Promise<boolean> => {
    // Simulate API call to validate tenant
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = tenant.slug === 'luxgen' || tenant.slug === 'demo' || tenant.slug === 'test';
        resolve(isValid);
      }, 1000);
    });
  };

  const applyTenantTheme = (tenant: any) => {
    document.documentElement.style.setProperty('--primary-color', tenant.theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', tenant.theme.secondaryColor);
    document.title = `${tenant.name} - LuxGen Platform`;
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
            error={tenantState.error} 
            onRetry={initializeTenant}
          >
            <div>Error occurred</div>
          </TenantErrorBoundary>
        );
      
      case 'identified':
        return (
          <TenantProvider>
            <Suspense fallback={<TenantLoadingScreen />}>
              <TenantErrorBoundary>
                {children}
              </TenantErrorBoundary>
            </Suspense>
          </TenantProvider>
        );
      
      default:
        return <TenantLoadingScreen />;
    }
  };

  return (
    <div className="tenant-router">
      {renderContent()}
    </div>
  );
};

export default TenantRouter;
