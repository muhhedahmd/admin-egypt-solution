"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  FolderKanban,
  Users,
  FileText,
  Mail,
  Eye,
  MessageSquare,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
// import { StatsCard } from "@/components/admin/stats-card";
import { useGetAnalyticsOverviewQuery } from "@/lib/store/api/analytic-api";
import { StatsCard } from "@/components/admin/stats-card";
import { AnalyticsChart } from "@/components/admin/analytics-chart";

export default function AdminDashboard() {
  // Fetch analytics data for last 30 days
  const { data: analyticsData, isLoading: analyticsLoading } =
    useGetAnalyticsOverviewQuery({ days: 30 });

    console.log(analyticsData)
    // Fetch analytics for previous period (for comparison)
    const { data: previousAnalytics } = useGetAnalyticsOverviewQuery({ days: 60 });
    console.log(analyticsData , previousAnalytics)


  const stats = analyticsData?.data;
  const previousStats = previousAnalytics?.data;

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Calculate period metrics (last 30 days vs previous 30 days)
  const getPeriodMetrics = () => {
    if (!stats || !previousStats) return null;

    // Current period (last 30 days)
    const currentVisitors = stats.totalVisitors;
    const currentPageViews = stats.totalPageViews;
    const currentContacts = stats.totalContacts;
    const currentBlogViews = stats.totalBlogViews;

    // Previous period (days 31-60)
    const previousVisitors = previousStats.totalVisitors - currentVisitors;
    const previousPageViews = previousStats.totalPageViews - currentPageViews;
    const previousContacts = previousStats.totalContacts - currentContacts;
    const previousBlogViews = previousStats.totalBlogViews - currentBlogViews;

    return {
      visitors: {
        current: currentVisitors,
        change: calculateChange(currentVisitors, previousVisitors),
      },
      pageViews: {
        current: currentPageViews,
        change: calculateChange(currentPageViews, previousPageViews),
      },
      contacts: {
        current: currentContacts,
        change: calculateChange(currentContacts, previousContacts),
      },
      blogViews: {
        current: currentBlogViews,
        change: calculateChange(currentBlogViews, previousBlogViews),
      },
    };
  };

  const metrics = getPeriodMetrics();

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}% from last period`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your website.
        </p>
      </div>

      {/* Top Stats Cards - These would come from different APIs */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Services"
          value="12"
          change="+2 this month"
          icon={Briefcase}
          trend="up"
        />
        <StatsCard
          title="Active Projects"
          value="28"
          change="+5 this month"
          icon={FolderKanban}
          trend="up"
        />
        <StatsCard
          title="Team Members"
          value="15"
          change="No change"
          icon={Users}
          trend="neutral"
        />
        <StatsCard
          title="Blog Posts"
          value="47"
          change="+8 this month"
          icon={FileText}
          trend="up"
        />
      </div> */}
            {/* Analytics Metrics from Real Data */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Page Views */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {metrics?.pageViews.current.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {metrics && metrics.pageViews.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span
                    className={
                      metrics && metrics.pageViews.change >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {metrics ? formatChange(metrics.pageViews.change) : "N/A"}
                  </span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* New Contacts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Contacts</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {metrics?.contacts.current || "0"}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {metrics && metrics.contacts.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span
                    className={
                      metrics && metrics.contacts.change >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {metrics ? formatChange(metrics.contacts.change) : "N/A"}
                  </span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Blog Views */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Views</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {metrics?.blogViews.current.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {metrics && metrics.blogViews.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span
                    className={
                      metrics && metrics.blogViews.change >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {metrics ? formatChange(metrics.blogViews.change) : "N/A"}
                  </span>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart and Recent Activity */}
      <div className="">
        <Card className="col-span-4">

          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            {analyticsLoading ? (
              <Skeleton className="h-[270px] w-full" />
            ) : (
              <AnalyticsChart data={stats?.chartData || []} />
            )}
          </CardContent>
        </Card>

      
      </div>



      {/* Additional Engagement Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.totalVisitors.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 30 days
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.avgBounceRate.toFixed(1) || "0"}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average across all pages
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatSessionTime(stats?.avgSessionTime || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Time spent per session
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats
                    ? (
                        (stats.totalContacts / stats.totalVisitors) *
                        100
                      ).toFixed(2)
                    : "0"}
                  %
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Visitors to contacts
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to format session time
function formatSessionTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}