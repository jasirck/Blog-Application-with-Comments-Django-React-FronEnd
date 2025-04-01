import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../api";
import Comment from "./Comment";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isTogglingLike, setIsTogglingLike] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        const [postRes, commentsRes] = await Promise.all([
          axiosInstance.get(`posts/${id}/`),
          axiosInstance.get(`posts/${id}/comments/`),
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingComment(true);
    try {
      const response = await axiosInstance.post(`posts/${id}/comments/`, {
        content: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsTogglingLike(true);
    try {
      if (post.is_liked) {
        await axiosInstance.delete(`posts/${id}/like/`);
        setPost({
          ...post,
          likes_count: post.likes_count - 1,
          is_liked: false,
        });
      } else {
        await axiosInstance.post(`posts/${id}/like/`);
        setPost({
          ...post,
          likes_count: post.likes_count + 1,
          is_liked: true,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update like");
    } finally {
      setIsTogglingLike(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axiosInstance.delete(`posts/${id}/`);
        navigate("/");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete post");
      }
    }
  };

  const updateComment = (updatedComment) => {
    setComments(
      comments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  };

  const deleteComment = (commentId) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <p>{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-2 text-blue-600 hover:text-blue-800"
        >
          Return to homepage
        </button>
      </div>
    </div>
  );

  if (!post) return (
    <div className="text-center py-12">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="mt-2 text-lg font-medium text-gray-900">Post not found</h3>
      <button
        onClick={() => navigate('/')}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Browse all posts
      </button>
    </div>
  );

  const isAuthor = user  === post.author.username;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
          {isAuthor && (
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(`/edit-post/${post.id}`)}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 flex items-center"
              >
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
            {post.author.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{post.author.username}</p>
            <p className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="prose max-w-none mb-6">
          <p className="whitespace-pre-line text-gray-700">{post.content}</p>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            disabled={isTogglingLike}
            className={`flex items-center space-x-1 ${post.is_liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-600 transition-colors`}
          >
            <svg className="h-6 w-6" fill={post.is_liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{post.likes_count}</span>
          </button>
          
          <div className="flex items-center space-x-1 text-gray-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{comments.length} comments</span>
          </div>
        </div>
      </article>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h2>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Add your comment
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your thoughts..."
              rows="4"
              required
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingComment || !newComment.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmittingComment ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </>
                ) : "Post Comment"}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded mb-6">
            <p>
              Please{' '}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-700 hover:text-blue-900 font-medium underline"
              >
                login
              </button>{' '}
              to leave a comment
            </p>
          </div>
        )}

        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                postId={id}
                currentUser={user}
                onUpdate={updateComment}
                onDelete={deleteComment}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;