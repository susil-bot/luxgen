import React from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

interface TenantNotFoundProps {
  tenantSlug?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

const TenantNotFound: React.FC<TenantNotFoundProps> = ({ 
  tenantSlug, 
  onRetry, 
  onGoHome 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Tenant Not Found
          </h1>
          <p className="text-gray-600">
            {tenantSlug 
              ? `The tenant "${tenantSlug}" could not be found.`
              : 'The requested tenant could not be found.'
            }
          </p>
        </div>

        <div className="space-y-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          )}

          {onGoHome && (
            <button
              onClick={onGoHome}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </button>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default TenantNotFound;
