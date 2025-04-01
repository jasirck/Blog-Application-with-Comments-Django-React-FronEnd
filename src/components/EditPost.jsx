import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../api';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    tags: [],
    is_published: false
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`api/posts/${id}/`);
        

        setPostData({
          title: response.data.title,
          content: response.data.content,
          tags: response.data.tags.map(tag => tag.name),
          is_published: response.data.is_published
        });
      } catch (err) {
        setError(err.response?.data || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`api/posts/${id}/`, {
        title: postData.title,
        content: postData.content,
        is_published: postData.is_published,
        tags: postData.tags
      });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data || 'Failed to update post');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !postData.tags.includes(tagInput.trim())) {
      setPostData({
        ...postData,
        tags: [...postData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setPostData({
      ...postData,
      tags: postData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  if (loading) return <div className="text-center p-4">Loading post...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={postData.title}
            onChange={(e) => setPostData({ ...postData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Content</label>
          <textarea
            className="w-full p-2 border rounded h-40"
            value={postData.content}
            onChange={(e) => setPostData({ ...postData, content: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Tags</label>
          <div className="flex mb-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {postData.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 px-2 py-1 rounded flex items-center">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="publish"
            checked={postData.is_published}
            onChange={(e) => setPostData({ ...postData, is_published: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="publish">Publish post</label>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;