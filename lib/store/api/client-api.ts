import {
  Image,
  PaginatedResponse,
  PaginationParams,
  successResponse,
} from "@/types/services";
import { baseApi } from "./base-api";
import { Client } from "@/types/schema";

export type clientRespons = {
  client: Client;
  image: Image | null;
  logo: Image | null;
};

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Clients Queries
    getClients: builder.query<
      PaginatedResponse<clientRespons>,
      PaginationParams
    >({
      query: ({ skip = 0, take = 10 }) => `/clients?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `clients-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`;
      },
    }),

    getClientById: builder.query<successResponse<clientRespons> , string>({
      query: (id) => `/clients/${id}`,
    }),

    getActiveClients: builder.query({
      query: ({ skip = 0, take = 10 }) =>
        `/api/clients/active/all?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `active-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`;
      },
    }),

    searchClients: builder.query<successResponse<clientRespons> , { q: string; skip: number; take: number }>({
      query: ({ q, skip = 0, take = 10 }) =>
        `clients/search?q=${q}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `search-${queryArgs?.q}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },
    }),

    // Clients Mutations
    createClient: builder.mutation<successResponse<clientRespons>, FormData>({
      query: (data) => ({
        url: "/clients",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const upComingClient = await queryFulfilled;
        const patch = dispatch(
          clientApi.util.updateQueryData(
            "getClients",
            { skip: 0, take: 10 },
            (draft) => {
              draft.data.unshift(upComingClient.data.data);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patch.undo();
          console.log(error);
          // Handle error
        }
      },
    }),

    updateClient: builder.mutation<successResponse<clientRespons> , { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/clients/${id}`,
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled , getCacheEntry ,getState }) {
        try {
          await queryFulfilled;

          // dispatch(clientApi.)

          // getCacheEntry().data.api.queries['getClients'].data.map((client) => {
          //   if(client.client.id == id){
          //     client.client = queryFulfilled.data.client
          //   }
          // })
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
          await queryFulfilled;
          dispatch(clientApi.util.invalidateTags(["Clients"]));
        } catch {
          // Handle error
        }
      },
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useGetActiveClientsQuery,
  useSearchClientsQuery,
  useLazySearchClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApi;
