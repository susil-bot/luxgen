import React, { ReactNode } from 'react';
import { GlobalProviders } from '../providers/GlobalProviders';
import { TenantRouter } from '../components/tenant/TenantRouter';
import { TenantScopedProviders } from '../providers/TenantScopedProviders';
import { LazyProviders } from '../providers/LazyProviders';

interface AppComposerProps {
  children: ReactNode;
}

/**
 * App Composer - Single Level Composition
 */
export const AppComposer: React.FC<AppComposerProps> = ({ children }) => {
  return (
    <GlobalProviders>
      <TenantRouter>
        <TenantScopedProviders>
          <LazyProviders>
            {children}
          </LazyProviders>
        </TenantScopedProviders>
      </TenantRouter>
    </GlobalProviders>
  );
};

/**
 * Modular App Structure
 * Each module is independent and can be composed without nesting
 */
export const ModularApp: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="App">
      <AppComposer>
        {children}
      </AppComposer>
    </div>
  );
};

export default AppComposer;
