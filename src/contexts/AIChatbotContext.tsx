import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'content' | 'followup' | 'social';
  metadata?: {
    niche?: string;
    contentType?: string;
    platform?: string;
    clientId?: string;
    metrics?: any;
  };
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  niche: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: 'social' | 'followup' | 'training' | 'assessment';
  platform?: string;
  prompt: string;
  variables: string[];
}

interface AIChatbotContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  contentTemplates: ContentTemplate[];
  userNiche: string;
  
  // Conversation management
  startNewConversation: (niche: string) => void;
  sendMessage: (content: string, type?: Message['type'], metadata?: Message['metadata']) => Promise<void>;
  selectConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  
  // Content generation
  generateContent: (template: ContentTemplate, variables: Record<string, string>) => Promise<string>;
  generateFollowup: (clientId: string, context: string) => Promise<string>;
  generateSocialContent: (platform: string, niche: string, topic: string) => Promise<string>;
  
  // Niche management
  setUserNiche: (niche: string) => void;
  getNicheSuggestions: () => string[];
  
  // Analytics
  getConversationAnalytics: (conversationId: string) => any;
  getContentPerformance: (contentId: string) => any;
}

const AIChatbotContext = createContext<AIChatbotContextType | undefined>(undefined);

export const useAIChatbot = () => {
  const context = useContext(AIChatbotContext);
  if (!context) {
    throw new Error('useAIChatbot must be used within an AIChatbotProvider');
  }
  return context;
};

interface AIChatbotProviderProps {
  children: React.ReactNode;
}

// Predefined content templates
const defaultContentTemplates: ContentTemplate[] = [
  {
    id: 'linkedin-post',
    name: 'LinkedIn Professional Post',
    description: 'Create engaging LinkedIn posts for professional networking',
    type: 'social',
    platform: 'linkedin',
    prompt: 'Create a professional LinkedIn post about {topic} for {niche} professionals. Include actionable insights and encourage engagement.',
    variables: ['topic', 'niche']
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story Content',
    description: 'Generate Instagram story ideas and captions',
    type: 'social',
    platform: 'instagram',
    prompt: 'Create an Instagram story about {topic} for {niche} audience. Include engaging visuals description and call-to-action.',
    variables: ['topic', 'niche']
  },
  {
    id: 'client-followup',
    name: 'Client Follow-up Email',
    description: 'Professional follow-up emails for client relationships',
    type: 'followup',
    prompt: 'Write a professional follow-up email for {clientName} regarding {context}. Be helpful and build long-term relationship.',
    variables: ['clientName', 'context']
  },
  {
    id: 'training-module',
    name: 'Training Module Content',
    description: 'Create training content for leadership development',
    type: 'training',
    prompt: 'Create a training module about {topic} for {niche} leaders. Include learning objectives, key points, and practical exercises.',
    variables: ['topic', 'niche']
  },
  {
    id: 'assessment-question',
    name: 'Assessment Questions',
    description: 'Generate assessment questions for skill evaluation',
    type: 'assessment',
    prompt: 'Create 5 assessment questions about {topic} for {niche} professionals. Include different difficulty levels.',
    variables: ['topic', 'niche']
  }
];

// Niche suggestions
const nicheSuggestions = [
  'Leadership Development',
  'Team Management',
  'Communication Skills',
  'Strategic Planning',
  'Change Management',
  'Conflict Resolution',
  'Time Management',
  'Emotional Intelligence',
  'Project Management',
  'Sales Leadership',
  'HR Management',
  'Financial Leadership',
  'Technology Leadership',
  'Healthcare Management',
  'Education Leadership',
  'Non-profit Management',
  'Startup Leadership',
  'Remote Team Management'
];

