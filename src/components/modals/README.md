# Modal Components

A comprehensive collection of modal components for the trainer platform, built with React, TypeScript, and Tailwind CSS. All modals are designed with accessibility, responsive design, and proper props handling.

## Features

- **TypeScript Support**: Full type safety with proper interfaces
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Responsive Design**: Works on all screen sizes
- **Customizable**: Extensive props for customization
- **Consistent Design**: Unified design language across all modals
- **Performance**: Optimized rendering and state management

## Components Overview

### Base Modal
The foundation component that other modals extend. Provides common functionality like backdrop, keyboard handling, and basic structure.

### Search Modal
Advanced search functionality with recent searches and pages, similar to the screenshot provided.

### Basic Modals
- **Basic Modal**: Simple confirmation dialogs
- **Scrollable Modal**: For long content with scroll bars
- **Cookies Modal**: Cookie consent management

### Feedback Modals
- **Success Modal**: Success notifications
- **Danger Modal**: Confirmation for destructive actions
- **Info Modal**: Information display
- **Warning Modal**: Warning notifications

### Product Modals
- **Send Feedback**: User feedback collection
- **Newsletter**: Email subscription
- **Announcement**: Important announcements
- **Integration**: Third-party integrations
- **What's New**: Feature updates
- **Change Plan**: Subscription management
- **Quick Find**: Quick search and navigation

## Installation

All modals are available through the main export:

```typescript
import { 
  SearchModal, 
  BasicModal, 
  SuccessModal,
  // ... other modals
} from '../components/modals';
```

## Usage Examples

### Search Modal

```typescript
import React, { useState } from 'react';
import { SearchModal, SearchResult } from '../components/modals';

const MyComponent = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement search logic
  };

  const recentSearches: SearchResult[] = [
    {
      id: '1',
      title: 'Leadership Training',
      type: 'search',
      timestamp: '2 hours ago'
    }
  ];

  return (
    <>
      <button onClick={() => setIsSearchOpen(true)}>
        Open Search
      </button>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
        recentSearches={recentSearches}
        placeholder="Search Anything..."
      />
    </>
  );
};
```

### Basic Modal

```typescript
import { BasicModal } from '../components/modals';

<BasicModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  content="Are you sure you want to proceed?"
  confirmText="Yes, proceed"
  cancelText="Cancel"
  onConfirm={() => console.log('Confirmed')}
  onCancel={() => console.log('Cancelled')}
/>
```

### Success Modal

```typescript
import { SuccessModal } from '../components/modals';

<SuccessModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Success!"
  message="Your action has been completed successfully."
  confirmText="Continue"
  onConfirm={() => console.log('Success confirmed')}
/>
```

### Send Feedback Modal

```typescript
import { SendFeedbackModal } from '../components/modals';

<SendFeedbackModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={(feedback) => {
    console.log('Feedback:', feedback);
    // Handle feedback submission
  }}
/>
```

## Props Reference

### BaseModal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls modal visibility |
| `onClose` | `() => void` | - | Callback when modal closes |
| `title` | `string` | - | Modal title |
| `children` | `React.ReactNode` | - | Modal content |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'md'` | Modal size |
| `showCloseButton` | `boolean` | `true` | Show close button |
| `closeOnBackdrop` | `boolean` | `true` | Close on backdrop click |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |
| `className` | `string` | `''` | Additional CSS classes |
| `headerClassName` | `string` | `''` | Header CSS classes |
| `bodyClassName` | `string` | `''` | Body CSS classes |

### SearchModal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls modal visibility |
| `onClose` | `() => void` | - | Callback when modal closes |
| `onSearch` | `(query: string) => void` | - | Search callback |
| `recentSearches` | `SearchResult[]` | `[]` | Recent search items |
| `recentPages` | `SearchResult[]` | `[]` | Recent page items |
| `placeholder` | `string` | `"Search Anything..."` | Search placeholder |
| `className` | `string` | `''` | Additional CSS classes |

### SearchResult Interface

```typescript
interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'search' | 'page';
  timestamp?: string;
  url?: string;
}
```

### FeedbackModal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls modal visibility |
| `onClose` | `() => void` | - | Callback when modal closes |
| `title` | `string` | - | Modal title |
| `message` | `string` | - | Modal message |
| `confirmText` | `string` | - | Confirm button text |
| `cancelText` | `string` | - | Cancel button text |
| `onConfirm` | `() => void` | - | Confirm callback |
| `onCancel` | `() => void` | - | Cancel callback |
| `showCancelButton` | `boolean` | `false` | Show cancel button |

## Accessibility Features

All modals include:

- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Automatic focus trapping and restoration
- **Keyboard Navigation**: Escape key to close, Tab for navigation
- **Screen Reader Support**: Semantic HTML and ARIA attributes
- **High Contrast**: Proper color contrast ratios

## Responsive Design

Modals are fully responsive and work on:

- **Mobile**: Full-screen modals with touch-friendly interactions
- **Tablet**: Optimized sizing and spacing
- **Desktop**: Standard modal sizing with hover effects

## Customization

### Styling

All modals use Tailwind CSS classes and can be customized through:

- `className` prop for additional styles
- `headerClassName` and `bodyClassName` for specific sections
- CSS custom properties for theme colors

### Theming

Modals follow the platform's design system with:

- Purple primary color (`purple-600`)
- Gray neutral colors
- Consistent spacing and typography
- Unified button styles

## Performance Considerations

- **Lazy Loading**: Modals only render when open
- **Event Cleanup**: Proper cleanup of event listeners
- **State Management**: Efficient state updates
- **Memory Management**: Proper component unmounting

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

When adding new modals:

1. Extend the `BaseModal` component
2. Add proper TypeScript interfaces
3. Include accessibility features
4. Add to the showcase page
5. Update this documentation

## Examples

See `ModalShowcase.tsx` for complete examples of all modal types and their usage patterns. 