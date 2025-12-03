import { PaginatedResponse, successResponse } from "@/types/services";
import { baseApi } from "./base-api";
import { Contact } from "@/types/schema";

export type FilterType = 
  | "email" 
  | "name" 
  | "phone" 
  | "company" 
  | "subject" 
  | "message"
  | "category" 
  | "status" 
  | "priority"
  | "budget"
  | "timeline"
  | "dateRange";
export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Contacts Queries

    getContacts: builder.query<
      PaginatedResponse<Omit<Contact, "ipAddress" | "ipAddress">>,
      { skip?: number; take?: number }
    >({
      query: ({ skip = 0, take = 10 }) => `/contacts?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `contacts-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`;
      },
    }),
    getContactById: builder.query<successResponse<Contact>, string>({
      query: (id) => `/contacts/${id}`,
    }),

    createContact: builder.mutation<successResponse<Contact>, Record<string, any>>({
      query: (data: Record<string, any>) => ({
        url: "/contacts",
        method: "POST",
        body: data,
      }),
    }),
    replayContact: builder.mutation<
      successResponse<null>,
      { contactId: string; response: string,}
    >({
      query: ({ contactId, response }) => ({
        url: `/contacts/replay/${contactId}`,
        method: "POST",
        body: { response },
      }),
    }),

    UpdateContact: builder.mutation<successResponse<Contact>, { contactId: string; data: Partial<Contact> }>({
      query: ({ contactId, data }) => ({
        url: `/contacts/${contactId}`,
        method: "PUT",
        body: data,
      }),
    }),

    // Additional endpoints can be added here such as stats, filter, etc.
    stats : builder.query<void, void>({
      query: () => `/contacts/stats`,
    }),

    search : builder.query<void, { query: string; skip?: number; take?: number }>({
      query: ({ query, skip = 0, take = 10 }) =>
        `/contacts/search?q=${query}&skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `search-${queryArgs?.query}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },
    }),


    filter: builder.mutation<void, { filters: Partial<Record<FilterType, any>>; skip?: number; take?: number }>({
      query: ({ filters, skip = 0, take = 10 }) =>{
        return {
          url: `/contacts/filter?skip=${skip}&take=${take}`,
          method: "POST",
          body: filters
        }
      }
       
  
    }),


  }),
});

export const {
  useStatsQuery,
  useLazySearchQuery,
  useFilterMutation : useLazyFilterQuery,

  useGetContactsQuery,
  useGetContactByIdQuery,
  // useSearchContactsQuery,
  useCreateContactMutation,
  useReplayContactMutation,
  useUpdateContactMutation,
} = clientApi;
