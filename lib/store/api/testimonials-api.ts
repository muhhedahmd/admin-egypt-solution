import { PaginatedResponse, successResponse } from "@/types/services";
import { baseApi } from "./base-api";
import { Image, Testimonial, TestimonialWithImage } from "@/types/schema";

export const testimonialsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query<
      PaginatedResponse<TestimonialWithImage>,
      {
        skip?: number;
        take?: number;
      }
    >({
      query: ( { skip , take}) => {
        return {
          url : "/testimonials",
          params: {
            skip,
            take,
          },
        }
      },
      providesTags: ["Testimonials"],
    }),

    getTestimonialById: builder.query<
      successResponse<{
        Avatar: Image | null;
        testimonial: Testimonial;
      }>,
      string
    >({
      query: (id) => `/testimonials/${id}`,
      providesTags: (result, error, id) => [{ type: "Testimonials", id }],
    }),

    createTestimonial: builder.mutation<
      successResponse<{
        avatar: Image | null;
        testimonials: Testimonial;
      }>,
      FormData
    >({
      query: (body) => ({
        url: "/testimonials",
        method: "POST",
        body,
      }),
      // invalidatesTags: ["testimonials"],
      async onQueryStarted(queryArgument, { dispatch, queryFulfilled, extra }) {
        const result = (await queryFulfilled).data;
        const patchResult = dispatch(
          testimonialsApi.util.updateQueryData(
            "getTestimonials",
            {
              skip: 0,
              take: 10,
            },
            (draft) => {
              draft.data.unshift({
                ...result.data.testimonials,
                avatar: result.data.avatar || undefined,
              });
              draft.pagination.totalItems += 1;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
    updateTestimonial: builder.mutation<
    FormData, 
      { id: string , body: FormData }
    >({
      query: ({ id , body }) => ({
        url: `/testimonials/${id}`,
        method: "PUT",
        body  : body
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Testimonials", id },
        "Testimonials",
      ],
    }),
    deleteTestimonial: builder.mutation<void, string>({
      query: (id) => ({
        url: `/testimonials/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(
        queryArgument,
        { dispatch, queryFulfilled, extra, getCacheEntry, getState, requestId }
      ) {
        const cacheEntry = getState();

        const Testimonials = cacheEntry.api.queries["getTestimonials"]?.data;

        if (Testimonials) {
        }

        const patchResult = dispatch(
          testimonialsApi.util.updateQueryData(
            "getTestimonials",
            {
              skip: 0,
              take: 10,
            },
            (draft) => {
              draft.data = draft.data.filter(
                (Testimonial) => Testimonial.id !== queryArgument
              );
              draft.pagination.totalItems -= 1;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          // Handle error
        }
      },
    }),
  }),
});

export const {
  useGetTestimonialsQuery,
  useGetTestimonialByIdQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialsApi;
