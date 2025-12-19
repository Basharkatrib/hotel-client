import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Helper function to get CSRF token from cookie
function getCsrfToken() {
  const name = 'XSRF-TOKEN=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}

// Base query مع interceptor للتعامل مع 401 errors
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    // مع Vite proxy، نستخدم المسار النسبي بدلاً من URL كامل
    baseUrl: '/api',
    credentials: 'include', // إرسال cookies مع كل طلب
    prepareHeaders: (headers, { endpoint }) => {
      headers.set('Accept', 'application/json');
      
      // إرسال CSRF token في header X-XSRF-TOKEN للطلبات التي تحتاج CSRF protection
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers.set('X-XSRF-TOKEN', csrfToken);
      }
      
      // Avoid forcing JSON Content-Type for file uploads (e.g. avatar)
      if (endpoint !== 'uploadAvatar') {
        headers.set('Content-Type', 'application/json');
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // إذا كان الخطأ 401 (Unauthorized)، يعني التوكن منتهي أو غير صالح
  if (result.error && result.error.status === 401) {
    // عمل logout تلقائياً
    api.dispatch({ type: 'auth/logout' });
    
    // حذف البيانات من localStorage
    try {
      const { persistor } = await import('../store/store');
      if (persistor) {
        persistor.purge();
      }
    } catch (err) {
      // إذا فشل استيراد persistor، احذف localStorage يدوياً
      localStorage.removeItem('persist:root');
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
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

    // Logout
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
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
} = api;

