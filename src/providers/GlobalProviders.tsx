import React, { ReactNode } from 'react';

interface GlobalProvidersProps {
  children: ReactNode;
}

export const GlobalProviders: React.FC<GlobalProvidersProps> = ({ children }) => {
  return <>{children}</>;
};

export default GlobalProviders;