export const AIChatbotProvider: React.FC<AIChatbotProviderProps> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userNiche, setUserNicheState] = useState('Leadership Development');

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('aiChatbotConversations');
    const savedNiche = localStorage.getItem('userNiche');
    
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        setConversations(parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt)
        })));
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    }
    
    if (savedNiche) {
      setUserNicheState(savedNiche);
    }
  }, []);

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem('aiChatbotConversations', JSON.stringify(conversations));
  }, [conversations]);

  // Save niche to localStorage
  useEffect(() => {
    localStorage.setItem('userNiche', userNiche);
  }, [userNiche]);

  const startNewConversation = useCallback((niche: string) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `AI Assistant - ${niche}`,
      messages: [],
      niche,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  }, []);

  const sendMessage = useCallback(async (content: string, type: Message['type'] = 'text', metadata?: Message['metadata']) => {
    if (!currentConversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      type,
      metadata
    };

    // Add user message
    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
      updatedAt: new Date()
    };

    setConversations(prev => 
      prev.map(conv => 
        conv.id === currentConversation.id ? updatedConversation : conv
      )
    );
    setCurrentConversation(updatedConversation);

    // Generate AI response
    setIsLoading(true);
    try {
      const aiResponse = await generateAIResponse(content, type, metadata, userNiche);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        type,
        metadata
      };

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
        updatedAt: new Date()
      };

      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversation.id ? finalConversation : conv
        )
      );
      setCurrentConversation(finalConversation);
    } catch (error) {
      console.error('Error generating AI response:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentConversation, userNiche]);

  const generateAIResponse = async (content: string, type: Message['type'], metadata?: Message['metadata'], niche?: string): Promise<string> => {
    // Simulate AI response generation
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const responses = {
      text: `I understand you're asking about "${content}" in the context of ${niche || 'leadership development'}. Let me help you with that.`,
      content: `Here's some content for your ${metadata?.contentType || 'request'}:\n\n${generateContentBasedOnType(content, metadata, niche)}`,
      followup: `Here's a professional follow-up message for ${metadata?.clientId || 'your client'}:\n\n${generateFollowupContent(content, metadata)}`,
      social: `Here's social media content for ${metadata?.platform || 'your platform'}:\n\n${generateSocialContentTemplate(content, metadata, niche)}`
    };

    return responses[type] || responses.text;
  };

  const generateContentBasedOnType = (content: string, metadata?: Message['metadata'], niche?: string): string => {
    const templates = {
      'training': `📚 Training Module: ${content}\n\n🎯 Learning Objectives:\n• Understand key concepts\n• Apply practical strategies\n• Measure progress effectively\n\n💡 Key Points:\n• Point 1: Essential foundation\n• Point 2: Advanced techniques\n• Point 3: Real-world application\n\n✅ Practical Exercise:\nComplete the assessment to reinforce learning.`,
      'assessment': `📝 Assessment Questions:\n\n1. How would you apply ${content} in your current role?\n2. What challenges do you face with ${content}?\n3. What strategies have worked best for you?\n4. How do you measure success in ${content}?\n5. What support do you need to improve?`,
      'followup': `📧 Follow-up Message:\n\nHi [Client Name],\n\nI hope this message finds you well. I wanted to follow up on our recent discussion about ${content}.\n\nBased on our conversation, I believe we can help you achieve your goals through our tailored approach. Would you be interested in scheduling a follow-up call to discuss next steps?\n\nBest regards,\n[Your Name]`
    };

    return templates[metadata?.contentType as keyof typeof templates] || templates.training;
  };

  const generateFollowupContent = (content: string, metadata?: Message['metadata']): string => {
    return `Hi there! 👋\n\nI wanted to follow up on our recent conversation about ${content}. I've been thinking about how we can best support your goals.\n\nHere are a few personalized suggestions:\n• Custom training approach\n• Progress tracking system\n• Ongoing support plan\n\nWould you like to schedule a quick call to discuss these options? I'm available this week.\n\nBest regards,\nYour LuxGen Team`;
  };

  const generateSocialContentTemplate = (content: string, metadata?: Message['metadata'], niche?: string): string => {
    const platform = metadata?.platform || 'social media';
    const templates = {
      'linkedin': `🚀 Leadership Tip: ${content}\n\n💡 Key Insight: ${niche} professionals often struggle with this, but here's the solution...\n\n✅ Action Step: Try this approach today and share your results below!\n\n#Leadership #${niche?.replace(/\s+/g, '')} #ProfessionalDevelopment #LuxGen`,
      'instagram': `✨ Leadership Moment ✨\n\nToday's focus: ${content}\n\n💭 Reflection: How does this apply to your leadership journey?\n\n🎯 Challenge: Share one way you'll implement this today!\n\n#Leadership #${niche?.replace(/\s+/g, '')} #Growth #LuxGen`,
      'twitter': `💡 Leadership insight: ${content}\n\nKey takeaway: ${niche} success starts with this mindset.\n\nWhat's your experience with this? Share below! 👇\n\n#Leadership #${niche?.replace(/\s+/g, '')} #LuxGen`
    };

    return templates[platform as keyof typeof templates] || templates.linkedin;
  };

  const selectConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    setCurrentConversation(conversation || null);
  }, [conversations]);

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null);
    }
  }, [currentConversation]);

  const generateContent = useCallback(async (template: ContentTemplate, variables: Record<string, string>): Promise<string> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let content = template.prompt;
      Object.entries(variables).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{${key}}`, 'g'), value);
      });

      return await generateAIResponse(content, 'content', { contentType: template.type, platform: template.platform });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateFollowup = useCallback(async (clientId: string, context: string): Promise<string> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateFollowupContent(context, { clientId });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateSocialContent = useCallback(async (platform: string, niche: string, topic: string): Promise<string> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return generateSocialContentTemplate(topic, { platform }, niche);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setUserNiche = useCallback((niche: string) => {
    setUserNicheState(niche);
  }, []);

  const getNicheSuggestions = useCallback(() => {
    return nicheSuggestions;
  }, []);

  const getConversationAnalytics = useCallback((conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) return null;

    return {
      messageCount: conversation.messages.length,
      userMessages: conversation.messages.filter(m => m.role === 'user').length,
      assistantMessages: conversation.messages.filter(m => m.role === 'assistant').length,
      duration: Date.now() - conversation.createdAt.getTime(),
      lastActivity: conversation.updatedAt
    };
  }, [conversations]);

  const getContentPerformance = useCallback((contentId: string) => {
    // Simulate content performance metrics
    return {
      views: Math.floor(Math.random() * 1000) + 100,
      engagement: Math.floor(Math.random() * 50) + 10,
      shares: Math.floor(Math.random() * 20) + 5,
      clicks: Math.floor(Math.random() * 100) + 20
    };
  }, []);

  const value: AIChatbotContextType = {
    conversations,
    currentConversation,
    isLoading,
    contentTemplates: defaultContentTemplates,
    userNiche,
    startNewConversation,
    sendMessage,
    selectConversation,
    deleteConversation,
    generateContent,
    generateFollowup,
    generateSocialContent,
    setUserNiche,
    getNicheSuggestions,
    getConversationAnalytics,
    getContentPerformance
  };

  return (
    <AIChatbotContext.Provider value={value}>
      {children}
    </AIChatbotContext.Provider>
  );
}; 