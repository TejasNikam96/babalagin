// Tracks the logged-in matrimonial profile user (separate from admin auth).
// The 30-minute idle timeout is enforced server-side via the session token; the
// client just keeps the token and logs out when the server reports it invalid
// (see SessionValidator).
import { createSlice } from '@reduxjs/toolkit';

const KEY = 'profileUser';

function persist(user) {
  try {
    if (user) sessionStorage.setItem(KEY, JSON.stringify(user));
    else sessionStorage.removeItem(KEY);
  } catch (e) { /* ignore */ }
}

function loadUser() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: loadUser() },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      persist(action.payload);
    },
    logout: (state) => {
      state.user = null;
      persist(null);
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
