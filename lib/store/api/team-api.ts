import { baseApi } from "./base-api"

interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string
  image?: string
  expertise?: string[]
  [key: string]: any
}

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMembers: builder.query<TeamMember[], void>({
      query: () => "/team",
      providesTags: ["Team"],
    }),
    getTeamMemberById: builder.query<TeamMember, string>({
      query: (id) => `/team/${id}`,
      providesTags: (result, error, id) => [{ type: "Team", id }],
    }),
    createTeamMember: builder.mutation<TeamMember, Partial<TeamMember>>({
      query: (body) => ({
        url: "/team",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Team"],
    }),
    updateTeamMember: builder.mutation<TeamMember, { id: string; body: Partial<TeamMember> }>({
      query: ({ id, body }) => ({
        url: `/team/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Team", id }, "Team"],
    }),
    deleteTeamMember: builder.mutation<void, string>({
      query: (id) => ({
        url: `/team/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),
  }),
})

export const {
  useGetTeamMembersQuery,
  useGetTeamMemberByIdQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = teamApi
