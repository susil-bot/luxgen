import React, { ReactNode } from 'react';
import { useTheme, useThemeStyles, useResponsive } from '../../contexts/ThemeContext';

// Simple Theme-aware Button Component
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  type = 'button',
}) => {
  const { theme } = useTheme();
  const { getColor } = useThemeStyles();

  const getVariantStyles = () => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: theme.typography.fontWeight.medium,
      borderRadius: theme.spacing.button.borderRadius[size],
      transition: theme.transitions.button,
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: 'none',
      outline: 'none',
      textDecoration: 'none',
      boxShadow: theme.shadows.button,
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.6 : 1,
      padding: theme.spacing.button.padding[size],
      fontSize: theme.typography.fontSize.base,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: getColor('primary', '500'),
          color: getColor('text', 'inverse'),
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: getColor('secondary', '100'),
          color: getColor('text', 'primary'),
          border: `1px solid ${getColor('border', 'primary')}`,
        };
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: getColor('success', '500'),
          color: getColor('text', 'inverse'),
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: getColor('warning', '500'),
          color: getColor('text', 'inverse'),
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: getColor('error', '500'),
          color: getColor('text', 'inverse'),
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: getColor('text', 'primary'),
        };
      default:
        return baseStyles;
    }
  };

  const styles = getVariantStyles();

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      style={styles}
    >
      {loading && (
        <div
          style={{
            width: '1rem',
            height: '1rem',
            border: `2px solid ${getColor('background', 'primary')}`,
            borderTop: `2px solid ${getColor('primary', '500')}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: theme.spacing.sm,
          }}
        />
      )}
      {children}
    </button>
  );
};

// Simple Theme-aware Card Component
interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  padding = 'md',
  className = '',
  onClick,
}) => {
  const { theme } = useTheme();
  const { getColor } = useThemeStyles();

  const getVariantStyles = () => {
    const baseStyles = {
      backgroundColor: getColor('background', 'card'),
      borderRadius: theme.spacing.card.borderRadius[size],
      transition: theme.transitions.card,
      cursor: onClick ? 'pointer' : 'default',
      padding: padding === 'none' ? '0' : theme.spacing.card.padding[padding],
      fontSize: theme.typography.fontSize.base,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          boxShadow: theme.shadows.lg,
        };
      case 'outlined':
        return {
          ...baseStyles,
          border: `1px solid ${getColor('border', 'primary')}`,
        };
      default:
        return {
          ...baseStyles,
          boxShadow: theme.shadows.card,
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={className}
      style={styles}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Simple Theme-aware Text Component
interface TextProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption';
  color?: 'primary' | 'secondary' | 'muted' | 'inverse' | 'success' | 'warning' | 'error';
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color = 'primary',
  weight = 'normal',
  align = 'left',
  className = '',
}) => {
  const { theme } = useTheme();
  const { getColor, getFontSize, getFontWeight } = useThemeStyles();

  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: theme.typography.fontSize['4xl'],
          fontWeight: theme.typography.fontWeight.bold,
          lineHeight: theme.typography.lineHeight.tight,
        };
      case 'h2':
        return {
          fontSize: theme.typography.fontSize['3xl'],
          fontWeight: theme.typography.fontWeight.bold,
          lineHeight: theme.typography.lineHeight.tight,
        };
      case 'h3':
        return {
          fontSize: theme.typography.fontSize['2xl'],
          fontWeight: theme.typography.fontWeight.semibold,
          lineHeight: theme.typography.lineHeight.snug,
        };
      case 'h4':
        return {
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.semibold,
          lineHeight: theme.typography.lineHeight.snug,
        };
      case 'h5':
        return {
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.medium,
          lineHeight: theme.typography.lineHeight.normal,
        };
      case 'h6':
        return {
          fontSize: theme.typography.fontSize.base,
          fontWeight: theme.typography.fontWeight.medium,
          lineHeight: theme.typography.lineHeight.normal,
        };
      case 'body':
        return {
          fontSize: theme.typography.fontSize.base,
          fontWeight: theme.typography.fontWeight.normal,
          lineHeight: theme.typography.lineHeight.normal,
        };
      case 'caption':
        return {
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.normal,
          lineHeight: theme.typography.lineHeight.normal,
        };
      default:
        return {
          fontSize: theme.typography.fontSize.base,
          fontWeight: theme.typography.fontWeight.normal,
          lineHeight: theme.typography.lineHeight.normal,
        };
    }
  };

  const getColorValue = () => {
    switch (color) {
      case 'primary': return getColor('text', 'primary');
      case 'secondary': return getColor('text', 'secondary');
      case 'muted': return getColor('text', 'muted');
      case 'inverse': return getColor('text', 'inverse');
      case 'success': return getColor('success', '600');
      case 'warning': return getColor('warning', '600');
      case 'error': return getColor('error', '600');
      default: return getColor('text', 'primary');
    }
  };

  const styles = {
    ...getVariantStyles(),
    color: getColorValue(),
    textAlign: align,
    margin: 0,
    padding: 0,
  };

  const Tag = variant.startsWith('h') ? variant : 'span';

  return (
    <Tag className={className} style={styles}>
      {children}
    </Tag>
  );
};

// Simple Theme-aware Container Component
interface ContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = 'md',
  center = true,
  className = '',
}) => {
  const { theme } = useTheme();

  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'sm': return '640px';
      case 'md': return '768px';
      case 'lg': return '1024px';
      case 'xl': return '1280px';
      case '2xl': return '1536px';
      case 'full': return '100%';
      default: return '1024px';
    }
  };

  const getPadding = () => {
    switch (padding) {
      case 'none': return '0';
      case 'sm': return theme.spacing.sm;
      case 'md': return theme.spacing.md;
      case 'lg': return theme.spacing.lg;
      case 'xl': return theme.spacing.xl;
      default: return theme.spacing.md;
    }
  };

  const styles = {
    maxWidth: getMaxWidth(),
    margin: center ? '0 auto' : '0',
    padding: getPadding(),
    width: '100%',
  };

  return (
    <div className={className} style={styles}>
      {children}
    </div>
  );
};

export default {
  Button,
  Card,
  Text,
  Container,
}; 