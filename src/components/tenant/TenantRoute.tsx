import React from 'react';
import { useTenant } from '../../core/tenancy/TenantProvider';

interface TenantRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

const TenantRoute: React.FC<TenantRouteProps> = ({ children, requiredPermissions = [] }) => {
  const { tenant, hasAllPermissions, loading, error } = useTenant();

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
          <h2 className="text-xl font-semibold">Tenant Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">
          <h2 className="text-xl font-semibold">No Tenant Selected</h2>
          <p>Please select a tenant to continue.</p>
        </div>
      </div>
    );
  }

  if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p>You don't have permission to access this resource.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default TenantRoute;
