import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_BACKEND_URL_API || "http://localhost:5000/api",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Vercel Cookie Fallback: use the infinity token if provided
    const fallbackToken = process.env.NEXT_PUBLIC_FALLBACK_TOKEN;
    const finalToken = token || fallbackToken;

    if (finalToken) {
      headers.set("authorization", `Bearer ${finalToken}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Analytics",
    "Hero",
    "CompanyInfo",
    "Services",
    "SlideShows",
    "Project",
    "BlogCategory",
    "Projects",
    "Blog",
    "Team",
    "Clients",
    "Testimonials",
    "Contacts",
    "Media",
  ],
  endpoints: () => ({}),
});
