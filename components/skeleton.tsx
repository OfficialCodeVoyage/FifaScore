"use client"

import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded bg-muted/30 skeleton-shimmer", className)} />
  )
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("fifa-card overflow-hidden", className)}>
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  )
}

export function SkeletonMatch({ className }: SkeletonProps) {
  return (
    <div className={cn("p-4 rounded-xl bg-muted/20", className)}>
      <div className="flex items-center justify-between">
        {/* Player 1 */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <span className="text-muted-foreground/30">-</span>
          <Skeleton className="h-8 w-8 rounded" />
        </div>

        {/* Player 2 */}
        <div className="flex items-center gap-3">
          <div className="space-y-1 text-right">
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-3 w-12 ml-auto" />
          </div>
          <Skeleton className="w-8 h-8 rounded" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonStatCard({ className }: SkeletonProps) {
  return (
    <div className={cn("fifa-card p-4", className)}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-12 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

export function SkeletonMatchList({ count = 3, className }: SkeletonProps & { count?: number }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonMatch key={i} />
      ))}
    </div>
  )
}

export function SkeletonStatsGrid({ className }: SkeletonProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
  )
}
