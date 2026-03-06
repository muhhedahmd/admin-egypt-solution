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
    const fallbackRefreshToken = process.env.NEXT_PUBLIC_FALLBACK_REFRESH_TOKEN;

    const finalToken = token || fallbackToken;

    if (finalToken) {
      headers.set("authorization", `Bearer ${finalToken}`);
    }

    // Some backend flows might require the refresh token to be passed manually
    // if cookies are strictly ignored or failing on the subdomain
    if (fallbackRefreshToken) {
      headers.set("x-refresh-token", fallbackRefreshToken);
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
