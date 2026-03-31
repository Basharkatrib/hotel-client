// services/partnerApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const partnerApi = createApi({
  reducerPath: 'partnerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      headers.set('Accept', 'application/json');
      const token = getState().auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    submitPartnerApplication: builder.mutation({
      query: (formData) => ({
        url: '/partner/apply',
        method: 'POST',
        body: formData, // FormData object مباشرة
      }),
    }),
  }),
});

export const { useSubmitPartnerApplicationMutation } = partnerApi;