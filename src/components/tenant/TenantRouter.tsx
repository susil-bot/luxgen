import React, { useEffect, useState, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { MultiTenancyProvider } from '../../contexts/MultiTenancyContext';
import { TenantLoadingScreen } from './TenantLoadingScreen';
import { TenantErrorBoundary } from './TenantErrorBoundary';
import { TenantNotFound } from './TenantNotFound';
import { TenantSuspended } from './TenantSuspended';
import { TenantExpired } from './TenantExpired';
import { useTenant } from '../../workflow/hooks/useTenant';
import { tenantService } from '../../services/TenantService';

interface TenantRouterProps {
  children: React.ReactNode;
}

/**
 * TenantRouter - Main entry point for tenant-aware routing
 * Handles tenant identification, validation, and routing
 */
export const TenantRouter: React.FC<TenantRouterProps> = ({ children }) => {
  const [tenantState, setTenantState] = useState<{
    status: 'loading' | 'identified' | 'not_found' | 'suspended' | 'expired' | 'error';
    tenant?: any;
    error?: string;
  }>({ status: 'loading' });
  
  const location = useLocation();

  useEffect(() => {
    initializeTenant();
  }, [location.pathname]);

  const initializeTenant = async () => {
    try {
      setTenantState({ status: 'loading' });

      // Extract tenant information from URL
      const tenantInfo = extractTenantFromUrl();
      
      if (!tenantInfo) {
        setTenantState({ status: 'not_found' });
        return;
      }

      // Validate and load tenant
      const tenant = await tenantService.getTenant(tenantInfo);
      
      if (!tenant) {
        setTenantState({ status: 'not_found' });
        return;
      }

      // Check tenant status
      if (tenant.status === 'suspended') {
        setTenantState({ status: 'suspended', tenant });
        return;
      }

      if (tenant.status === 'expired') {
        setTenantState({ status: 'expired', tenant });
        return;
      }

      // Tenant is valid and active
      setTenantState({ status: 'identified', tenant });

    } catch (error) {
      console.error('Tenant initialization error:', error);
      setTenantState({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const extractTenantFromUrl = () => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    // 1. Check subdomain (tenant.luxgen.com)
    if (hostname.includes('.')) {
      const subdomain = hostname.split('.')[0];
      if (subdomain && subdomain !== 'www' && subdomain !== 'app' && subdomain !== 'localhost') {
        return { type: 'subdomain', identifier: subdomain };
      }
    }

    // 2. Check custom domain
    if (hostname !== 'localhost' && !hostname.includes('luxgen.com')) {
      return { type: 'domain', identifier: hostname };
    }

    // 3. Check URL path (/tenant/slug)
    const pathMatch = pathname.match(/^\/tenant\/([^\/]+)/);
    if (pathMatch) {
      return { type: 'path', identifier: pathMatch[1] };
    }

    // 4. Check localStorage for development
    const storedTenant = localStorage.getItem('currentTenant');
    if (storedTenant) {
      return { type: 'stored', identifier: storedTenant };
    }

    return null;
  };

  // Render different states based on tenant status
  switch (tenantState.status) {
    case 'loading':
      return <TenantLoadingScreen />;

    case 'not_found':
      return <TenantNotFound />;

    case 'suspended':
      return <TenantSuspended tenant={tenantState.tenant} />;

    case 'expired':
      return <TenantExpired tenant={tenantState.tenant} />;

    case 'error':
      return (
        <TenantErrorBoundary 
          error={tenantState.error} 
          onRetry={initializeTenant}
        />
      );

    case 'identified':
      return (
        <MultiTenancyProvider tenant={tenantState.tenant}>
          <Suspense fallback={<TenantLoadingScreen />}>
            <TenantErrorBoundary>
              {children}
            </TenantErrorBoundary>
          </Suspense>
        </MultiTenancyProvider>
      );

    default:
      return <TenantLoadingScreen />;
  }
};

export default TenantRouter;
