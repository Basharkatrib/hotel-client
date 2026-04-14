import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

const initialState = {
  user: null,
  token: null, // التوكن يتم تخزينه في الذاكرة فقط
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // تحديث بيانات المستخدم والتوكن
    setCredentials: (state, action) => {
      const { user, access_token } = action.payload;
      state.user = user;
      state.token = access_token;
      state.isAuthenticated = true;
    },
    // تسجيل الخروج
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
          state.token = payload.data.access_token;
          state.isAuthenticated = true;
        }
      }
    );

    // عند نجاح Google Login
    builder.addMatcher(
      api.endpoints.googleLogin.matchFulfilled,
      (state, { payload }) => {
        if (payload.status && payload.data) {
          state.user = payload.data.user;
          state.token = payload.data.access_token;
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
          state.token = payload.data.access_token;
          state.isAuthenticated = true;
        }
      }
    );

    // عند نجاح Refresh
    builder.addMatcher(
      api.endpoints.refresh.matchFulfilled,
      (state, { payload }) => {
        if (payload.status && payload.data) {
          state.user = payload.data.user;
          state.token = payload.data.access_token;
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
          state.isAuthenticated = true;
        }
      }
    );

    // عند نجاح تحديث البروفايل
    builder.addMatcher(
      api.endpoints.updateProfile.matchFulfilled,
      (state, { payload }) => {
        if (payload.status && payload.data) {
          state.user = { ...state.user, ...payload.data.user };
        }
      }
    );

    // عند نجاح رفع صورة جديدة
    builder.addMatcher(
      api.endpoints.uploadAvatar.matchFulfilled,
      (state, { payload }) => {
        const newAvatar = payload?.data?.avatar || payload?.avatar;
        if (newAvatar && state.user) {
          state.user.avatar = newAvatar;
        }
      }
    );

    // عند حذف الصورة
    builder.addMatcher(
      api.endpoints.deleteAvatar.matchFulfilled,
      (state) => {
        if (state.user) {
          state.user.avatar = null;
        }
      }
    );

    // عند فشل Get User (401 - التوكن منتهي)
    builder.addMatcher(
      api.endpoints.getUser.matchRejected,
      (state, { error }) => {
        if (error?.status === 401) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
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

export const { logout, setUser, setCredentials } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;

