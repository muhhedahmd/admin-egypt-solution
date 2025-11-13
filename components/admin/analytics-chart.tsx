"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "Jan", views: 2400, contacts: 12 },
  { month: "Feb", views: 3200, contacts: 18 },
  { month: "Mar", views: 2800, contacts: 15 },
  { month: "Apr", views: 4100, contacts: 22 },
  { month: "May", views: 3800, contacts: 19 },
  { month: "Jun", views: 4500, contacts: 28 },
]

const chartConfig = {
  views: {
    label: "Page Views",
    color: "hsl(var(--chart-1))",
  },
  contacts: {
    label: "Contacts",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function AnalyticsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="views"
          stroke="var(--color-views)"
          fill="var(--color-views)"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="contacts"
          stroke="var(--color-contacts)"
          fill="var(--color-contacts)"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
