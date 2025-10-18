/**
 * FeedPost Transformer Functions
 * Data transformation for FeedPost component
 */

import { formatters, utils, contentProcessors } from './FeedPostHelper';

// Transform API response to component props
export const transformers = {
  // Transform post data for display
  transformPost: (apiPost) => {
    if (!apiPost) return null;
    
    return {
      id: apiPost.id,
      author: {
        userId: apiPost.author?.userId || apiPost.author?.id,
        name: apiPost.author?.name || 'Unknown User',
        title: apiPost.author?.title || 'No Title',
        avatar: apiPost.author?.avatar || '/api/placeholder/40/40',
        verified: apiPost.author?.verified || false,
        connection: apiPost.author?.connection || 'unknown'
      },
      content: {
        text: apiPost.content?.text || '',
        images: apiPost.content?.images || [],
        videos: apiPost.content?.videos || [],
        links: apiPost.content?.links || []
      },
      engagement: {
        likes: apiPost.engagement?.likes || 0,
        comments: apiPost.engagement?.comments || 0,
        shares: apiPost.engagement?.shares || 0,
        views: apiPost.engagement?.views || 0
      },
      visibility: {
        type: apiPost.visibility?.type || 'public',
        audience: apiPost.visibility?.audience || []
      },
      hashtags: apiPost.hashtags || [],
      mentions: apiPost.mentions || [],
      status: apiPost.status || 'published',
      createdAt: apiPost.createdAt,
      updatedAt: apiPost.updatedAt,
      formattedDate: formatters.formatPostDate(apiPost.createdAt),
      formattedContent: formatters.formatPostContent(apiPost.content?.text || ''),
      engagementStats: formatters.formatEngagementStats(apiPost)
    };
  },

  // Transform multiple posts
  transformPosts: (apiPosts) => {
    if (!Array.isArray(apiPosts)) return [];
    
    return apiPosts.map(post => transformers.transformPost(post));
  },

  // Transform comment data
  transformComment: (apiComment) => {
    if (!apiComment) return null;
    
    return {
      id: apiComment.id,
      postId: apiComment.postId,
      author: {
        userId: apiComment.author?.userId || apiComment.author?.id,
        name: apiComment.author?.name || 'Unknown User',
        avatar: apiComment.author?.avatar || '/api/placeholder/32/32'
      },
      content: apiComment.content || '',
      engagement: {
        likes: apiComment.engagement?.likes || 0,
        replies: apiComment.engagement?.replies || 0
      },
      mentions: apiComment.mentions || [],
      hashtags: apiComment.hashtags || [],
      status: apiComment.status || 'active',
      createdAt: apiComment.createdAt,
      updatedAt: apiComment.updatedAt,
      formattedDate: formatters.formatPostDate(apiComment.createdAt),
      formattedContent: formatters.formatPostContent(apiComment.content || '')
    };
  },

  // Transform multiple comments
  transformComments: (apiComments) => {
    if (!Array.isArray(apiComments)) return [];
    
    return apiComments.map(comment => transformers.transformComment(comment));
  }
};

// Business logic
export const businessLogic = {
  // Determine if user can interact with post
  canUserInteract: (post, userId, userRole) => {
    if (!post || !userId) return false;
    
    // User can always interact with their own posts
    if (post.author.userId === userId) return true;
    
    // Check visibility rules
    if (post.visibility.type === 'public') return true;
    if (post.visibility.type === 'connections' && userRole !== 'guest') return true;
    if (post.visibility.type === 'private' && post.author.userId === userId) return true;
    
    return false;
  },

  // Determine if user can edit post
  canUserEdit: (post, userId, userRole) => {
    if (!post || !userId) return false;
    
    // User can edit their own posts
    if (post.author.userId === userId) return true;
    
    // Super admin can edit any post
    if (userRole === 'super_admin') return true;
    
    return false;
  },

  // Determine if user can delete post
  canUserDelete: (post, userId, userRole) => {
    if (!post || !userId) return false;
    
    // User can delete their own posts
    if (post.author.userId === userId) return true;
    
    // Super admin can delete any post
    if (userRole === 'super_admin') return true;
    
    return false;
  },

  // Calculate post engagement score
  calculateEngagementScore: (post) => {
    const { likes, comments, shares, views } = post.engagement;
    const totalEngagement = likes + comments + shares;
    const engagementRate = views > 0 ? (totalEngagement / views) * 100 : 0;
    
    // Weighted score: likes (1x), comments (2x), shares (3x)
    const weightedScore = likes + (comments * 2) + (shares * 3);
    
    return {
      totalEngagement,
      engagementRate: parseFloat(engagementRate.toFixed(2)),
      weightedScore,
      isHighEngagement: engagementRate > 5,
      isViral: engagementRate > 20
    };
  },

  // Determine post priority for feed
  calculatePostPriority: (post, userPreferences = {}) => {
    const engagementScore = businessLogic.calculateEngagementScore(post);
    const timeDecay = Math.max(0, 1 - (Date.now() - new Date(post.createdAt).getTime()) / (24 * 60 * 60 * 1000));
    
    let priority = 0;
    
    // Base priority from engagement
    priority += engagementScore.weightedScore * 0.4;
    
    // Time decay factor
    priority += timeDecay * 0.3;
    
    // User preferences
    if (userPreferences.followedUsers && post.author.userId in userPreferences.followedUsers) {
      priority += 0.2;
    }
    
    if (userPreferences.interests && post.hashtags.some(tag => userPreferences.interests.includes(tag))) {
      priority += 0.1;
    }
    
    return priority;
  }
};

