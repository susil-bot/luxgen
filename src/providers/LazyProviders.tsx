import React, { ReactNode, Suspense } from 'react';
import { LazyProvider } from '../utils/ProviderComposer';

interface LazyProvidersProps {
  children: ReactNode;
  tenantId?: string;
}

/**
 * Lazy Providers
 * Heavy providers that are loaded on-demand to improve initial load time
 */
export const LazyProviders: React.FC<LazyProvidersProps> = ({ 
  children, 
  tenantId 
}) => {
  return (
    <Suspense fallback={<div>Loading advanced features...</div>}>
      <LazyProvider
        provider={() => import('../contexts/AIChatbotContext').then(m => ({ default: m.AIChatbotProvider }))}
        fallback={<div>Loading AI Chatbot...</div>}
      >
        <LazyProvider
          provider={() => import('../contexts/GroupManagementContext').then(m => ({ default: m.GroupManagementProvider }))}
          fallback={<div>Loading Group Management...</div>}
        >
          {children}
        </LazyProvider>
      </LazyProvider>
    </Suspense>
  );
};

/**
 * Conditional Lazy Provider
 * Only loads when specific conditions are met
 */
export const ConditionalLazyProvider: React.FC<{
  condition: boolean;
  provider: () => Promise<{ default: React.ComponentType<{ children: ReactNode }> }>;
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ condition, provider, children, fallback }) => {
  if (!condition) {
    return <>{children}</>;
  }

  return (
    <LazyProvider provider={provider} fallback={fallback}>
      {children}
    </LazyProvider>
  );
};

export default LazyProviders;
