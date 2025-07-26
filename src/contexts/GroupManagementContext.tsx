import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  Group,
  GroupMember,
  LivePresentation,
  LivePoll,
  PollResponse,
  UserPerformance,
  GroupReport,
  RealTimeEvent,
  GroupTemplate
} from '../types';

// State Interface
interface GroupManagementState {
  groups: Group[];
  currentGroup: Group | null;
  presentations: LivePresentation[];
  currentPresentation: LivePresentation | null;
  userPerformances: UserPerformance[];
  templates: GroupTemplate[];
  loading: boolean;
  error: string | null;
  realTimeEvents: RealTimeEvent[];
}

// Action Types
type GroupManagementAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_GROUPS'; payload: Group[] }
  | { type: 'ADD_GROUP'; payload: Group }
  | { type: 'UPDATE_GROUP'; payload: Group }
  | { type: 'DELETE_GROUP'; payload: string }
  | { type: 'SET_CURRENT_GROUP'; payload: Group | null }
  | { type: 'ADD_MEMBER_TO_GROUP'; payload: { groupId: string; member: GroupMember } }
  | { type: 'REMOVE_MEMBER_FROM_GROUP'; payload: { groupId: string; userId: string } }
  | { type: 'SET_PRESENTATIONS'; payload: LivePresentation[] }
  | { type: 'ADD_PRESENTATION'; payload: LivePresentation }
  | { type: 'UPDATE_PRESENTATION'; payload: LivePresentation }
  | { type: 'SET_CURRENT_PRESENTATION'; payload: LivePresentation | null }
  | { type: 'ADD_POLL'; payload: { presentationId: string; poll: LivePoll } }
  | { type: 'UPDATE_POLL'; payload: { presentationId: string; poll: LivePoll } }
  | { type: 'ADD_POLL_RESPONSE'; payload: { presentationId: string; pollId: string; response: PollResponse } }
  | { type: 'SET_USER_PERFORMANCES'; payload: UserPerformance[] }
  | { type: 'UPDATE_USER_PERFORMANCE'; payload: UserPerformance }
  | { type: 'SET_TEMPLATES'; payload: GroupTemplate[] }
  | { type: 'ADD_REAL_TIME_EVENT'; payload: RealTimeEvent };

// Initial State
const initialState: GroupManagementState = {
  groups: [],
  currentGroup: null,
  presentations: [],
  currentPresentation: null,
  userPerformances: [],
  templates: [],
  loading: false,
  error: null,
  realTimeEvents: []
};

