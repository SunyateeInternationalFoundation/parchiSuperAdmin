import { createSlice } from '@reduxjs/toolkit';

// Get initial state from localStorage (if available)
const storedState = localStorage.getItem('user');
const initialState = storedState ? JSON.parse(storedState) : { token: null, loggedIn: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.token = action.payload.token;
      state.loggedIn = action.payload.loggedIn;
      localStorage.setItem('user', JSON.stringify(state));
    },
    logout: (state) => {
      state.token = null;
      state.loggedIn = false;
      localStorage.removeItem('authState');
    },
  },
});

export const { setAuthState, logout } = authSlice.actions;

export default authSlice.reducer;
