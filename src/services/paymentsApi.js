import { api } from './api';

export const paymentsApi = api.injectEndpoints({
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
