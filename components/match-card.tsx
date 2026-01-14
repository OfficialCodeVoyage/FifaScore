"use client"

import * as React from "react"
import { MessageCircle, Calendar } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export interface MatchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  team1Name: string
  team1Logo?: string
  team1Score: number
  team2Name: string
  team2Logo?: string
  team2Score: number
  date: string
  hasComment?: boolean
  onClick?: () => void
}

const MatchCard = React.forwardRef<HTMLDivElement, MatchCardProps>(
  (
    {
      className,
      team1Name,
      team1Logo,
      team1Score,
      team2Name,
      team2Logo,
      team2Score,
      date,
      hasComment = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const team1Won = team1Score > team2Score
    const team2Won = team2Score > team1Score
    const isDraw = team1Score === team2Score

    return (
      <Card
        ref={ref}
        className={cn(
          "cursor-pointer transition-all hover:shadow-md active:scale-[0.98]",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Team 1 */}
            <div className="flex flex-1 items-center gap-3">
              {team1Logo ? (
                <img
                  src={team1Logo}
                  alt={team1Name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {team1Name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span
                className={cn(
                  "text-sm font-medium truncate max-w-[80px]",
                  team1Won && "text-primary font-semibold"
                )}
              >
                {team1Name}
              </span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-2 px-4">
              <span
                className={cn(
                  "text-2xl font-bold tabular-nums",
                  team1Won && "text-primary",
                  isDraw && "text-muted-foreground"
                )}
              >
                {team1Score}
              </span>
              <span className="text-muted-foreground">-</span>
              <span
                className={cn(
                  "text-2xl font-bold tabular-nums",
                  team2Won && "text-primary",
                  isDraw && "text-muted-foreground"
                )}
              >
                {team2Score}
              </span>
            </div>

            {/* Team 2 */}
            <div className="flex flex-1 items-center justify-end gap-3">
              <span
                className={cn(
                  "text-sm font-medium truncate max-w-[80px] text-right",
                  team2Won && "text-primary font-semibold"
                )}
              >
                {team2Name}
              </span>
              {team2Logo ? (
                <img
                  src={team2Logo}
                  alt={team2Name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {team2Name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Footer with date and comment indicator */}
          <div className="mt-3 flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{date}</span>
            </div>
            {hasComment && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageCircle className="h-3 w-3" />
                <span>Comment</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)
MatchCard.displayName = "MatchCard"

export { MatchCard }
