/**
 * FeedPost Fetcher Functions
 * API calls and data fetching for FeedPost component
 */

import apiServices from '../../services/apiServices';

// API endpoints
const ENDPOINTS = {
  POSTS: '/feed',
  POST: (id) => `/feed/${id}`,
  POST_LIKE: (id) => `/feed/${id}/like`,
  POST_COMMENTS: (id) => `/feed/${id}/comments`,
  POST_COMMENT: (id) => `/feed/${id}/comments`,
  POST_SHARE: (id) => `/feed/${id}/share`,
  POST_SAVE: (id) => `/feed/${id}/save`
};

// Fetch functions
export const fetchers = {
  // Get all posts
  getPosts: async (params = {}) => {
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
        error: error.message
      };
    }
  },

  // Get single post
  getPost: async (postId) => {
    try {
      const response = await apiServices.getFeedPost(postId);
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
        error: error.message
      };
    }
  },

  // Create new post
  createPost: async (postData) => {
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
        error: error.message
      };
    }
  },

  // Update post
  updatePost: async (postId, postData) => {
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
        error: error.message
      };
    }
  },

  // Delete post
  deletePost: async (postId) => {
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
        error: error.message
      };
    }
  },

  // Like/unlike post
  togglePostLike: async (postId, reactionType = 'like') => {
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
        error: error.message
      };
    }
  },

  // Get post comments
  getPostComments: async (postId, params = {}) => {
    try {
      const response = await apiServices.getFeedPostComments(postId, params);
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
        error: error.message
      };
    }
  },

  // Add comment to post
  addPostComment: async (postId, commentData) => {
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
        error: error.message
      };
    }
  },

  // Share post
  sharePost: async (postId, shareData) => {
    try {
      // This would be implemented when share functionality is added
      const response = await apiServices.post(`/feed/${postId}/share`, shareData);
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
        error: error.message
      };
    }
  },

  // Save/unsave post
  togglePostSave: async (postId) => {
    try {
      // This would be implemented when save functionality is added
      const response = await apiServices.post(`/feed/${postId}/save`);
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
        error: error.message
      };
    }
  }
};

// Error handling
export const errorHandlers = {
  handleFetchError: (error, fallbackData) => {
    console.error('Fetch error:', error);
    return {
      success: false,
      data: fallbackData,
      error: error.message
    };
  },

  handleNetworkError: (error) => {
    console.error('Network error:', error);
    return {
      success: false,
      data: null,
      error: 'Network error. Please check your connection.'
    };
  },

  handleAuthError: (error) => {
    console.error('Authentication error:', error);
    return {
      success: false,
      data: null,
      error: 'Authentication required. Please log in.'
    };
  },

  handleValidationError: (error) => {
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
  retryWithBackoff: async (fn, maxRetries = 3, baseDelay = 1000) => {
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

  retryOnNetworkError: async (fn) => {
    return retryLogic.retryWithBackoff(fn, 3, 1000);
  },

  retryOnAuthError: async (fn) => {
    return retryLogic.retryWithBackoff(fn, 2, 500);
  }
};

// Caching
export const cache = {
  postsCache: new Map(),
  commentsCache: new Map(),
  
  set: (key, data, ttl = 300000) => { // 5 minutes default TTL
    cache.postsCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  },
  
  get: (key) => {
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
  batchLikePosts: async (postIds, reactionType = 'like') => {
    const promises = postIds.map(id => fetchers.togglePostLike(id, reactionType));
    return Promise.allSettled(promises);
  },
  
  batchDeletePosts: async (postIds) => {
    const promises = postIds.map(id => fetchers.deletePost(id));
    return Promise.allSettled(promises);
  },
  
  batchGetPosts: async (postIds) => {
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
