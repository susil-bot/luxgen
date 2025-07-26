import React from 'react';
import { AlertCircle, X, RefreshCw, ExternalLink, Mail, Lock, User, Phone, Building } from 'lucide-react';
import { formatFormError } from '../../utils/authErrorHandler';

interface ErrorDisplayProps {
  error: any;
  context?: 'login' | 'register' | 'password-reset';
  onDismiss?: () => void;
  onAction?: (action: string) => void;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  context = 'login',
  onDismiss,
  onAction,
  className = ''
}) => {
  if (!error) return null;

  const errorInfo = formatFormError(error, context);
  
  const getSeverityStyles = () => {
    switch (errorInfo.severity) {
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
          icon: 'text-yellow-600 dark:text-yellow-400',
          text: 'text-yellow-800 dark:text-yellow-200',
          title: 'text-yellow-900 dark:text-yellow-100'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          text: 'text-blue-800 dark:text-blue-200',
          title: 'text-blue-900 dark:text-blue-100'
        };
      default: // error
        return {
          container: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          text: 'text-red-800 dark:text-red-200',
          title: 'text-red-900 dark:text-red-100'
        };
    }
  };

  const getFieldIcon = (field?: string) => {
    switch (field) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'password':
        return <Lock className="w-4 h-4" />;
      case 'firstName':
      case 'lastName':
        return <User className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'company':
      case 'tenantDomain':
        return <Building className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleAction = () => {
    if (errorInfo.action && onAction) {
      onAction(errorInfo.action.action);
    }
  };

  const styles = getSeverityStyles();

  return (
    <div className={`border rounded-lg p-4 ${styles.container} ${className}`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {errorInfo.field ? getFieldIcon(errorInfo.field) : <AlertCircle className="w-5 h-5" />}
        </div>
        
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium ${styles.title}`}>
              {errorInfo.severity === 'error' ? 'Error' : 
               errorInfo.severity === 'warning' ? 'Warning' : 'Information'}
            </h3>
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className={`${styles.icon} hover:opacity-75 transition-opacity`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="mt-1">
            <p className={`text-sm ${styles.text}`}>
              {errorInfo.message}
            </p>
            
            {errorInfo.field && (
              <div className="mt-2 flex items-center text-xs text-gray-600 dark:text-gray-400">
                <span className="mr-1">Field:</span>
                <span className="font-medium capitalize">
                  {errorInfo.field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </div>
            )}
          </div>
          
          {errorInfo.action && (
            <div className="mt-3">
              <button
                onClick={handleAction}
                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  errorInfo.severity === 'error' 
                    ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50'
                    : errorInfo.severity === 'warning'
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/50'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
                }`}
              >
                {errorInfo.action.label === 'Retry' && <RefreshCw className="w-3 h-3 mr-1" />}
                {errorInfo.action.label === 'Contact Support' && <ExternalLink className="w-3 h-3 mr-1" />}
                {errorInfo.action.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay; 