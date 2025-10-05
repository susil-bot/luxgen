import React from 'react';
import { Search, Home, ArrowLeft } from 'lucide-react';

export const TenantNotFound: React.FC = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-8">
          <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-r from-gray-600 to-blue-600 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Workspace Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The workspace you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Go to Homepage</span>
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Check the URL or contact your administrator for access.</p>
        </div>
      </div>
    </div>
  );
};

export default TenantNotFound;
