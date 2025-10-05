import React, { ReactNode } from 'react';
import { TenantRouter } from '../components/tenant/TenantRouter';

interface AppComposerProps {
  children: ReactNode;
}

export const AppComposer: React.FC<AppComposerProps> = ({ children }) => {
  return (
    <TenantRouter>
      {children}
    </TenantRouter>
  );
};

export default AppComposer;
