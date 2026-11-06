"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const chartData = [
  { date: "2025-05-01", desktop: 222, mobile: 150 },
  { date: "2025-05-02", desktop: 97, mobile: 180 },
  { date: "2025-05-03", desktop: 167, mobile: 120 },
  { date: "2025-05-04", desktop: 242, mobile: 260 },
  { date: "2025-05-05", desktop: 373, mobile: 290 },
  { date: "2025-05-06", desktop: 301, mobile: 340 },
  { date: "2025-05-07", desktop: 245, mobile: 180 },
  { date: "2025-05-08", desktop: 409, mobile: 320 },
  { date: "2025-05-09", desktop: 159, mobile: 210 },
  { date: "2025-05-10", desktop: 261, mobile: 190 },
  { date: "2025-05-11", desktop: 327, mobile: 350 },
  { date: "2025-05-12", desktop: 292, mobile: 210 },
  { date: "2025-05-13", desktop: 342, mobile: 380 },
  { date: "2025-05-14", desktop: 237, mobile: 220 },
  { date: "2025-05-15", desktop: 320, mobile: 270 },
  { date: "2025-05-16", desktop: 138, mobile: 190 },
  { date: "2025-05-17", desktop: 446, mobile: 360 },
  { date: "2025-05-18", desktop: 364, mobile: 410 },
  { date: "2025-05-19", desktop: 243, mobile: 180 },
  { date: "2025-05-20", desktop: 289, mobile: 250 },
  { date: "2025-05-21", desktop: 337, mobile: 300 },
  { date: "2025-05-22", desktop: 224, mobile: 170 },
  { date: "2025-05-23", desktop: 338, mobile: 230 },
  { date: "2025-05-24", desktop: 387, mobile: 290 },
  { date: "2025-05-25", desktop: 315, mobile: 250 },
  { date: "2025-05-26", desktop: 275, mobile: 230 },
  { date: "2025-05-27", desktop: 420, mobile: 460 },
  { date: "2025-05-28", desktop: 333, mobile: 290 },
  { date: "2025-05-29", desktop: 278, mobile: 230 },
  { date: "2025-05-30", desktop: 440, mobile: 380 },
];

type RevenueAreaChartProps = {
  range: string;
};

export function RevenueAreaChart({ range }: RevenueAreaChartProps) {
  const visibleData = React.useMemo(() => {
    if (range === "Week") {
      return chartData.slice(-7);
    }

    if (range === "Year") {
      return chartData;
    }

    return chartData.slice(-30);
  }, [range]);

  return (
    <div className="revenue-chart" aria-label="Revenue chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={visibleData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueDesktopFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--purple)" stopOpacity={0.45} />
              <stop offset="95%" stopColor="var(--purple)" stopOpacity={0.04} />
            </linearGradient>
            <linearGradient id="revenueMobileFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--yellow)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--yellow)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 4" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={28}
            tick={{ fill: "var(--muted)", fontSize: 9 }}
            tickFormatter={(value: string) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <Tooltip
            cursor={{ stroke: "var(--purple)", strokeDasharray: "3 3" }}
            contentStyle={{
              color: "var(--text)",
              background: "var(--panel-dark)",
              border: "1px solid var(--purple)",
              borderRadius: 8,
              fontSize: 10,
            }}
            labelFormatter={(value) =>
              new Date(String(value)).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
            formatter={(value, name) => [
              `$${Number(value).toLocaleString()}`,
              name === "desktop" ? "Revenue" : "Previous period",
            ]}
          />
          <Area
            dataKey="mobile"
            type="natural"
            fill="url(#revenueMobileFill)"
            stroke="var(--yellow)"
            strokeDasharray="4 5"
            strokeWidth={2}
            stackId="a"
          />
          <Area
            dataKey="desktop"
            type="natural"
            fill="url(#revenueDesktopFill)"
            stroke="var(--purple)"
            strokeWidth={3}
            stackId="a"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
