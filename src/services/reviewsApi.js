import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Reviews', 'HotelReviews', 'RoomReviews'],
  endpoints: (builder) => ({
    // Get reviews for a hotel
    getHotelReviews: builder.query({
      query: ({ hotelSlug, params = {} }) => {
        const searchParams = new URLSearchParams();
        
        if (params.page) {
          searchParams.append('page', params.page);
        }
        if (params.per_page) {
          searchParams.append('per_page', params.per_page);
        }
        if (params.rating) {
          searchParams.append('rating', params.rating);
        }
        if (params.sort_by) {
          searchParams.append('sort_by', params.sort_by);
        }
        if (params.sort_order) {
          searchParams.append('sort_order', params.sort_order);
        }

        const queryString = searchParams.toString();
        return `/hotels/${hotelSlug}/reviews${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result, error, { hotelSlug }) => [
        { type: 'Reviews', id: `hotel-${hotelSlug}` },
        { type: 'HotelReviews', id: hotelSlug },
      ],
    }),

    // Get reviews for a room
    getRoomReviews: builder.query({
      query: ({ roomId, params = {} }) => {
        const searchParams = new URLSearchParams();
        
        if (params.page) {
          searchParams.append('page', params.page);
        }
        if (params.per_page) {
          searchParams.append('per_page', params.per_page);
        }
        if (params.rating) {
          searchParams.append('rating', params.rating);
        }
        if (params.sort_by) {
          searchParams.append('sort_by', params.sort_by);
        }
        if (params.sort_order) {
          searchParams.append('sort_order', params.sort_order);
        }

        const queryString = searchParams.toString();
        return `/rooms/${roomId}/reviews${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result, error, { roomId }) => [
        { type: 'Reviews', id: `room-${roomId}` },
        { type: 'RoomReviews', id: roomId },
      ],
    }),

    // Get review statistics for a hotel
    getHotelReviewStats: builder.query({
      query: (hotelSlug) => `/hotels/${hotelSlug}/reviews/stats`,
      providesTags: (result, error, hotelSlug) => [
        { type: 'Reviews', id: `hotel-stats-${hotelSlug}` },
      ],
    }),

    // Get review statistics for a room
    getRoomReviewStats: builder.query({
      query: (roomId) => `/rooms/${roomId}/reviews/stats`,
      providesTags: (result, error, roomId) => [
        { type: 'Reviews', id: `room-stats-${roomId}` },
      ],
    }),

    // Create a review for a hotel
    createHotelReview: builder.mutation({
      query: ({ hotelSlug, reviewData }) => ({
        url: `/hotels/${hotelSlug}/reviews`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { hotelSlug }) => [
        { type: 'Reviews', id: `hotel-${hotelSlug}` },
        { type: 'HotelReviews', id: hotelSlug },
        { type: 'Reviews', id: `hotel-stats-${hotelSlug}` },
      ],
    }),

    // Create a review for a room
    createRoomReview: builder.mutation({
      query: ({ roomId, reviewData }) => ({
        url: `/rooms/${roomId}/reviews`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { roomId }) => [
        { type: 'Reviews', id: `room-${roomId}` },
        { type: 'RoomReviews', id: roomId },
        { type: 'Reviews', id: `room-stats-${roomId}` },
      ],
    }),

    // Update a review
    updateReview: builder.mutation({
      query: ({ reviewId, reviewData }) => ({
        url: `/reviews/${reviewId}`,
        method: 'PUT',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { reviewId }) => {
        // Get reviewable info from result to invalidate specific tags
        if (result?.data) {
          const review = result.data;
          const reviewableType = review.reviewable_type;
          const reviewableId = review.reviewable_id;
          
          // If it's a hotel review, we need hotel slug - but we don't have it here
          // So we'll invalidate all reviews which will refresh everything
          return [
            { type: 'Reviews', id: reviewId },
            'Reviews',
            'HotelReviews',
            'RoomReviews',
          ];
        }
        // Fallback: invalidate all
        return ['Reviews', 'HotelReviews', 'RoomReviews'];
      },
    }),

    // Delete a review
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, reviewId) => {
        // Invalidate all review-related tags to ensure data refresh
        // This will refresh all hotel and room reviews lists
        return [
          { type: 'Reviews', id: reviewId },
          'Reviews',
          'HotelReviews',
          'RoomReviews',
        ];
      },
    }),

    // Check if user has reviewed (for hotel)
    checkHotelReview: builder.query({
      query: (hotelSlug) => `/hotels/${hotelSlug}/reviews/check`,
      providesTags: (result, error, hotelSlug) => [
        { type: 'Reviews', id: `check-hotel-${hotelSlug}` },
      ],
    }),

    // Check if user has reviewed (for room)
    checkRoomReview: builder.query({
      query: (roomId) => `/rooms/${roomId}/reviews/check`,
      providesTags: (result, error, roomId) => [
        { type: 'Reviews', id: `check-room-${roomId}` },
      ],
    }),
  }),
});

export const {
  useGetHotelReviewsQuery,
  useGetRoomReviewsQuery,
  useGetHotelReviewStatsQuery,
  useGetRoomReviewStatsQuery,
  useCreateHotelReviewMutation,
  useCreateRoomReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useCheckHotelReviewQuery,
  useCheckRoomReviewQuery,
} = reviewsApi;
