import React from 'react';
import { Clock, CreditCard, Mail } from 'lucide-react';

interface TenantExpiredProps {
  tenant?: any;
}

export const TenantExpired: React.FC<TenantExpiredProps> = ({ tenant }) => {
  const handleRenewSubscription = () => {
    // Redirect to billing/renewal page
    window.location.href = '/billing/renew';
  };

  const handleContactBilling = () => {
    window.location.href = 'mailto:billing@luxgen.com?subject=Subscription Renewal';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-8">
          <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Subscription Expired
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {tenant?.name || 'This workspace'} subscription has expired. 
            Please renew to continue using the service.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleRenewSubscription}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <CreditCard className="h-4 w-4" />
            <span>Renew Subscription</span>
          </button>
          
          <button
            onClick={handleContactBilling}
            className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>Contact Billing</span>
          </button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Your data is safe and will be restored once you renew.</p>
        </div>
      </div>
    </div>
  );
};

export default TenantExpired;