// Reducer
function groupManagementReducer(state: GroupManagementState, action: GroupManagementAction): GroupManagementState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_GROUPS':
      return { ...state, groups: action.payload };
    
    case 'ADD_GROUP':
      return { ...state, groups: [...state.groups, action.payload] };
    
    case 'UPDATE_GROUP':
      return {
        ...state,
        groups: state.groups.map(group => 
          group.id === action.payload.id ? action.payload : group
        ),
        currentGroup: state.currentGroup?.id === action.payload.id ? action.payload : state.currentGroup
      };
    
    case 'DELETE_GROUP':
      return {
        ...state,
        groups: state.groups.filter(group => group.id !== action.payload),
        currentGroup: state.currentGroup?.id === action.payload ? null : state.currentGroup
      };
    
    case 'SET_CURRENT_GROUP':
      return { ...state, currentGroup: action.payload };
    
    case 'ADD_MEMBER_TO_GROUP':
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === action.payload.groupId
            ? { ...group, members: [...group.members, action.payload.member] }
            : group
        )
      };
    
    case 'REMOVE_MEMBER_FROM_GROUP':
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === action.payload.groupId
            ? { ...group, members: group.members.filter(member => member.userId !== action.payload.userId) }
            : group
        )
      };
    
    case 'SET_PRESENTATIONS':
      return { ...state, presentations: action.payload };
    
    case 'ADD_PRESENTATION':
      return { ...state, presentations: [...state.presentations, action.payload] };
    
    case 'UPDATE_PRESENTATION':
      return {
        ...state,
        presentations: state.presentations.map(presentation =>
          presentation.id === action.payload.id ? action.payload : presentation
        ),
        currentPresentation: state.currentPresentation?.id === action.payload.id ? action.payload : state.currentPresentation
      };
    
    case 'SET_CURRENT_PRESENTATION':
      return { ...state, currentPresentation: action.payload };
    
    case 'ADD_POLL':
      return {
        ...state,
        presentations: state.presentations.map(presentation =>
          presentation.id === action.payload.presentationId
            ? { ...presentation, polls: [...presentation.polls, action.payload.poll] }
            : presentation
        )
      };
    
    case 'UPDATE_POLL':
      return {
        ...state,
        presentations: state.presentations.map(presentation =>
          presentation.id === action.payload.presentationId
            ? {
                ...presentation,
                polls: presentation.polls.map(poll =>
                  poll.id === action.payload.poll.id ? action.payload.poll : poll
                )
              }
            : presentation
        )
      };
    
    case 'ADD_POLL_RESPONSE':
      return {
        ...state,
        presentations: state.presentations.map(presentation =>
          presentation.id === action.payload.presentationId
            ? {
                ...presentation,
                polls: presentation.polls.map(poll =>
                  poll.id === action.payload.pollId
                    ? { ...poll, responses: [...poll.responses, action.payload.response] }
                    : poll
                )
              }
            : presentation
        )
      };
    
    case 'SET_USER_PERFORMANCES':
      return { ...state, userPerformances: action.payload };
    
    case 'UPDATE_USER_PERFORMANCE':
      return {
        ...state,
        userPerformances: state.userPerformances.map(performance =>
          performance.userId === action.payload.userId && performance.groupId === action.payload.groupId
            ? action.payload
            : performance
        )
      };
    
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };
    
    case 'ADD_REAL_TIME_EVENT':
      return {
        ...state,
        realTimeEvents: [...state.realTimeEvents, action.payload].slice(-50) // Keep last 50 events
      };
    
    default:
      return state;
  }
}

// Context Interface
interface GroupManagementContextType {
  state: GroupManagementState;
  // Group Management
  createGroup: (groupData: Partial<Group>) => Promise<Group>;
  updateGroup: (groupId: string, updates: Partial<Group>) => Promise<Group>;
  deleteGroup: (groupId: string) => Promise<void>;
  addMemberToGroup: (groupId: string, userId: string, role?: GroupMember['role']) => Promise<void>;
  removeMemberFromGroup: (groupId: string, userId: string) => Promise<void>;
  getGroupPerformance: (groupId: string) => Promise<GroupReport>;
  
  // Presentation Management
  createPresentation: (presentationData: Partial<LivePresentation>) => Promise<LivePresentation>;
  startPresentation: (presentationId: string) => Promise<void>;
  endPresentation: (presentationId: string) => Promise<void>;
  addPoll: (presentationId: string, pollData: Partial<LivePoll>) => Promise<LivePoll>;
  activatePoll: (presentationId: string, pollId: string) => Promise<void>;
  deactivatePoll: (presentationId: string, pollId: string) => Promise<void>;
  submitPollResponse: (presentationId: string, pollId: string, answer: any) => Promise<void>;
  
  // Performance Tracking
  updateUserPerformance: (userId: string, groupId: string, metrics: Partial<UserPerformance['metrics']>) => Promise<void>;
  generateGroupReport: (groupId: string, period: GroupReport['period']) => Promise<GroupReport>;
  
  // Templates
  createTemplate: (templateData: Partial<GroupTemplate>) => Promise<GroupTemplate>;
  useTemplate: (templateId: string, groupData: Partial<Group>) => Promise<Group>;
  
  // Real-time
  subscribeToRealTimeEvents: (groupId?: string, presentationId?: string) => void;
  unsubscribeFromRealTimeEvents: () => void;
}

