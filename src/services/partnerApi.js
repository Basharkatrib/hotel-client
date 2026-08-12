import { api } from './api';

export const partnerApi = api.injectEndpoints({
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
