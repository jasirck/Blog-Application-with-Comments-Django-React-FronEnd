import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/PostList';

const App = () => {
  return (
    <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    </Provider>
  );
};

export default App;
