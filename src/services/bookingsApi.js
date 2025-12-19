import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const bookingsApi = createApi({
  reducerPath: 'bookingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api', // مع Vite proxy، نستخدم المسار النسبي
    credentials: 'include', // إرسال cookies مع كل طلب
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Bookings'],
  endpoints: (builder) => ({
    // Check room availability
    checkAvailability: builder.mutation({
      query: (data) => ({
        url: '/bookings/check-availability',
        method: 'POST',
        body: data,
      }),
    }),

    // Create a new booking
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Bookings'],
    }),

    // Get all user bookings
    getMyBookings: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        
        if (params.status) {
          searchParams.append('status', params.status);
        }
        
        if (params.page) {
          searchParams.append('page', params.page);
        }
        
        if (params.per_page) {
          searchParams.append('per_page', params.per_page);
        }
        
        return `/bookings?${searchParams.toString()}`;
      },
      providesTags: ['Bookings'],
    }),

    // Get booking details
    getBookingDetails: builder.query({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Bookings', id }],
    }),

    // Cancel a booking
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Bookings'],
    }),
  }),
});

export const {
  useCheckAvailabilityMutation,
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingDetailsQuery,
  useCancelBookingMutation,
} = bookingsApi;

