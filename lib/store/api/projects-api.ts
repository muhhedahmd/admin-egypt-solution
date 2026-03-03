import {
  PaginatedResponse,
  PaginationParams,
  successResponse,
} from "@/types/services";
import { baseApi } from "./base-api";
import {
  Image,
  Project,
  ProjectWithRelations,
  Technology,
} from "@/types/schema";

export type getProjects = {
  project: Project;
  image: Image | null;
  technologies: Partial<Technology>[];
};
export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Project Queries
    getProjects: builder.query<
      PaginatedResponse<getProjects>,
      PaginationParams
    >({
      query: ({ skip = 0, take = 10 }) => `/projects?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `projects-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`;
      },
    }),

    getProjectBySlug: builder.query<
      successResponse<{
        project: Project;
        image: Image | null;
        technologies: any | null;
        servicesData?: any | null;
      }>,
      {projectSlug :string ,currentLang : string}
    >({
      query: ({projectSlug}) => `/projects/${projectSlug}`,
    }),

    getFeaturedProjects: builder.query<any, any>({
      query: ({ skip = 0, take = 10 } = {}) =>
        `/projects/featured/all?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `featured-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`;
      },
    }),

    getProjectsByStatus: builder.query({
      query: ({ status, skip = 0, take = 10 }) =>
        `/projects/status/${status}?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `status-${queryArgs?.status}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },
    }),

    searchProjects: builder.query<
      PaginatedResponse<getProjects>,
      { q: string; skip: number; take: number }
    >({
      query: ({ q, skip = 0, take = 10 }) =>
        `/projects/search/query?q=${q}&skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `search-${queryArgs?.q}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },
    }),

    SearchTechnologies: builder.query<
      PaginatedResponse<Technology[]>,
      { q: string; skip: number; take: number }
    >({
      query: ({ q, skip = 0, take = 10 }) => {
        return {
          url: `/projects/tech-search`,
          params: {
            q,
            skip,
            take,
          },
        };
      },
      // serializeQueryArgs: ({ queryArgs }) => {
      //   return `tech-search-${queryArgs?.q}-${queryArgs?.skip || 0}-${
      //     queryArgs?.take || 10
      //   }`;

      // },
    }),

    getProjectsByTechnology: builder.query<
      PaginatedResponse<ProjectWithRelations[]>,
      { technologyId: string; skip: number; take: number }
    >({
      query: ({ technologyId, skip = 0, take = 10 }) =>
        `/projects/by-technology/${technologyId}?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `tech-${queryArgs?.technologyId}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },
    }),

    getProjectTechnologies: builder.query({
      query: ({ projectId, skip = 0, take = 10 }) =>
        `/projects/project-technologies/${projectId}?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `proj-tech-${queryArgs?.projectId}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },
    }),

    // Project Mutations
    createProject: builder.mutation({
      query: (data) => ({
        url: "/projects",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(projectApi.util.invalidateTags(["Project"]));
        } catch {
          console.log("error");
          // Handle error
        }
      },
    }),

    cerateProjectAndAssignTechnologies: builder.mutation({
      query: (data) => ({
        url: "/projects/projects-assign-technologies",
        method: "POST",
        body: data,
      }),
    }),

    updateProject: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(projectApi.util.invalidateTags(["Project"]));
        } catch {
          // Handle error
        }
      },
    }),
    updateProjectBulk: builder.mutation<
      void,
      {
        id: string;
        data: FormData;
      }
    >({
      query: ({ id, data }) => ({
        url: `/projects/update-project-bulk/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(projectApi.util.invalidateTags(["Project"]));
        } catch {
          // Handle error
        }
      },
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags(result, error, arg, meta) {
        return [{ type: "Project", id: arg }];
      },
    }),

    assignProjectsToTechnology: builder.mutation({
      query: (data) => ({
        url: "/projects/assign-technology",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(projectApi.util.invalidateTags(["Project"]));
        } catch {
          // Handle error
        }
      },
    }),

    removeProjectsFromTechnology: builder.mutation({
      query: (data) => ({
        url: "/projects/remove-technology",
        method: "DELETE",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(projectApi.util.invalidateTags(["Project"]));
        } catch {
          // Handle error
        }
      },
    }),

    GetTechnologiesByCategory: builder.query({
      query: ({ category, skip = 0, take = 100 }) => {
        return {
          url: `/projects/technologies/category/${category}`,
          params: {
            skip,
            take,
          },
        };
      },
    }),

    getCategories: builder.query<
      PaginatedResponse<string>,
      { skip: number; take: number }
    >({
      query: ({ skip, take }) => {
        return {
          url: "/projects/categories/all",
          params: {
            skip,
            take,
          },
        };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        return `cat-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`;
      },
      merge(currentCacheData, responseData, otherArgs) {
        console.log({
          currentCacheData,
          responseData,
        });
        const mergedData = [
          ...currentCacheData.data,
          ...responseData.data,
        ].flat();
        const merageSet = new Set(mergedData);
        const array = Array.from(merageSet);

        return {
          data: array,
          message: responseData.message,
          pagination: responseData.pagination || currentCacheData.pagination,
        };
      },
    }),
    getTechs: builder.query<
      successResponse<Technology[]>,
      { skip: number; take: number }
    >({
      query: ({ skip = 0, take = 10 }) => {
        return {
          url: "/projects/technologies/all",
          params: {
            skip,
            take,
          },
        };
      },
    }),
  }),
});

export const {
  useGetTechsQuery,
  useLazyGetTechsQuery,
  useLazyGetCategoriesQuery,
  useGetCategoriesQuery,
  useGetProjectsQuery,
  useLazySearchTechnologiesQuery,
  useLazyGetTechnologiesByCategoryQuery,
  useLazySearchProjectsQuery,
  useGetProjectBySlugQuery,
  useGetFeaturedProjectsQuery,
  useGetProjectsByStatusQuery,
  useSearchProjectsQuery,
  useGetProjectsByTechnologyQuery,
  useGetProjectTechnologiesQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useUpdateProjectBulkMutation,
  useDeleteProjectMutation,
  useAssignProjectsToTechnologyMutation,
  useRemoveProjectsFromTechnologyMutation,
  useCerateProjectAndAssignTechnologiesMutation,
} = projectApi;
