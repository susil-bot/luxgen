// Feed Types
export interface FeedPost {
  id: string;
  author: {
    userId: string;
    name: string;
    title: string;
    avatar: string;
    verified: boolean;
  };
  content: {
    text: string;
    images: string[];
    videos: string[];
    links: {
      url: string;
      title: string;
      description: string;
      image: string;
    }[];
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  visibility: {
    type: 'public' | 'connections' | 'private';
    audience: string[];
  };
  hashtags: string[];
  mentions: string[];
  tags: string[];
  location?: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  status: 'published' | 'draft' | 'archived' | 'deleted';
  metadata: {
    source: string;
    device: string;
    ipAddress: string;
    userAgent: string;
  };
  analytics: {
    reach: number;
    impressions: number;
    clicks: number;
    engagementRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FeedComment {
  id: string;
  postId: string;
  author: {
    userId: string;
    name: string;
    avatar: string;
  };
  content: string;
  parentComment?: string;
  engagement: {
    likes: number;
    replies: number;
  };
  mentions: string[];
  hashtags: string[];
  status: 'active' | 'deleted' | 'hidden';
  metadata: {
    source: string;
    device: string;
    ipAddress: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FeedLike {
  id: string;
  userId: string;
  targetType: 'post' | 'comment' | 'message';
  targetId: string;
  reactionType: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  createdAt: string;
}

export interface FeedShare {
  id: string;
  userId: string;
  postId: string;
  content?: string;
  visibility: 'public' | 'connections' | 'private';
  createdAt: string;
}

// Feed API Response Types
export interface FeedResponse {
  success: boolean;
  data: FeedPost[];
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

export interface PostResponse {
  success: boolean;
  data: FeedPost;
  error?: string;
}

export interface CommentResponse {
  success: boolean;
  data: FeedComment[];
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

// Feed Creation Types
export interface CreatePostData {
  content: {
    text: string;
    images?: string[];
    videos?: string[];
    links?: {
      url: string;
      title?: string;
      description?: string;
      image?: string;
    }[];
  };
  visibility?: {
    type: 'public' | 'connections' | 'private';
    audience?: string[];
  };
  hashtags?: string[];
  mentions?: string[];
  location?: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

export interface CreateCommentData {
  content: string;
  parentComment?: string;
  mentions?: string[];
  hashtags?: string[];
}

// Feed Filter Types
export interface FeedFilters {
  type?: 'all' | 'following' | 'trending' | 'recent';
  hashtags?: string[];
  mentions?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  engagement?: {
    minLikes?: number;
    minComments?: number;
    minShares?: number;
  };
}

// Feed Analytics Types
export interface FeedAnalytics {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalViews: number;
  averageEngagement: number;
  topHashtags: {
    tag: string;
    count: number;
  }[];
  topPosts: FeedPost[];
  engagementTrend: {
    date: string;
    likes: number;
    comments: number;
    shares: number;
  }[];
}
