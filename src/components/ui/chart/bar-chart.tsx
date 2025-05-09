
import * as React from "react"
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Payload,
  ValueType,
  NameType
} from "recharts"
import { ChartContainer } from "./chart-container"
import { ChartTooltipContent } from "./chart-tooltip"
import { ChartConfig } from "./types"

interface BarChartProps {
  data: any[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  showLegend?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  className?: string
}

export function BarChart({
  data,
  index,
  categories,
  colors,
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 56,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  className,
}: BarChartProps) {
  const config: ChartConfig = {}
  
  // Define colors for each category
  categories.forEach((category, i) => {
    config[category] = {
      color: colors?.[i] || undefined,
    }
  })

  return (
    <ChartContainer config={config} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 16, right: 16, bottom: 16, left: 16 }}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-muted"
            />
          )}
          {showXAxis && (
            <XAxis
              dataKey={index}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
          )}
          {showYAxis && (
            <YAxis
              width={yAxisWidth}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={valueFormatter}
            />
          )}
          {showTooltip && (
            <Tooltip
              cursor={{ fill: "var(--chart-tooltip-bg)" }}
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  label={label}
                  valueFormatter={valueFormatter}
                />
              )}
            />
          )}
          {showLegend && <Legend />}
          {categories.map((category) => (
            <Bar
              key={category}
              dataKey={category}
              fill={`var(--color-${category}, var(--chart-primary))`}
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
