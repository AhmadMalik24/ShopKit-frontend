"use client";

import * as React from "react";
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
import type { PieSectorShapeProps } from "recharts/types/polar/Pie";

const demographicsData = [
  { group: "18–30 years", visitors: 46, color: "var(--purple)" },
  { group: "30–45 years", visitors: 32, color: "var(--yellow)" },
  { group: "45–60 years", visitors: 18, color: "var(--cyan)" },
  { group: "60+ years", visitors: 4, color: "var(--muted)" },
];

export function DemographicsPieChart() {
  const [activeGroup, setActiveGroup] = React.useState(demographicsData[0].group);
  const activeIndex = demographicsData.findIndex(
    (item) => item.group === activeGroup,
  );

  const renderPieShape = React.useCallback(
    ({ index, outerRadius = 0, ...props }: PieSectorShapeProps) => {
      if (index === activeIndex) {
        return (
          <g>
            <Sector {...props} outerRadius={outerRadius + 6} />
            <Sector
              {...props}
              outerRadius={outerRadius + 14}
              innerRadius={outerRadius + 8}
            />
          </g>
        );
      }

      return <Sector {...props} outerRadius={outerRadius} />;
    },
    [activeIndex],
  );

  return (
    <div className="demographics-chart">
      <div className="demographics-chart-header">
        <div>
          <p className="subtle-copy">Age distribution</p>
          <strong className="demographics-chart-title">Visitors</strong>
        </div>
        <select
          aria-label="Select demographic group"
          value={activeGroup}
          onChange={(event) => setActiveGroup(event.target.value)}
        >
          {demographicsData.map((item) => (
            <option key={item.group} value={item.group}>
              {item.group}
            </option>
          ))}
        </select>
      </div>

      <div className="demographics-chart-visual">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              cursor={false}
              contentStyle={{
                color: "var(--text)",
                background: "var(--panel-dark)",
                border: "1px solid var(--line)",
                borderRadius: 8,
              }}
              formatter={(value) => [`${value}%`, "Visitors"]}
            />
            <Pie
              data={demographicsData}
              dataKey="visitors"
              nameKey="group"
              innerRadius={62}
              outerRadius={92}
              stroke="var(--panel)"
              strokeWidth={4}
              shape={renderPieShape}
            >
              {demographicsData.map((item) => (
                <Cell key={item.group} fill={item.color} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 3}
                          fill="var(--text)"
                          fontSize="21"
                          fontWeight="700"
                        >
                          {demographicsData[activeIndex].visitors}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 14}
                          fill="var(--muted)"
                          fontSize="9"
                        >
                          {demographicsData[activeIndex].group}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
