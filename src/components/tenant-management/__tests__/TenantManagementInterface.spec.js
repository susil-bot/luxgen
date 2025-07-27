import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TenantManagementInterface from '../TenantManagementInterface';
import apiServices from '../../../services/apiServices';
import { toast } from 'react-hot-toast';

// Mock dependencies
jest.mock('../../../services/apiServices');
jest.mock('react-hot-toast');
jest.mock('../../../utils/errorHandler', () => ({
  handleApiError: jest.fn(),
  handleApiResponse: jest.fn((response) => response.success)
}));

const mockTenants = [
  {
    id: '1',
    name: 'Test Tenant 1',
    slug: 'test-tenant-1',
    domain: 'test1.example.com',
    status: 'active',
    plan: {
      id: 'pro',
      name: 'Professional',
      type: 'professional',
      features: ['ai', 'analytics', 'integrations'],
      limits: { users: 100, storage: 100, apiCalls: 10000, customDomains: 2, integrations: 10 },
      pricing: { monthly: 99, yearly: 999, currency: 'USD' }
    },
    limits: {
      current: { users: 25, storage: 50, apiCalls: 5000, customDomains: 1, integrations: 5 },
      usage: { storageUsed: 25, apiCallsUsed: 2500, lastReset: new Date() }
    },
    metadata: {
      industry: 'Technology',
      size: 'medium',
      region: 'North America',
      timezone: 'America/New_York',
      language: 'en',
      currency: 'USD'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Test Tenant 2',
    slug: 'test-tenant-2',
    domain: 'test2.example.com',
    status: 'suspended',
    plan: {
      id: 'basic',
      name: 'Basic',
      type: 'basic',
      features: ['basic', 'analytics'],
      limits: { users: 25, storage: 50, apiCalls: 5000, customDomains: 1, integrations: 5 },
      pricing: { monthly: 29, yearly: 290, currency: 'USD' }
    },
    limits: {
      current: { users: 10, storage: 20, apiCalls: 2000, customDomains: 0, integrations: 2 },
      usage: { storageUsed: 10, apiCallsUsed: 1000, lastReset: new Date() }
    },
    metadata: {
      industry: 'Healthcare',
      size: 'small',
      region: 'Europe',
      timezone: 'Europe/London',
      language: 'en',
      currency: 'EUR'
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10')
  }
];

describe('TenantManagementInterface', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiServices.getTenants.mockResolvedValue({
      success: true,
      data: mockTenants
    });
    toast.mockReturnValue('toast-id');
  });

  it('renders without crashing', async () => {
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Tenant Management')).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    render(<TenantManagementInterface />);
    
    // Should show loading spinner
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('loads and displays tenants', async () => {
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Tenant 1')).toBeInTheDocument();
      expect(screen.getByText('Test Tenant 2')).toBeInTheDocument();
    });
  });

  it('displays correct stats', async () => {
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Total tenants
      expect(screen.getByText('1')).toBeInTheDocument(); // Active tenants
      expect(screen.getByText('35')).toBeInTheDocument(); // Total users
      expect(screen.getByText('$128')).toBeInTheDocument(); // Total revenue
    });
  });

  it('filters tenants by search term', async () => {
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Tenant 1')).toBeInTheDocument();
      expect(screen.getByText('Test Tenant 2')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search tenants...');
    fireEvent.change(searchInput, { target: { value: 'Tenant 1' } });

    expect(screen.getByText('Test Tenant 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Tenant 2')).not.toBeInTheDocument();
  });

  it('filters tenants by status', async () => {
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Tenant 1')).toBeInTheDocument();
      expect(screen.getByText('Test Tenant 2')).toBeInTheDocument();
    });

    const statusFilter = screen.getByDisplayValue('All Status');
    fireEvent.change(statusFilter, { target: { value: 'active' } });

    expect(screen.getByText('Test Tenant 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Tenant 2')).not.toBeInTheDocument();
  });

  it('filters tenants by plan', async () => {
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Tenant 1')).toBeInTheDocument();
      expect(screen.getByText('Test Tenant 2')).toBeInTheDocument();
    });

    const planFilter = screen.getByDisplayValue('All Plans');
    fireEvent.change(planFilter, { target: { value: 'professional' } });

    expect(screen.getByText('Test Tenant 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Tenant 2')).not.toBeInTheDocument();
  });

  it('opens settings manager when settings button is clicked', async () => {
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Tenant 1')).toBeInTheDocument();
    });

    const settingsButtons = screen.getAllByTitle('Settings');
    fireEvent.click(settingsButtons[0]);

    // Should show settings manager modal
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('shows toast message when create tenant button is clicked', async () => {
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Create Tenant')).toBeInTheDocument();
    });

    const createButton = screen.getByText('Create Tenant');
    fireEvent.click(createButton);

    expect(toast).toHaveBeenCalledWith('Create tenant functionality coming soon!');
  });

  it('shows toast message when view details button is clicked', async () => {
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Tenant 1')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByTitle('View Details');
    fireEvent.click(viewButtons[0]);

    expect(toast).toHaveBeenCalledWith('View details coming soon!');
  });

  it('shows toast message when edit button is clicked', async () => {
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Tenant 1')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByTitle('Edit');
    fireEvent.click(editButtons[0]);

    expect(toast).toHaveBeenCalledWith('Edit tenant coming soon!');
  });

  it('calls delete tenant API when delete button is clicked', async () => {
    // Mock window.confirm to return true
    window.confirm = jest.fn(() => true);
    
    apiServices.deleteTenant.mockResolvedValue({
      success: true,
      message: 'Tenant deleted successfully'
    });

    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Tenant 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this tenant? This action cannot be undone.');
    expect(apiServices.deleteTenant).toHaveBeenCalledWith('1');
  });

  it('does not call delete API when user cancels confirmation', async () => {
    // Mock window.confirm to return false
    window.confirm = jest.fn(() => false);
    
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Tenant 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(apiServices.deleteTenant).not.toHaveBeenCalled();
  });

  it('refreshes data when refresh button is clicked', async () => {
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Tenant 1')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    expect(apiServices.getTenants).toHaveBeenCalledTimes(2); // Initial load + refresh
  });

  it('displays empty state when no tenants match filters', async () => {
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Tenant 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search tenants...');
    fireEvent.change(searchInput, { target: { value: 'NonExistentTenant' } });

    expect(screen.getByText('No tenants found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filters')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    apiServices.getTenants.mockRejectedValue(new Error('API Error'));
    
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      // Should not crash and should show empty state
      expect(screen.getByText('No tenants found')).toBeInTheDocument();
    });
  });

  it('displays correct status badges', async () => {
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('active')).toBeInTheDocument();
      expect(screen.getByText('suspended')).toBeInTheDocument();
    });
  });

  it('displays correct plan badges', async () => {
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('professional')).toBeInTheDocument();
      expect(screen.getByText('basic')).toBeInTheDocument();
    });
  });

  it('displays tenant information correctly', async () => {
    render(<TenantManagementInterface />);
    
    await waitFor(() => {
      expect(screen.getByText('test-tenant-1')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument(); // Users for tenant 1
      expect(screen.getByText('10')).toBeInTheDocument(); // Users for tenant 2
    });
  });
}); 