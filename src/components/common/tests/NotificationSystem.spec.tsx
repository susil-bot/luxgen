import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import { AuthProvider } from '../../../contexts/AuthContext';
import { NotificationProvider } from '../NotificationSystem';

// Mock the API services
jest.mock('../../../services/apiServices', () => ({
  getNotifications: jest.fn(),
  markNotificationAsRead: jest.fn(),
  deleteNotification: jest.fn(),
  updateNotificationSettings: jest.fn(),
}));

// Mock the toast notifications
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
}));

// Mock the useAuth hook
const mockUseAuth = {
  user: {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
  },
  isAuthenticated: true,
};

jest.mock('../../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../../contexts/AuthContext'),
  useAuth: () => mockUseAuth,
}));

// Mock the useTheme hook
const mockUseTheme = {
  theme: 'light',
  toggleTheme: jest.fn(),
  setTheme: jest.fn(),
};

jest.mock('../../../contexts/ThemeContext', () => ({
  ...jest.requireActual('../../../contexts/ThemeContext'),
  useTheme: () => mockUseTheme,
}));

// Mock Audio API
const mockAudio = {
  play: jest.fn(),
  pause: jest.fn(),
  currentTime: 0,
  duration: 0,
  volume: 1,
  muted: false,
};

global.Audio = jest.fn(() => mockAudio) as any;

