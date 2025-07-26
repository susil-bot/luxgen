# 🎨 Global Theme System Guide

## 📋 Overview

The Trainer Platform implements a comprehensive, globally configurable theme system that allows for tenant-specific customization while maintaining responsive design principles. This system provides centralized control over colors, typography, spacing, shadows, and other design tokens.

## 🏗️ Architecture

### **Core Components**

1. **Theme Configuration** (`src/config/themeConfig.ts`)
   - Central theme definition with TypeScript interfaces
   - Default theme values and presets
   - Utility functions for theme manipulation

2. **Theme Context** (`src/contexts/ThemeContext.tsx`)
   - React Context for theme state management
   - Dark mode support
   - CSS variable generation and application

3. **Theme Components** (`src/components/common/ThemeComponents.tsx`)
   - Theme-aware UI components
   - Responsive design integration
   - Consistent styling patterns

## 🎯 Key Features

### **✅ Tenant-Specific Configuration**
- Each tenant can have custom theme overrides
- Preset themes for quick deployment
- Dynamic theme switching

### **✅ Responsive Design**
- Mobile-first approach
- Breakpoint-aware components
- Adaptive typography and spacing

### **✅ Dark Mode Support**
- Automatic dark mode detection
- Manual toggle capability
- Persistent user preferences

### **✅ CSS Variables**
- Dynamic CSS variable generation
- Runtime theme updates
- Performance optimized

## 🔧 Configuration

### **Theme Structure**

```typescript
interface ThemeConfig {
  // Colors
  colors: {
    primary: { 50-900: string };
    secondary: { 50-900: string };
    success: { 50-900: string };
    warning: { 50-900: string };
    error: { 50-900: string };
    info: { 50-900: string };
    gray: { 50-900: string };
    background: { primary, secondary, tertiary, overlay, modal, card, sidebar, header, footer };
    text: { primary, secondary, tertiary, muted, inverse, link, linkHover };
    border: { primary, secondary, tertiary, focus, error, success, warning };
  };
  
  // Spacing
  spacing: {
    xs, sm, md, lg, xl, '2xl', '3xl', '4xl', '5xl';
    button: { padding, borderRadius };
    card: { padding, borderRadius, gap };
    input: { padding, borderRadius };
    modal: { padding, borderRadius, gap };
    sidebar: { width, padding };
    header: { height, padding };
  };
  
  // Typography
  typography: {
    fontFamily: { sans, serif, mono, display };
    fontSize: { xs-9xl };
    fontWeight: { thin-black };
    lineHeight: { none-loose };
    letterSpacing: { tighter-widest };
  };
  
  // Shadows
  shadows: {
    sm, md, lg, xl, '2xl', inner, none;
    card, modal, dropdown, button, input;
  };
  
  // Transitions
  transitions: {
    duration: { 75-1000 };
    easing: { linear, in, out, inOut };
    button, card, modal, sidebar, dropdown, input;
  };
  
  // Breakpoints
  breakpoints: {
    sm, md, lg, xl, '2xl';
  };
  
  // Z-Index
  zIndex: {
    hide, auto, base, docked, dropdown, sticky, banner, overlay, modal, popover, skipLink, toast, tooltip;
  };
}
```

### **Available Theme Presets**

```typescript
const themePresets = {
  default: 'Default Theme',
  corporate: 'Corporate Blue',
  modern: 'Modern Green', 
  creative: 'Creative Purple',
  minimal: 'Minimal Gray'
};
```

## 🚀 Usage

### **1. Basic Theme Usage**

```typescript
import { useTheme, useThemeStyles, useResponsive } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, setTheme, isDarkMode, setDarkMode } = useTheme();
  const { getColor, getSpacing, getFontSize } = useThemeStyles();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <div style={{
      backgroundColor: getColor('background', 'primary'),
      color: getColor('text', 'primary'),
      padding: getSpacing('md'),
      fontSize: isMobile() ? getFontSize('sm') : getFontSize('base')
    }}>
      <h1>Theme-aware Component</h1>
      <button onClick={() => setTheme('corporate')}>
        Switch to Corporate Theme
      </button>
      <button onClick={() => setDarkMode(!isDarkMode)}>
        Toggle Dark Mode
      </button>
    </div>
  );
};
```

