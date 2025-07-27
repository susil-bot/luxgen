# Profile Components

This directory contains the profile-related components for the trainer platform.

## ProfilePage Component

A comprehensive user profile page that matches the design shown in the reference image.

### Features

- **Cover Image**: Beautiful gradient cover with profile picture overlay
- **User Information**: Name, tagline, location, website, and professional details
- **Navigation Tabs**: General, Connections, and Contributions sections
- **Team Members**: Visual display of team members with hover tooltips
- **Action Buttons**: Follow/Unfollow, message, and more options
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Full dark mode compatibility

### Design Elements

- **Header Section**: Company branding with search and navigation
- **Team Members Bar**: Visual representation of team members
- **Profile Card**: Main profile content with cover image and information
- **Tab Navigation**: Clean tab interface for different content sections
- **Information Panel**: Right sidebar with user details and actions

### Usage

```tsx
import { ProfilePage } from './components/profile';

// Use in routes
<Route path="/app/profile" element={<ProfilePage />} />
```

### Props

The component uses the authenticated user context to display personalized information.

### Styling

- Uses Tailwind CSS for styling
- Responsive grid layout
- Gradient backgrounds and shadows
- Hover effects and transitions
- Consistent with the platform's design system 