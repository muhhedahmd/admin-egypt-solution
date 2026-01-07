"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface TrafficData {
  source?: string;
  medium?: string;
  visitors: number;
}

interface TrafficSourcesChartProps {
  data: TrafficData[];
  type: "source" | "medium";
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function TrafficSourcesChart({ data, type }: TrafficSourcesChartProps) {
  const chartData = data.map((item) => ({
    name: type === "source" ? item.source : item.medium,
    value: item.visitors,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="horizontal">
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            width={100}
            className="text-xs capitalize"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const data = payload[0];
              return (
                <div className="rounded-lg border bg-background p-3 shadow-lg">
                  <p className="text-sm font-medium capitalize mb-1">{data.payload.name}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Visitors:</span>
                    <span className="font-medium">{data.value}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>
                      {((Number(data.value) / total) * 100).toFixed(1)}% of total
                    </span>
                  </div>
                </div>
              );
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="space-y-2">
        {chartData.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="capitalize font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{item.value.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}