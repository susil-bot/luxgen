// Messaging Types
export interface Message {
  id: string;
  conversationId: string;
  sender: {
    userId: string;
    name: string;
    avatar: string;
  };
  content: {
    text?: string;
    attachments: {
      type: 'image' | 'video' | 'file' | 'link';
      url: string;
      filename?: string;
      size?: number;
      mimeType?: string;
    }[];
  };
  recipients: {
    userId: string;
    readAt?: string;
    deliveredAt: string;
  }[];
  status: 'sent' | 'delivered' | 'read' | 'failed';
  messageType: 'text' | 'image' | 'video' | 'file' | 'system';
  metadata: {
    source: string;
    device: string;
    ipAddress: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  participants: {
    userId: string;
    name: string;
    avatar: string;
    role: 'admin' | 'member';
    joinedAt: string;
    lastReadAt?: string;
  }[];
  title?: string;
  description?: string;
  type: 'direct' | 'group';
  lastMessage?: {
    content: string;
    sender: string;
    timestamp: string;
  };
  settings: {
    notifications: boolean;
    muteUntil?: string;
    archive: boolean;
  };
  metadata: {
    createdBy: string;
    source: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Messaging API Response Types
export interface ConversationsResponse {
  success: boolean;
  data: Conversation[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: string;
}

export interface ConversationResponse {
  success: boolean;
  data: Conversation;
  error?: string;
}

export interface MessagesResponse {
  success: boolean;
  data: Message[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: string;
}

export interface MessageResponse {
  success: boolean;
  data: Message;
  error?: string;
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
  error?: string;
}

// Messaging Creation Types
export interface CreateConversationData {
  participants: {
    userId: string;
    name: string;
    avatar?: string;
  }[];
  title?: string;
  type?: 'direct' | 'group';
}

export interface SendMessageData {
  content: string;
  messageType?: 'text' | 'image' | 'video' | 'file';
  attachments?: {
    type: 'image' | 'video' | 'file' | 'link';
    url: string;
    filename?: string;
    size?: number;
    mimeType?: string;
  }[];
}

// Messaging Filter Types
export interface MessageFilters {
  conversationId?: string;
  senderId?: string;
  messageType?: 'text' | 'image' | 'video' | 'file' | 'system';
  dateRange?: {
    start: string;
    end: string;
  };
  status?: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface ConversationFilters {
  type?: 'direct' | 'group';
  participantId?: string;
  archived?: boolean;
  muted?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Messaging Analytics Types
export interface MessagingAnalytics {
  totalConversations: number;
  totalMessages: number;
  unreadMessages: number;
  averageMessagesPerConversation: number;
  mostActiveConversations: {
    conversationId: string;
    messageCount: number;
    lastActivity: string;
  }[];
  messageTrend: {
    date: string;
    messageCount: number;
  }[];
  responseTime: {
    average: number;
    median: number;
    p95: number;
  };
}

// Real-time Messaging Types
export interface MessageEvent {
  type: 'message' | 'typing' | 'read' | 'delivered';
  conversationId: string;
  message?: Message;
  userId: string;
  timestamp: string;
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
  timestamp: string;
}

export interface ReadEvent {
  conversationId: string;
  userId: string;
  messageId: string;
  timestamp: string;
}

// Messaging Settings Types
export interface MessagingSettings {
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    email: boolean;
  };
  privacy: {
    readReceipts: boolean;
    onlineStatus: boolean;
    lastSeen: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
  };
  shortcuts: {
    sendOnEnter: boolean;
    emojiShortcuts: boolean;
    mentionShortcuts: boolean;
  };
}
