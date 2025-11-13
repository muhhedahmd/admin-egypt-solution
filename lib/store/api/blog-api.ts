import { PaginatedResponse, successResponse } from "@/types/services";
import { baseApi } from "./base-api";
import { Blog, BlogStatus } from "@/types/schema";



export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<PaginatedResponse<Blog> ,{ skip: number; take: number }>({
      query: ({ skip = 0, take = 10 } ) =>
        `/api/blog?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `${queryArgs?.skip || 0}-${queryArgs?.take || 10}`;
      },
      merge: (currentCache, newItems) => {
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    getBlogById: builder.query({
      query: (id) => `/api/blog/${id}`,
    }),

    getPublishedBlogs: builder.query<PaginatedResponse<Blog> , { skip: number; take: number }>({
      query: ({ skip = 0, take = 10 } ) =>
        `/api/blog/published/all?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `published-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`;
      },
    }),

    getFeaturedBlogs: builder.query<PaginatedResponse<Blog> , { skip: number; take: number }>({
      query: ({ skip = 0, take = 10 } ) =>
        `/api/blog/featured/all?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `featured-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`;
      },
    }),

    getBlogsByStatus: builder.query<PaginatedResponse<Blog> , { skip: number; take: number , status :BlogStatus }>({
      query: ({ status, skip = 0, take = 10 }) =>
        `/api/blog/status/${status}?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `status-${queryArgs?.status}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },
    }),

    searchBlogs: builder.query<successResponse<Blog>, { q: string; skip: number; take: number }>({
      query: ({ q, skip = 0, take = 10 }) =>
        `/api/blog/search/query?q=${q}&skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `search-${queryArgs?.q}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },
    }),

    getBlogsByCategory: builder.query<PaginatedResponse<Blog>, { categoryId: string; skip: number; take: number }>({
      query: ({ categoryId, skip = 0, take = 10 }) =>
        `/api/blog/by-category/${categoryId}?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `category-${queryArgs?.categoryId}-${queryArgs?.skip || 0}-${
          queryArgs?.take || 10
        }`;
      },
    }),

    // Blog Mutations
    createBlog: builder.mutation<successResponse<Blog>  , Blog>({
      query: (data) => ({
        url: "/api/blog",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(blogApi.util.invalidateTags(["Blog"]));
        } catch {
          // Handle error
        }
      },
    }),

    updateBlog: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/blog/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(blogApi.util.invalidateTags(["Blog"]));
        } catch {
          // Handle error
        }
      },
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/api/blog/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(blogApi.util.invalidateTags(["Blog"]));
        } catch {
          // Handle error
        }
      },
    }),

    incrementBlogViews: builder.mutation({
      query: (id) => ({
        url: `/api/blog/${id}/views`,
        method: "POST",
      }),
    }),

    assignBlogToCategory: builder.mutation({
      query: (data) => ({
        url: "/api/blog/assign-category",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(blogApi.util.invalidateTags(["BlogCategory"]));
        } catch {
          // Handle error
        }
      },
    }),

    removeBlogFromCategory: builder.mutation({
      query: (data) => ({
        url: "/api/blog/remove-category",
        method: "DELETE",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(blogApi.util.invalidateTags(["BlogCategory"]));
        } catch {
          // Handle error
        }
      },
    }),

    getBlogCategories: builder.query({
      query: ({ skip = 0, take = 10 } = {}) =>
        `/api/blog/categories/all?skip=${skip}&take=${take}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return `categories-${queryArgs?.skip || 0}-${queryArgs?.take || 10}`;
      },
    }),

    getBlogCategoryById: builder.query({
      query: (id) => `/api/blog/category/${id}`,
    }),

    // Category Mutations
    createBlogCategory: builder.mutation({
      query: (data) => ({
        url: "/api/blog/category",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(blogCategoryApi.util.invalidateTags(["BlogCategory"]));
        } catch {
          // Handle error
        }
      },
    }),

    updateBlogCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/blog/category/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(blogCategoryApi.util.invalidateTags(["BlogCategory"]));
        } catch {
          // Handle error
        }
      },
    }),

    deleteBlogCategory: builder.mutation({
      query: (id) => ({
        url: `/api/blog/category/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(blogCategoryApi.util.invalidateTags(["BlogCategory"]));
        } catch {
          // Handle error
        }
      },
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useGetPublishedBlogsQuery,
  useGetFeaturedBlogsQuery,
  useGetBlogsByStatusQuery,
  useSearchBlogsQuery,
  useGetBlogsByCategoryQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useIncrementBlogViewsMutation,
  useAssignBlogToCategoryMutation,
  useRemoveBlogFromCategoryMutation,
  useGetBlogCategoriesQuery,
  useGetBlogCategoryByIdQuery,
  useCreateBlogCategoryMutation,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
} = blogApi;
