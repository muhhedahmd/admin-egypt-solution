"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStatsQuery } from "@/lib/store/api/contact-api"
import { Mail, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function ContactsStats() {
  const { 
    data: statsData,
    isLoading,
  } = useStatsQuery()

  const stats = statsData?.data

  // Calculate weekly change (you can adjust this logic based on your API data)
  const weeklyChange = stats ? Math.round(stats.total * 0.08) : 0 // Example: 8% of total

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32 animate-pulse" />
              <Skeleton className="h-4 w-4 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2 animate-pulse" />
              <Skeleton className="h-3 w-24 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total || 0}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+{weeklyChange}</span> this week
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.pending || 0}</div>
          <p className="text-xs text-muted-foreground">
            <span className={stats?.pendingPercentage > 50 ? "text-orange-600" : "text-blue-600"}>
              {stats?.pendingPercentage || 0}%
            </span> of total
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.resolved || 0}</div>
          <p className="text-xs text-muted-foreground">
            <span className={stats?.resolutionRate > 0 ? "text-green-600" : "text-gray-600"}>
              {stats?.resolutionRate || 0}%
            </span> resolution rate
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Urgent</CardTitle>
          <AlertCircle className={`h-4 w-4 ${stats?.urgent > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats?.urgent > 0 ? 'text-red-600' : ''}`}>
            {stats?.urgent || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.urgent > 0 ? (
              <span className="text-red-600">Requires attention</span>
            ) : (
              <span className="text-green-600">All clear</span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}