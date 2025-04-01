import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('user') || null,
  token: localStorage.getItem('token') || null,
  refresh_token: localStorage.getItem('refresh_token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refresh_token = action.payload.refresh_token;

      localStorage.setItem('user', action.payload.user);
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('refresh_token', action.payload.refresh_token);

    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refresh_token = null;


      localStorage.clear();
    },
   
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
