import React from 'react';
import { useTenant } from '../core/tenancy/TenantProvider';

const SettingsPage: React.FC = () => {
  const { tenant, user, loading, error } = useTenant();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          <h2 className="text-xl font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure your application settings and preferences.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-600">General settings configuration goes here</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-600">Security settings configuration goes here</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-600">Notification settings configuration goes here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
