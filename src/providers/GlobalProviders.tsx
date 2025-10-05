import React, { ReactNode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ProviderComposer } from '../utils/ProviderComposer';

interface GlobalProvidersProps {
  children: ReactNode;
}

/**
 * Global Providers
 * These providers are global and not tenant-specific.
 * They should be at the top level of the app.
 */
export const GlobalProviders: React.FC<GlobalProvidersProps> = ({ children }) => {
  const globalProviders = [
    {
      component: ThemeProvider,
      props: {
        initialTheme: 'default',
        initialDarkMode: false
      }
    },
    {
      component: Router,
      props: {}
    }
  ];

  return (
    <ProviderComposer providers={globalProviders}>
      {children}
    </ProviderComposer>
  );
};

export default GlobalProviders;
