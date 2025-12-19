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

export const paymentsApi = createApi({
  reducerPath: 'paymentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api', // مع Vite proxy، نستخدم المسار النسبي
    credentials: 'include', // إرسال cookies مع كل طلب
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      
      // إرسال CSRF token في header X-XSRF-TOKEN
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers.set('X-XSRF-TOKEN', csrfToken);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Payments'],
  endpoints: (builder) => ({
    // Create payment intent
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: '/payments/create-intent',
        method: 'POST',
        body: data,
      }),
    }),

    // Confirm payment
    confirmPayment: builder.mutation({
      query: (data) => ({
        url: '/payments/confirm',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payments'],
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
} = paymentsApi;

