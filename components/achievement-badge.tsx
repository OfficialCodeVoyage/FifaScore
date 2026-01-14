"use client"

import * as React from "react"
import { LucideIcon, Trophy, Star, Flame, Target, Award } from "lucide-react"

import { cn } from "@/lib/utils"

export type AchievementType =
  | "trophy"
  | "star"
  | "flame"
  | "target"
  | "award"
  | "custom"

export interface AchievementBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  description?: string
  type?: AchievementType
  icon?: LucideIcon
  unlocked?: boolean
  progress?: {
    current: number
    total: number
  }
  size?: "sm" | "md" | "lg"
}

const iconMap: Record<Exclude<AchievementType, "custom">, LucideIcon> = {
  trophy: Trophy,
  star: Star,
  flame: Flame,
  target: Target,
  award: Award,
}

const sizeClasses = {
  sm: {
    container: "p-2",
    icon: "h-6 w-6",
    iconWrapper: "h-10 w-10",
    name: "text-xs",
    description: "text-[10px]",
  },
  md: {
    container: "p-3",
    icon: "h-8 w-8",
    iconWrapper: "h-14 w-14",
    name: "text-sm",
    description: "text-xs",
  },
  lg: {
    container: "p-4",
    icon: "h-10 w-10",
    iconWrapper: "h-18 w-18",
    name: "text-base",
    description: "text-sm",
  },
}

const AchievementBadge = React.forwardRef<HTMLDivElement, AchievementBadgeProps>(
  (
    {
      className,
      name,
      description,
      type = "trophy",
      icon: CustomIcon,
      unlocked = false,
      progress,
      size = "md",
      ...props
    },
    ref
  ) => {
    const Icon = type === "custom" && CustomIcon ? CustomIcon : iconMap[type as Exclude<AchievementType, "custom">]
    const sizes = sizeClasses[size]

    const progressPercent = progress
      ? Math.round((progress.current / progress.total) * 100)
      : 0

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center text-center rounded-lg border bg-card transition-all",
          unlocked
            ? "border-primary/50 shadow-sm"
            : "border-muted opacity-60 grayscale",
          sizes.container,
          className
        )}
        {...props}
      >
        {/* Icon */}
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full",
            unlocked
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
            sizes.iconWrapper
          )}
        >
          <Icon className={sizes.icon} />
          {unlocked && (
            <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
          )}
        </div>

        {/* Name */}
        <p
          className={cn(
            "mt-2 font-semibold leading-tight",
            unlocked ? "text-foreground" : "text-muted-foreground",
            sizes.name
          )}
        >
          {name}
        </p>

        {/* Description */}
        {description && (
          <p
            className={cn(
              "mt-0.5 text-muted-foreground leading-tight",
              sizes.description
            )}
          >
            {description}
          </p>
        )}

        {/* Progress bar */}
        {progress && !unlocked && (
          <div className="mt-2 w-full">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {progress.current}/{progress.total}
            </p>
          </div>
        )}
      </div>
    )
  }
)
AchievementBadge.displayName = "AchievementBadge"

export { AchievementBadge }
