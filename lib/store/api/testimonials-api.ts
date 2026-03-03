import { PaginatedResponse, successResponse } from "@/types/services";
import { baseApi } from "./base-api";
import { Image, Testimonial, TestimonialTranslation } from "@/types/schema";

export interface TestimonialWithTranslation {
  testimonial: Testimonial;
  avatar: Image | null;
  translation: TestimonialTranslation[];
  slideShows?: any[];
}

export const testimonialsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query<
      PaginatedResponse<TestimonialWithTranslation>,
      {
        skip?: number;
        take?: number;
      }
    >({
      query: ({ skip, take }) => {
        return {
          url: "/testimonials",
          params: {
            skip,
            take,
          },
        };
      },
      providesTags: ["Testimonials"],
    }),

    SearchTestimonials: builder.query<
      PaginatedResponse<TestimonialWithTranslation>,
      {
        skip?: number;
        take?: number;
        q?: string;
      }
    >({
      query: ({ skip, take, q }) => {
        return {
          url: "/testimonials/search",
          params: {
            skip,
            take,
            q,
          },
        };
      },
      providesTags: ["Testimonials"],
    }),

    getTestimonialById: builder.query<
      successResponse<{
        Avatar: Image | null;
        testimonial: Testimonial;
        translation: TestimonialTranslation[];
        slideShows?: any[];
      }>,
      string
    >({
      query: (id) => `/testimonials/${id}`,
      providesTags: (result, error, id) => [{ type: "Testimonials", id }],
    }),

    createTestimonial: builder.mutation<
      successResponse<{
        Avatar: Image | null;
        testimonial: Testimonial;
        translation: TestimonialTranslation[];
      }>,
      FormData
    >({
      query: (body) => ({
        url: "/testimonials",
        method: "POST",
        body,
      }),
      async onQueryStarted(queryArgument, { dispatch, queryFulfilled }) {
        try {
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
                  testimonial: result.data.testimonial,
                  avatar: result.data.Avatar || null,
                  translation: result.data.translation,
                });
                draft.pagination.totalItems += 1;
              },
            ),
          );
        } catch (error) {
          // Handle error
        }
      },
    }),

    updateTestimonial: builder.mutation<
      successResponse<{
        Avatar: Image | null;
        testimonial: Testimonial;
        translation: TestimonialTranslation;
      }>,
      { id: string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/testimonials/${id}`,
        method: "PUT",
        body: body,
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
        { dispatch, queryFulfilled, getState },
      ) {
        const cacheEntry = getState();
        const Testimonials = cacheEntry.api.queries["getTestimonials"]?.data;

        const patchResult = dispatch(
          testimonialsApi.util.updateQueryData(
            "getTestimonials",
            {
              skip: 0,
              take: 10,
            },
            (draft) => {
              draft.data = draft.data.filter(
                (item) => item.testimonial.id !== queryArgument,
              );
              draft.pagination.totalItems -= 1;
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Testimonials"],
    }),
  }),
});

export const {
  useGetTestimonialsQuery,
  useSearchTestimonialsQuery,
  useLazySearchTestimonialsQuery,
  useGetTestimonialByIdQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialsApi;
