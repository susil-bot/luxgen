import React, { ReactNode } from 'react';
import { TenantScopedProviders } from '../../providers/TenantScopedProviders';

interface TenantAppWrapperProps {
  children: ReactNode;
}

export const TenantAppWrapper: React.FC<TenantAppWrapperProps> = ({ children }) => {
  return (
    <TenantScopedProviders>
      {children}
    </TenantScopedProviders>
  );
};

export default TenantAppWrapper;
