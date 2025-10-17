import React, { ComponentType, ReactNode } from 'react';

/**
 * Provider Composer Utility
 * Composes multiple providers into a single component to reduce nesting
 * and improve performance by minimizing re-renders
 */

interface ProviderConfig {
  component: ComponentType<{ children: ReactNode }>;
  props?: Record<string, any>;
  condition?: () => boolean;
}

interface ProviderComposerProps {
  providers: ProviderConfig[];
  children: ReactNode;
}

/**
 * Provider Composer Component
 * Reduces provider nesting and improves performance
 */
export const ProviderComposer: React.FC<ProviderComposerProps> = ({ 
  providers, 
  children 
}) => {
  const result = providers.reduceRight(
    (acc: ReactNode, { component: Component, props = {}, condition }: ProviderConfig) => {
      // Skip provider if condition is false
      if (condition && !condition()) {
        return acc;
      }
      
      return <Component {...props}>{acc}</Component>;
    },
    children
  );
  
  // Ensure we always return a valid React element
  return result as React.ReactElement;
};

/**
 * Hook to create a provider composer with specific providers
 */
export const useProviderComposer = (providers: ProviderConfig[]) => {
  return (children: ReactNode) => (
    <ProviderComposer providers={providers}>
      {children}
    </ProviderComposer>
  );
};

/**
 * Higher-order component to wrap components with providers
 */
export const withProviders = (
  providers: ProviderConfig[]
) => <P extends object>(Component: ComponentType<P>) => {
  const WrappedComponent: React.FC<P> = (props) => (
    <ProviderComposer providers={providers}>
      <Component {...props} />
    </ProviderComposer>
  );
  
  WrappedComponent.displayName = `withProviders(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

/**
 * Conditional provider wrapper
 */
export const ConditionalProvider: React.FC<{
  condition: boolean;
  provider: ComponentType<{ children: ReactNode }>;
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ condition, provider: Provider, children, fallback = children }) => {
  if (!condition) {
    return <>{fallback}</>;
  }
  
  return <Provider>{children}</Provider>;
};

/**
 * Lazy provider wrapper for code splitting
 */
export const LazyProvider: React.FC<{
  provider: () => Promise<{ default: ComponentType<{ children: ReactNode }> }>;
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ provider, children, fallback }) => {
  const LazyComponent = React.lazy(provider);
  
  return (
    <React.Suspense fallback={fallback || <div>Loading...</div>}>
      <LazyComponent>{children}</LazyComponent>
    </React.Suspense>
  );
};

export default ProviderComposer;
