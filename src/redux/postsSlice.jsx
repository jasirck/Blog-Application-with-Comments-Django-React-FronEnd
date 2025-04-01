import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postsLoading(state) {
      state.status = 'loading';
    },
    postsReceived(state, action) {
      state.status = 'succeeded';
      state.posts = action.payload;
    },
    postsFailed(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    postAdded(state, action) {
      state.posts.unshift(action.payload);
    }
  }
});


export const { setPosts, setStatus } = postsSlice.actions;


export const { postsLoading, postsReceived, postsFailed, postAdded } = postsSlice.actions;
export default postsSlice.reducer;
