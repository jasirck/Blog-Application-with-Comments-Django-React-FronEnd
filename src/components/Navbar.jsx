import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../redux/authSlice';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="bg-gray-700 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Blog App</Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/create-post" className="hover:underline">Create Post</Link>
              <button onClick={() => dispatch(logout())} className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;