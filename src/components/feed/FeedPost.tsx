import React, { useState } from 'react';
import { 
  User, MoreHorizontal, X, ThumbsUp, MessageCircle, Share2, Send,
  ChevronDown, Smile, MapPin, Calendar, ExternalLink, Globe, Image, Bookmark
} from 'lucide-react';
import { FeedPost as FeedPostType } from '../../types/feed';
import { apiServices } from '../../core/api/ApiService';

interface FeedPostProps {
  post: FeedPostType;
}

const FeedPost: React.FC<FeedPostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [likes, setLikes] = useState(post.engagement.likes);

  const handleLike = async () => {
    try {
      const response = await apiServices.likeFeedPost(post.id);
      if (response.success) {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      try {
        const response = await apiServices.addFeedPostComment(post.id, {
          content: commentText
        });
        if (response.success) {
          setCommentText('');
          // Optionally reload comments
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src={post.author.avatar || '/api/placeholder/40/40'} 
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-1">
                <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                {post.author.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">{post.author.title}</p>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <Globe className="w-3 h-3" />
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content.text}</p>
        
        {/* Post Images */}
        {post.content.images && post.content.images.length > 0 && (
          <div className="mt-3 space-y-2">
            {post.content.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full rounded-lg"
              />
            ))}
          </div>
        )}

        {/* Post Links */}
        {post.content.links && post.content.links.length > 0 && (
          <div className="mt-3 space-y-2">
            {post.content.links.map((link, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-3">
                  <h4 className="font-semibold text-gray-900">{link.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                  <div className="flex items-center mt-2 text-blue-600">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    <span className="text-sm">View link</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {post.hashtags.map((tag, index) => (
              <span key={index} className="text-blue-600 text-sm hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-gray-50 ${
                isLiked ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likes}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-gray-50 text-gray-600"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{post.engagement.comments}</span>
            </button>
            
            <button className="flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-gray-50 text-gray-600">
              <Share2 className="w-4 h-4" />
              <span className="text-sm">{post.engagement.shares}</span>
            </button>
          </div>
          
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-1 rounded-full hover:bg-gray-50 ${
              isSaved ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 p-4">
          <form onSubmit={handleComment} className="flex items-center space-x-2 mb-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          
          {/* Comments would be loaded here */}
          <div className="text-sm text-gray-500 text-center py-2">
            Comments will be loaded here
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedPost;
