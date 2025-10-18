import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ModernButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = ''
}) => {
  const getVariantClasses = () => {
    const variants = {
      primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-transparent shadow-sm',
      secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm',
      success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-transparent shadow-sm',
      warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-transparent shadow-sm',
      error: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-transparent shadow-sm',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent'
    };
    return variants[variant];
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-6 py-4 text-base'
    };
    return sizes[size];
  };

  const getIconSize = () => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };
    return sizes[size];
  };

  const baseClasses = `
    inline-flex items-center justify-center
    border rounded-lg font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${className}
  `;

  const renderIcon = () => {
    if (loading) {
      return <Loader2 className={`${getIconSize()} animate-spin`} />;
    }
    if (icon) {
      return <span className={getIconSize()}>{icon}</span>;
    }
    return null;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          {renderIcon()}
          <span className="ml-2">Loading...</span>
        </>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          {renderIcon()}
          <span className="ml-2">{children}</span>
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          <span className="mr-2">{children}</span>
          {renderIcon()}
        </>
      );
    }

    return children;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
    >
      {renderContent()}
    </button>
  );
};

export default ModernButton;
