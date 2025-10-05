import React, { ReactNode } from 'react';
import { TenantScopedProviders } from '../../providers/TenantScopedProviders';
import { LazyProviders } from '../../providers/LazyProviders';

interface TenantAppWrapperProps {
  children: ReactNode;
}

/**
 * Tenant App Wrapper
 * Combines tenant-scoped providers and lazy providers into a single component
 * Eliminates nesting by composing at the same level
 */
export const TenantAppWrapper: React.FC<TenantAppWrapperProps> = ({ children }) => {
  return (
    <TenantScopedProviders>
      <LazyProviders>
        {children}
      </LazyProviders>
    </TenantScopedProviders>
  );
};

export default TenantAppWrapper;
