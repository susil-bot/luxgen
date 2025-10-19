/**
 * Environment Configuration
 * Centralized environment configuration for LuxGen Frontend
 */

export interface EnvironmentConfig {
  apiUrl: string;
  debug: boolean;
  logging: 'verbose' | 'info' | 'error';
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

// Get environment configuration
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Development configuration
  if (nodeEnv === 'development') {
    return {
      apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:4004',
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
    };
  }
  
  // Staging configuration (using production build)
  if (process.env.REACT_APP_ENVIRONMENT === 'staging') {
    return {
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
    };
  }
  
  // Production configuration
  return {
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
  };
};

// Export current configuration
export const environmentConfig = getEnvironmentConfig();

// Debug logging
if (environmentConfig.debug) {
  console.log('🔧 Environment Configuration:', {
    apiUrl: environmentConfig.apiUrl,
    debug: environmentConfig.debug,
    logging: environmentConfig.logging,
    nodeEnv: process.env.NODE_ENV,
  });
}
