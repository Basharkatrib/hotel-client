import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const hotelsApi = createApi({
  reducerPath: 'hotelsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api', // مع Vite proxy، نستخدم المسار النسبي
    credentials: 'include', // إرسال cookies مع كل طلب
  }),
  tagTypes: ['Hotels', 'Notifications'],
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        // Type filter
        if (params.type && params.type !== 'any') {
          searchParams.append('type', params.type);
        }

        // Price range
        if (params.min_price !== undefined) {
          searchParams.append('min_price', params.min_price);
        }
        if (params.max_price !== undefined) {
          searchParams.append('max_price', params.max_price);
        }

        // City filter
        if (params.city) {
          searchParams.append('city', params.city);
        }

        // Availability filters (optional, backend may ignore if not supported)
        if (params.check_in_date) {
          searchParams.append('check_in_date', params.check_in_date);
        }
        if (params.check_out_date) {
          searchParams.append('check_out_date', params.check_out_date);
        }

        // Guests / rooms (used to filter hotels that can accommodate the party)
        if (params.guests) {
          searchParams.append('guests', params.guests);
        }
        if (params.rooms) {
          searchParams.append('rooms', params.rooms);
        }

        // Boolean filters
        if (params.has_free_cancellation) {
          searchParams.append('has_free_cancellation', '1');
        }
        if (params.has_spa_access) {
          searchParams.append('has_spa_access', '1');
        }
        if (params.has_breakfast_included) {
          searchParams.append('has_breakfast_included', '1');
        }
        if (params.is_featured) {
          searchParams.append('is_featured', '1');
        }
        if (params.is_getaway_deal) {
          searchParams.append('is_getaway_deal', '1');
        }

        // Sorting
        if (params.sort_by) {
          searchParams.append('sort_by', params.sort_by);
        }
        if (params.sort_order) {
          searchParams.append('sort_order', params.sort_order);
        }

        // Pagination
        if (params.page) {
          searchParams.append('page', params.page);
        }
        if (params.per_page) {
          searchParams.append('per_page', params.per_page);
        }

        return `/hotels?${searchParams.toString()}`;
      },
      providesTags: ['Hotels'],
    }),

    getHotel: builder.query({
      query: (id) => `/hotels/${id}`,
      providesTags: (result, error, id) => [{ type: 'Hotels', id }],
    }),

    getRooms: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        // Hotel filter
        if (params.hotel_id) {
          searchParams.append('hotel_id', params.hotel_id);
        }

        // Date filters for availability
        if (params.check_in_date) {
          searchParams.append('check_in_date', params.check_in_date);
        }
        if (params.check_out_date) {
          searchParams.append('check_out_date', params.check_out_date);
        }

        // Guests filter
        if (params.max_guests) {
          searchParams.append('max_guests', params.max_guests);
        }

        // Type filter
        if (params.type) {
          searchParams.append('type', params.type);
        }

        // Beds filter
        if (params.min_beds) {
          searchParams.append('min_beds', params.min_beds);
        }

        // Price range
        if (params.min_price !== undefined) {
          searchParams.append('min_price', params.min_price);
        }
        if (params.max_price !== undefined) {
          searchParams.append('max_price', params.max_price);
        }

        // Features
        if (params.has_breakfast) {
          searchParams.append('has_breakfast', '1');
        }
        if (params.has_wifi) {
          searchParams.append('has_wifi', '1');
        }
        if (params.has_balcony) {
          searchParams.append('has_balcony', '1');
        }

        // View
        if (params.view) {
          searchParams.append('view', params.view);
        }

        // Sorting
        if (params.sort_by) {
          searchParams.append('sort_by', params.sort_by);
        }
        if (params.sort_order) {
          searchParams.append('sort_order', params.sort_order);
        }

        // Pagination
        if (params.page) {
          searchParams.append('page', params.page);
        }
        if (params.per_page) {
          searchParams.append('per_page', params.per_page);
        }

        return `/rooms?${searchParams.toString()}`;
      },
      providesTags: ['Hotels'],
    }),

    getRoom: builder.query({
      query: (id) => `/rooms/${id}`,
      providesTags: (result, error, id) => [{ type: 'Hotels', id }],
    }),

    getRecommendations: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        if (params.city) searchParams.append('city', params.city);
        if (params.guests) searchParams.append('guests', params.guests);
        if (params.min_price) searchParams.append('min_price', params.min_price);
        if (params.max_price) searchParams.append('max_price', params.max_price);
        if (params.view) searchParams.append('view', params.view);

        if (params.amenities && Array.isArray(params.amenities)) {
          params.amenities.forEach(amenity => {
            searchParams.append('amenities[]', amenity);
          });
        }

        return `/rooms/recommend?${searchParams.toString()}`;
      },
      providesTags: ['Hotels'],
    }),

    getNotifications: builder.query({
      query: () => '/notifications',
      providesTags: ['Notifications'],
    }),

    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),

    markAllAsRead: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelQuery,
  useGetRoomsQuery,
  useGetRoomQuery,
  useGetRecommendationsQuery,
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation
} = hotelsApi;

