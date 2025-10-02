import React from 'react';

interface LuxgenLogoProps {
  size?: 'small' | 'medium' | 'large' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  style?: React.CSSProperties;
}

const LuxgenLogo: React.FC<LuxgenLogoProps> = ({ 
  size = 'medium', 
  variant = 'full',
  className = '',
  style = {}
}) => {
  const sizeMap = {
    small: { width: 120, height: 36 },
    medium: { width: 160, height: 48 },
    large: { width: 200, height: 60 },
    xl: { width: 240, height: 72 }
  };

  const dimensions = sizeMap[size];

  const renderIcon = () => (
    <g transform="translate(15, 15)">
      {/* Outer circle */}
      <circle cx="15" cy="15" r="12" fill="none" stroke="#FF6B35" strokeWidth="2"/>
      {/* Four-pointed star */}
      <g transform="translate(15, 15)">
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
        <line x1="-8" y1="0" x2="8" y2="0" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
      </g>
    </g>
  );

  const renderText = () => (
    <text 
      x="10" 
      y="40" 
      fontFamily="Arial, sans-serif" 
      fontSize="32" 
      fontWeight="bold" 
      fill="#FF6B35"
    >
      Luxgen
    </text>
  );

  const renderPeriod = () => (
    <circle cx="190" cy="35" r="2" fill="#FF6B35"/>
  );

  if (variant === 'icon') {
    return (
      <svg 
        width={dimensions.width} 
        height={dimensions.height} 
        viewBox="0 0 200 60" 
        className={className}
        style={style}
      >
        <rect width="200" height="60" fill="#000000"/>
        {renderIcon()}
      </svg>
    );
  }

  if (variant === 'text') {
    return (
      <svg 
        width={dimensions.width} 
        height={dimensions.height} 
        viewBox="0 0 200 60" 
        className={className}
        style={style}
      >
        <rect width="200" height="60" fill="#000000"/>
        {renderText()}
        {renderPeriod()}
      </svg>
    );
  }

  // Full logo (default)
  return (
    <svg 
      width={dimensions.width} 
      height={dimensions.height} 
      viewBox="0 0 200 60" 
      className={className}
      style={style}
    >
      <rect width="200" height="60" fill="#000000"/>
      {renderText()}
      {renderIcon()}
      {renderPeriod()}
    </svg>
  );
};

export default LuxgenLogo;
