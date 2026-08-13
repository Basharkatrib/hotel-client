import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../store/slices/authSlice';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Single-flight refresh: طلب تجديد واحد فقط في نفس الوقت
// (الـ backend يعمل token rotation — refresh متوازي كان يُسقط الجلسة)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let refreshPromise = null;

const performTokenRefresh = async (api, extraOptions) => {
  const refreshResult = await rawBaseQuery(
    { url: '/auth/refresh', method: 'POST' },
    api,
    extraOptions
  );

  if (refreshResult?.data?.status && refreshResult.data?.data) {
    const { user, access_token } = refreshResult.data.data;
    api.dispatch(setCredentials({ user, access_token }));
    return { ok: true, result: refreshResult };
  }

  return { ok: false, result: refreshResult };
};

const getRefreshPromise = (api, extraOptions) => {
  if (!refreshPromise) {
    refreshPromise = performTokenRefresh(api, extraOptions).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Base Query الأساسي
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState, endpoint }) => {
    headers.set('Accept', 'application/json');

    const token = getState().auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (endpoint !== 'uploadAvatar' && endpoint !== 'submitPartnerApplication') {
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  },
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Base Query مع Auto-Refresh عند 401
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const url = typeof args === 'string' ? args : args?.url;
  const isRefreshCall = url === '/auth/refresh';
  const isLogoutCall = url === '/auth/logout';

  if (isLogoutCall) {
    return rawBaseQuery(args, api, extraOptions);
  }

  if (isRefreshCall) {
    const { result } = await getRefreshPromise(api, extraOptions);
    return result;
  }

  if (refreshPromise) {
    const { ok } = await refreshPromise;
    if (!ok) {
      return { error: { status: 401, data: { message: 'Unauthenticated' } } };
    }
  }

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const { ok } = await getRefreshPromise(api, extraOptions);
    if (ok) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User', 'Bookings', 'Favorites', 'Payments',
    'Reviews', 'HotelReviews', 'RoomReviews',
    'Hotels', 'Notifications',
  ],
  endpoints: (builder) => ({
    // Refresh Token (Silent Refresh)
    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),

    // Register
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Verify Email
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: data,
      }),
    }),

    // Resend OTP
    resendOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),

    // Login (Email + Password)
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Google Login
    googleLogin: builder.mutation({
      query: (data) => ({
        url: '/auth/google',
        method: 'POST',
        body: data,
      }),
    }),

    // Send OTP (Login)
    sendOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body: data,
      }),
    }),

    // Verify OTP (Login)
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Get Current User
    getUser: builder.query({
      query: () => '/user',
      providesTags: ['User'],
    }),

    // Update profile
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/user/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Upload avatar (profile image)
    uploadAvatar: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('avatar', file);
        return {
          url: '/user/avatar',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['User'],
    }),

    // Delete avatar
    deleteAvatar: builder.mutation({
      query: () => ({
        url: '/user/avatar',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Logout
    // Logout
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // Update FCM Token
    updateFcmToken: builder.mutation({
      query: (data) => ({
        url: '/user/fcm-token',
        method: 'POST',
        body: data,
      }),
    }),

    // AI Chat
    sendChatMessage: builder.mutation({
      query: (messages) => ({
        url: '/chat',
        method: 'POST',
        body: { messages },
      }),
    }),
    // Contact Us Message
    sendContactMessage: builder.mutation({
      query: (data) => ({
        url: '/contact',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useRefreshMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
  useUpdateFcmTokenMutation,
  useSendChatMessageMutation,
  useSendContactMessageMutation,
} = api;