// Data mapping
export const mappers = {
  // Map post data for different views
  mapPostForFeed: (post) => {
    return {
      ...post,
      displayType: 'feed',
      showFullContent: true,
      showEngagement: true,
      showActions: true
    };
  },

  mapPostForDetail: (post) => {
    return {
      ...post,
      displayType: 'detail',
      showFullContent: true,
      showEngagement: true,
      showActions: true,
      showComments: true
    };
  },

  mapPostForProfile: (post) => {
    return {
      ...post,
      displayType: 'profile',
      showFullContent: false,
      showEngagement: true,
      showActions: false
    };
  },

  // Map post data for editing
  mapPostForEdit: (post) => {
    return {
      id: post.id,
      content: post.content.text,
      visibility: post.visibility.type,
      hashtags: post.hashtags,
      mentions: post.mentions,
      status: post.status
    };
  },

  // Map post data for creation
  mapPostForCreate: (formData) => {
    const processedContent = contentProcessors.processPostContent(formData.content);
    
    return {
      content: {
        text: formData.content,
        images: formData.images || [],
        videos: formData.videos || [],
        links: formData.links || []
      },
      visibility: {
        type: formData.visibility || 'public',
        audience: formData.audience || []
      },
      hashtags: processedContent.hashtags,
      mentions: processedContent.mentions,
      status: 'published'
    };
  }
};

// Content processing
export const contentProcessors = {
  // Process post content for display
  processPostContent: (content) => {
    if (!content) return { text: '', formatted: '', hashtags: [], mentions: [] };
    
    const processed = contentProcessors.processPostContent(content);
    return {
      text: processed.originalContent,
      formatted: processed.formattedContent,
      hashtags: processed.hashtags,
      mentions: processed.mentions,
      wordCount: processed.wordCount,
      characterCount: processed.characterCount
    };
  },

  // Process images for display
  processImages: (images) => {
    if (!Array.isArray(images)) return [];
    
    return images.map((image, index) => ({
      url: image,
      alt: `Post image ${index + 1}`,
      thumbnail: image,
      fullSize: image,
      index
    }));
  },

  // Process links for display
  processLinks: (links) => {
    if (!Array.isArray(links)) return [];
    
    return links.map(link => ({
      url: link.url,
      title: link.title || 'Untitled',
      description: link.description || '',
      image: link.image || null,
      domain: new URL(link.url).hostname
    }));
  }
};

// Filter and sort functions
export const filters = {
  // Filter posts by user role and permissions
  filterPostsByUser: (posts, userId, userRole) => {
    return posts.filter(post => businessLogic.canUserInteract(post, userId, userRole));
  },

  // Filter posts by engagement level
  filterPostsByEngagement: (posts, minEngagement = 0) => {
    return posts.filter(post => {
      const score = businessLogic.calculateEngagementScore(post);
      return score.totalEngagement >= minEngagement;
    });
  },

  // Filter posts by date range
  filterPostsByDate: (posts, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return posts.filter(post => {
      const postDate = new Date(post.createdAt);
      return postDate >= start && postDate <= end;
    });
  },

  // Filter posts by hashtags
  filterPostsByHashtags: (posts, hashtags) => {
    if (!Array.isArray(hashtags) || hashtags.length === 0) return posts;
    
    return posts.filter(post => 
      post.hashtags && post.hashtags.some(tag => hashtags.includes(tag))
    );
  },

  // Sort posts by priority
  sortPostsByPriority: (posts, userPreferences = {}) => {
    return posts.sort((a, b) => {
      const priorityA = businessLogic.calculatePostPriority(a, userPreferences);
      const priorityB = businessLogic.calculatePostPriority(b, userPreferences);
      return priorityB - priorityA;
    });
  },

  // Sort posts by engagement
  sortPostsByEngagement: (posts) => {
    return posts.sort((a, b) => {
      const scoreA = businessLogic.calculateEngagementScore(a);
      const scoreB = businessLogic.calculateEngagementScore(b);
      return scoreB.weightedScore - scoreA.weightedScore;
    });
  }
};

// Analytics
export const analytics = {
  // Calculate post performance metrics
  calculatePostMetrics: (post) => {
    const engagementScore = businessLogic.calculateEngagementScore(post);
    const timeSincePost = Date.now() - new Date(post.createdAt).getTime();
    const hoursSincePost = timeSincePost / (1000 * 60 * 60);
    
    return {
      engagementScore,
      hoursSincePost: Math.round(hoursSincePost * 100) / 100,
      engagementPerHour: hoursSincePost > 0 ? engagementScore.totalEngagement / hoursSincePost : 0,
      isTrending: engagementScore.isHighEngagement && hoursSincePost < 24,
      isViral: engagementScore.isViral
    };
  },

  // Calculate user engagement metrics
  calculateUserEngagement: (posts) => {
    if (!Array.isArray(posts) || posts.length === 0) return { totalPosts: 0, totalEngagement: 0, avgEngagement: 0 };
    
    const totalEngagement = posts.reduce((sum, post) => {
      const score = businessLogic.calculateEngagementScore(post);
      return sum + score.totalEngagement;
    }, 0);
    
    return {
      totalPosts: posts.length,
      totalEngagement,
      avgEngagement: totalEngagement / posts.length,
      highEngagementPosts: posts.filter(post => {
        const score = businessLogic.calculateEngagementScore(post);
        return score.isHighEngagement;
      }).length
    };
  }
};

export default {
  transformers,
  businessLogic,
  mappers,
  contentProcessors,
  filters,
  analytics
};
