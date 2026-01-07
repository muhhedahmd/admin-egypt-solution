import { PaginatedResponse, successResponse } from "@/types/services";
import { baseApi } from "./base-api";
import { Image, TeamMember, TeamMemberWithImage } from "@/types/schema";
import { createEntityAdapter } from "@reduxjs/toolkit";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMembers: builder.query<
      PaginatedResponse<TeamMemberWithImage>,
      {
        skip?: number;
        take?: number;
      }
    >({
      query: ({ skip = 0, take = 10 }) => {
        return {
          url: "/team",
          params: {
            skip,
            take,
          },
        };
      },

      providesTags: ["Team"],
    }),
    getTeamMemberById: builder.query<
      {
        Image: Image | null;
        teamMember: TeamMember;
        message: string;
      },
      string
    >({
      query: (id) => `/team/${id}`,
      providesTags: (result, error, id) => [{ type: "Team", id }],
    }),

    createTeamMember: builder.mutation<
      successResponse<{
        Image: Image | null;
        TeamMember: TeamMember;
      }>,
      FormData
    >({
      query: (body) => ({
        url: "/team",
        method: "POST",
        body,
      }),
      // invalidatesTags: ["Team"],
      async onQueryStarted(queryArgument, { dispatch, queryFulfilled, extra }) {
        const result = (await queryFulfilled).data;
        const patchResult = dispatch(
          teamApi.util.updateQueryData(
            "getTeamMembers",
            {
              skip: 0,
              take: 10,
            },
            (draft) => {
              draft.data.unshift({
                ...result.data.TeamMember,
                image: result.data.Image || null,
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
    updateTeamMember: builder.mutation<
      TeamMember,
      { id: string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/team/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Team", id },
        "Team",
      ],
    }),
    deleteTeamMember: builder.mutation<void, string>({
      query: (id) => ({
        url: `/team/${id}`,
        method: "DELETE",
      }),
      // async onQueryStarted(queryArgument, { dispatch, queryFulfilled, extra  , getCacheEntry ,getState ,requestId}) {

      //   const cacheEntry = getState()
      //   const teamMembers = cacheEntry.api.queries['getTeamMembers']?.data

      //   if(teamMembers){

      //   }

      //   const patchResult = dispatch(
      //     teamApi.util.updateQueryData(
      //       "getTeamMembers",
      //       {
      //         skip: 0,
      //         take: 10,
      //       },
      //       (draft) => {
      //         draft.data = draft.data.filter(
      //           (teamMember) => teamMember.id !== queryArgument
      //         );
      //         draft.pagination.totalItems -= 1;
      //       }
      //     )
      //   );
      //   try {
      //     await queryFulfilled;
      //   } catch (error) {
      //     // Handle error
      //   }
      // },
      invalidatesTags: (result, error, id) => [{ type: "Team" }, "Team"],
    }),
  }),
});

export const {
  useGetTeamMembersQuery,
  useGetTeamMemberByIdQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = teamApi;
