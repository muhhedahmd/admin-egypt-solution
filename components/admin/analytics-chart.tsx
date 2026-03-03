"use client";

import { adminDashboardTranslations } from "@/i18n/admin-dashboard";
import { useLanguage } from "@/providers/lang";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface ChartDataPoint {
  date: string;
  visitors: number;
  pageViews: number;
  blogViews: number;
}

interface AnalyticsChartProps {
  data: ChartDataPoint[];
}

export function  AnalyticsChart({ data }: AnalyticsChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));
  const { 
      currentLang , 
  
  
    } = useLanguage()
      const t = adminDashboardTranslations[currentLang as keyof typeof adminDashboardTranslations] || adminDashboardTranslations["en"];
      
    

  return (
    <ResponsiveContainer  width="100%" height={290}>
      <AreaChart  data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs"
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="rounded-lg border bg-background p-3 shadow-lg">
                <p className="text-sm font-medium mb-2">{payload[0].payload.date}</p>
                {payload.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-muted-foreground">{entry.name}:</span>
                    <span className="font-medium">{entry.value}</span>
                  </div>
                ))}
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="pageViews"
          name={t.chart.pageViews}
          style={{

            stroke :"hsl(var(--chart-3))",
            // fill :"hsl(var(--chart-1))"
          }}
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="visitors"
          name={t.chart.visitors}
          style={{
            stroke :"hsl(var(--chart-2))",
            fill : "hsl(var(--chart-2))"

          }}
          fillOpacity={0.2}
          strokeWidth={2}
        />
     
      </AreaChart>
    </ResponsiveContainer>
  );
}