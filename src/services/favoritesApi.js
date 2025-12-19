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

export const favoritesApi = createApi({
  reducerPath: 'favoritesApi',
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

