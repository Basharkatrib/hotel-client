import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query مع interceptor للتعامل مع 401 errors
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include', // مهم جداً لإرسال الـ Refresh Cookie
    prepareHeaders: (headers, { getState, endpoint }) => {
      headers.set('Accept', 'application/json');
      
      // الحصول على الـ Access Token من الـ State (Redux)
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      // Avoid forcing JSON Content-Type for file uploads (e.g. avatar)
      if (endpoint !== 'uploadAvatar') {
        headers.set('Content-Type', 'application/json');
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // إذا كان الخطأ 401، قد يكون التوكن انتهى، لكننا سنعتمد على AuthChecker 
  // لعمل refresh صامت عند الضرورة أو عند تحميل التطبيق.

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
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
  }),
});

export const {
  useRefreshMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useLoginMutation,
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
} = api;
