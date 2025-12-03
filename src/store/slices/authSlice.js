import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // تسجيل الخروج يدوياً
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    // تحديث معلومات المستخدم يدوياً
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // عند نجاح Login
    builder.addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        if (payload.status && payload.data) {
          state.user = payload.data.user;
          state.token = payload.data.token;
          state.isAuthenticated = true;
        }
      }
    );

    // عند نجاح Verify OTP (Login)
    builder.addMatcher(
      api.endpoints.verifyOtp.matchFulfilled,
      (state, { payload }) => {
        if (payload.status && payload.data) {
          state.user = payload.data.user;
          state.token = payload.data.token;
          state.isAuthenticated = true;
        }
      }
    );

    // عند نجاح Get User
    builder.addMatcher(
      api.endpoints.getUser.matchFulfilled,
      (state, { payload }) => {
        if (payload.status && payload.data) {
          state.user = payload.data.user;
        }
      }
    );

    // عند نجاح Logout
    builder.addMatcher(api.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

