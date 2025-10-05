import React, { ReactNode } from 'react';

interface TenantErrorBoundaryProps {
  children?: ReactNode;
  error?: string;
  onRetry?: () => void;
}

export const TenantErrorBoundary: React.FC<TenantErrorBoundaryProps> = ({ 
  children, 
  error, 
  onRetry 
}) => {
  if (error) {
    return (
      <div className="tenant-error-boundary" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#fef2f2',
        padding: '20px'
      }}>
        <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>Something went wrong</h2>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>{error}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default TenantErrorBoundary;
