# Assets Directory

This directory contains all static assets used throughout the application.

## 📁 Directory Structure

```
src/assets/
├── images/          # General images, photos, backgrounds
├── icons/           # Icon files (SVG, PNG, ICO)
├── fonts/           # Custom font files
├── logos/           # Logo variations and brand assets
└── README.md        # This file
```

## 🎯 Usage Guidelines

### **Images**
- Store in `src/assets/images/`
- Use descriptive filenames (e.g., `hero-background.jpg`, `user-avatar-placeholder.png`)
- Optimize images for web (compress, use appropriate formats)
- Consider using WebP format for better performance

### **Icons**
- Store in `src/assets/icons/`
- Prefer SVG format for scalability
- Use consistent naming convention (e.g., `arrow-right.svg`, `user-profile.svg`)
- Consider using icon libraries like Lucide React for common icons

### **Fonts**
- Store in `src/assets/fonts/`
- Include font files and CSS declarations
- Use web fonts when possible
- Consider font loading performance

### **Logos**
- Store in `src/assets/logos/`
- Include different sizes and formats
- Use transparent backgrounds when possible
- Include both light and dark variants if needed

## 📝 Import Examples

```typescript
// Import images
import heroImage from '../assets/images/hero-background.jpg';
import logo from '../assets/logos/logo-primary.svg';

// Import icons
import arrowIcon from '../assets/icons/arrow-right.svg';

// Import fonts (in CSS)
@font-face {
  font-family: 'CustomFont';
  src: url('../assets/fonts/custom-font.woff2') format('woff2');
}
```

## 🔧 Best Practices

1. **File Naming**: Use kebab-case for filenames
2. **Optimization**: Compress images and optimize SVGs
3. **Organization**: Group related assets in subdirectories
4. **Versioning**: Consider versioning for frequently updated assets
5. **Accessibility**: Include alt text and proper descriptions

## 📦 Asset Management

- Keep assets organized and well-documented
- Remove unused assets regularly
- Consider using asset optimization tools
- Monitor bundle size impact of assets

## 🚀 Performance Tips

- Use appropriate image formats (WebP, AVIF for modern browsers)
- Implement lazy loading for images
- Consider using image sprites for multiple small icons
- Optimize font loading with `font-display: swap` 