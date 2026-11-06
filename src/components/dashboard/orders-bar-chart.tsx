"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

export function OrdersBarChart() {
  return (
    <div className="orders-chart" aria-label="Orders breakdown for January through June">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 4" />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{ fill: "var(--muted)", fontSize: 9 }}
            tickFormatter={(value: string) => value.slice(0, 3)}
          />
          <Tooltip
            cursor={false}
            contentStyle={{
              color: "var(--text)",
              background: "var(--panel-dark)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              fontSize: 10,
            }}
            formatter={(value, name) => [
              Number(value).toLocaleString(),
              name === "desktop" ? "Desktop" : "Mobile",
            ]}
          />
          <Bar dataKey="desktop" fill="var(--purple)" radius={4} />
          <Bar dataKey="mobile" fill="var(--yellow)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
