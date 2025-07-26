import { User } from '../types';

// Training Interfaces
export interface TrainingSession {
  id: string;
  title: string;
  description: string;
  instructor: User;
  date: Date;
  duration: number;
  participants: User[];
  maxParticipants: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  type: 'workshop' | 'seminar' | 'hands-on' | 'assessment';
  category: string;
  materials: TrainingMaterial[];
  location?: string;
  meetingLink?: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  instructor: User;
  modules: CourseModule[];
  enrolledParticipants: User[];
  maxEnrollment: number;
  status: 'active' | 'inactive' | 'completed';
  category: string;
  rating: number;
  totalDuration: number;
  thumbnail?: string;
  prerequisites?: string[];
  learningObjectives: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'assignment' | 'interactive';
  duration: number;
  content: string;
  isRequired: boolean;
  order: number;
  materials: TrainingMaterial[];
}

export interface TrainingMaterial {
  id: string;
  title: string;
  type: 'video' | 'document' | 'presentation' | 'link' | 'file';
  url: string;
  size?: number;
  duration?: number;
  description: string;
}

export interface ParticipantProgress {
  userId: string;
  courseId: string;
  completedModules: string[];
  currentModule: string;
  progress: number;
  timeSpent: number;
  lastAccessed: Date;
  assessmentScores: AssessmentScore[];
  certificates: Certificate[];
}

export interface AssessmentScore {
  moduleId: string;
  score: number;
  maxScore: number;
  completedAt: Date;
  attempts: number;
}

export interface Certificate {
  id: string;
  courseId: string;
  issuedAt: Date;
  expiresAt?: Date;
  downloadUrl: string;
}

export interface TrainerStats {
  totalSessions: number;
  totalParticipants: number;
  averageRating: number;
  completionRate: number;
  totalHours: number;
  activeCourses: number;
  upcomingSessions: number;
}

export interface ParticipantStats {
  enrolledCourses: number;
  completedCourses: number;
  totalHours: number;
  averageScore: number;
  learningStreak: number;
  achievements: number;
}

export class TrainingService {
  private static instance: TrainingService;

  private constructor() {}

  static getInstance(): TrainingService {
    if (!TrainingService.instance) {
      TrainingService.instance = new TrainingService();
    }
    return TrainingService.instance;
  }

  // Trainer Methods
  async getTrainerSessions(trainerId: string): Promise<TrainingSession[]> {
    // Mock data - in real app, this would fetch from database
    return [
      {
        id: '1',
        title: 'Advanced React Development',
        description: 'Deep dive into React hooks and advanced patterns',
        instructor: {
          id: trainerId,
          email: 'trainer@example.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
          role: 'trainer',
          tenantId: 'tenant-1',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        date: new Date('2024-04-15T10:00:00'),
        duration: 120,
        participants: [],
        maxParticipants: 20,
        status: 'scheduled',
        type: 'workshop',
        category: 'Frontend Development',
        materials: []
      }
    ];
  }

  async getTrainerCourses(trainerId: string): Promise<TrainingCourse[]> {
    // Mock data
    return [
      {
        id: '1',
        title: 'React Fundamentals',
        description: 'Learn React from the ground up',
        instructor: {
          id: trainerId,
          email: 'trainer@example.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
          role: 'trainer',
          tenantId: 'tenant-1',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        modules: [],
        enrolledParticipants: [],
        maxEnrollment: 50,
        status: 'active',
        category: 'Frontend Development',
        rating: 4.8,
        totalDuration: 480,
        learningObjectives: ['Understand React basics', 'Build functional components', 'Use React hooks'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async getTrainerStats(trainerId: string): Promise<TrainerStats> {
    // Mock data
    return {
      totalSessions: 24,
      totalParticipants: 156,
      averageRating: 4.7,
      completionRate: 87,
      totalHours: 48,
      activeCourses: 3,
      upcomingSessions: 2
    };
  }

  async createSession(sessionData: Omit<TrainingSession, 'id'>): Promise<TrainingSession> {
    // Mock implementation
    const newSession: TrainingSession = {
      ...sessionData,
      id: Date.now().toString(),
    };
    return newSession;
  }

  async updateSession(sessionId: string, updates: Partial<TrainingSession>): Promise<TrainingSession | null> {
    // Mock implementation
    return null;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    // Mock implementation
    return true;
  }

  // Participant Methods
  async getParticipantCourses(participantId: string): Promise<TrainingCourse[]> {
    // Mock data
    return [
      {
        id: '1',
        title: 'React Fundamentals',
        description: 'Learn React from the ground up',
        instructor: {
          id: 'trainer-1',
          email: 'trainer@example.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
          role: 'trainer',
          tenantId: 'tenant-1',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        modules: [],
        enrolledParticipants: [],
        maxEnrollment: 50,
        status: 'active',
        category: 'Frontend Development',
        rating: 4.8,
        totalDuration: 480,
        learningObjectives: ['Understand React basics', 'Build functional components', 'Use React hooks'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async getParticipantProgress(participantId: string, courseId: string): Promise<ParticipantProgress | null> {
    // Mock data
    return {
      userId: participantId,
      courseId: courseId,
      completedModules: ['module-1', 'module-2'],
      currentModule: 'module-3',
      progress: 75,
      timeSpent: 360,
      lastAccessed: new Date(),
      assessmentScores: [
        {
          moduleId: 'module-1',
          score: 85,
          maxScore: 100,
          completedAt: new Date(),
          attempts: 1
        }
      ],
      certificates: []
    };
  }

  async getParticipantStats(participantId: string): Promise<ParticipantStats> {
    // Mock data
    return {
      enrolledCourses: 3,
      completedCourses: 1,
      totalHours: 24,
      averageScore: 87,
      learningStreak: 7,
      achievements: 3
    };
  }

  async enrollInCourse(participantId: string, courseId: string): Promise<boolean> {
    // Mock implementation
    return true;
  }

  async completeModule(participantId: string, courseId: string, moduleId: string): Promise<boolean> {
    // Mock implementation
    return true;
  }

  async submitAssessment(participantId: string, moduleId: string, answers: any[]): Promise<AssessmentScore> {
    // Mock implementation
    return {
      moduleId,
      score: 85,
      maxScore: 100,
      completedAt: new Date(),
      attempts: 1
    };
  }

  // General Methods
  async getAvailableCourses(): Promise<TrainingCourse[]> {
    // Mock data
    return [
      {
        id: '1',
        title: 'React Fundamentals',
        description: 'Learn React from the ground up',
        instructor: {
          id: 'trainer-1',
          email: 'trainer@example.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
          role: 'trainer',
          tenantId: 'tenant-1',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        modules: [],
        enrolledParticipants: [],
        maxEnrollment: 50,
        status: 'active',
        category: 'Frontend Development',
        rating: 4.8,
        totalDuration: 480,
        learningObjectives: ['Understand React basics', 'Build functional components', 'Use React hooks'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async searchCourses(query: string, filters?: any): Promise<TrainingCourse[]> {
    // Mock implementation
    return this.getAvailableCourses();
  }

  async getCourseDetails(courseId: string): Promise<TrainingCourse | null> {
    // Mock implementation
    const courses = await this.getAvailableCourses();
    return courses.find(c => c.id === courseId) || null;
  }

  async rateCourse(participantId: string, courseId: string, rating: number, review?: string): Promise<boolean> {
    // Mock implementation
    return true;
  }
}

export const trainingService = TrainingService.getInstance(); 