### **2. Using Theme Components**

```typescript
import { Button, Card, Input, Container, Grid, Flex, Text } from '../components/common/ThemeComponents';

const Dashboard = () => {
  return (
    <Container maxWidth="lg" padding="lg">
      <Grid cols={3} gap="lg">
        <Card variant="elevated" size="lg">
          <Text variant="h3" color="primary">Welcome</Text>
          <Text variant="body" color="secondary">
            This card uses theme-aware styling
          </Text>
          <Flex gap="md" justify="between" align="center">
            <Button variant="primary" size="md">
              Primary Action
            </Button>
            <Button variant="ghost" size="sm">
              Secondary
            </Button>
          </Flex>
        </Card>
        
        <Card variant="outlined">
          <Input
            value={email}
            onChange={setEmail}
            placeholder="Enter email"
            variant="filled"
            size="md"
            fullWidth
            label="Email Address"
            helperText="We'll never share your email"
          />
        </Card>
      </Grid>
    </Container>
  );
};
```

### **3. Tenant-Specific Theme Configuration**

```typescript
// In your tenant configuration
const tenantTheme = {
  colors: {
    primary: {
      500: '#2563eb', // Custom primary color
      600: '#1d4ed8',
      700: '#1e40af',
    },
    background: {
      primary: '#f8fafc',
      card: '#ffffff',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
  },
  spacing: {
    button: {
      padding: {
        md: '0.875rem 1.75rem', // Custom button padding
      },
    },
  },
};

// Apply to ThemeProvider
<ThemeProvider tenantTheme={tenantTheme}>
  <App />
</ThemeProvider>
```

### **4. Responsive Design Integration**

```typescript
const ResponsiveComponent = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { getSpacing, getFontSize } = useThemeStyles();

  const styles = {
    padding: isMobile() ? getSpacing('sm') : getSpacing('lg'),
    fontSize: isMobile() ? getFontSize('sm') : getFontSize('lg'),
    gridTemplateColumns: isMobile() ? '1fr' : isTablet() ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
  };

  return (
    <div style={styles}>
      <Text variant={isMobile() ? 'h4' : 'h2'}>
        Responsive Heading
      </Text>
      <Grid cols={isMobile() ? 1 : isTablet() ? 2 : 3}>
        {/* Grid items */}
      </Grid>
    </div>
  );
};
```

## 🎨 Customization

### **1. Creating Custom Themes**

```typescript
import { createTheme, mergeThemes } from '../config/themeConfig';

// Create a new theme from scratch
const customTheme = createTheme({
  name: 'Custom Theme',
  colors: {
    primary: {
      500: '#8b5cf6', // Purple
      600: '#7c3aed',
      700: '#6d28d9',
    },
    background: {
      primary: '#fafafa',
      card: '#ffffff',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Poppins', 'system-ui', 'sans-serif'],
    },
  },
});

// Merge with existing theme
const enhancedTheme = mergeThemes(defaultTheme, customTheme);
```

### **2. Dynamic Theme Updates**

```typescript
const ThemeCustomizer = () => {
  const { updateTheme, resetTheme } = useTheme();

  const updatePrimaryColor = (color: string) => {
    updateTheme({
      colors: {
        primary: {
          500: color,
          600: darken(color, 0.1),
          700: darken(color, 0.2),
        },
      },
    });
  };

  return (
    <div>
      <input
        type="color"
        onChange={(e) => updatePrimaryColor(e.target.value)}
        defaultValue="#3b82f6"
      />
      <button onClick={resetTheme}>Reset to Default</button>
    </div>
  );
};
```

### **3. CSS Variable Generation**

```typescript
import { generateCSSVariables } from '../config/themeConfig';

const ThemeManager = () => {
  const { theme, generateCSSVars } = useTheme();

  // Generate CSS variables string
  const cssVars = generateCSSVars();
  
  // Apply to document
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = cssVars;
    document.head.appendChild(style);
    
    return () => style.remove();
  }, [cssVars]);

  return null;
};
```

## 📱 Responsive Design

