import { PaginatedResponse, successResponse } from "@/types/services";
import { baseApi } from "./base-api";
import { IHero, Image, PaginationParams } from "@/types/schema";

export type Hero_Image = {
  hero: IHero;
  backgroundImage: Image;
};
export const HeroApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get heros
    getAllHeroes: builder.query<
      PaginatedResponse<Hero_Image>,
      PaginationParams
    >({
      query: ({ skip = 0, take = 10 }) => {
        return {
          url: "/hero",
          params: {
            skip,
            take,
          },
        };
      },
      providesTags: ["Hero"],
    }),
    getActiveHeroes: builder.query<successResponse<Hero_Image>, void>({
      query: () => "/hero/active",
      //   providesTags: ["Hero"],
    }),
    HeroesSearch: builder.query<
      PaginatedResponse<Hero_Image>,
      {
        q: string;
      }
    >({
      query: ({ q }) => {
        return {
          url: "/hero/search",
          params: {
            q,
          },
        };
      },
      //   providesTags: ["Hero"],
    }),

    getHeroById: builder.query<
      successResponse<IHero>,
      { id: string; lang: string }
    >({
      query: ({ id }) => `/hero/${id}`,
    }),
    // Create hero
    createHero: builder.mutation<successResponse<IHero>, FormData>({
      query: (formData) => ({
        url: "/hero",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Hero"],
    }),

    // Update hero
    updateHero: builder.mutation<
      successResponse<IHero>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/hero/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Hero"],
    }),

    toggleActive: builder.mutation<
      successResponse<{
        id: string;
        isActive: boolean;
      }>,
      { id: string; }
    >({
      query: ({ id}) => ({
        url: `/hero/toggle-active/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Hero"],
    }),

    // delete
    deleteHero: builder.mutation<successResponse<IHero>, string>({
      query: (id) => ({
        url: `/hero/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hero"],
    }),
  }),
});

export const {
  useToggleActiveMutation,
  useGetAllHeroesQuery,
  useGetHeroByIdQuery,
  useCreateHeroMutation,
  useUpdateHeroMutation,
  useDeleteHeroMutation,
  useGetActiveHeroesQuery,
  useLazyHeroesSearchQuery,
} = HeroApi;
