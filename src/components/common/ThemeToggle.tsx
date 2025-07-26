import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = "",
  size = 'md'
}) => {
  const { isDarkMode, setDarkMode } = useTheme();

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <button
      onClick={() => setDarkMode(!isDarkMode)}
      className={`${sizeClasses[size]} text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${className}`}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? (
        <Sun size={iconSizes[size]} />
      ) : (
        <Moon size={iconSizes[size]} />
      )}
    </button>
  );
};

export default ThemeToggle; 