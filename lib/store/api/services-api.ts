import {
  CreateServiceDTO,
  Image,
  PaginatedResponse,
  successResponse,
} from "@/types/services";
import { baseApi } from "./base-api";
import { ServiceWithImage } from "@/types/schema";

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  features?: string[];
  [key: string]: any;
}

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<
      PaginatedResponse<ServiceWithImage>,
      {
        skip: number;
        take: number;
      }
    >({
      query: ({ skip, take } = { skip: 0, take: 10 }) => {
        return {
          url: "/services",
          params: {
            skip,
            take,
          },
        };
      },
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        // Return a unique key for the query based on its arguments
        return `${endpointName}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },

      // merge(currentCacheData, responseData, otherArgs)  {
      //   console.log({
      //     currentCacheData,
      //     responseData
      //   })
      //   const mergedData ={
      //     data : {
      //       pagination : responseData.data.pagination,
      //       message : responseData.data.message,
      //       data : [...currentCacheData.data.data, ...responseData.data.data]
      //     }
      //   }
      //   console.log({
      //     mergedData
      //   })
      //   return mergedData
      // },

      providesTags: ["Services"],
    }),

    SearchServices: builder.query<
      { data: PaginatedResponse<ServiceWithImage> },
      { q: string }
    >({
      query: ({ q }) => `/services/search?q=${q}`,
    }),
    CheckOrder: builder.query<
      successResponse<{
        isValid: boolean;
        takenBy: Service;
      }>,
      { order: number }
    >({
      query: ({ order }) => "/services/check-order?order=" + order,
    }),
    getServiceById: builder.query<
      successResponse<{
        service: Service;
        Image: Image;
      }>,
      {
        slug?: string;
        lang?: string;
      }
    >({
      query: ({slug}) => `/services/${slug}`,
      providesTags: (result, error, { slug }) => [{ type: "Services", slug }],
    }),
    getServiceBySlug: builder.query<Service, string>({
      query: (slug) => `/services/slug/${slug}`,
    }),
    createService: builder.mutation<
      successResponse<ServiceWithImage>,
      FormData
    >({
      query: (body) => ({
        url: "/services",
        method: "POST",
        body,
      }),

      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const data = (await queryFulfilled).data;
        const patchResult = dispatch(
          servicesApi.util.updateQueryData(
            "getServices",
            {
              skip: 0,
              take: 10,
            },
            (draft) => {
              draft.data?.data.unshift(data.data);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (err) {
          patchResult.undo();
          console.error("Delete failed, rollback:", err);
        }
      },
    }),
    updateService: builder.mutation<
      Service,
      { id: string; body: Partial<Service> }
    >({
      query: ({ id, body }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Services", id },
        "Services",
      ],
    }),
    deleteService: builder.mutation<
      {
        data: Service;
        message: string;
      },
      {
        id: string;
      }
    >({
      query: ({ id }) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Services", id },
        "Services",
      ],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useCheckOrderQuery,
  useGetServiceBySlugQuery,
  useLazyCheckOrderQuery,
  useLazySearchServicesQuery,
} = servicesApi;
