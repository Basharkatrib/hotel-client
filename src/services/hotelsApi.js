import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const hotelsApi = createApi({
  reducerPath: 'hotelsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL + '/api',
  }),
  tagTypes: ['Hotels'],
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
  }),
});

export const { useGetHotelsQuery, useGetHotelQuery, useGetRoomsQuery, useGetRoomQuery } = hotelsApi;

