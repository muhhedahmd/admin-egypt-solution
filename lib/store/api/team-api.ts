import { PaginatedResponse, successResponse } from "@/types/services";
import { baseApi } from "./base-api";
import { Image, TeamMember, TeamMemberWithImage } from "@/types/schema";
import { se } from "date-fns/locale";

export type teamMemberTranslation = {
  name: string;
  bio?: string;
  lang: "EN" | "AR";
  position?: string;
};
export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMembers: builder.query<
      PaginatedResponse<{
        teamMember: TeamMember;
        image: Image | null;
        translation: teamMemberTranslation[];
      }>,
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
    searchTeamMembers: builder.query<
      PaginatedResponse<{
        teamMember: TeamMember;
        image: Image | null;
        translation: teamMemberTranslation[];
      }>,
      {
        skip?: number;
        take?: number;
        q: string;
      }
    >({
      query: ({ q, skip = 0, take = 10 }) => {

        return {
          url: "/team/search",
          params: {
            skip,
            take,
            q,
          },
        };
      },
      serializeQueryArgs: ({ queryArgs , endpointName ,endpointDefinition }) => {
        return `${endpointDefinition}-${endpointName}-${queryArgs?.q}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },

      providesTags: ["Team"],
    }),
    getTeamMemberById: builder.query<
      successResponse<{
        image: Image | null;
        teamMember: TeamMember;
        translation: teamMemberTranslation[];
      }>,
      string
    >({
      query: (id) => `/team/${id}`,
      providesTags: (result, error, id) => [{ type: "Team", id }],
    }),

    createTeamMember: builder.mutation<
      successResponse<{
        Image: Image | null;
        TeamMember: TeamMember;
        translation: teamMemberTranslation[];
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
                teamMember: result.data.TeamMember,
                translation: result.data.translation,
                image: result.data.Image || null,
              });
              draft.pagination.totalItems += 1;
            },
          ),
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

      invalidatesTags: (result, error, id) => [{ type: "Team" }, "Team"],
    }),
  }),
});

export const {
  useGetTeamMembersQuery,
  useSearchTeamMembersQuery,
  useLazySearchTeamMembersQuery,
  useGetTeamMemberByIdQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = teamApi;
