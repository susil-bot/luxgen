import React, { Suspense, ReactNode } from 'react';

interface LazyProvidersProps {
  children: ReactNode;
}

export const LazyProviders: React.FC<LazyProvidersProps> = ({ children }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
};

export default LazyProviders;
