
import { baseApi } from "./base-api"

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Client Queries
    getClients: builder.query({
      query: ({ skip = 0, take = 10 } = {}) => `/api/clients?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `clients-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`
      },
    }),

    getClientById: builder.query({
      query: (id) => `/api/clients/${id}`,
    }),

    getActiveClients: builder.query({
      query: ({ skip = 0, take = 10 } = {}) => `/api/clients/active/all?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `active-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`
      },
    }),

    searchClients: builder.query({
      query: ({ q, skip = 0, take = 10 }) => `/api/clients/search/query?q=${q}&skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `search-${queryArgs?.q}-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`
      },
    }),

    // Client Mutations
    createClient: builder.mutation({
      query: (data) => ({
        url: "/api/clients",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(clientApi.util.invalidateTags(["Client"]))
        } catch {
          // Handle error
        }
      },
    }),

    updateClient: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/clients/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(clientApi.util.invalidateTags(["Client"]))
        } catch {
          // Handle error
        }
      },
    }),

    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/api/clients/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(clientApi.util.invalidateTags(["Client"]))
        } catch {
          // Handle error
        }
      },
    }),
  }),
})

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useGetActiveClientsQuery,
  useSearchClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApi
