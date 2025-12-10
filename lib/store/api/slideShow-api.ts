import type {
  AttachMany as AttachManyDTO,
  AttachmentTypes,
  BulkSlideOperation,
  deattachManyDTO as DetachManyDTO,
  SlideShow,
  SlideshowType,
} from "@/types/slideShows";
import { baseApi } from "./base-api";
import { PaginatedResponse, successResponse } from "@/types/services";
import { CreateAndAttachMany, Image } from "@/types/schema";

export type minimalSlide = {
  id: string;
  order: number;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  type: SlideshowType;
  title: string;
};
export interface Slide {
  id: string;
  type: "services" | "projects" | "clients" | "testimonials" | "team";
  order: number;
  isVisible: boolean;
  customTitle ?: string
customDescription ?: string
  data: {

    name?: string;
    title?: string;
    clientName?: string;
    image?: Image;
    avatar?: Image;
    logo?: Image;
    [key: string]: any;
  };
}


export interface PaginationInfo {
  totalPages: number;
  hasMore: boolean;
  currentPage: number;
}
export interface PaginatedSlidesResponse {
  slides: Slide[];
  pages: Record<
    "services" | "projects" | "clients" | "testimonials" | "team",
    PaginationInfo
  >;
  slidesCount: {
    services: number;
    projects: number;
    clients: number;
    testimonials: number;
    team: number;
  };
}

