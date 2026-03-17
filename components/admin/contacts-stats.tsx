"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStatsQuery } from "@/lib/store/api/contact-api"
import { Mail, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

import { useLanguage } from "@/providers/lang"
import { tContacts } from "@/i18n/contacts"

export function ContactsStats() {
  const { currentLang } = useLanguage();
  const t = tContacts[(currentLang?.toLowerCase() as "en" | "ar") || "en"];

  const {
    data: statsData,
    isLoading,
  } = useStatsQuery()

  const stats = (statsData as any)?.data

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
          <CardTitle className="text-sm font-medium">{t.stats.totalInquiries}</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total || 0}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+{weeklyChange}</span> {t.stats.thisWeek}
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t.stats.pending}</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.pending || 0}</div>
          <p className="text-xs text-muted-foreground">
            <span className={stats?.pendingPercentage > 50 ? "text-orange-600" : "text-blue-600"}>
              {stats?.pendingPercentage || 0}%
            </span> {t.stats.ofTotal}
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t.stats.resolved}</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.resolved || 0}</div>
          <p className="text-xs text-muted-foreground">
            <span className={stats?.resolutionRate > 0 ? "text-green-600" : "text-gray-600"}>
              {stats?.resolutionRate || 0}%
            </span> {t.stats.resolutionRate}
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t.stats.urgent}</CardTitle>
          <AlertCircle className={`h-4 w-4 ${stats?.urgent > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats?.urgent > 0 ? 'text-red-600' : ''}`}>
            {stats?.urgent || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.urgent > 0 ? (
              <span className="text-red-600">{t.stats.requiresAttention}</span>
            ) : (
              <span className="text-green-600">{t.stats.allClear}</span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}