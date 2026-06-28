// store.js
import { configureStore } from '@reduxjs/toolkit';
import registrationReducer from '../Slices/registrationSlice';
import authReducer from '../Slices/authSlice';

export const store = configureStore({
  reducer: {
    registration: registrationReducer, // ← this key, not "register" or anything else
    auth: authReducer,
  },
});