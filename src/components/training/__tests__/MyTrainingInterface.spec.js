import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyTrainingInterface from '../MyTrainingInterface';
import { AuthProvider } from '../../../contexts/AuthContext';
import * as apiServices from '../../../services/apiServices';

// Mock apiServices
jest.mock('../../../services/apiServices');
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock window.matchMedia for responsive testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const mockUser = {
  id: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  role: 'participant',
};

const mockPrograms = [
  {
    id: 'program-1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React development',
    category: 'Programming',
    difficulty: 'beginner',
    duration: 10,
    modules: [
      {
        id: 'module-1',
        title: 'Introduction to React',
        description: 'Basic concepts and setup',
        type: 'video',
        duration: 30,
        content: 'React intro content',
        isRequired: true,
        order: 1,
        isCompleted: false,
        materials: [],
      },
    ],
    instructor: {
      id: 'instructor-1',
      name: 'Jane Smith',
      avatar: 'https://example.com/avatar.jpg',
      rating: 4.5,
    },
    thumbnail: 'https://example.com/thumbnail.jpg',
    rating: 4.5,
    enrolledAt: '2024-01-01T00:00:00Z',
    progress: 25,
    status: 'in_progress',
    lastAccessed: '2024-01-15T00:00:00Z',
  },
];

const mockStats = {
  totalPrograms: 5,
  completedPrograms: 2,
  inProgressPrograms: 2,
  totalHoursLearned: 15,
  averageScore: 85,
  certificatesEarned: 2,
  currentStreak: 7,
  longestStreak: 14,
  weeklyProgress: [
    { week: '2024-01-08', hoursLearned: 2, programsCompleted: 0, assessmentsPassed: 1 },
    { week: '2024-01-15', hoursLearned: 3, programsCompleted: 1, assessmentsPassed: 2 },
  ],
  skillProgress: [
    { skill: 'React', level: 'intermediate', progress: 75, programsCompleted: 3 },
    { skill: 'JavaScript', level: 'advanced', progress: 90, programsCompleted: 5 },
  ],
};

const mockAssessments = [
  {
    id: 'assessment-1',
    title: 'React Basics Quiz',
    description: 'Test your knowledge of React fundamentals',
    programId: 'program-1',
    questions: [],
    passingScore: 70,
    timeLimit: 30,
    isActive: true,
    attempts: [],
  },
];

const mockLearningPaths = [
  {
    id: 'path-1',
    title: 'Full Stack Development',
    description: 'Complete path to become a full stack developer',
    programs: ['program-1', 'program-2'],
    estimatedDuration: 40,
    skills: ['React', 'Node.js', 'Database'],
    difficulty: 'intermediate',
    isRecommended: true,
  },
];