// Create Context
const GroupManagementContext = createContext<GroupManagementContextType | undefined>(undefined);

// Provider Component
interface GroupManagementProviderProps {
  children: ReactNode;
}

export const GroupManagementProvider: React.FC<GroupManagementProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(groupManagementReducer, initialState);

  // Simulated API functions (replace with actual API calls)
  const api = {
    async createGroup(groupData: Partial<Group>): Promise<Group> {
      const newGroup: Group = {
        id: `group_${Date.now()}`,
        name: groupData.name || 'New Group',
        description: groupData.description,
        trainerId: groupData.trainerId || 'current_trainer',
        tenantId: groupData.tenantId || 'current_tenant',
        members: [],
        maxSize: groupData.maxSize || 20,
        category: groupData.category || 'General',
        tags: groupData.tags || [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        performanceMetrics: {
          averageScore: 0,
          completionRate: 0,
          participationRate: 0,
          totalSessions: 0,
          totalAssessments: 0,
          improvementTrend: 'stable',
          lastUpdated: new Date()
        }
      };
      
      dispatch({ type: 'ADD_GROUP', payload: newGroup });
      return newGroup;
    },

    async updateGroup(groupId: string, updates: Partial<Group>): Promise<Group> {
      const updatedGroup = { ...state.groups.find(g => g.id === groupId)!, ...updates, updatedAt: new Date() };
      dispatch({ type: 'UPDATE_GROUP', payload: updatedGroup });
      return updatedGroup;
    },

    async deleteGroup(groupId: string): Promise<void> {
      dispatch({ type: 'DELETE_GROUP', payload: groupId });
    },

    async addMemberToGroup(groupId: string, userId: string, role: GroupMember['role'] = 'member'): Promise<void> {
      const member: GroupMember = {
        userId,
        joinedAt: new Date(),
        role,
        status: 'active',
        lastActivity: new Date()
      };
      dispatch({ type: 'ADD_MEMBER_TO_GROUP', payload: { groupId, member } });
    },

    async removeMemberFromGroup(groupId: string, userId: string): Promise<void> {
      dispatch({ type: 'REMOVE_MEMBER_FROM_GROUP', payload: { groupId, userId } });
    },

    async getGroupPerformance(groupId: string): Promise<GroupReport> {
      const group = state.groups.find(g => g.id === groupId);
      if (!group) throw new Error('Group not found');
      
      const groupPerformances = state.userPerformances.filter(p => p.groupId === groupId);
      
      const report: GroupReport = {
        groupId,
        period: 'monthly',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(),
        generatedAt: new Date(),
        metrics: {
          totalMembers: group.members.length,
          activeMembers: groupPerformances.filter(p => p.metrics.engagementLevel > 0.5).length,
          averagePerformance: groupPerformances.length > 0 
            ? groupPerformances.reduce((sum, p) => sum + p.metrics.assessmentScore, 0) / groupPerformances.length 
            : 0,
          topPerformers: groupPerformances
            .sort((a, b) => b.metrics.assessmentScore - a.metrics.assessmentScore)
            .slice(0, 5)
            .map(p => p.userId),
          improvementAreas: [
            'Increase interactive activities to boost engagement',
            'Schedule more frequent check-ins with low-performing members',
            'Consider peer mentoring programs for better knowledge sharing'
          ],
          engagementTrend: groupPerformances.length > 0 
            ? groupPerformances.reduce((sum, p) => sum + p.metrics.engagementLevel, 0) / groupPerformances.length 
            : 0
        },
        recommendations: [
          'Increase interactive activities to boost engagement',
          'Schedule more frequent check-ins with low-performing members',
          'Consider peer mentoring programs for better knowledge sharing'
        ]
      };
      
      return report;
    },

    async createPresentation(presentationData: Partial<LivePresentation>): Promise<LivePresentation> {
      const newPresentation: LivePresentation = {
        id: `presentation_${Date.now()}`,
        title: presentationData.title || 'New Presentation',
        description: presentationData.description,
        trainerId: presentationData.trainerId || 'current_trainer',
        groupId: presentationData.groupId,
        status: 'preparing',
        currentSlide: 1,
        totalSlides: presentationData.totalSlides || 1,
        participants: [],
        polls: [],
        analytics: {
          totalParticipants: 0,
          averageEngagement: 0,
          totalPolls: 0,
          averageResponseRate: 0,
          peakConcurrentUsers: 0,
          sessionDuration: 0,
          engagementTrend: []
        }
      };
      
      dispatch({ type: 'ADD_PRESENTATION', payload: newPresentation });
      return newPresentation;
    },

    async startPresentation(presentationId: string): Promise<void> {
      const presentation = state.presentations.find(p => p.id === presentationId);
      if (presentation) {
        const updatedPresentation = {
          ...presentation,
          status: 'live' as const,
          startedAt: new Date()
        };
        dispatch({ type: 'UPDATE_PRESENTATION', payload: updatedPresentation });
      }
    },

    async endPresentation(presentationId: string): Promise<void> {
      const presentation = state.presentations.find(p => p.id === presentationId);
      if (presentation) {
        const updatedPresentation = {
          ...presentation,
          status: 'ended' as const,
          endedAt: new Date()
        };
        dispatch({ type: 'UPDATE_PRESENTATION', payload: updatedPresentation });
      }
    },

    async addPoll(presentationId: string, pollData: Partial<LivePoll>): Promise<LivePoll> {
      const newPoll: LivePoll = {
        id: `poll_${Date.now()}`,
        question: pollData.question || 'New Poll Question',
        type: pollData.type || 'multiple_choice',
        options: pollData.options || [],
        isActive: false,
        timeLimit: pollData.timeLimit,
        createdAt: new Date(),
        responses: [],
        results: {
          totalResponses: 0,
          participationRate: 0,
          answers: [],
          averageResponseTime: 0
        }
      };
      
      dispatch({ type: 'ADD_POLL', payload: { presentationId, poll: newPoll } });
      return newPoll;
    },

    async activatePoll(presentationId: string, pollId: string): Promise<void> {
      const presentation = state.presentations.find(p => p.id === presentationId);
      if (presentation) {
        const updatedPolls = presentation.polls.map(poll =>
          poll.id === pollId ? { ...poll, isActive: true } : poll
        );
        const updatedPresentation = { ...presentation, polls: updatedPolls };
        dispatch({ type: 'UPDATE_PRESENTATION', payload: updatedPresentation });
      }
    },

    async deactivatePoll(presentationId: string, pollId: string): Promise<void> {
      const presentation = state.presentations.find(p => p.id === presentationId);
      if (presentation) {
        const updatedPolls = presentation.polls.map(poll =>
          poll.id === pollId ? { ...poll, isActive: false } : poll
        );
        const updatedPresentation = { ...presentation, polls: updatedPolls };
        dispatch({ type: 'UPDATE_PRESENTATION', payload: updatedPresentation });
      }
    },

    async submitPollResponse(presentationId: string, pollId: string, answer: any): Promise<void> {
      const response: PollResponse = {
        id: `response_${Date.now()}`,
        pollId,
        userId: 'current_user',
        answer,
        submittedAt: new Date(),
        responseTime: 5 // Simulated response time
      };
      
      dispatch({ type: 'ADD_POLL_RESPONSE', payload: { presentationId, pollId, response } });
    },

    async updateUserPerformance(userId: string, groupId: string, metrics: Partial<UserPerformance['metrics']>): Promise<void> {
      const existingPerformance = state.userPerformances.find(
        p => p.userId === userId && p.groupId === groupId
      );
      
      const updatedPerformance: UserPerformance = {
        userId,
        groupId,
        metrics: {
          attendanceRate: existingPerformance?.metrics.attendanceRate || 0,
          participationScore: existingPerformance?.metrics.participationScore || 0,
          assessmentScore: existingPerformance?.metrics.assessmentScore || 0,
          engagementLevel: existingPerformance?.metrics.engagementLevel || 0,
          improvementRate: existingPerformance?.metrics.improvementRate || 0,
          ...metrics
        },
        history: existingPerformance?.history || [],
        lastUpdated: new Date()
      };
      
      dispatch({ type: 'UPDATE_USER_PERFORMANCE', payload: updatedPerformance });
    },

    async generateGroupReport(groupId: string, period: GroupReport['period']): Promise<GroupReport> {
      const group = state.groups.find(g => g.id === groupId);
      if (!group) throw new Error('Group not found');
      
      const report: GroupReport = {
        groupId,
        period,
        startDate: new Date(),
        endDate: new Date(),
        metrics: {
          totalMembers: group.members.length,
          activeMembers: group.members.filter(m => m.status === 'active').length,
          averagePerformance: group.performanceMetrics.averageScore,
          topPerformers: group.members
            .sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0))
            .slice(0, 3)
            .map(m => m.userId),
          improvementAreas: ['Communication', 'Leadership', 'Teamwork'],
          engagementTrend: group.performanceMetrics.participationRate
        },
        recommendations: [
          'Increase interactive activities',
          'Provide more feedback opportunities',
          'Encourage peer-to-peer learning'
        ],
        generatedAt: new Date()
      };
      
      return report;
    },

    async createTemplate(templateData: Partial<GroupTemplate>): Promise<GroupTemplate> {
      const newTemplate: GroupTemplate = {
        id: `template_${Date.now()}`,
        name: templateData.name || 'New Template',
        description: templateData.description || '',
        maxSize: templateData.maxSize || 20,
        category: templateData.category || 'General',
        tags: templateData.tags || [],
        trainerId: templateData.trainerId || 'current_trainer',
        isPublic: templateData.isPublic || false,
        usageCount: 0,
        createdAt: new Date()
      };
      
      dispatch({ type: 'SET_TEMPLATES', payload: [...state.templates, newTemplate] });
      return newTemplate;
    },

    async useTemplate(templateId: string, groupData: Partial<Group>): Promise<Group> {
      const template = state.templates.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');
      
      const newGroup = await this.createGroup({
        ...groupData,
        maxSize: template.maxSize,
        category: template.category,
        tags: template.tags
      });
      
      // Update template usage count
      const updatedTemplate = { ...template, usageCount: template.usageCount + 1 };
      dispatch({ type: 'SET_TEMPLATES', payload: state.templates.map(t => t.id === templateId ? updatedTemplate : t) });
      
      return newGroup;
    }
  };

  // Real-time event handling
  let realTimeSubscription: NodeJS.Timeout | null = null;

  const subscribeToRealTimeEvents = (groupId?: string, presentationId?: string) => {
    if (realTimeSubscription) {
      clearInterval(realTimeSubscription);
    }
    
    realTimeSubscription = setInterval(() => {
      // Simulate real-time events
      const event: RealTimeEvent = {
        type: 'poll_response',
        data: { pollId: 'poll_1', responseCount: Math.floor(Math.random() * 10) },
        timestamp: new Date(),
        groupId,
        presentationId
      };
      
      dispatch({ type: 'ADD_REAL_TIME_EVENT', payload: event });
    }, 5000);
  };

  const unsubscribeFromRealTimeEvents = () => {
    if (realTimeSubscription) {
      clearInterval(realTimeSubscription);
      realTimeSubscription = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribeFromRealTimeEvents();
    };
  }, []);

  const contextValue: GroupManagementContextType = {
    state,
    ...api,
    subscribeToRealTimeEvents,
    unsubscribeFromRealTimeEvents
  };

  return (
    <GroupManagementContext.Provider value={contextValue}>
      {children}
    </GroupManagementContext.Provider>
  );
};

// Hook
export const useGroupManagement = (): GroupManagementContextType => {
  const context = useContext(GroupManagementContext);
  if (context === undefined) {
    throw new Error('useGroupManagement must be used within a GroupManagementProvider');
  }
  return context;
}; 