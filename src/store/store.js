import { configureStore } from '@reduxjs/toolkit';
import authReducer from './adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
