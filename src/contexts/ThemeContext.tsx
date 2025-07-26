import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ThemeConfig, 
  defaultTheme, 
  themePresets, 
  createTheme, 
  mergeThemes, 
  generateCSSVariables 
} from '../config/themeConfig';

interface ThemeContextType {
  theme: ThemeConfig;
  currentTheme: string;
  isDarkMode: boolean;
  setTheme: (themeName: string) => void;
  setDarkMode: (isDark: boolean) => void;
  updateTheme: (overrides: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
  getThemePresets: () => Record<string, Partial<ThemeConfig>>;
  generateCSSVars: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: string;
  initialDarkMode?: boolean;
  tenantTheme?: Partial<ThemeConfig>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'default',
  initialDarkMode = false,
  tenantTheme = {}
}) => {
  const [currentTheme, setCurrentTheme] = useState<string>(initialTheme);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(initialDarkMode);
  const [customTheme, setCustomTheme] = useState<Partial<ThemeConfig>>(tenantTheme);

  // Get the base theme based on current theme name
  const getBaseTheme = (): ThemeConfig => {
    if (currentTheme === 'default') {
      return defaultTheme;
    }
    
    const preset = themePresets[currentTheme];
    if (preset) {
      return mergeThemes(defaultTheme, preset);
    }
    
    return defaultTheme;
  };

  // Get the current theme with all overrides applied
  const getCurrentTheme = (): ThemeConfig => {
    const baseTheme = getBaseTheme();
    const mergedTheme = mergeThemes(baseTheme, customTheme);
    
    // Apply dark mode if enabled
    if (isDarkMode) {
      return mergeThemes(mergedTheme, {
        colors: {
          ...mergedTheme.colors,
          background: {
            ...mergedTheme.colors.background,
            primary: '#0f172a',
            secondary: '#1e293b',
            tertiary: '#334155',
            overlay: 'rgba(0, 0, 0, 0.7)',
            modal: '#1e293b',
            card: '#1e293b',
            sidebar: '#0f172a',
            header: '#1e293b',
            footer: '#0f172a',
          },
          text: {
            ...mergedTheme.colors.text,
            primary: '#f8fafc',
            secondary: '#cbd5e1',
            tertiary: '#94a3b8',
            muted: '#64748b',
            inverse: '#0f172a',
            link: '#60a5fa',
            linkHover: '#93c5fd',
          },
          border: {
            ...mergedTheme.colors.border,
            primary: '#334155',
            secondary: '#475569',
            tertiary: '#64748b',
            focus: '#60a5fa',
            error: '#f87171',
            success: '#4ade80',
            warning: '#fbbf24',
          },
        },
      });
    }
    
    return mergedTheme;
  };

  const [theme, setThemeState] = useState<ThemeConfig>(getCurrentTheme());

  // Update theme when dependencies change
  useEffect(() => {
    const newTheme = getCurrentTheme();
    setThemeState(newTheme);
    
    // Generate and apply CSS variables
    const cssVars = generateCSSVariables(newTheme);
    applyCSSVariables(cssVars);
    
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme, isDarkMode, customTheme]);

  // Apply CSS variables to document
  const applyCSSVariables = (cssVars: string) => {
    // Remove existing style tag if it exists
    const existingStyle = document.getElementById('theme-variables');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Create new style tag
    const style = document.createElement('style');
    style.id = 'theme-variables';
    style.textContent = cssVars;
    document.head.appendChild(style);
  };

  // Set theme by name
  const setTheme = (themeName: string) => {
    setCurrentTheme(themeName);
    
    // Save to localStorage
    localStorage.setItem('theme', themeName);
  };

  // Toggle dark mode
  const setDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
    
    // Save to localStorage
    localStorage.setItem('darkMode', isDark.toString());
  };

  // Update theme with custom overrides
  const updateTheme = (overrides: Partial<ThemeConfig>) => {
    setCustomTheme(prev => ({ ...prev, ...overrides }));
    
    // Save to localStorage
    localStorage.setItem('customTheme', JSON.stringify({ ...customTheme, ...overrides }));
  };

  // Reset theme to default
  const resetTheme = () => {
    setCurrentTheme('default');
    setCustomTheme({});
    setIsDarkMode(false);
    
    // Clear localStorage
    localStorage.removeItem('theme');
    localStorage.removeItem('customTheme');
    localStorage.removeItem('darkMode');
  };

  // Get available theme presets
  const getThemePresets = () => {
    return {
      default: { name: 'Default Theme' },
      ...themePresets
    };
  };

  // Generate CSS variables string
  const generateCSSVars = () => {
    return generateCSSVariables(theme);
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedCustomTheme = localStorage.getItem('customTheme');
    
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
    
    if (savedDarkMode) {
      setIsDarkMode(savedDarkMode === 'true');
    }
    
    if (savedCustomTheme) {
      try {
        const parsed = JSON.parse(savedCustomTheme);
        setCustomTheme(parsed);
      } catch (error) {
        console.error('Failed to parse saved custom theme:', error);
      }
    }
  }, []);

  const value: ThemeContextType = {
    theme,
    currentTheme,
    isDarkMode,
    setTheme,
    setDarkMode,
    updateTheme,
    resetTheme,
    getThemePresets,
    generateCSSVars,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for responsive design
export const useResponsive = () => {
  const { theme } = useTheme();
  
  const isMobile = () => window.innerWidth < parseInt(theme.breakpoints.md);
  const isTablet = () => {
    const width = window.innerWidth;
    return width >= parseInt(theme.breakpoints.md) && width < parseInt(theme.breakpoints.lg);
  };
  const isDesktop = () => window.innerWidth >= parseInt(theme.breakpoints.lg);
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    breakpoints: theme.breakpoints,
  };
};

// Hook for theme-aware styling
export const useThemeStyles = () => {
  const { theme } = useTheme();
  
  return {
    // Color utilities
    colors: theme.colors,
    getColor: (category: keyof typeof theme.colors, shade?: string) => {
      const colorCategory = theme.colors[category];
      if (typeof colorCategory === 'object' && shade) {
        return (colorCategory as any)[shade] || colorCategory;
      }
      return colorCategory;
    },
    
    // Spacing utilities
    spacing: theme.spacing,
    getSpacing: (size: keyof typeof theme.spacing) => theme.spacing[size],
    
    // Typography utilities
    typography: theme.typography,
    getFontSize: (size: keyof typeof theme.typography.fontSize) => theme.typography.fontSize[size],
    getFontWeight: (weight: keyof typeof theme.typography.fontWeight) => theme.typography.fontWeight[weight],
    
    // Shadow utilities
    shadows: theme.shadows,
    getShadow: (shadow: keyof typeof theme.shadows) => theme.shadows[shadow],
    
    // Transition utilities
    transitions: theme.transitions,
    getTransition: (component: keyof typeof theme.transitions) => theme.transitions[component],
    
    // Z-index utilities
    zIndex: theme.zIndex,
    getZIndex: (level: keyof typeof theme.zIndex) => theme.zIndex[level],
  };
};

export default ThemeProvider; 