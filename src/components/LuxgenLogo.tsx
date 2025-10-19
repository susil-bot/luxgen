import React from 'react';

interface LuxgenLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'color';
}

const LuxgenLogo: React.FC<LuxgenLogoProps> = ({ 
  className = '', 
  size = 'md', 
  variant = 'color' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const colorClasses = {
    light: 'text-white',
    dark: 'text-gray-900',
    color: 'text-blue-600'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizeClasses[size]} ${colorClasses[variant]} flex items-center justify-center`}>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-full h-full"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <span className={`ml-2 font-bold ${colorClasses[variant]} ${
        size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl'
      }`}>
        LuxGen
      </span>
    </div>
  );
};

export default LuxgenLogo;
