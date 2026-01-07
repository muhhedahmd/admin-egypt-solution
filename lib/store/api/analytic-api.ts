import { successResponse } from "@/types/services";
import { baseApi } from "./base-api";

export interface AnalyticsOverview {
  totalVisitors: number;
  totalPageViews: number;
  totalBlogViews: number;
  totalContacts: number;
  avgBounceRate: number;
  avgSessionTime: number;
  chartData: Array<{
    date: string;
    visitors: number;
    pageViews: number;
    blogViews: number;
  }>;
}

export interface TopPage {
  path: string;
  title: string;
  views: number;
  uniqueViews: number;
  avgTimeOnPage: number | null;
  avgScrollDepth: number | null;
}

export interface TrafficSource {
  source: string;
  visitors: number;
}

export interface TrafficMedium {
  medium: string;
  visitors: number;
}

export interface TrafficSourcesResponse {
  sources: TrafficSource[];
  mediums: TrafficMedium[];
}

export const AnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get analytics overview
    getAnalyticsOverview: builder.query<
      successResponse<AnalyticsOverview>,
      { days?: number }
    >({
      query: ({ days = 30 }) => ({
        url: "/analytics/overview",
        params: { days },
      }),
      providesTags: ["Analytics"],
    }),

    // Get top pages
    getTopPages: builder.query<
      successResponse<TopPage[]>,
      { days?: number; limit?: number }
    >({
      query: ({ days = 30, limit = 10 }) => ({
        url: "/analytics/top-pages",
        params: { days, limit },
      }),
      providesTags: ["Analytics"],
    }),

    // Get traffic sources
    getTrafficSources: builder.query<
      successResponse<TrafficSourcesResponse>,
      { days?: number }
    >({
      query: ({ days = 30 }) => ({
        url: "/analytics/traffic-sources",
        params: { days },
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetAnalyticsOverviewQuery,
  useGetTopPagesQuery,
  useGetTrafficSourcesQuery,
} = AnalyticsApi;