export const slideshowApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSlideShows: builder.query<
      PaginatedResponse<SlideShow>,
      {
        skip: number;
        take: number;
      }
    >({
      query: ({ skip, take } = { skip: 0, take: 10 }) => {
        return {
          url: "/slide-show",
          params: {
            skip,
            take,
          },
        };
      },
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        // Custom cache key using skip and take for proper pagination caching
        return `${endpointName}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },
      providesTags: ["SlideShows"],
    }),

    getAllSlideShowsMinmal: builder.query<
      successResponse<minimalSlide[]>,
      void
    >({
      query: () => `/slide-show/all-minimal`,
    }),
    getSlideShowById: builder.query<successResponse<SlideShow>, string>({
      query: (id) => `/slide-show/${id}`,
      providesTags: (result, error, id) => [{ type: "SlideShows", id }],
    }),

    getSlideShowsByType: builder.query<
      { data: PaginatedResponse<SlideShow> },
      {
        type: string;
        skip: number;
        take: number;
      }
    >({
      query: ({ type, skip, take }) => ({
        url: "/slide-show/by-type",
        method: "GET",
        params: {
          skip,
          take,
        },
        body: { type },
      }),
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        return `${endpointName}-${queryArgs?.type}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },
      providesTags: (result, error, { type }) => [
        { type: "SlideShows", id: `type-${type}` },
      ],
    }),

    getGroupedSlideShowsByType: builder.query<
      { data: PaginatedResponse<SlideShow> },
      {
        id: string;
        skip: number;
        take: number;
      }
    >({
      query: ({ id, skip, take }) => ({
        url: `/slide-show/grouped-type/${id}`,
        params: {
          skip,
          take,
        },
      }),
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        return `${endpointName}-${queryArgs?.id}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },
      providesTags: (result, error, { id }) => [
        { type: "SlideShows", id: `grouped-${id}` },
      ],
    }),

    getAttachesByType: builder.query<
      { data: PaginatedResponse<SlideShow> },
      {
        id: string;
        skip: number;
        take: number;
      }
    >({
      query: ({ id, skip, take }) => ({
        url: `/slide-show/attaches-by-type/${id}`,
        params: {
          skip,
          take,
        },
      }),
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        return `${endpointName}-${queryArgs?.id}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },
      providesTags: (result, error, { id }) => [
        { type: "SlideShows", id: `attaches-${id}` },
      ],
    }),

    createSlideShow: builder.mutation<successResponse<SlideShow>, FormData>({
      query: (body) => ({
        url: "/slide-show",
        method: "POST",
        body,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const data = (await queryFulfilled).data;
        // Optimistic update: add new slideshow to the beginning of the list
        const patchResult = dispatch(
          slideshowApi.util.updateQueryData(
            "getSlideShows",
            {
              skip: 0,
              take: 10,
            },
            (draft) => {
              draft.data.unshift(data.data);
              draft.pagination.totalItems += 1;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (err) {
          patchResult.undo();
          console.error("Create slideshow failed, rollback:", err);
        }
      },
    }),

    updateSlideShow: builder.mutation<
      successResponse<SlideShow>,
      { id: string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/slide-show/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SlideShows", id },
        "SlideShows",
      ],
    }),

    updateAttachMany : builder.mutation<
      successResponse<SlideShow>,
      { id: string; body: any }
    >({
      query: ({ id, body }) => ({
        url: `/slide-show/attach-many/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SlideShows", id },
        "SlideShows",
      ],
    }),

    deleteSlideShow: builder.mutation<
      successResponse<SlideShow>,
      {
        id: string;
        skip: number;
        take: number;
      }
    >({
      query: ({ id }) => ({
        url: `/slide-show/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(queryArgument, { dispatch, queryFulfilled }) {
        const { skip, take, id } = queryArgument;
        const result = (await queryFulfilled).data;
        // Optimistic update: remove deleted slideshow from cache
        const patchResult = dispatch(
          slideshowApi.util.updateQueryData(
            "getSlideShows",
            {
              skip,
              take,
            },
            (draft) => {
              draft.data = draft.data.filter((s) => s.id !== result.data.id);
              draft.pagination.totalItems -= 1;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (err) {
          patchResult.undo();
          console.error("Delete slideshow failed, rollback:", err);
        }
      },
    }),

    PaginatedSlides: builder.mutation<
      successResponse<PaginatedSlidesResponse>,
      {
        id: string;
        page: number;
        pagesPerType?: Partial<
          Record<
            "services" | "projects" | "clients" | "testimonials" | "team",
            number
          >
        >;
        perPage: number;
      }
    >({
      
      query: ({ id, page, pagesPerType, perPage }) => ({
        url: `/slide-show/get-paginated-slides/${id}`,
        method: "POST",
        body: {
          page,
          perPage,
          pagesPerType,
        },
      }),
      // Merge logic for infinite scroll
    }),

    attachMany: builder.mutation<successResponse<SlideShow>, AttachManyDTO>({
      query: (body) => ({
        url: "/slide-show/attach-many",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { slideShowId }) => [
        { type: "SlideShows", id: slideShowId },
        "SlideShows",
      ],
    }),
    bulkOperations: builder.mutation<successResponse<BulkSlideOperation>, { id :string , data : any}>({
      query: ({ id , data}) => ({
        url: `/slide-show/bulk-operations/${id}`,
        method: "POST",
        body : data,
      
      }),
      // invalidatesTags: (result, error, { slideShowId }) => [
      //   { type: "SlideShows", id: slideShowId },
      //   "SlideShows",
      // ],
    }),

    detachMany: builder.mutation<successResponse<SlideShow>, DetachManyDTO>({
      query: (body) => ({
        url: "/slide-show/detach-many",
        method: "DELETE",
        body,
      }),
      invalidatesTags: (result, error, { slideShowId }) => [
        { type: "SlideShows", id: slideShowId },
        "SlideShows",
      ],
    }),
    CreateSlideShowAndAttachMany: builder.mutation<
      successResponse<{ slideShow: SlideShow; attacheds: AttachmentTypes[] }>,
      CreateAndAttachMany
    >({
      query: (body) => ({
        url: "/slide-show/create-attach-many",
        method: "POST",
        body,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const data = (await queryFulfilled).data;
        const patchResult = dispatch(
          slideshowApi.util.updateQueryData(
            "getSlideShows",
            {
              skip: 0,
              take: 10,
            },
            (draft) => {
              draft.data.unshift(data.data.slideShow);
              draft.pagination.totalItems += 1;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error("Create and attach many failed:", error);
        }
      },
    }),

    ReorderBulk: builder.mutation<
      successResponse<{ id: string; order: number }[]>,
      { id: string; order: number }[]
    >({
      query: (data) => ({
        url: "/slide-show/reorder-bulk",
        method: "PUT",
        body: data,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const result = (await queryFulfilled).data;
        const patchResult = dispatch(
          slideshowApi.util.updateQueryData(
            "getAllSlideShowsMinmal",
            undefined,
            (draft) => {
              draft.data = draft.data.map((s) => {
                const findInComing = result.data.find((r) => r.id === s.id);
                if (findInComing?.order) {
                  return {
                    ...s,
                    order: findInComing.order,
                  };
                }
                return s;
              });
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error("Reorder bulk failed:", error);
        }
      },
    }),
  }),
 

});

export const {
  usePaginatedSlidesMutation,
  useGetAllSlideShowsMinmalQuery,
  useCreateSlideShowAndAttachManyMutation,
  useGetSlideShowsQuery,
  useGetSlideShowByIdQuery,
  useGetSlideShowsByTypeQuery,
  useGetGroupedSlideShowsByTypeQuery,
  useGetAttachesByTypeQuery,
  useCreateSlideShowMutation,
  useUpdateSlideShowMutation,
  useDeleteSlideShowMutation,
  useAttachManyMutation,
  useDetachManyMutation,
  useLazyGetSlideShowsQuery,
  useLazyGetSlideShowsByTypeQuery,
  useReorderBulkMutation,
  useUpdateAttachManyMutation,
  useBulkOperationsMutation
} = slideshowApi;
