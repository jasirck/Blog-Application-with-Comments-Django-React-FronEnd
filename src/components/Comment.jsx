import React, { useState } from 'react';
import axiosInstance from '../api';

const Comment = ({ comment, postId, currentUser, onUpdate, onDelete, depth = 0 }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const maxDepth = 5;
  const canReply = depth < maxDepth;
  const isAuthor = currentUser  === comment.user.username;

  const handleUpdate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`comments/${comment.id}/`, {
        content: editedContent
      });
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setIsLoading(true);
      setError(null);
      try {
        await axiosInstance.delete(`comments/${comment.id}/`);
        onDelete(comment.id);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete comment');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReply = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(`posts/${postId}/comments/`, {
        content: replyContent,
        parent_id: comment.id
      });
      
      const updatedComment = {
        ...comment,
        replies: [...(comment.replies || []), response.data]
      };
      
      onUpdate(updatedComment);
      setIsReplying(false);
      setReplyContent('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post reply');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`relative pl-6 mb-4 ${depth > 0 ? 'mt-3' : ''}`}
      style={{ marginLeft: depth > 0 ? '1.5rem' : '0' }}
    >
      {/* Vertical line for nested comments */}
      {depth > 0 && (
        <div className="absolute top-0 left-0 bottom-0 w-0.5 bg-gray-200"></div>
      )}

      {/* Comment Card */}
      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
        {/* Comment Header */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-800">{comment.user.username}</span>
            <span className="text-xs text-gray-500">
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </div>
          
          {isAuthor && (
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                disabled={isLoading}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              <button 
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <div className="mb-3">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              rows="3"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 mb-3 whitespace-pre-line">{comment.content}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 text-sm">
          {currentUser && canReply && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {isReplying ? 'Cancel Reply' : 'Reply'}
            </button>
          )}
        </div>

        {/* Reply Form */}
        {isReplying && (
          <div className="mt-4 pl-4 border-l-2 border-blue-100">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your reply..."
              disabled={isLoading}
              rows="3"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setIsReplying(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isLoading || !replyContent.trim()}
              >
                {isLoading ? 'Posting...' : 'Post Reply'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <Comment 
              key={reply.id}
              comment={reply}
              postId={postId}
              currentUser={currentUser}
              onUpdate={(updatedReply) => {
                const updatedReplies = comment.replies.map(r => 
                  r.id === updatedReply.id ? updatedReply : r
                );
                onUpdate({...comment, replies: updatedReplies});
              }}
              onDelete={(deletedId) => {
                const updatedReplies = comment.replies.filter(r => r.id !== deletedId);
                onUpdate({...comment, replies: updatedReplies});
              }}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;