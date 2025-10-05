import React, { ReactNode } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { OnboardingProvider } from '../contexts/OnboardingContext';
import { AIChatbotProvider } from '../contexts/AIChatbotContext';
import { GroupManagementProvider } from '../contexts/GroupManagementContext';
import { MultiTenancyProvider } from '../contexts/MultiTenancyContext';

interface TenantScopedProvidersProps {
  children: ReactNode;
  tenantId?: string;
  features?: {
    analytics: boolean;
    notifications: boolean;
    chat: boolean;
    reports: boolean;
  };
}

export const TenantScopedProviders: React.FC<TenantScopedProvidersProps> = ({ 
  children, 
  tenantId,
  features 
}) => {
  return (
    <MultiTenancyProvider>
      <AuthProvider>
        <OnboardingProvider>
          {features?.chat && (
            <AIChatbotProvider>
              {children}
            </AIChatbotProvider>
          )}
          {features?.reports && (
            <GroupManagementProvider>
              {children}
            </GroupManagementProvider>
          )}
          {!features?.chat && !features?.reports && children}
        </OnboardingProvider>
      </AuthProvider>
    </MultiTenancyProvider>
  );
};

export default TenantScopedProviders;