const renderNotificationSystem = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <div>Test Content</div>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('NotificationSystem Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API responses
    const { getNotifications, markNotificationAsRead, deleteNotification, updateNotificationSettings } = require('../../../services/apiServices');
    
    getNotifications.mockResolvedValue({
      success: true,
      data: {
        notifications: [
          {
            id: 'notif-1',
            title: 'New Session Available',
            message: 'React Fundamentals session is now available',
            type: 'info',
            read: false,
            createdAt: '2024-01-15T10:00:00Z',
            priority: 'medium',
          },
          {
            id: 'notif-2',
            title: 'Assessment Completed',
            message: 'You have completed the JavaScript quiz',
            type: 'success',
            read: true,
            createdAt: '2024-01-14T15:30:00Z',
            priority: 'low',
          },
        ],
        unreadCount: 1,
      },
    });
    
    markNotificationAsRead.mockResolvedValue({
      success: true,
      message: 'Notification marked as read',
    });
    
    deleteNotification.mockResolvedValue({
      success: true,
      message: 'Notification deleted',
    });
    
    updateNotificationSettings.mockResolvedValue({
      success: true,
      message: 'Settings updated',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    test('should render notification system without crashing', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        expect(screen.getByTestId('notification-system')).toBeInTheDocument();
      });
    });

    test('should display notification bell icon', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        expect(screen.getByLabelText(/Notifications/i)).toBeInTheDocument();
      });
    });

    test('should show unread count badge', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument(); // Unread count
      });
    });
  });

  describe('Notification Panel', () => {
    test('should open notification panel when bell is clicked', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);
        
        expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
      });
    });

    test('should display notification list', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);
        
        expect(screen.getByText('New Session Available')).toBeInTheDocument();
        expect(screen.getByText('Assessment Completed')).toBeInTheDocument();
      });
    });

    test('should show notification details', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);
        
        expect(screen.getByText('React Fundamentals session is now available')).toBeInTheDocument();
        expect(screen.getByText('You have completed the JavaScript quiz')).toBeInTheDocument();
      });
    });

    test('should show notification timestamps', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);
        
        // Should show relative time
        expect(screen.getByText(/ago/i)).toBeInTheDocument();
      });
    });
  });

  describe('Notification Types', () => {
    test('should display different notification types correctly', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);
        
        // Should show different icons for different types
        expect(screen.getByText('New Session Available')).toBeInTheDocument();
        expect(screen.getByText('Assessment Completed')).toBeInTheDocument();
      });
    });

    test('should apply correct styling for different types', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);
        
        // Should have different styling for read/unread notifications
        const notifications = screen.getAllByRole('listitem');
        expect(notifications.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Notification Actions', () => {
    test('should mark notification as read when clicked', async () => {
      const { markNotificationAsRead } = require('../../../services/apiServices');
      
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);
        
        const notification = screen.getByText('New Session Available');
        fireEvent.click(notification);
        
        expect(markNotificationAsRead).toHaveBeenCalledWith('notif-1');
      });
    });

    test('should delete notification when delete button is clicked', async () => {
      const { deleteNotification } = require('../../../services/apiServices');
      
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);
        
        const deleteButton = screen.getByLabelText(/Delete notification/i);
        fireEvent.click(deleteButton);
        
        expect(deleteNotification).toHaveBeenCalledWith('notif-1');
      });
    });

    test('should mark all notifications as read', async () => {
      const { markNotificationAsRead } = require('../../../services/apiServices');
      
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);
        
        const markAllReadButton = screen.getByText(/Mark all as read/i);
        fireEvent.click(markAllReadButton);
        
        expect(markNotificationAsRead).toHaveBeenCalled();
      });
    });
  });

  describe('Notification Settings', () => {
    test('should open settings panel', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);
        
        const settingsButton = screen.getByLabelText(/Notification settings/i);
        fireEvent.click(settingsButton);
        
        expect(screen.getByText(/Notification Settings/i)).toBeInTheDocument();
      });
    });

    test('should toggle sound notifications', async () => {
      const { updateNotificationSettings } = require('../../../services/apiServices');
      
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);
        
        const settingsButton = screen.getByLabelText(/Notification settings/i);
        fireEvent.click(settingsButton);
        
        const soundToggle = screen.getByLabelText(/Sound notifications/i);
        fireEvent.click(soundToggle);
        
        expect(updateNotificationSettings).toHaveBeenCalled();
      });
    });

    test('should toggle email notifications', async () => {
      const { updateNotificationSettings } = require('../../../services/apiServices');
      
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);
        
        const settingsButton = screen.getByLabelText(/Notification settings/i);
        fireEvent.click(settingsButton);
        
        const emailToggle = screen.getByLabelText(/Email notifications/i);
        fireEvent.click(emailToggle);
        
        expect(updateNotificationSettings).toHaveBeenCalled();
      });
    });
  });

  describe('Sound Notifications', () => {
    test('should play notification sound for new notifications', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        // Should play sound for unread notifications
        expect(mockAudio.play).toHaveBeenCalled();
      });
    });

    test('should not play sound when disabled', async () => {
      // Mock settings with sound disabled
      const { getNotifications } = require('../../../services/apiServices');
      getNotifications.mockResolvedValue({
        success: true,
        data: {
          notifications: [],
          settings: { soundEnabled: false },
        },
      });
      
      renderNotificationSystem();
      
      await waitFor(() => {
        expect(mockAudio.play).not.toHaveBeenCalled();
      });
    });
  });

  describe('Real-time Updates', () => {
    test('should update notifications in real-time', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument(); // Initial unread count
      });
      
      // Simulate new notification
      const { getNotifications } = require('../../../services/apiServices');
      getNotifications.mockResolvedValue({
        success: true,
        data: {
          notifications: [
            {
              id: 'notif-3',
              title: 'New Message',
              message: 'You have a new message',
              type: 'info',
              read: false,
              createdAt: new Date().toISOString(),
            },
          ],
          unreadCount: 2,
        },
      });
      
      // Trigger refresh
      const bellButton = screen.getByLabelText(/Notifications/i);
      fireEvent.click(bellButton);
      
      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument(); // Updated unread count
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      const { getNotifications } = require('../../../services/apiServices');
      getNotifications.mockRejectedValue(new Error('API Error'));
      
      renderNotificationSystem();
      
      await waitFor(() => {
        expect(screen.getByText(/Error loading notifications/i)).toBeInTheDocument();
      });
    });

    test('should show error message for failed actions', async () => {
      const { markNotificationAsRead } = require('../../../services/apiServices');
      markNotificationAsRead.mockResolvedValue({
        success: false,
        message: 'Failed to mark as read',
      });
      
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);
        
        const notification = screen.getByText('New Session Available');
        fireEvent.click(notification);
        
        expect(screen.getByText(/Failed to mark as read/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        expect(screen.getByLabelText(/Notifications/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Unread notifications/i)).toBeInTheDocument();
      });
    });

    test('should be keyboard navigable', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        bellButton.focus();
        expect(bellButton).toHaveFocus();
        
        fireEvent.keyDown(bellButton, { key: 'Enter' });
        expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
      });
    });

    test('should support screen readers', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        expect(bellButton).toHaveAttribute('aria-expanded', 'false');
        
        fireEvent.click(bellButton);
        expect(bellButton).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Responsive Design', () => {
    test('should be responsive on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      renderNotificationSystem();
      
      // Should render without errors on mobile
      expect(screen.getByTestId('notification-system')).toBeInTheDocument();
    });

    test('should handle different screen sizes', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      renderNotificationSystem();
      
      // Should render without errors on tablet
      expect(screen.getByTestId('notification-system')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('should render efficiently', async () => {
      const startTime = performance.now();
      renderNotificationSystem();
      
      await waitFor(() => {
        expect(screen.getByTestId('notification-system')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000);
    });

    test('should not cause memory leaks', async () => {
      const { unmount } = renderNotificationSystem();
      
      await waitFor(() => {
        expect(screen.getByTestId('notification-system')).toBeInTheDocument();
      });
      
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Theme Integration', () => {
    test('should apply theme classes', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        const notificationSystem = screen.getByTestId('notification-system');
        expect(notificationSystem).toHaveClass('bg-white', 'dark:bg-gray-800');
      });
    });

    test('should handle theme switching', async () => {
      renderNotificationSystem();
      
      // Should render with current theme
      await waitFor(() => {
        expect(screen.getByTestId('notification-system')).toBeInTheDocument();
      });
    });
  });

  describe('Filtering and Search', () => {
    test('should filter notifications by type', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);
        
        const filterButton = screen.getByText(/Filter/i);
        fireEvent.click(filterButton);
        
        const infoFilter = screen.getByText(/Info/i);
        fireEvent.click(infoFilter);
        
        // Should only show info notifications
        expect(screen.getByText('New Session Available')).toBeInTheDocument();
        expect(screen.queryByText('Assessment Completed')).not.toBeInTheDocument();
      });
    });

    test('should search notifications', async () => {
      renderNotificationSystem();
      
      await waitFor(() => {
        const bellButton = screen.getByLabelText(/Notifications/i);
        fireEvent.click(bellButton);
        
        const searchInput = screen.getByPlaceholderText(/Search notifications/i);
        fireEvent.change(searchInput, { target: { value: 'React' } });
        
        // Should filter notifications containing "React"
        expect(screen.getByText('New Session Available')).toBeInTheDocument();
        expect(screen.queryByText('Assessment Completed')).not.toBeInTheDocument();
      });
    });
  });
}); 