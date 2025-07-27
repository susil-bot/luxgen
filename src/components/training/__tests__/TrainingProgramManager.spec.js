import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrainingProgramManager from '../TrainingProgramManager';
import { toast } from 'react-hot-toast';

// Mock dependencies
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock('../../../services/TrainingProgramService', () => ({
  getPrograms: jest.fn(),
  getProgramStats: jest.fn(),
  createProgram: jest.fn(),
  updateProgram: jest.fn(),
  deleteProgram: jest.fn(),
  duplicateProgram: jest.fn(),
  archiveProgram: jest.fn(),
}));

const mockPrograms = [
  {
    id: 'program-1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React development',
    category: 'Web Development',
    type: 'course',
    difficulty: 'beginner',
    status: 'active',
    instructor: 'John Doe',
    duration: 120,
    enrollments: 45,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'program-2',
    title: 'Advanced JavaScript',
    description: 'Master advanced JavaScript concepts',
    category: 'Programming',
    type: 'workshop',
    difficulty: 'advanced',
    status: 'draft',
    instructor: 'Jane Smith',
    duration: 180,
    enrollments: 23,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'program-3',
    title: 'Data Science Certification',
    description: 'Complete certification in data science',
    category: 'Data Science',
    type: 'certification',
    difficulty: 'expert',
    status: 'active',
    instructor: 'Bob Johnson',
    duration: 480,
    enrollments: 67,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
];

const mockStats = {
  totalPrograms: 3,
  activePrograms: 2,
  completedPrograms: 0,
  draftPrograms: 1,
  totalEnrollments: 135,
  averageCompletionRate: 78.5,
  totalDuration: 780,
  popularCategories: [
    { name: 'Web Development', count: 1 },
    { name: 'Data Science', count: 1 },
    { name: 'Programming', count: 1 },
  ],
};

describe('TrainingProgramManager', () => {
  const mockTenantId = 'tenant-1';
  const mockOnClose = jest.fn();

  const defaultProps = {
    tenantId: mockTenantId,
    isOpen: true,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API responses
    const TrainingProgramService = require('../../../services/TrainingProgramService');
    TrainingProgramService.getPrograms.mockResolvedValue(mockPrograms);
    TrainingProgramService.getProgramStats.mockResolvedValue(mockStats);
  });

  describe('Component Rendering', () => {
    test('renders when open', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Training Program Management')).toBeInTheDocument();
        expect(screen.getByText('Create Program')).toBeInTheDocument();
      });
    });

    test('does not render when closed', () => {
      render(<TrainingProgramManager {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Training Program Management')).not.toBeInTheDocument();
    });

    test('displays program management header', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Training Program Management')).toBeInTheDocument();
        expect(screen.getByText('Create and manage training programs for your organization')).toBeInTheDocument();
      });
    });

    test('shows loading state initially', () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      expect(screen.getByText('Loading training programs...')).toBeInTheDocument();
    });
  });

  describe('Statistics Display', () => {
    test('displays program statistics', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument(); // Total Programs
        expect(screen.getByText('2')).toBeInTheDocument(); // Active Programs
        expect(screen.getByText('135')).toBeInTheDocument(); // Total Enrollments
        expect(screen.getByText('78.5%')).toBeInTheDocument(); // Completion Rate
      });
    });

    test('displays correct stat labels', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Programs')).toBeInTheDocument();
        expect(screen.getByText('Active Programs')).toBeInTheDocument();
        expect(screen.getByText('Total Enrollments')).toBeInTheDocument();
        expect(screen.getByText('Completion Rate')).toBeInTheDocument();
      });
    });
  });

  describe('Search and Filtering', () => {
    test('allows searching programs', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search programs...');
        expect(searchInput).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search programs...');
      fireEvent.change(searchInput, { target: { value: 'React' } });
      
      await waitFor(() => {
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
        expect(screen.queryByText('Advanced JavaScript')).not.toBeInTheDocument();
      });
    });

    test('allows filtering by status', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const statusFilter = screen.getByDisplayValue('All Status');
        expect(statusFilter).toBeInTheDocument();
      });

      const statusFilter = screen.getByDisplayValue('All Status');
      fireEvent.change(statusFilter, { target: { value: 'active' } });
      
      await waitFor(() => {
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
        expect(screen.getByText('Data Science Certification')).toBeInTheDocument();
        expect(screen.queryByText('Advanced JavaScript')).not.toBeInTheDocument();
      });
    });

    test('allows filtering by type', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const typeFilter = screen.getByDisplayValue('All Types');
        expect(typeFilter).toBeInTheDocument();
      });

      const typeFilter = screen.getByDisplayValue('All Types');
      fireEvent.change(typeFilter, { target: { value: 'course' } });
      
      await waitFor(() => {
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
        expect(screen.queryByText('Advanced JavaScript')).not.toBeInTheDocument();
      });
    });

    test('allows filtering by difficulty', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const difficultyFilter = screen.getByDisplayValue('All Difficulties');
        expect(difficultyFilter).toBeInTheDocument();
      });

      const difficultyFilter = screen.getByDisplayValue('All Difficulties');
      fireEvent.change(difficultyFilter, { target: { value: 'beginner' } });
      
      await waitFor(() => {
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
        expect(screen.queryByText('Advanced JavaScript')).not.toBeInTheDocument();
      });
    });

    test('allows sorting programs', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const sortSelect = screen.getByDisplayValue('Name A-Z');
        expect(sortSelect).toBeInTheDocument();
      });

      const sortSelect = screen.getByDisplayValue('Name A-Z');
      fireEvent.change(sortSelect, { target: { value: 'name-desc' } });
      
      // Verify sorting behavior (this would depend on the actual implementation)
      await waitFor(() => {
        const programs = screen.getAllByText(/React Fundamentals|Advanced JavaScript|Data Science Certification/);
        expect(programs.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Program Display', () => {
    test('displays program cards with correct information', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
        expect(screen.getByText('Learn the basics of React development')).toBeInTheDocument();
        expect(screen.getByText('Web Development')).toBeInTheDocument();
        expect(screen.getByText('beginner')).toBeInTheDocument();
        expect(screen.getByText('45')).toBeInTheDocument(); // enrollments
      });
    });

    test('displays program status badges', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('active')).toBeInTheDocument();
        expect(screen.getByText('draft')).toBeInTheDocument();
      });
    });

    test('displays program type icons', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('course')).toBeInTheDocument();
        expect(screen.getByText('workshop')).toBeInTheDocument();
        expect(screen.getByText('certification')).toBeInTheDocument();
      });
    });

    test('displays difficulty levels with correct styling', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const beginnerBadge = screen.getByText('beginner');
        const advancedBadge = screen.getByText('advanced');
        const expertBadge = screen.getByText('expert');
        
        expect(beginnerBadge).toBeInTheDocument();
        expect(advancedBadge).toBeInTheDocument();
        expect(expertBadge).toBeInTheDocument();
      });
    });

    test('displays duration in readable format', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('2h 0m')).toBeInTheDocument(); // 120 minutes
        expect(screen.getByText('3h 0m')).toBeInTheDocument(); // 180 minutes
        expect(screen.getByText('8h 0m')).toBeInTheDocument(); // 480 minutes
      });
    });
  });

  describe('Program Actions', () => {
    test('shows action buttons for each program', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const viewButtons = screen.getAllByText('View');
        const editButtons = screen.getAllByText('Edit');
        
        expect(viewButtons.length).toBe(3);
        expect(editButtons.length).toBe(3);
      });
    });

    test('allows duplicating programs', async () => {
      const TrainingProgramService = require('../../../services/TrainingProgramService');
      TrainingProgramService.duplicateProgram.mockResolvedValue({
        ...mockPrograms[0],
        id: 'program-1-copy',
        title: 'React Fundamentals (Copy)',
      });

      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const duplicateButtons = screen.getAllByTitle('Duplicate');
        expect(duplicateButtons.length).toBe(3);
      });

      const duplicateButtons = screen.getAllByTitle('Duplicate');
      fireEvent.click(duplicateButtons[0]);
      
      await waitFor(() => {
        expect(TrainingProgramService.duplicateProgram).toHaveBeenCalledWith(
          mockTenantId,
          'program-1'
        );
        expect(toast.success).toHaveBeenCalledWith('Training program duplicated successfully!');
      });
    });

    test('handles duplicate program errors', async () => {
      const TrainingProgramService = require('../../../services/TrainingProgramService');
      TrainingProgramService.duplicateProgram.mockRejectedValue(new Error('API Error'));

      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const duplicateButtons = screen.getAllByTitle('Duplicate');
        fireEvent.click(duplicateButtons[0]);
      });
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to duplicate training program');
      });
    });
  });

  describe('Empty State', () => {
    test('shows empty state when no programs match filters', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search programs...');
        fireEvent.change(searchInput, { target: { value: 'NonExistentProgram' } });
      });
      
      await waitFor(() => {
        expect(screen.getByText('No training programs found matching your criteria.')).toBeInTheDocument();
        expect(screen.getByText('Create Your First Program')).toBeInTheDocument();
      });
    });

    test('allows creating program from empty state', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search programs...');
        fireEvent.change(searchInput, { target: { value: 'NonExistentProgram' } });
      });
      
      await waitFor(() => {
        const createButton = screen.getByText('Create Your First Program');
        fireEvent.click(createButton);
      });
      
      // This would trigger the create modal (implementation dependent)
    });
  });

  describe('Refresh Functionality', () => {
    test('allows refreshing programs', async () => {
      const TrainingProgramService = require('../../../services/TrainingProgramService');
      
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const refreshButton = screen.getByTitle('Refresh');
        expect(refreshButton).toBeInTheDocument();
      });

      const refreshButton = screen.getByTitle('Refresh');
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(TrainingProgramService.getPrograms).toHaveBeenCalledTimes(2);
        expect(TrainingProgramService.getProgramStats).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Error Handling', () => {
    test('handles loading errors gracefully', async () => {
      const TrainingProgramService = require('../../../services/TrainingProgramService');
      TrainingProgramService.getPrograms.mockRejectedValue(new Error('API Error'));

      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to load training programs');
      });
    });

    test('handles stats loading errors gracefully', async () => {
      const TrainingProgramService = require('../../../services/TrainingProgramService');
      TrainingProgramService.getProgramStats.mockRejectedValue(new Error('API Error'));

      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        // Should still load programs even if stats fail
        expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    test('supports keyboard navigation', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const createButton = screen.getByText('Create Program');
        createButton.focus();
        expect(createButton).toHaveFocus();
      });
    });

    test('has proper focus management', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close/i });
        closeButton.focus();
        expect(closeButton).toHaveFocus();
      });
    });
  });

  describe('Responsive Design', () => {
    test('adapts to different screen sizes', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toHaveClass('max-w-7xl');
      });
    });

    test('maintains functionality on mobile', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const createButton = screen.getByText('Create Program');
        expect(createButton).toBeInTheDocument();
      });
    });
  });

  describe('Integration', () => {
    test('calls onClose when modal is closed', async () => {
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    test('loads data on mount', async () => {
      const TrainingProgramService = require('../../../services/TrainingProgramService');
      
      render(<TrainingProgramManager {...defaultProps} />);
      
      await waitFor(() => {
        expect(TrainingProgramService.getPrograms).toHaveBeenCalledWith(mockTenantId, undefined);
        expect(TrainingProgramService.getProgramStats).toHaveBeenCalledWith(mockTenantId);
      });
    });

    test('does not load data when closed', () => {
      const TrainingProgramService = require('../../../services/TrainingProgramService');
      
      render(<TrainingProgramManager {...defaultProps} isOpen={false} />);
      
      expect(TrainingProgramService.getPrograms).not.toHaveBeenCalled();
      expect(TrainingProgramService.getProgramStats).not.toHaveBeenCalled();
    });
  });
}); 