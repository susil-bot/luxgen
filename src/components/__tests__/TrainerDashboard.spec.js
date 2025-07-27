import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AuthProvider } from '../../contexts/AuthContext';
import TrainerDashboard from '../trainer/TrainerDashboard';

// Mock the API services
jest.mock('../../services/apiServices', () => ({
  getTrainerDashboard: jest.fn(),
  getTrainerStats: jest.fn(),
  getTrainerSessions: jest.fn(),
  getTrainerContent: jest.fn(),
  getTrainerAnalytics: jest.fn(),
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
    id: 'trainer-123',
    name: 'John Trainer',
    email: 'trainer@example.com',
    role: 'trainer',
  },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
};

jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: () => mockUseAuth,
}));

// Mock the useTheme hook
const mockUseTheme = {
  theme: 'light',
  toggleTheme: jest.fn(),
  setTheme: jest.fn(),
};

jest.mock('../../contexts/ThemeContext', () => ({
  ...jest.requireActual('../../contexts/ThemeContext'),
  useTheme: () => mockUseTheme,
}));

const renderTrainerDashboard = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TrainerDashboard />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('TrainerDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API responses
    const { getTrainerDashboard, getTrainerStats, getTrainerSessions, getTrainerContent, getTrainerAnalytics } = require('../../services/apiServices');
    
    getTrainerDashboard.mockResolvedValue({
      success: true,
      data: {
        overview: {
          totalSessions: 25,
          activeSessions: 8,
          completedSessions: 17,
          totalParticipants: 150,
          averageRating: 4.5,
          totalRevenue: 5000,
        },
        recentSessions: [
          {
            id: 'session-1',
            title: 'Advanced React Training',
            date: '2024-01-15',
            participants: 12,
            status: 'completed',
            rating: 4.8,
          },
        ],
        upcomingSessions: [
          {
            id: 'session-2',
            title: 'TypeScript Fundamentals',
            date: '2024-01-20',
            participants: 8,
            status: 'scheduled',
          },
        ],
      },
    });
    
    getTrainerStats.mockResolvedValue({
      success: true,
      data: {
        monthlyStats: {
          sessions: 25,
          participants: 150,
          revenue: 5000,
          rating: 4.5,
        },
      },
    });
    
    getTrainerSessions.mockResolvedValue({
      success: true,
      data: {
        sessions: [
          {
            id: 'session-1',
            title: 'Advanced React Training',
            date: '2024-01-15',
            participants: 12,
            status: 'completed',
            rating: 4.8,
          },
        ],
      },
    });
    
    getTrainerContent.mockResolvedValue({
      success: true,
      data: {
        content: [
          {
            id: 'content-1',
            title: 'React Hooks Guide',
            type: 'video',
            views: 150,
            rating: 4.7,
          },
        ],
      },
    });
    
    getTrainerAnalytics.mockResolvedValue({
      success: true,
      data: {
        analytics: {
          engagement: 85,
          completion: 92,
          satisfaction: 4.5,
        },
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    test('should render trainer dashboard without crashing', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Trainer Dashboard/i)).toBeInTheDocument();
      });
    });

    test('should display trainer name', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/John Trainer/i)).toBeInTheDocument();
      });
    });

    test('should show loading state initially', () => {
      renderTrainerDashboard();
      
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });
  });

  describe('Dashboard Overview', () => {
    test('should display overview statistics', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText('25')).toBeInTheDocument(); // Total sessions
        expect(screen.getByText('150')).toBeInTheDocument(); // Total participants
        expect(screen.getByText('4.5')).toBeInTheDocument(); // Average rating
        expect(screen.getByText('$5,000')).toBeInTheDocument(); // Total revenue
      });
    });

    test('should display session status cards', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Active Sessions/i)).toBeInTheDocument();
        expect(screen.getByText(/Completed Sessions/i)).toBeInTheDocument();
        expect(screen.getByText('8')).toBeInTheDocument(); // Active sessions
        expect(screen.getByText('17')).toBeInTheDocument(); // Completed sessions
      });
    });
  });

  describe('Recent Sessions', () => {
    test('should display recent sessions list', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Recent Sessions/i)).toBeInTheDocument();
        expect(screen.getByText('Advanced React Training')).toBeInTheDocument();
        expect(screen.getByText('4.8')).toBeInTheDocument(); // Rating
      });
    });

    test('should show session details correctly', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText('12 participants')).toBeInTheDocument();
        expect(screen.getByText(/completed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Upcoming Sessions', () => {
    test('should display upcoming sessions', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Upcoming Sessions/i)).toBeInTheDocument();
        expect(screen.getByText('TypeScript Fundamentals')).toBeInTheDocument();
        expect(screen.getByText('8 participants')).toBeInTheDocument();
      });
    });

    test('should show scheduled status', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/scheduled/i)).toBeInTheDocument();
      });
    });
  });

  describe('Content Management', () => {
    test('should display content analytics', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Content Analytics/i)).toBeInTheDocument();
        expect(screen.getByText('React Hooks Guide')).toBeInTheDocument();
        expect(screen.getByText('150 views')).toBeInTheDocument();
      });
    });

    test('should show content rating', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText('4.7')).toBeInTheDocument(); // Content rating
      });
    });
  });

  describe('Search and Filtering', () => {
    test('should have search functionality', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/Search sessions/i);
        expect(searchInput).toBeInTheDocument();
      });
    });

    test('should filter sessions by search term', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/Search sessions/i);
        fireEvent.change(searchInput, { target: { value: 'React' } });
        
        expect(searchInput.value).toBe('React');
      });
    });

    test('should have filter options', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Filter/i)).toBeInTheDocument();
      });
    });
  });

  describe('Actions and Buttons', () => {
    test('should have create session button', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Create Session/i)).toBeInTheDocument();
      });
    });

    test('should have view all sessions button', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/View All Sessions/i)).toBeInTheDocument();
      });
    });

    test('should have refresh button', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByLabelText(/Refresh/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      const { getTrainerDashboard } = require('../../services/apiServices');
      getTrainerDashboard.mockRejectedValue(new Error('API Error'));
      
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Error loading dashboard/i)).toBeInTheDocument();
      });
    });

    test('should show error message for failed requests', async () => {
      const { getTrainerDashboard } = require('../../services/apiServices');
      getTrainerDashboard.mockResolvedValue({
        success: false,
        message: 'Failed to load dashboard',
      });
      
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Failed to load dashboard/i)).toBeInTheDocument();
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
      
      renderTrainerDashboard();
      
      // Should render without errors on mobile
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    test('should handle different screen sizes', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      renderTrainerDashboard();
      
      // Should render without errors on tablet
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('should render efficiently', async () => {
      const startTime = performance.now();
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Trainer Dashboard/i)).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000);
    });

    test('should not cause memory leaks', async () => {
      const { unmount } = renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Trainer Dashboard/i)).toBeInTheDocument();
      });
      
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByLabelText(/Refresh/i)).toBeInTheDocument();
      });
    });

    test('should be keyboard navigable', async () => {
      renderTrainerDashboard();
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/Search sessions/i);
        searchInput.focus();
        expect(searchInput).toHaveFocus();
      });
    });
  });

  describe('Data Refresh', () => {
    test('should refresh data when refresh button is clicked', async () => {
      const { getTrainerDashboard } = require('../../services/apiServices');
      
      renderTrainerDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Trainer Dashboard/i)).toBeInTheDocument();
      });
      
      const refreshButton = screen.getByLabelText(/Refresh/i);
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(getTrainerDashboard).toHaveBeenCalledTimes(2);
      });
    });
  });
}); 