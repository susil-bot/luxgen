# Header Components

A modular header system with authentication integration and responsive design.

## Components Overview

### Header (Main Component)
The main header component that combines all sub-components.

```tsx
import Header from './components/header/Header';

// Basic usage
<Header />

// With custom navigation
<Header 
  navigationItems={[
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' }
  ]}
  logoProps={{ showText: true }}
/>
```

### Logo
Reusable logo component with optional text.

```tsx
import { Logo } from './components/header';

<Logo showText={true} className="custom-class" />
```

### Navigation
Desktop navigation menu with active link detection.

```tsx
import { Navigation } from './components/header';

<Navigation 
  items={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about', external: false },
    { label: 'External', href: 'https://example.com', external: true }
  ]}
/>
```

### AuthButtons
Authentication buttons that adapt based on user login status.

```tsx
import { AuthButtons } from './components/header';

<AuthButtons className="ml-4" />
```

### MobileMenu
Full-screen mobile navigation overlay.

```tsx
import { MobileMenu } from './components/header';

<MobileMenu 
  isOpen={isMobileMenuOpen}
  onClose={() => setIsMobileMenuOpen(false)}
  navigationItems={navigationItems}
/>
```

### MobileMenuToggle
Mobile hamburger menu button.

```tsx
import { MobileMenuToggle } from './components/header';

<MobileMenuToggle 
  isOpen={isMobileMenuOpen}
  onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
/>
```

## Features

### ✅ **Authentication Integration**
- Automatically shows appropriate UI based on login status
- Integrates with existing AuthContext
- User profile display in authenticated state

### ✅ **Responsive Design**
- Mobile-first approach
- Collapsible mobile menu
- Touch-friendly interactions

### ✅ **Accessibility**
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly

### ✅ **Customizable**
- Configurable navigation items
- Optional logo text
- External link support
- Custom styling via className props

## Usage Examples

### Landing Page Header
```tsx
const LandingPage = () => {
  const navigationItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <div>
      <Header 
        navigationItems={navigationItems}
        logoProps={{ showText: true }}
      />
      {/* Page content */}
    </div>
  );
};
```

### Application Header
```tsx
const AppLayout = () => {
  return (
    <div>
      <Header 
        showNavigation={false} // Hide navigation for app layout
        logoProps={{ showText: false }} // Logo only
      />
      {/* App content */}
    </div>
  );
};
```

## Styling

All components use Tailwind CSS classes and follow the design system:

- **Primary Color**: Teal (`teal-600`)
- **Text Colors**: Gray scale
- **Spacing**: Consistent 4px grid
- **Shadows**: Subtle shadow-sm
- **Transitions**: Smooth hover effects

## Integration Notes

1. **Authentication**: Components automatically integrate with the existing `AuthContext`
2. **Routing**: Uses React Router `Link` and `NavLink` components
3. **Icons**: Uses Lucide React icon library
4. **Mobile**: Responsive design with mobile overlay menu

## File Structure

```
src/components/header/
├── Header.tsx          # Main header component
├── Logo.tsx           # Logo component
├── Navigation.tsx     # Desktop navigation
├── AuthButtons.tsx    # Authentication buttons
├── MobileMenu.tsx     # Mobile overlay menu
├── MobileMenuToggle.tsx # Mobile menu button
├── index.ts           # Export barrel
└── README.md          # This documentation
``` 