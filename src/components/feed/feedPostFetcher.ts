/**
 * FeedPost Fetcher Functions
 * API calls and data fetching for FeedPost component
 */

import apiServices from '../../services/apiServices';

// API endpoints
const ENDPOINTS = {
  POSTS: '/feed',
  POST: (id: string) => `/feed/${id}`,
  POST_LIKE: (id: string) => `/feed/${id}/like`,
  POST_COMMENTS: (id: string) => `/feed/${id}/comments`,
  POST_COMMENT: (id: string) => `/feed/${id}/comments`,
  POST_SHARE: (id: string) => `/feed/${id}/share`,
  POST_SAVE: (id: string) => `/feed/${id}/save`
};

// Fetch functions
export const fetchers = {
  // Get all posts
  getPosts: async (params: any = {}) => {
    try {
      const response = await apiServices.getFeedPosts(params);
      return {
        success: true,
        data: response.data || [],
        pagination: response.pagination,
        error: null
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      return {
        success: false,
        data: fallbackData.posts,
        pagination: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  },

  // Get single post
  getPost: async (postId: string) => {
    try {
      const response = await apiServices.getFeedPosts({ id: postId });
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error fetching post:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  },

  // Create new post
  createPost: async (postData: any) => {
    try {
      const response = await apiServices.createFeedPost(postData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error creating post:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  },

  // Update post
  updatePost: async (postId: string, postData: any) => {
    try {
      const response = await apiServices.updateFeedPost(postId, postData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error updating post:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  },

  // Delete post
  deletePost: async (postId: string) => {
    try {
      const response = await apiServices.deleteFeedPost(postId);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error deleting post:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  },

  // Like/unlike post
  togglePostLike: async (postId: string, reactionType: string = 'like') => {
    try {
      const response = await apiServices.likeFeedPost(postId, reactionType);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error toggling post like:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  },

  // Get post comments
  getPostComments: async (postId: string, params: any = {}) => {
    try {
      const response = await apiServices.getFeedPosts({ postId, ...params });
      return {
        success: true,
        data: response.data || [],
        pagination: response.pagination,
        error: null
      };
    } catch (error) {
      console.error('Error fetching post comments:', error);
      return {
        success: false,
        data: fallbackData.comments,
        pagination: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  },

  // Add comment to post
  addPostComment: async (postId: string, commentData: any) => {
    try {
      const response = await apiServices.addFeedPostComment(postId, commentData);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error adding post comment:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  },

  // Share post
  sharePost: async (postId: string, shareData: any) => {
    try {
      // This would be implemented when share functionality is added
      const response = await apiServices.createFeedPost({ ...shareData, postId });
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error sharing post:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  },

  // Save/unsave post
  togglePostSave: async (postId: string) => {
    try {
      // This would be implemented when save functionality is added
      const response = await apiServices.createFeedPost({ postId, action: 'save' });
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error toggling post save:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};

// Error handling
export const errorHandlers = {
  handleFetchError: (error: any, fallbackData: any) => {
    console.error('Fetch error:', error);
    return {
      success: false,
      data: fallbackData,
      error: error.message
    };
  },

  handleNetworkError: (error: any) => {
    console.error('Network error:', error);
    return {
      success: false,
      data: null,
      error: 'Network error. Please check your connection.'
    };
  },

  handleAuthError: (error: any) => {
    console.error('Authentication error:', error);
    return {
      success: false,
      data: null,
      error: 'Authentication required. Please log in.'
    };
  },

  handleValidationError: (error: any) => {
    console.error('Validation error:', error);
    return {
      success: false,
      data: null,
      error: 'Invalid data. Please check your input.'
    };
  }
};

// Fallback data
export const fallbackData = {
  posts: [
    {
      id: 'fallback-1',
      author: {
        userId: 'user-1',
        name: 'John Doe',
        title: 'Software Developer',
        avatar: '/api/placeholder/40/40',
        verified: false
      },
      content: {
        text: 'This is a fallback post when the API is unavailable.',
        images: [],
        videos: [],
        links: []
      },
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 1
      },
      visibility: {
        type: 'public',
        audience: []
      },
      hashtags: ['fallback'],
      mentions: [],
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  comments: [
    {
      id: 'comment-1',
      postId: 'fallback-1',
      author: {
        userId: 'user-2',
        name: 'Jane Smith',
        avatar: '/api/placeholder/32/32'
      },
      content: 'This is a fallback comment.',
      engagement: {
        likes: 0,
        replies: 0
      },
      mentions: [],
      hashtags: [],
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

// Retry logic
export const retryLogic = {
  retryWithBackoff: async (fn: any, maxRetries: number = 3, baseDelay: number = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  },

  retryOnNetworkError: async (fn: any) => {
    return retryLogic.retryWithBackoff(fn, 3, 1000);
  },

  retryOnAuthError: async (fn: any) => {
    return retryLogic.retryWithBackoff(fn, 2, 500);
  }
};

// Caching
export const cache = {
  postsCache: new Map(),
  commentsCache: new Map(),
  
  set: (key: any, data: any, ttl: number = 300000) => { // 5 minutes default TTL
    cache.postsCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  },
  
  get: (key: any) => {
    const cached = cache.postsCache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      cache.postsCache.delete(key);
      return null;
    }
    
    return cached.data;
  },
  
  clear: () => {
    cache.postsCache.clear();
    cache.commentsCache.clear();
  }
};

// Batch operations
export const batchOperations = {
  batchLikePosts: async (postIds: string[], reactionType: string = 'like') => {
    const promises = postIds.map(id => fetchers.togglePostLike(id, reactionType));
    return Promise.allSettled(promises);
  },
  
  batchDeletePosts: async (postIds: string[]) => {
    const promises = postIds.map(id => fetchers.deletePost(id));
    return Promise.allSettled(promises);
  },
  
  batchGetPosts: async (postIds: string[]) => {
    const promises = postIds.map(id => fetchers.getPost(id));
    return Promise.allSettled(promises);
  }
};

export default {
  ENDPOINTS,
  fetchers,
  errorHandlers,
  fallbackData,
  retryLogic,
  cache,
  batchOperations
};
