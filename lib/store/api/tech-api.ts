
import { baseApi } from "./base-api"

export const technologyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Technology Queries
    getTechnologies: builder.query({
      query: ({ skip = 0, take = 10 } = {}) => `/projects/technologies/all?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `tech-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`
      },
    }),

    getTechnologyById: builder.query({
      query: (id) => `/projects/technology/${id}`,
    }),

    getTechnologiesByCategory: builder.query({
      query: ({ category, skip = 0, take = 10 }) =>
        `/projects/technologies/category/${category}?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `cat-${queryArgs?.category}-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`
      },
    }),

    getTechnologyCategories: builder.query({
      query: () => "/projects/categories/all",
    }),

    // Technology Mutations
    createTechnology: builder.mutation({
      query: (data) => ({
        url: "/projects/technology",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // dispatch(technologyApi.util.invalidateTags([""]))
        } catch {
          // Handle error
        }
      },
    }),

    updateTechnology: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/projects/technology/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(technologyApi.util.invalidateTags(["Technology"]))
        } catch {
          // Handle error
        }
      },
    }),

    deleteTechnology: builder.mutation({
      query: (id) => ({
        url: `/projects/technology/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(technologyApi.util.invalidateTags(["Technology"]))
        } catch {
          // Handle error
        }
      },
    }),

    createTechnologyWithProjects: builder.mutation({
      query: (data) => ({
        url: "/projects/technology-with-projects",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(technologyApi.util.invalidateTags(["Technology", "Project"]))
        } catch {
          // Handle error
        }
      },
    }),
  }),
})

export const {
  useGetTechnologiesQuery,
  useGetTechnologyByIdQuery,
  useGetTechnologiesByCategoryQuery,
  useGetTechnologyCategoriesQuery,
  useCreateTechnologyMutation,
  useUpdateTechnologyMutation,
  useDeleteTechnologyMutation,
  useCreateTechnologyWithProjectsMutation,
} = technologyApi
