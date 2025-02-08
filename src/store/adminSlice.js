import { createSlice } from '@reduxjs/toolkit';

// Get initial state from localStorage (if available)
const storedState = localStorage.getItem('user');
const initialState = storedState ? JSON.parse(storedState) : { token: null, loggedIn: false, id: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.token = action.payload.token;
      state.loggedIn = action.payload.loggedIn;
      state.id = action.payload.id;
      localStorage.setItem('user', JSON.stringify(state));
    },
    logout: (state) => {
      state.token = null;
      state.loggedIn = false;
      state.id = null;
      localStorage.removeItem('user');
    },
  },
});

export const { setAuthState, logout } = authSlice.actions;

export default authSlice.reducer;
