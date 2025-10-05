import React from 'react';
import { Loader2 } from 'lucide-react';

interface TenantLoadingScreenProps {
  message?: string;
}

export const TenantLoadingScreen: React.FC<TenantLoadingScreenProps> = ({ 
  message = 'Loading your workspace...' 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {message}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we set up your workspace
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span>Identifying tenant</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <span>Loading configuration</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <span>Initializing workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantLoadingScreen;
