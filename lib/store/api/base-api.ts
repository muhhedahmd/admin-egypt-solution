import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL_API || "http://localhost:5000/api",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    return headers
  },
  
})

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [  "Hero", "CompanyInfo", "Services","SlideShows"  ,  "Project" , "BlogCategory" , "Projects", "Blog", "Team", "Clients", "Testimonials", "Contacts", "Media"],
  endpoints: () => ({}),

   
  
})
