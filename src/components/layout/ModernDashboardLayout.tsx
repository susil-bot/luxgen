import React, { ReactNode } from 'react';
import ModernNavigation from './ModernNavigation';
import ResponsiveContainer from './ResponsiveContainer';

interface ModernDashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

const ModernDashboardLayout: React.FC<ModernDashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
  className = ''
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavigation />
      
      <main className="py-8">
        <ResponsiveContainer maxWidth="7xl" padding="lg">
          {/* Header */}
          {(title || subtitle || actions) && (
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {title && (
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-gray-600 text-lg">
                      {subtitle}
                    </p>
                  )}
                </div>
                {actions && (
                  <div className="mt-4 sm:mt-0">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className={`${className}`}>
            {children}
          </div>
        </ResponsiveContainer>
      </main>
    </div>
  );
};

export default ModernDashboardLayout;
