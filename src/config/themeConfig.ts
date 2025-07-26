// Global Theme Configuration System
// This file defines all themeable variables that can be customized per tenant

export interface ThemeColors {
  // Primary Brand Colors
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Secondary Brand Colors
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Semantic Colors
  success: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  warning: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  error: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  info: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Neutral Colors
  gray: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Background Colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    overlay: string;
    modal: string;
    card: string;
    sidebar: string;
    header: string;
    footer: string;
  };
  
  // Text Colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    inverse: string;
    link: string;
    linkHover: string;
  };
  
  // Border Colors
  border: {
    primary: string;
    secondary: string;
    tertiary: string;
    focus: string;
    error: string;
    success: string;
    warning: string;
  };
}

export interface ThemeSpacing {
  // Base spacing units
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  
  // Component-specific spacing
  button: {
    padding: {
      sm: string;
      md: string;
      lg: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
  };
  
  card: {
    padding: {
      sm: string;
      md: string;
      lg: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
    gap: string;
  };
  
  input: {
    padding: {
      sm: string;
      md: string;
      lg: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
  };
  
  modal: {
    padding: string;
    borderRadius: string;
    gap: string;
  };
  
  sidebar: {
    width: {
      collapsed: string;
      expanded: string;
    };
    padding: string;
  };
  
  header: {
    height: string;
    padding: string;
  };
}

export interface ThemeTypography {
  // Font families
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
    display: string[];
  };
  
  // Font sizes
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
    '7xl': string;
    '8xl': string;
    '9xl': string;
  };
  
  // Font weights
  fontWeight: {
    thin: string;
    extralight: string;
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
    extrabold: string;
    black: string;
  };
  
  // Line heights
  lineHeight: {
    none: string;
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
  
  // Letter spacing
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
  
  // Component-specific shadows
  card: string;
  modal: string;
  dropdown: string;
  button: string;
  input: string;
}

export interface ThemeTransitions {
  // Duration
  duration: {
    75: string;
    100: string;
    150: string;
    200: string;
    300: string;
    500: string;
    700: string;
    1000: string;
  };
  
  // Easing functions
  easing: {
    linear: string;
    in: string;
    out: string;
    inOut: string;
  };
  
      // Component-specific transitions
    button: string;
    card: string;
    modal: string;
    sidebar: string;
    dropdown: string;
    input: string;
}

export interface ThemeBreakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeZIndex {
  hide: number;
  auto: string;
  base: number;
  docked: number;
  dropdown: number;
  sticky: number;
  banner: number;
  overlay: number;
  modal: number;
  popover: number;
  skipLink: number;
  toast: number;
  tooltip: number;
}

export interface ThemeConfig {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  shadows: ThemeShadows;
  transitions: ThemeTransitions;
  breakpoints: ThemeBreakpoints;
  zIndex: ThemeZIndex;
  
  // Theme metadata
  name: string;
  description: string;
  version: string;
  author: string;
  
  // Responsive design settings
  responsive: {
    mobileFirst: boolean;
    container: {
      center: boolean;
      padding: string;
      screens: Record<string, string>;
    };
  };
  
  // Animation settings
  animations: {
    enabled: boolean;
    reducedMotion: boolean;
  };
}

// Default Theme Configuration
export const defaultTheme: ThemeConfig = {
  name: 'Default Theme',
  description: 'Default theme for Trainer Platform',
  version: '1.0.0',
  author: 'Trainer Platform Team',
  
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      overlay: 'rgba(0, 0, 0, 0.5)',
      modal: '#ffffff',
      card: '#ffffff',
      sidebar: '#f8fafc',
      header: '#ffffff',
      footer: '#f8fafc',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      tertiary: '#6b7280',
      muted: '#9ca3af',
      inverse: '#ffffff',
      link: '#3b82f6',
      linkHover: '#2563eb',
    },
    border: {
      primary: '#e5e7eb',
      secondary: '#f3f4f6',
      tertiary: '#f9fafb',
      focus: '#3b82f6',
      error: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b',
    },
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
    '5xl': '8rem',
    
    button: {
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
      },
    },
    
