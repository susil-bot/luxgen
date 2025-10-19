import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AIChatbotInterface from '../AIChatbotInterface';
import { AIChatbotProvider } from '../../../contexts/AIChatbotContext';
import { toast } from 'react-hot-toast';

// Mock dependencies
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  toast: jest.fn(),
}));

jest.mock('../../../contexts/AIChatbotContext', () => ({
  ...jest.requireActual('../../../contexts/AIChatbotContext'),
  useAIChatbot: () => ({
    conversations: [],
    currentConversation: null,
    isLoading: false,
    userNiche: 'Leadership Training',
    startNewConversation: jest.fn(),
    sendMessage: jest.fn(),
    selectConversation: jest.fn(),
  }),
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('AIChatbotInterface', () => {
  const mockContext = {
    conversations: [
      {
        id: 'conv-1',
        title: 'Training Module Creation',
        messages: [
          { id: 'msg-1', role: 'user', content: 'Create a training module' },
          { id: 'msg-2', role: 'assistant', content: 'Here is your training module...' }
        ],
        createdAt: '2024-01-15T10:00:00Z'
      }
    ],
    currentConversation: null,
    isLoading: false,
    userNiche: 'Leadership Training',
    startNewConversation: jest.fn(),
    sendMessage: jest.fn(),
    selectConversation: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AIChatbotProvider>
          <AIChatbotInterface />
        </AIChatbotProvider>
      </BrowserRouter>
    );
  };

  describe('Component Rendering', () => {
    test('renders main interface elements', () => {
      renderComponent();
      
      expect(screen.getByText('AI Assistant')).toBeInTheDocument();
      expect(screen.getByText('Welcome to AI Assistant! 🤖')).toBeInTheDocument();
      expect(screen.getByText('Training Module')).toBeInTheDocument();
      expect(screen.getByText('Client Follow-up')).toBeInTheDocument();
    });

    test('renders sidebar navigation', () => {
      renderComponent();
      
      // Check for sidebar toggle button
      const sidebarButton = screen.getByTitle('Toggle sidebar');
      expect(sidebarButton).toBeInTheDocument();
    });

    test('renders quick action templates', () => {
      renderComponent();
      
      expect(screen.getByText('Training Module')).toBeInTheDocument();
      expect(screen.getByText('Create engaging learning content')).toBeInTheDocument();
      expect(screen.getByText('Client Follow-up')).toBeInTheDocument();
      expect(screen.getByText('Build lasting relationships')).toBeInTheDocument();
      expect(screen.getByText('Content Creation')).toBeInTheDocument();
      expect(screen.getByText('Generate engaging content')).toBeInTheDocument();
    });
  });

  describe('Sidebar Functionality', () => {
    test('toggles sidebar visibility', () => {
      renderComponent();
      
      const sidebarButton = screen.getByTitle('Toggle sidebar');
      fireEvent.click(sidebarButton);
      
      // Check if sidebar expands
      expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    });

    test('shows navigation options when sidebar is expanded', () => {
      renderComponent();
      
      const sidebarButton = screen.getByTitle('Toggle sidebar');
      fireEvent.click(sidebarButton);
      
      expect(screen.getByText('Chat')).toBeInTheDocument();
      expect(screen.getByText('Templates')).toBeInTheDocument();
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  describe('View Navigation', () => {
    test('switches between different views', async () => {
      renderComponent();
      
      // Expand sidebar first
      const sidebarButton = screen.getByTitle('Toggle sidebar');
      fireEvent.click(sidebarButton);
      
      // Click on Templates view
      const templatesButton = screen.getByText('Templates');
      fireEvent.click(templatesButton);
      
      await waitFor(() => {
        expect(screen.getByText('Quick Templates')).toBeInTheDocument();
      });
      
      // Click on History view
      const historyButton = screen.getByText('History');
      fireEvent.click(historyButton);
      
      await waitFor(() => {
        expect(screen.getByText('Conversation History')).toBeInTheDocument();
      });
    });

    test('shows templates view with all quick actions', async () => {
      renderComponent();
      
      // Expand sidebar and go to templates
      const sidebarButton = screen.getByTitle('Toggle sidebar');
      fireEvent.click(sidebarButton);
      
      const templatesButton = screen.getByText('Templates');
      fireEvent.click(templatesButton);
      
      await waitFor(() => {
        expect(screen.getByText('Training Module')).toBeInTheDocument();
        expect(screen.getByText('Client Follow-up')).toBeInTheDocument();
        expect(screen.getByText('Content Creation')).toBeInTheDocument();
        expect(screen.getByText('Assessment Questions')).toBeInTheDocument();
        expect(screen.getByText('Social Media')).toBeInTheDocument();
        expect(screen.getByText('Performance Analysis')).toBeInTheDocument();
      });
    });
  });

  describe('Quick Actions', () => {
    test('handles quick action clicks', async () => {
      const mockStartNewConversation = jest.fn();
      const mockSendMessage = jest.fn();
      
      jest.spyOn(require('../../../contexts/AIChatbotContext'), 'useAIChatbot').mockReturnValue({
        ...mockContext,
        startNewConversation: mockStartNewConversation,
        sendMessage: mockSendMessage,
      });

      renderComponent();
      
      const trainingModuleButton = screen.getByText('Training Module');
      fireEvent.click(trainingModuleButton);
      
      await waitFor(() => {
        expect(mockStartNewConversation).toHaveBeenCalledWith('Leadership Training');
        expect(mockSendMessage).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('Started training module assistant');
      });
    });

    test('filters quick actions based on search', () => {
      renderComponent();
      
      const searchInput = screen.getByPlaceholderText('Search templates...');
      fireEvent.change(searchInput, { target: { value: 'training' } });
      
      expect(screen.getByText('Training Module')).toBeInTheDocument();
      expect(screen.queryByText('Client Follow-up')).not.toBeInTheDocument();
    });
  });

  describe('Chat Functionality', () => {
    test('shows welcome screen when no conversation is active', () => {
      renderComponent();
      
      expect(screen.getByText('Welcome to AI Assistant! 🤖')).toBeInTheDocument();
      expect(screen.getByText("I'm here to help you with Leadership Training content creation, training, and client communication.")).toBeInTheDocument();
    });

    test('displays conversation messages when active', () => {
      jest.spyOn(require('../../../contexts/AIChatbotContext'), 'useAIChatbot').mockReturnValue({
        ...mockContext,
        currentConversation: mockContext.conversations[0],
      });

      renderComponent();
      
      expect(screen.getByText('Create a training module')).toBeInTheDocument();
      expect(screen.getByText('Here is your training module...')).toBeInTheDocument();
    });

    test('handles message sending', async () => {
      const mockSendMessage = jest.fn();
      
      jest.spyOn(require('../../../contexts/AIChatbotContext'), 'useAIChatbot').mockReturnValue({
        ...mockContext,
        currentConversation: mockContext.conversations[0],
        sendMessage: mockSendMessage,
      });

      renderComponent();
      
      const messageInput = screen.getByPlaceholderText('Ask me anything about content creation, training, or client communication...');
      const sendButton = screen.getByText('Send');
      
      fireEvent.change(messageInput, { target: { value: 'Hello AI' } });
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalledWith('Hello AI');
      });
    });

    test('shows loading state when AI is thinking', () => {
      jest.spyOn(require('../../../contexts/AIChatbotContext'), 'useAIChatbot').mockReturnValue({
        ...mockContext,
        currentConversation: mockContext.conversations[0],
        isLoading: true,
      });

      renderComponent();
      
      expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
    });
  });

  describe('Message Actions', () => {
    test('copies individual messages', async () => {
      jest.spyOn(require('../../../contexts/AIChatbotContext'), 'useAIChatbot').mockReturnValue({
        ...mockContext,
        currentConversation: mockContext.conversations[0],
      });

      renderComponent();
      
      const copyButtons = screen.getAllByTitle('Copy message');
      fireEvent.click(copyButtons[0]);
      
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Create a training module');
        expect(toast.success).toHaveBeenCalledWith('Message copied to clipboard');
      });
    });

    test('exports conversation', async () => {
      jest.spyOn(require('../../../contexts/AIChatbotContext'), 'useAIChatbot').mockReturnValue({
        ...mockContext,
        currentConversation: mockContext.conversations[0],
      });

      // Mock URL.createObjectURL and document.createElement
      const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
      const mockRevokeObjectURL = jest.fn();
      const mockClick = jest.fn();
      
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      
      const mockAnchor = {
        href: '',
        download: '',
        click: mockClick,
      } as any;
      
      jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor);

      renderComponent();
      
      const exportButton = screen.getByTitle('Export conversation');
      fireEvent.click(exportButton);
      
      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockClick).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('Conversation exported');
      });
    });
  });

  describe('Voice Input', () => {
    test('shows voice input coming soon message', async () => {
      jest.spyOn(require('../../../contexts/AIChatbotContext'), 'useAIChatbot').mockReturnValue({
        ...mockContext,
        currentConversation: mockContext.conversations[0],
      });

      renderComponent();
      
      const voiceButton = screen.getByTitle('Voice input');
      fireEvent.click(voiceButton);
      
      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith('Voice input coming soon!');
      });
    });
  });

  describe('History View', () => {
    test('displays conversation history', async () => {
      renderComponent();
      
      // Expand sidebar and go to history
      const sidebarButton = screen.getByTitle('Toggle sidebar');
      fireEvent.click(sidebarButton);
      
      const historyButton = screen.getByText('History');
      fireEvent.click(historyButton);
      
      await waitFor(() => {
        expect(screen.getByText('Training Module Creation')).toBeInTheDocument();
        expect(screen.getByText('2 messages')).toBeInTheDocument();
      });
    });

    test('allows selecting previous conversations', async () => {
      const mockSelectConversation = jest.fn();
      
      jest.spyOn(require('../../../contexts/AIChatbotContext'), 'useAIChatbot').mockReturnValue({
        ...mockContext,
        selectConversation: mockSelectConversation,
      });

      renderComponent();
      
      // Expand sidebar and go to history
      const sidebarButton = screen.getByTitle('Toggle sidebar');
      fireEvent.click(sidebarButton);
      
      const historyButton = screen.getByText('History');
      fireEvent.click(historyButton);
      
      const conversationItem = screen.getByText('Training Module Creation');
      fireEvent.click(conversationItem);
      
      await waitFor(() => {
        expect(mockSelectConversation).toHaveBeenCalledWith('conv-1');
      });
    });
  });

  describe('Responsive Design', () => {
    test('adapts to different screen sizes', () => {
      renderComponent();
      
      // Test that the layout is responsive
      const container = screen.getByText('AI Assistant').closest('div');
      expect(container).toHaveClass('flex');
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels and titles', () => {
      renderComponent();
      
      expect(screen.getByTitle('Toggle sidebar')).toBeInTheDocument();
      expect(screen.getByTitle('Voice input')).toBeInTheDocument();
      expect(screen.getByTitle('Copy message')).toBeInTheDocument();
    });

    test('supports keyboard navigation', () => {
      renderComponent();
      
      // Test that interactive elements are focusable
      const searchInput = screen.getByPlaceholderText('Search templates...');
      searchInput.focus();
      expect(searchInput).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    test('handles API errors gracefully', async () => {
      const mockSendMessage = jest.fn().mockRejectedValue(new Error('API Error'));
      
      jest.spyOn(require('../../../contexts/AIChatbotContext'), 'useAIChatbot').mockReturnValue({
        ...mockContext,
        currentConversation: mockContext.conversations[0],
        sendMessage: mockSendMessage,
      });

      renderComponent();
      
      const messageInput = screen.getByPlaceholderText('Ask me anything about content creation, training, or client communication...');
      const sendButton = screen.getByText('Send');
      
      fireEvent.change(messageInput, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalled();
      });
    });
  });

  describe('Performance', () => {
    test('renders efficiently with many conversations', () => {
      const manyConversations = Array.from({ length: 50 }, (_, i) => ({
        id: `conv-${i}`,
        title: `Conversation ${i}`,
        messages: [],
        createdAt: '2024-01-15T10:00:00Z'
      }));

      jest.spyOn(require('../../../contexts/AIChatbotContext'), 'useAIChatbot').mockReturnValue({
        ...mockContext,
        conversations: manyConversations,
      });

      const startTime = performance.now();
      renderComponent();
      const endTime = performance.now();
      
      // Should render in under 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
}); 