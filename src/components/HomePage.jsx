import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { postsLoading, postsReceived, postsFailed } from '../redux/postsSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, status, error } = useSelector(state => state.posts);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    
    if (!user) navigate('/login');
    const getPosts = async () => {
      dispatch(postsLoading());
      try {
        const response = await axios.get('/api/posts/');
        dispatch(postsReceived(response.data));
      } catch (err) {
        dispatch(postsFailed(err.message));
      }
    };
    getPosts();
  }, [dispatch]);

  if (status === 'loading') return <div className="text-center p-8">Loading posts...</div>;
  if (status === 'failed') return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Recent Posts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <div
            key={post.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handlePostClick(post.id)}
          >
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-2">By {post.author.username}</p>
            <p className="text-sm text-gray-500">
              {post.likes_count} likes • {post.comments_count} comments
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
