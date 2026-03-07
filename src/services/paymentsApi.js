import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const paymentsApi = createApi({
  reducerPath: 'paymentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
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
