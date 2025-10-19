/**
 * Environment Configuration
 * Centralized configuration for different environments
 */

export interface EnvironmentConfig {
  apiUrl: string;
  debug: boolean;
  logging: 'verbose' | 'info' | 'warn' | 'error';
  features: {
    analytics: boolean;
    monitoring: boolean;
    errorReporting: boolean;
  };
  performance: {
    enableCodeSplitting: boolean;
    enableLazyLoading: boolean;
    enableCaching: boolean;
  };
}

export const environments: Record<string, EnvironmentConfig> = {
  development: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    debug: true,
    logging: 'verbose',
    features: {
      analytics: false,
      monitoring: false,
      errorReporting: false,
    },
    performance: {
      enableCodeSplitting: false,
      enableLazyLoading: false,
      enableCaching: false,
    },
  },
  staging: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://staging-api.luxgen.com',
    debug: true,
    logging: 'info',
    features: {
      analytics: true,
      monitoring: true,
      errorReporting: true,
    },
    performance: {
      enableCodeSplitting: true,
      enableLazyLoading: true,
      enableCaching: true,
    },
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://luxgen-backend.netlify.app',
    debug: false,
    logging: 'error',
    features: {
      analytics: true,
      monitoring: true,
      errorReporting: true,
    },
    performance: {
      enableCodeSplitting: true,
      enableLazyLoading: true,
      enableCaching: true,
    },
  },
};

/**
 * Get current environment configuration
 */
export const getCurrentEnvironment = (): EnvironmentConfig => {
  const env = process.env.NODE_ENV || 'development';
  return environments[env] || environments.development;
};

/**
 * Environment utilities
 */
export const isDevelopment = (): boolean => process.env.NODE_ENV === 'development';
export const isStaging = (): boolean => process.env.REACT_APP_ENVIRONMENT === 'staging';
export const isProduction = (): boolean => process.env.NODE_ENV === 'production';

/**
 * Feature flags
 */
export const isFeatureEnabled = (feature: keyof EnvironmentConfig['features']): boolean => {
  const config = getCurrentEnvironment();
  return config.features[feature];
};

/**
 * Performance settings
 */
export const getPerformanceSettings = () => {
  const config = getCurrentEnvironment();
  return config.performance;
};
