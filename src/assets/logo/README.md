# LuxGen Logo Assets

This directory contains the official LuxGen logo assets in various formats and sizes.

## Logo Design

The LuxGen logo features:
- **Text**: "Luxgen" in bold orange-red (#FF6B35) font
- **Icon**: Four-pointed star within a circle, replacing the 'x' in "Luxgen"
- **Background**: Black (#000000)
- **Period**: Small dot after "Luxgen"

## Available Files

### SVG Format
- `luxgen-logo.svg` - Main logo in scalable vector format
- `favicon.svg` - Favicon version (32x32)

### React Component
- `LuxgenLogo.tsx` - Reusable React component with props:
  - `size`: 'small' | 'medium' | 'large' | 'xl'
  - `variant`: 'full' | 'icon' | 'text'
  - `className`: Custom CSS classes
  - `style`: Inline styles

## Usage Examples

### React Component
```tsx
import LuxgenLogo from '../components/LuxgenLogo';

// Full logo (default)
<LuxgenLogo size="large" />

// Icon only
<LuxgenLogo variant="icon" size="medium" />

// Text only
<LuxgenLogo variant="text" size="small" />

// Custom styling
<LuxgenLogo 
  size="xl" 
  className="my-logo" 
  style={{ margin: '20px' }}
/>
```

### Direct SVG Usage
```jsx
<img src="/src/assets/logo/luxgen-logo.svg" alt="LuxGen" />
```

## Brand Guidelines

### Colors
- **Primary Orange**: #FF6B35
- **Background**: #000000
- **Text**: #FFFFFF (when needed)

### Sizing
- **Small**: 120x36px
- **Medium**: 160x48px (recommended)
- **Large**: 200x60px
- **XL**: 240x72px

### Usage Rules
1. Always maintain the aspect ratio
2. Use the full logo when space allows
3. Use the icon version for small spaces (favicons, buttons)
4. Maintain minimum clear space around the logo
5. Don't modify the colors or proportions

## File Structure
```
src/assets/logo/
├── luxgen-logo.svg          # Main logo SVG
├── luxgen-logo.png          # PNG version (placeholder)
├── favicon.svg              # Favicon version
└── README.md               # This file

src/components/
└── LuxgenLogo.tsx          # React component
```

## Integration

The logo is automatically integrated into:
- Browser favicon
- PWA manifest
- React components
- Documentation

## Updates

To update the logo:
1. Modify the SVG files
2. Update the React component if needed
3. Regenerate PNG versions if required
4. Update this documentation