### **Breakpoints**

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Tablet landscape
  xl: '1280px',  // Desktop
  '2xl': '1536px' // Large desktop
};
```

### **Responsive Utilities**

```typescript
const { isMobile, isTablet, isDesktop } = useResponsive();

// Conditional rendering
{isMobile() && <MobileMenu />}
{isDesktop() && <DesktopSidebar />}

// Responsive styling
const styles = {
  fontSize: isMobile() ? '14px' : '16px',
  padding: isMobile() ? '1rem' : '2rem',
  gridColumns: isMobile() ? 1 : isTablet() ? 2 : 3,
};
```

### **Mobile-First Approach**

```typescript
// Base styles (mobile)
const baseStyles = {
  fontSize: '14px',
  padding: '1rem',
  gridTemplateColumns: '1fr',
};

// Responsive overrides
const responsiveStyles = {
  ...baseStyles,
  '@media (min-width: 768px)': {
    fontSize: '16px',
    padding: '1.5rem',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (min-width: 1024px)': {
    padding: '2rem',
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
};
```

## 🔄 Theme Switching

### **Programmatic Theme Changes**

```typescript
const ThemeSwitcher = () => {
  const { setTheme, currentTheme, getThemePresets } = useTheme();
  const presets = getThemePresets();

  return (
    <select 
      value={currentTheme} 
      onChange={(e) => setTheme(e.target.value)}
    >
      {Object.entries(presets).map(([key, preset]) => (
        <option key={key} value={key}>
          {preset.name}
        </option>
      ))}
    </select>
  );
};
```

### **Dark Mode Toggle**

```typescript
const DarkModeToggle = () => {
  const { isDarkMode, setDarkMode } = useTheme();

  return (
    <button onClick={() => setDarkMode(!isDarkMode)}>
      {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
};
```

## 🎯 Best Practices

### **1. Consistent Usage**
- Always use theme tokens instead of hardcoded values
- Use the provided theme components for consistency
- Leverage responsive utilities for mobile-first design

### **2. Performance Optimization**
- Theme changes are optimized with CSS variables
- Components re-render only when necessary
- CSS variables provide smooth transitions

### **3. Accessibility**
- Ensure sufficient color contrast ratios
- Support reduced motion preferences
- Provide alternative text for theme toggles

### **4. Tenant Isolation**
- Each tenant's theme is isolated
- No cross-tenant theme pollution
- Secure theme configuration storage

## 🔧 Advanced Features

### **1. Theme Persistence**
```typescript
// Themes are automatically saved to localStorage
localStorage.setItem('theme', 'corporate');
localStorage.setItem('darkMode', 'true');
localStorage.setItem('customTheme', JSON.stringify(customOverrides));
```

### **2. System Theme Detection**
```typescript
// Automatically detect system dark mode preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

### **3. Theme Validation**
```typescript
// Validate theme configuration
const validateTheme = (theme: Partial<ThemeConfig>) => {
  // Ensure all required properties are present
  // Validate color formats
  // Check for accessibility compliance
};
```

## 📊 Monitoring & Analytics

### **Theme Usage Tracking**
```typescript
const trackThemeUsage = (themeName: string) => {
  analytics.track('theme_changed', {
    theme: themeName,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });
};
```

### **Performance Metrics**
```typescript
const measureThemePerformance = () => {
  const start = performance.now();
  // Apply theme changes
  const end = performance.now();
  
  console.log(`Theme application took ${end - start}ms`);
};
```

## 🚀 Future Enhancements

### **Planned Features**
1. **Theme Builder UI** - Visual theme customization interface
2. **Theme Templates** - Pre-built theme collections
3. **Advanced Animations** - Theme-aware animation system
4. **CSS-in-JS Integration** - Styled-components support
5. **Theme Export/Import** - Theme sharing capabilities

### **Performance Improvements**
1. **Theme Caching** - Optimize theme loading
2. **Lazy Theme Loading** - Load themes on demand
3. **CSS Variable Optimization** - Reduce CSS variable count
4. **Bundle Splitting** - Separate theme configurations

---

*This theme system provides a robust foundation for consistent, customizable, and responsive design across the Trainer Platform.* 