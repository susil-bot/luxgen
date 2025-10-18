import React, { ReactNode } from 'react';

interface ModernCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  interactive?: boolean;
  onClick?: () => void;
}

const ModernCard: React.FC<ModernCardProps> = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  variant = 'default',
  interactive = false,
  onClick
}) => {
  const getVariantClasses = () => {
    const variants = {
      default: 'bg-white border border-gray-200 shadow-sm',
      elevated: 'bg-white border border-gray-200 shadow-lg',
      outlined: 'bg-white border-2 border-gray-300 shadow-none'
    };
    return variants[variant];
  };

  const getInteractiveClasses = () => {
    if (!interactive) return '';
    return 'cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200';
  };

  const baseClasses = `
    rounded-xl p-6
    ${getVariantClasses()}
    ${getInteractiveClasses()}
    ${className}
  `;

  return (
    <div
      className={baseClasses}
      onClick={onClick}
    >
      {/* Header */}
      {(title || subtitle || actions) && (
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="ml-4 flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div>
        {children}
      </div>
    </div>
  );
};

export default ModernCard;
