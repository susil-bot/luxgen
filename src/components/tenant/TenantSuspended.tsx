import React from 'react';
import { Shield, Mail, Phone } from 'lucide-react';

interface TenantSuspendedProps {
  tenant?: any;
}

export const TenantSuspended: React.FC<TenantSuspendedProps> = ({ tenant }) => {
  const handleContactSupport = () => {
    window.location.href = 'mailto:support@luxgen.com?subject=Account Suspension Inquiry';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-8">
          <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Workspace Suspended
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {tenant?.name || 'This workspace'} has been temporarily suspended. 
            Please contact support for more information.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleContactSupport}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>Contact Support</span>
          </button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>Call: +1 (555) 123-4567</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantSuspended;
