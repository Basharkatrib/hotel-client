import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const favoritesApi = createApi({
  reducerPath: 'favoritesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api', // مع Vite proxy، نستخدم المسار النسبي
    credentials: 'include', // إرسال cookies مع كل طلب
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Favorites'],
  endpoints: (builder) => ({
    getFavorites: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.per_page) {
          searchParams.append('per_page', params.per_page);
        }
        return `/favorites?${searchParams.toString()}`;
      },
      providesTags: ['Favorites'],
    }),
    
    checkFavorite: builder.query({
      query: ({ favoritable_type, favoritable_id }) => 
        `/favorites/check?favoritable_type=${favoritable_type}&favoritable_id=${favoritable_id}`,
      providesTags: (result, error, { favoritable_type, favoritable_id }) => [
        { type: 'Favorites', id: `${favoritable_type}-${favoritable_id}` },
      ],
    }),
    
    addToFavorites: builder.mutation({
      query: ({ favoritable_type, favoritable_id }) => ({
        url: '/favorites',
        method: 'POST',
        body: {
          favoritable_type,
          favoritable_id,
        },
      }),
      invalidatesTags: ['Favorites'],
    }),
    
    removeFromFavorites: builder.mutation({
      query: ({ favoritable_type, favoritable_id }) => ({
        url: '/favorites/remove',
        method: 'POST',
        body: {
          favoritable_type,
          favoritable_id,
        },
      }),
      invalidatesTags: ['Favorites'],
    }),
    
    removeFavoriteById: builder.mutation({
      query: (id) => ({
        url: `/favorites/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorites'],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useCheckFavoriteQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useRemoveFavoriteByIdMutation,
} = favoritesApi;

