import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../api';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        const [postRes, commentsRes] = await Promise.all([
          axiosInstance.get(`api/posts/${id}/`),  
          axiosInstance.get(`api/posts/${id}/comments/`)
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        setError(err.response?.data || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`api/posts/${id}/comments/`, {
        content: newComment
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      setError(err.response?.data || 'Failed to post comment');
    }
  };

  const handleLike = async () => {
    try {
      if (post.is_liked) {
        await axiosInstance.delete(`api/posts/${id}/like/`);
        setPost({
          ...post,
          likes_count: post.likes_count - 1,
          is_liked: false
        });
      } else {
        await axiosInstance.post(`api/posts/${id}/like/`);
        setPost({
          ...post,
          likes_count: post.likes_count + 1,
          is_liked: true
        });
      }
    } catch (err) {
      setError(err.response?.data || 'Failed to update like');
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`api/posts/${id}/`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Failed to delete post');
    }
  };

  if (loading) return <div className="text-center p-4">Loading post...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!post) return <div className="text-center p-4">Post not found</div>;

  const isAuthor = user  === post.author.username;
  

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <article className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          {isAuthor && (
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate(`/edit-post/${post.id}`)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button 
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 mb-2">By {post.author.username}</p>
        <p className="text-gray-500 text-sm mb-4">
          {new Date(post.created_at).toLocaleString()}
        </p>
        
        <div className="prose max-w-none mb-6">
          <p className="whitespace-pre-line">{post.content}</p>
        </div>
        
        <div className="flex items-center mb-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 ${post.is_liked ? 'text-red-500' : 'text-gray-500'}`}
            disabled={!user}
          >
            <span>♥</span>
            <span>{post.likes_count}</span>
          </button>
        </div>
      </article>

      <section className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>
        
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded mb-2 h-24"
              placeholder="Write a comment..."
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <p className="mb-6 text-gray-500">
            Please <button onClick={() => navigate('/login')} className="text-blue-500 hover:underline">login</button> to comment
          </p>
        )}
        
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="border-b pb-4 last:border-0">
              <div className="flex justify-between">
                <p className="font-medium">{comment.user.username}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
              <p className="mt-1 text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;