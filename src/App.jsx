import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import  store  from './redux/store';
import HomePage from './components/HomePage';
import PostDetail from './components/PostDetail';
import CreatePost from './components/CreatePost';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from './components/Navbar';
import EditPost from './components/EditPost';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;