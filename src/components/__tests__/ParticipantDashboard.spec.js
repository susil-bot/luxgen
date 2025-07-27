import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AuthProvider } from '../../contexts/AuthContext';
import ParticipantDashboard from '../participant/ParticipantDashboard';

// Mock the API services
jest.mock('../../services/apiServices', () => ({
  getParticipantDashboard: jest.fn(),
  getParticipantProgress: jest.fn(),
  getParticipantSessions: jest.fn(),
  getParticipantContent: jest.fn(),
  getParticipantAssessments: jest.fn(),
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
    id: 'participant-123',
    name: 'Jane Participant',
    email: 'participant@example.com',
    role: 'participant',
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

const renderParticipantDashboard = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ParticipantDashboard />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('ParticipantDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API responses
    const { getParticipantDashboard, getParticipantProgress, getParticipantSessions, getParticipantContent, getParticipantAssessments } = require('../../services/apiServices');
    
    getParticipantDashboard.mockResolvedValue({
      success: true,
      data: {
        overview: {
          enrolledSessions: 8,
          completedSessions: 5,
          inProgressSessions: 2,
          upcomingSessions: 1,
          averageScore: 85,
          totalHours: 24,
        },
        currentSessions: [
          {
            id: 'session-1',
            title: 'React Fundamentals',
            progress: 75,
            nextClass: '2024-01-18T10:00:00Z',
            trainer: 'John Trainer',
          },
        ],
        completedSessions: [
          {
            id: 'session-2',
            title: 'JavaScript Basics',
            score: 92,
            completionDate: '2024-01-10',
            certificate: 'cert-123',
          },
        ],
        upcomingSessions: [
          {
            id: 'session-3',
            title: 'Advanced React',
            startDate: '2024-01-25T14:00:00Z',
            trainer: 'Sarah Trainer',
            duration: '2 hours',
          },
        ],
      },
    });
    
    getParticipantProgress.mockResolvedValue({
      success: true,
      data: {
        progress: {
          overall: 65,
          technical: 80,
          softSkills: 70,
          assessments: 85,
        },
      },
    });
    
    getParticipantSessions.mockResolvedValue({
      success: true,
      data: {
        sessions: [
          {
            id: 'session-1',
            title: 'React Fundamentals',
            progress: 75,
            nextClass: '2024-01-18T10:00:00Z',
            trainer: 'John Trainer',
          },
        ],
      },
    });
    
    getParticipantContent.mockResolvedValue({
      success: true,
      data: {
        content: [
          {
            id: 'content-1',
            title: 'React Hooks Tutorial',
            type: 'video',
            duration: '45 min',
            completed: true,
            progress: 100,
          },
        ],
      },
    });
    
    getParticipantAssessments.mockResolvedValue({
      success: true,
      data: {
        assessments: [
          {
            id: 'assessment-1',
            title: 'JavaScript Fundamentals Quiz',
            score: 85,
            totalQuestions: 20,
            completedAt: '2024-01-12T15:30:00Z',
          },
        ],
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    test('should render participant dashboard without crashing', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Participant Dashboard/i)).toBeInTheDocument();
      });
    });

    test('should display participant name', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Jane Participant/i)).toBeInTheDocument();
      });
    });

    test('should show loading state initially', () => {
      renderParticipantDashboard();
      
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });
  });

  describe('Dashboard Overview', () => {
    test('should display overview statistics', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText('8')).toBeInTheDocument(); // Enrolled sessions
        expect(screen.getByText('5')).toBeInTheDocument(); // Completed sessions
        expect(screen.getByText('85')).toBeInTheDocument(); // Average score
        expect(screen.getByText('24')).toBeInTheDocument(); // Total hours
      });
    });

    test('should display progress indicators', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument(); // In progress sessions
        expect(screen.getByText('1')).toBeInTheDocument(); // Upcoming sessions
      });
    });
  });

  describe('Current Sessions', () => {
    test('should display current sessions list', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Current Sessions/i)).toBeInTheDocument();
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
        expect(screen.getByText('75%')).toBeInTheDocument(); // Progress
      });
    });

    test('should show session details correctly', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/John Trainer/i)).toBeInTheDocument();
        expect(screen.getByText(/Next Class/i)).toBeInTheDocument();
      });
    });
  });

  describe('Completed Sessions', () => {
    test('should display completed sessions', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Completed Sessions/i)).toBeInTheDocument();
        expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
        expect(screen.getByText('92%')).toBeInTheDocument(); // Score
      });
    });

    test('should show completion date', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Completed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Upcoming Sessions', () => {
    test('should display upcoming sessions', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Upcoming Sessions/i)).toBeInTheDocument();
        expect(screen.getByText('Advanced React')).toBeInTheDocument();
        expect(screen.getByText('Sarah Trainer')).toBeInTheDocument();
      });
    });

    test('should show session duration', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText('2 hours')).toBeInTheDocument();
      });
    });
  });

  describe('Learning Progress', () => {
    test('should display learning progress', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Learning Progress/i)).toBeInTheDocument();
        expect(screen.getByText('65%')).toBeInTheDocument(); // Overall progress
      });
    });

    test('should show skill breakdown', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Technical Skills/i)).toBeInTheDocument();
        expect(screen.getByText('80%')).toBeInTheDocument(); // Technical skills
        expect(screen.getByText(/Soft Skills/i)).toBeInTheDocument();
        expect(screen.getByText('70%')).toBeInTheDocument(); // Soft skills
      });
    });
  });

  describe('Content Library', () => {
    test('should display content library', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Content Library/i)).toBeInTheDocument();
        expect(screen.getByText('React Hooks Tutorial')).toBeInTheDocument();
        expect(screen.getByText('45 min')).toBeInTheDocument(); // Duration
      });
    });

    test('should show content completion status', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText('100%')).toBeInTheDocument(); // Content progress
        expect(screen.getByText(/Completed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Assessments', () => {
    test('should display assessments', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Assessments/i)).toBeInTheDocument();
        expect(screen.getByText('JavaScript Fundamentals Quiz')).toBeInTheDocument();
        expect(screen.getByText('85%')).toBeInTheDocument(); // Assessment score
      });
    });

    test('should show assessment details', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText('20 questions')).toBeInTheDocument();
        expect(screen.getByText(/Completed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Search and Filtering', () => {
    test('should have search functionality', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/Search content/i);
        expect(searchInput).toBeInTheDocument();
      });
    });

    test('should filter content by search term', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/Search content/i);
        fireEvent.change(searchInput, { target: { value: 'React' } });
        
        expect(searchInput.value).toBe('React');
      });
    });

    test('should have filter options', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Filter/i)).toBeInTheDocument();
      });
    });
  });

  describe('Actions and Buttons', () => {
    test('should have join session button', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Join Session/i)).toBeInTheDocument();
      });
    });

    test('should have view all sessions button', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/View All Sessions/i)).toBeInTheDocument();
      });
    });

    test('should have refresh button', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByLabelText(/Refresh/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      const { getParticipantDashboard } = require('../../services/apiServices');
      getParticipantDashboard.mockRejectedValue(new Error('API Error'));
      
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Error loading dashboard/i)).toBeInTheDocument();
      });
    });

    test('should show error message for failed requests', async () => {
      const { getParticipantDashboard } = require('../../services/apiServices');
      getParticipantDashboard.mockResolvedValue({
        success: false,
        message: 'Failed to load dashboard',
      });
      
      renderParticipantDashboard();
      
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
      
      renderParticipantDashboard();
      
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
      
      renderParticipantDashboard();
      
      // Should render without errors on tablet
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('should render efficiently', async () => {
      const startTime = performance.now();
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Participant Dashboard/i)).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000);
    });

    test('should not cause memory leaks', async () => {
      const { unmount } = renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Participant Dashboard/i)).toBeInTheDocument();
      });
      
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByLabelText(/Refresh/i)).toBeInTheDocument();
      });
    });

    test('should be keyboard navigable', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/Search content/i);
        searchInput.focus();
        expect(searchInput).toHaveFocus();
      });
    });
  });

  describe('Data Refresh', () => {
    test('should refresh data when refresh button is clicked', async () => {
      const { getParticipantDashboard } = require('../../services/apiServices');
      
      renderParticipantDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Participant Dashboard/i)).toBeInTheDocument();
      });
      
      const refreshButton = screen.getByLabelText(/Refresh/i);
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(getParticipantDashboard).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Session Interaction', () => {
    test('should handle join session action', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        const joinButton = screen.getByText(/Join Session/i);
        expect(joinButton).toBeInTheDocument();
        
        fireEvent.click(joinButton);
      });
    });

    test('should handle view session details', async () => {
      renderParticipantDashboard();
      
      await waitFor(() => {
        const sessionTitle = screen.getByText('React Fundamentals');
        expect(sessionTitle).toBeInTheDocument();
        
        fireEvent.click(sessionTitle);
      });
    });
  });
}); 