const renderWithAuth = (component) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('MyTrainingInterface Responsive Design', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock successful API responses
    apiServices.getTrainingCourses.mockResolvedValue({
      success: true,
      data: mockPrograms,
    });
    
    apiServices.getAssessments.mockResolvedValue({
      success: true,
      data: mockAssessments,
    });
    
    apiServices.getParticipantStats.mockResolvedValue({
      success: true,
      data: mockStats,
    });
    
    apiServices.getLearningPaths.mockResolvedValue({
      success: true,
      data: mockLearningPaths,
    });
  });

  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 375,
      });
      
      // Mock mobile media query
      window.matchMedia.mockImplementation(query => ({
        matches: query.includes('max-width: 640px'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
    });

    test('displays mobile-optimized header', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('My Training')).toBeInTheDocument();
      });
      
      // Check for mobile-optimized elements
      const header = screen.getByText('My Training').closest('div');
      expect(header).toHaveClass('text-xl', 'sm:text-2xl');
    });

    test('shows mobile tab selector instead of desktop tabs', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('My Training')).toBeInTheDocument();
      });
      
      // Mobile tab selector should be visible
      const tabSelector = screen.getByRole('combobox');
      expect(tabSelector).toBeInTheDocument();
      
      // Desktop tabs should be hidden
      const desktopTabs = document.querySelector('nav.hidden.md\\:flex');
      expect(desktopTabs).toBeInTheDocument();
    });

    test('displays responsive stats grid', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Programs')).toBeInTheDocument();
      });
      
      const statsGrid = screen.getByText('Total Programs').closest('div');
      expect(statsGrid).toHaveClass('grid-cols-2', 'lg:grid-cols-4');
    });

    test('shows mobile-optimized program cards', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      });
      
      const programCard = screen.getByText('React Fundamentals').closest('div');
      expect(programCard).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');
    });

    test('displays responsive filters', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      // Navigate to programs tab
      const tabSelector = screen.getByRole('combobox');
      fireEvent.change(tabSelector, { target: { value: 'programs' } });
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search programs...')).toBeInTheDocument();
      });
      
      const filterContainer = screen.getByPlaceholderText('Search programs...').closest('div');
      expect(filterContainer).toHaveClass('flex-col', 'sm:flex-row');
    });
  });

  describe('Tablet Responsiveness', () => {
    beforeEach(() => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 768,
      });
      
      // Mock tablet media query
      window.matchMedia.mockImplementation(query => ({
        matches: query.includes('min-width: 640px') && !query.includes('min-width: 1024px'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
    });

    test('displays tablet-optimized layout', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('My Training')).toBeInTheDocument();
      });
      
      // Check for tablet-optimized spacing
      const container = screen.getByText('My Training').closest('div');
      expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
    });

    test('shows responsive program grid on tablet', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      // Navigate to programs tab
      const tabSelector = screen.getByRole('combobox');
      fireEvent.change(tabSelector, { target: { value: 'programs' } });
      
      await waitFor(() => {
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      });
      
      const programGrid = screen.getByText('React Fundamentals').closest('div');
      expect(programGrid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');
    });
  });

  describe('Desktop Responsiveness', () => {
    beforeEach(() => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1200,
      });
      
      // Mock desktop media query
      window.matchMedia.mockImplementation(query => ({
        matches: query.includes('min-width: 1024px'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
    });

    test('displays desktop tab navigation', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('My Training')).toBeInTheDocument();
      });
      
      // Desktop tabs should be visible
      const desktopTabs = document.querySelector('nav.hidden.md\\:flex');
      expect(desktopTabs).toBeInTheDocument();
      
      // Mobile tab selector should be hidden
      const mobileSelector = screen.getByRole('combobox');
      expect(mobileSelector.closest('div')).toHaveClass('md:hidden');
    });

    test('shows full desktop layout', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('My Training')).toBeInTheDocument();
      });
      
      // Check for desktop-optimized elements
      const header = screen.getByText('My Training').closest('div');
      expect(header).toHaveClass('text-xl', 'sm:text-2xl');
    });
  });

  describe('Responsive Interactions', () => {
    test('handles mobile touch interactions', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      });
      
      // Test touch-friendly button sizes
      const continueButton = screen.getByText('Continue');
      expect(continueButton).toHaveClass('text-xs', 'sm:text-sm');
    });

    test('responsive modal behavior', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      });
      
      // Click on program to open modal
      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);
      
      await waitFor(() => {
        const modal = document.querySelector('.fixed.inset-0');
        expect(modal).toBeInTheDocument();
      });
      
      // Check modal responsiveness
      const modalContent = document.querySelector('.max-w-4xl');
      expect(modalContent).toHaveClass('max-h-[90vh]', 'overflow-y-auto');
    });

    test('responsive form elements', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      // Navigate to programs tab
      const tabSelector = screen.getByRole('combobox');
      fireEvent.change(tabSelector, { target: { value: 'programs' } });
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search programs...')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByPlaceholderText('Search programs...');
      expect(searchInput).toHaveClass('text-sm', 'sm:text-base');
    });
  });

  describe('Responsive Typography', () => {
    test('uses responsive text sizes', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Programs')).toBeInTheDocument();
      });
      
      // Check responsive text classes
      const statsLabel = screen.getByText('Total Programs');
      expect(statsLabel).toHaveClass('text-xs', 'sm:text-sm');
      
      const statsValue = screen.getByText('5');
      expect(statsValue).toHaveClass('text-lg', 'sm:text-2xl');
    });

    test('responsive headings', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('My Training')).toBeInTheDocument();
      });
      
      const mainHeading = screen.getByText('My Training');
      expect(mainHeading).toHaveClass('text-xl', 'sm:text-2xl');
    });
  });

  describe('Responsive Spacing', () => {
    test('uses responsive padding and margins', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('My Training')).toBeInTheDocument();
      });
      
      // Check responsive spacing classes
      const container = screen.getByText('My Training').closest('div');
      expect(container).toHaveClass('py-4', 'sm:py-8');
    });

    test('responsive gaps in grids', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Programs')).toBeInTheDocument();
      });
      
      const statsGrid = screen.getByText('Total Programs').closest('div');
      expect(statsGrid).toHaveClass('gap-3', 'sm:gap-6');
    });
  });

  describe('Responsive Icons', () => {
    test('uses responsive icon sizes', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('My Training')).toBeInTheDocument();
      });
      
      // Check icon responsiveness
      const bookIcon = document.querySelector('.w-6.h-6.sm\\:w-8.sm\\:h-8');
      expect(bookIcon).toBeInTheDocument();
    });
  });

  describe('Accessibility in Responsive Design', () => {
    test('maintains accessibility on mobile', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('My Training')).toBeInTheDocument();
      });
      
      // Check for proper ARIA labels and roles
      const tabSelector = screen.getByRole('combobox');
      expect(tabSelector).toBeInTheDocument();
      
      // Check for focus management
      const refreshButton = screen.getByTitle('Refresh');
      expect(refreshButton).toBeInTheDocument();
    });

    test('touch-friendly button sizes', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      });
      
      // Check for touch-friendly button sizes
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        const minHeight = parseInt(styles.minHeight) || parseInt(styles.height);
        const minWidth = parseInt(styles.minWidth) || parseInt(styles.width);
        
        // Buttons should be at least 36px for touch interaction
        expect(minHeight).toBeGreaterThanOrEqual(36);
        expect(minWidth).toBeGreaterThanOrEqual(36);
      });
    });
  });

  describe('Performance in Responsive Design', () => {
    test('efficient rendering on different screen sizes', async () => {
      const { rerender } = renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('My Training')).toBeInTheDocument();
      });
      
      // Test re-rendering performance
      const startTime = performance.now();
      rerender(<MyTrainingInterface />);
      const endTime = performance.now();
      
      // Re-render should be fast (< 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('responsive image loading', async () => {
      renderWithAuth(<MyTrainingInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      });
      
      // Check for responsive image classes
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        expect(img).toHaveClass('object-cover');
      });
    });
  });
}); 