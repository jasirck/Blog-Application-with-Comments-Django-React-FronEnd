import React, { useState } from 'react';
import axios from '../../api';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [CunformPassword, setCunformPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      if (password !== CunformPassword) {
        setError('Passwords do not match');
        return;
      }
      const response = await axios.post('auth/register/', { username, email, password });
      dispatch(login(response.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form className="bg-white p-8 shadow-lg rounded-lg w-80" onSubmit={handleRegister}>
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border mb-4 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Cunform Password"
          className="w-full p-2 border mb-4 rounded"
          value={CunformPassword}
          onChange={(e) => setCunformPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Register
        </button>
        <p className="mt-4 text-center text-gray-600 cursor-pointer" onClick={() => navigate('/login')}>I have an account? </p>
      </form>
    </div>
  );
};

export default Register;
