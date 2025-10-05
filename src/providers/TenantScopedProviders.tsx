import React, { ReactNode, useMemo } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { OnboardingProvider } from '../contexts/OnboardingContext';
import { AIChatbotProvider } from '../contexts/AIChatbotContext';
import { GroupManagementProvider } from '../contexts/GroupManagementContext';
import { NotificationProvider } from '../components/common/NotificationSystem';
import { useTenant } from '../workflow/hooks/useTenant';
import { ProviderComposer } from '../utils/ProviderComposer';

interface TenantScopedProvidersProps {
  children: ReactNode;
}

/**
 * Tenant-Scoped Providers
 * These providers are scoped to the current tenant and only render
 * when a valid tenant is identified. This ensures proper tenant isolation.
 */
export const TenantScopedProviders: React.FC<TenantScopedProvidersProps> = ({ 
  children 
}) => {
  const { currentTenant } = useTenant();

  // Memoize providers to prevent unnecessary re-renders
  const tenantProviders = useMemo(() => [
    {
      component: AuthProvider,
      props: { tenantId: currentTenant?.id }
    },
    {
      component: OnboardingProvider,
      props: { tenantId: currentTenant?.id }
    },
    {
      component: NotificationProvider,
      props: { tenantId: currentTenant?.id }
    },
    {
      component: AIChatbotProvider,
      props: { 
        tenantId: currentTenant?.id,
        enabled: currentTenant?.features?.aiChatbot || false
      },
      condition: () => currentTenant?.features?.aiChatbot || false
    },
    {
      component: GroupManagementProvider,
      props: { 
        tenantId: currentTenant?.id,
        enabled: currentTenant?.features?.groupManagement || false
      },
      condition: () => currentTenant?.features?.groupManagement || false
    }
  ], [currentTenant?.id, currentTenant?.features]);

  return (
    <ProviderComposer providers={tenantProviders}>
      {children}
    </ProviderComposer>
  );
};

export default TenantScopedProviders;
