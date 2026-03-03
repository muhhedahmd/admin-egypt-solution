import {
  Image,
  PaginatedResponse,
  PaginationParams,
  successResponse,
} from "@/types/services";
import { baseApi } from "./base-api";
import { Client, ClientTranslation } from "@/types/schema";

export type ClientWithTranslation = {
  client: Client;
  image: Image | null;
  logo: Image | null;
  translation: ClientTranslation[];
};

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Clients Queries
    getClients: builder.query<
      PaginatedResponse<ClientWithTranslation>,
      PaginationParams
    >({
      query: ({ skip = 0, take = 10 }) => `/clients?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `clients-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`;
      },
      providesTags: ["Clients"],
    }),

    getClientById: builder.query<
      successResponse<ClientWithTranslation>,
      string
    >({
      query: (id) => `/clients/${id}`,
      providesTags: (result, error, id) => [{ type: "Clients", id }],
    }),

    getActiveClients: builder.query<
      PaginatedResponse<ClientWithTranslation>,
      PaginationParams
    >({
      query: ({ skip = 0, take = 10 }) =>
        `/clients/active/all?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `active-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`;
      },
      providesTags: ["Clients"],
    }),

    searchClients: builder.query<
      successResponse<ClientWithTranslation[]>,
      { q: string; skip: number; take: number }
    >({
      query: ({ q, skip = 0, take = 10 }) =>
        `clients/search?q=${q}&skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `search-${queryArgs?.q}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },
      providesTags: ["Clients"],
    }),

    // Clients Mutations
    createClient: builder.mutation<
      successResponse<{
        Image: Image | null;
        Logo: Image | null;
        translation: ClientTranslation[];
        client: Client;
      }>,
      FormData
    >({
      query: (data) => ({
        url: "/clients",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const upComingClient = await queryFulfilled;
          const patch = dispatch(
            clientApi.util.updateQueryData(
              "getClients",
              { skip: 0, take: 10 },
              (draft) => {
                draft.data.unshift({
                  client: upComingClient.data.data.client,
                  image: upComingClient.data.data.Image || null,
                  logo: upComingClient.data.data.Logo || null,
                  translation: upComingClient.data.data.translation,
                });
                draft.pagination.totalItems += 1;
              }
            )
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),

    updateClient: builder.mutation<
      successResponse<{
        Image: Image | null;
        Logo: Image | null;
        translation: ClientTranslation;
        client: Client;
      }>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/clients/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Clients", id },
        "Clients",
      ],
    }),

    deleteClient: builder.mutation<void, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          clientApi.util.updateQueryData(
            "getClients",
            { skip: 0, take: 10 },
            (draft) => {
              draft.data = draft.data.filter(
                (item) => item.client.id !== id
              );
              draft.pagination.totalItems -= 1;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Clients"],
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