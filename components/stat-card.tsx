"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    { className, label, value, icon: Icon, trend, description, ...props },
    ref
  ) => {
    return (
      <Card ref={ref} className={cn("", className)} {...props}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {label}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <p className="text-2xl font-bold tabular-nums">{value}</p>
                {trend && (
                  <span
                    className={cn(
                      "text-xs font-medium",
                      trend.isPositive ? "text-green-500" : "text-destructive"
                    )}
                  >
                    {trend.isPositive ? "+" : ""}
                    {trend.value}%
                  </span>
                )}
              </div>
              {description && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {Icon && (
              <div className="rounded-full bg-muted p-2">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)
StatCard.displayName = "StatCard"

export { StatCard }
