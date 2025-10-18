/**
 * FeedPost Helper Functions
 * Utility functions for FeedPost component
 */

// Constants
export const CONSTANTS = {
  MAX_POST_LENGTH: 2000,
  MAX_COMMENT_LENGTH: 500,
  MAX_HASHTAGS: 10,
  MAX_MENTIONS: 5,
  REACTION_TYPES: ['like', 'love', 'laugh', 'wow', 'sad', 'angry'],
  POST_STATUS: ['published', 'draft', 'archived', 'deleted'],
  VISIBILITY_TYPES: ['public', 'connections', 'private']
};

// Validation functions
export const validate = {
  postContent: (content) => {
    if (!content || typeof content !== 'string') {
      return { isValid: false, error: 'Content is required' };
    }
    if (content.length > CONSTANTS.MAX_POST_LENGTH) {
      return { isValid: false, error: `Content exceeds ${CONSTANTS.MAX_POST_LENGTH} characters` };
    }
    return { isValid: true };
  },

  commentContent: (content) => {
    if (!content || typeof content !== 'string') {
      return { isValid: false, error: 'Comment content is required' };
    }
    if (content.length > CONSTANTS.MAX_COMMENT_LENGTH) {
      return { isValid: false, error: `Comment exceeds ${CONSTANTS.MAX_COMMENT_LENGTH} characters` };
    }
    return { isValid: true };
  },

  hashtags: (hashtags) => {
    if (!Array.isArray(hashtags)) {
      return { isValid: false, error: 'Hashtags must be an array' };
    }
    if (hashtags.length > CONSTANTS.MAX_HASHTAGS) {
      return { isValid: false, error: `Maximum ${CONSTANTS.MAX_HASHTAGS} hashtags allowed` };
    }
    return { isValid: true };
  },

  mentions: (mentions) => {
    if (!Array.isArray(mentions)) {
      return { isValid: false, error: 'Mentions must be an array' };
    }
    if (mentions.length > CONSTANTS.MAX_MENTIONS) {
      return { isValid: false, error: `Maximum ${CONSTANTS.MAX_MENTIONS} mentions allowed` };
    }
    return { isValid: true };
  },

  reactionType: (reaction) => {
    if (!CONSTANTS.REACTION_TYPES.includes(reaction)) {
      return { isValid: false, error: 'Invalid reaction type' };
    }
    return { isValid: true };
  }
};

// Utility functions
export const utils = {
  extractHashtags: (text) => {
    const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
    const hashtags = text.match(hashtagRegex) || [];
    return hashtags.map(tag => tag.substring(1)); // Remove # symbol
  },

  extractMentions: (text) => {
    const mentionRegex = /@[\w\u0590-\u05ff]+/g;
    const mentions = text.match(mentionRegex) || [];
    return mentions.map(mention => mention.substring(1)); // Remove @ symbol
  },

  formatEngagementCount: (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  },

  calculateEngagementRate: (likes, comments, shares, views) => {
    if (views === 0) return 0;
    const totalEngagement = likes + comments + shares;
    return ((totalEngagement / views) * 100).toFixed(1);
  },

  isPostLiked: (post, userId) => {
    return post.likes && post.likes.some(like => like.userId === userId);
  },

  isPostSaved: (post, userId) => {
    return post.savedBy && post.savedBy.includes(userId);
  },

  canEditPost: (post, userId) => {
    return post.author.userId === userId;
  },

  canDeletePost: (post, userId, userRole) => {
    return post.author.userId === userId || userRole === 'super_admin';
  }
};

// Formatting functions
export const formatters = {
  formatPostDate: (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 604800)}w`;
    return date.toLocaleDateString();
  },

  formatPostContent: (content) => {
    // Convert hashtags to clickable links
    let formatted = content.replace(/#[\w\u0590-\u05ff]+/g, '<span class="hashtag">$&</span>');
    
    // Convert mentions to clickable links
    formatted = formatted.replace(/@[\w\u0590-\u05ff]+/g, '<span class="mention">$&</span>');
    
    // Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    formatted = formatted.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Convert line breaks to <br> tags
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  },

  formatEngagementStats: (post) => {
    const { likes, comments, shares, views } = post.engagement;
    const totalEngagement = likes + comments + shares;
    const engagementRate = utils.calculateEngagementRate(likes, comments, shares, views);
    
    return {
      totalEngagement,
      engagementRate: `${engagementRate}%`,
      formattedLikes: utils.formatEngagementCount(likes),
      formattedComments: utils.formatEngagementCount(comments),
      formattedShares: utils.formatEngagementCount(shares),
      formattedViews: utils.formatEngagementCount(views)
    };
  },

  formatPostVisibility: (visibility) => {
    const visibilityMap = {
      'public': 'Public',
      'connections': 'Connections only',
      'private': 'Private'
    };
    return visibilityMap[visibility] || 'Unknown';
  }
};

// Content processing functions
export const contentProcessors = {
  processPostContent: (content) => {
    const hashtags = utils.extractHashtags(content);
    const mentions = utils.extractMentions(content);
    const formattedContent = formatters.formatPostContent(content);
    
    return {
      originalContent: content,
      formattedContent,
      hashtags,
      mentions,
      wordCount: content.split(' ').length,
      characterCount: content.length
    };
  },

  processImageContent: (images) => {
    if (!Array.isArray(images)) return [];
    
    return images.map(image => ({
      url: image,
      alt: `Post image ${images.indexOf(image) + 1}`,
      thumbnail: image, // In a real app, you'd generate thumbnails
      fullSize: image
    }));
  },

  processLinkContent: (links) => {
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

// Post filtering and sorting
export const filters = {
  filterPostsByVisibility: (posts, userRole, userId) => {
    return posts.filter(post => {
      if (post.visibility.type === 'public') return true;
      if (post.visibility.type === 'connections' && userRole !== 'guest') return true;
      if (post.visibility.type === 'private' && post.author.userId === userId) return true;
      return false;
    });
  },

  filterPostsByHashtag: (posts, hashtag) => {
    return posts.filter(post => 
      post.hashtags && post.hashtags.includes(hashtag)
    );
  },

  filterPostsByUser: (posts, userId) => {
    return posts.filter(post => post.author.userId === userId);
  },

  sortPostsByDate: (posts, order = 'desc') => {
    return posts.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
  },

  sortPostsByEngagement: (posts) => {
    return posts.sort((a, b) => {
      const engagementA = a.engagement.likes + a.engagement.comments + a.engagement.shares;
      const engagementB = b.engagement.likes + b.engagement.comments + b.engagement.shares;
      return engagementB - engagementA;
    });
  }
};

// Error handling
export const errorHandlers = {
  handlePostCreationError: (error) => {
    console.error('Post creation error:', error);
    return {
      success: false,
      message: 'Failed to create post. Please try again.',
      error: error.message
    };
  },

  handlePostUpdateError: (error) => {
    console.error('Post update error:', error);
    return {
      success: false,
      message: 'Failed to update post. Please try again.',
      error: error.message
    };
  },

  handlePostDeleteError: (error) => {
    console.error('Post deletion error:', error);
    return {
      success: false,
      message: 'Failed to delete post. Please try again.',
      error: error.message
    };
  }
};

export default {
  CONSTANTS,
  validate,
  utils,
  formatters,
  contentProcessors,
  filters,
  errorHandlers
};
