import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { postsLoading, postsReceived, postsFailed } from '../redux/postsSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, status, error } = useSelector(state => state.posts);
  const { user } = useSelector(state => state.auth);
  
  // State for filters, search, and sort
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [publishedStatus, setPublishedStatus] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [availableTags, setAvailableTags] = useState([]);
  const [availableAuthors, setAvailableAuthors] = useState([]);

  // Fetch tags separately since they might not be in all posts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('tags/');
        setAvailableTags(response.data);
      } catch (err) {
        console.error('Failed to fetch tags:', err);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const getPosts = async () => {
      dispatch(postsLoading());
      try {
        // Build query parameters based on filters
        const params = new URLSearchParams();
        
        if (searchTerm) params.append('search', searchTerm);
        if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
        if (selectedAuthor) params.append('author', selectedAuthor);
        if (publishedStatus !== 'all') params.append('is_published', publishedStatus === 'published');
        params.append('sort', sortOption);
        
        const response = await axios.get(`posts/?${params.toString()}`);
        dispatch(postsReceived(response.data));
        
        // Extract unique authors for filter options
        const authors = new Set();
        response.data.forEach(post => authors.add(post.author.username));
        setAvailableAuthors(Array.from(authors));
      } catch (err) {
        dispatch(postsFailed(err.response?.data?.message || 'Failed to load posts'));
      }
    };

    if (user) {
      getPosts();
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, user, searchTerm, selectedTags, selectedAuthor, publishedStatus, sortOption]);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId) 
        : [...prev, tagId]
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSelectedAuthor('');
    setPublishedStatus('all');
    setSortOption('newest');
  };

  if (status === 'loading') return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading posts...</p>
      </div>
    </div>
  );

  if (status === 'failed') return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <p className="font-medium">Error loading posts:</p>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recent Posts</h1>
        {user && (
          <button
            onClick={() => navigate('/create-post')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create Post
          </button>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Posts
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Search by title or content..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Author Filter */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Author
            </label>
            <select
              id="author"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
            >
              <option value="">All Authors</option>
              {availableAuthors.map(author => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>
          </div>

          {/* Published Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Publication Status
            </label>
            <select
              id="status"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={publishedStatus}
              onChange={(e) => setPublishedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {/* Sort Option */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Tags Filter */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.id)}
                  className={`px-3 py-1 rounded-full text-sm ${selectedTags.includes(tag.id) 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'}`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedTags.length > 0 || selectedAuthor || publishedStatus !== 'all') && (
          <div className="mt-4">
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No posts found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filters</p>
          <div className="mt-6">
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <div
              key={post.id}
              className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer border ${
                post.is_published ? 'border-gray-100' : 'border-yellow-200'
              }`}
              onClick={() => handlePostClick(post.id)}
            >
              {!post.is_published && (
                <div className="bg-yellow-50 text-yellow-800 text-xs font-medium px-3 py-1">
                  Draft
                </div>
              )}
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-gray-600 mb-3 flex items-center">
                  <span className="truncate">By {post.author.username}</span>
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {post.likes_count || 0}
                    </span>
                    <span className="flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {post.comments_count || 0}
                    </span>
                  </div>
                  <span className="text-xs">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600">
                        {tag.name}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;