    card: {
      padding: {
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
      },
      gap: '1rem',
    },
    
    input: {
      padding: {
        sm: '0.5rem 0.75rem',
        md: '0.75rem 1rem',
        lg: '1rem 1.25rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
      },
    },
    
    modal: {
      padding: '1.5rem',
      borderRadius: '0.75rem',
      gap: '1rem',
    },
    
    sidebar: {
      width: {
        collapsed: '4rem',
        expanded: '16rem',
      },
      padding: '1rem',
    },
    
    header: {
      height: '4rem',
      padding: '0 1.5rem',
    },
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['JetBrains Mono', 'monospace'],
      display: ['Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem',
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
    
    card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    modal: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    dropdown: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    button: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    input: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  },
  
  transitions: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    button: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    card: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    modal: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    sidebar: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    dropdown: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    input: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1020,
    banner: 1030,
    overlay: 1040,
    modal: 1050,
    popover: 1060,
    skipLink: 1070,
    toast: 1080,
    tooltip: 1090,
  },
  
  responsive: {
    mobileFirst: true,
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  
  animations: {
    enabled: true,
    reducedMotion: false,
  },
};

// Theme presets for different tenants
export const themePresets: Record<string, Partial<ThemeConfig>> = {
  // Corporate Blue Theme
  corporate: {
    name: 'Corporate Blue',
    colors: {
      ...defaultTheme.colors,
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#2563eb',
        600: '#1d4ed8',
        700: '#1e40af',
        800: '#1e3a8a',
        900: '#1e3a8a',
      },
    },
  },
  
  // Modern Green Theme
  modern: {
    name: 'Modern Green',
    colors: {
      ...defaultTheme.colors,
      primary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },
    },
  },
  
  // Creative Purple Theme
  creative: {
    name: 'Creative Purple',
    colors: {
      ...defaultTheme.colors,
      primary: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7c3aed',
        800: '#6b21a8',
        900: '#581c87',
      },
    },
  },
  
  // Minimal Gray Theme
  minimal: {
    name: 'Minimal Gray',
    colors: {
      ...defaultTheme.colors,
      primary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
    },
  },
};

// Theme utility functions
export const createTheme = (overrides: Partial<ThemeConfig>): ThemeConfig => {
  return {
    ...defaultTheme,
    ...overrides,
  };
};

export const mergeThemes = (base: ThemeConfig, overrides: Partial<ThemeConfig>): ThemeConfig => {
  return {
    ...base,
    ...overrides,
    colors: {
      ...base.colors,
      ...overrides.colors,
    },
    spacing: {
      ...base.spacing,
      ...overrides.spacing,
    },
    typography: {
      ...base.typography,
      ...overrides.typography,
    },
    shadows: {
      ...base.shadows,
      ...overrides.shadows,
    },
    transitions: {
      ...base.transitions,
      ...overrides.transitions,
    },
  };
};

// CSS Variable generation
export const generateCSSVariables = (theme: ThemeConfig): string => {
  const variables: string[] = [];
  
  // Color variables
  Object.entries(theme.colors).forEach(([category, colors]) => {
    if (typeof colors === 'object' && colors !== null) {
      Object.entries(colors).forEach(([shade, value]) => {
        variables.push(`--color-${category}-${shade}: ${value};`);
      });
    }
  });
  
  // Spacing variables
  Object.entries(theme.spacing).forEach(([key, value]) => {
    if (typeof value === 'string') {
      variables.push(`--spacing-${key}: ${value};`);
    }
  });
  
  // Typography variables
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    variables.push(`--font-size-${key}: ${value};`);
  });
  
  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    variables.push(`--font-weight-${key}: ${value};`);
  });
  
  // Shadow variables
  Object.entries(theme.shadows).forEach(([key, value]) => {
    variables.push(`--shadow-${key}: ${value};`);
  });
  
  // Transition variables
  Object.entries(theme.transitions.duration).forEach(([key, value]) => {
    variables.push(`--transition-duration-${key}: ${value};`);
  });
  
  return `:root {\n  ${variables.join('\n  ')}\n}`;
};

export default defaultTheme; 