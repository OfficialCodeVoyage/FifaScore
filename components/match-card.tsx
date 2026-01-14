"use client"

import * as React from "react"
import { MessageCircle, Calendar, Trophy } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { TeamLogo } from "@/components/team-logo"

export interface MatchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  team1Name: string
  team1Logo?: string
  team1Score: number
  team1ShortName?: string
  team1Color?: string
  team2Name: string
  team2Logo?: string
  team2Score: number
  team2ShortName?: string
  team2Color?: string
  date: string
  hasComment?: boolean
  extraTime?: boolean
  penalties?: boolean
  onClick?: () => void
}

const MatchCard = React.forwardRef<HTMLDivElement, MatchCardProps>(
  (
    {
      className,
      team1Name,
      team1Logo,
      team1Score,
      team1ShortName,
      team1Color,
      team2Name,
      team2Logo,
      team2Score,
      team2ShortName,
      team2Color,
      date,
      hasComment = false,
      extraTime = false,
      penalties = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const team1Won = team1Score > team2Score
    const team2Won = team2Score > team1Score
    const isDraw = team1Score === team2Score

    return (
      <div
        ref={ref}
        className={cn(
          "fifa-card cursor-pointer overflow-hidden",
          className
        )}
        onClick={onClick}
        {...props}
      >
        {/* Main content */}
        <div className="relative p-4">
          {/* Team color accents */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 opacity-80"
            style={{ backgroundColor: team1Color || 'hsl(var(--muted))' }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-1 opacity-80"
            style={{ backgroundColor: team2Color || 'hsl(var(--muted))' }}
          />

          <div className="flex items-center justify-between gap-2">
            {/* Team 1 */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className={cn(
                "team-logo-md flex items-center justify-center transition-transform",
                team1Won && "scale-110"
              )}>
                {team1Logo ? (
                  <TeamLogo
                    src={team1Logo}
                    alt={team1Name}
                    className="w-full h-full object-contain"
                    fallbackClassName="w-full h-full text-sm font-bold text-gray-800"
                  />
                ) : (
                  <span className="text-sm font-bold text-gray-800">
                    {team1ShortName || team1Name.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium truncate max-w-full text-center",
                  team1Won && "text-primary font-semibold"
                )}
              >
                {team1ShortName || team1Name}
              </span>
              {team1Won && (
                <Trophy className="h-3 w-3 text-primary mt-1" />
              )}
            </div>

            {/* Score */}
            <div className="flex flex-col items-center px-4">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "text-4xl score-display",
                    team1Won && "text-primary winner-glow",
                    isDraw && "text-muted-foreground"
                  )}
                >
                  {team1Score}
                </span>
                <div className="vs-badge text-muted-foreground text-sm">
                  VS
                </div>
                <span
                  className={cn(
                    "text-4xl score-display",
                    team2Won && "text-primary winner-glow",
                    isDraw && "text-muted-foreground"
                  )}
                >
                  {team2Score}
                </span>
              </div>

              {/* Match modifiers */}
              {(extraTime || penalties) && (
                <div className="flex gap-1 mt-2">
                  {extraTime && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                      AET
                    </Badge>
                  )}
                  {penalties && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-accent/20 text-accent">
                      PEN
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Team 2 */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className={cn(
                "team-logo-md flex items-center justify-center transition-transform",
                team2Won && "scale-110"
              )}>
                {team2Logo ? (
                  <TeamLogo
                    src={team2Logo}
                    alt={team2Name}
                    className="w-full h-full object-contain"
                    fallbackClassName="w-full h-full text-sm font-bold text-gray-800"
                  />
                ) : (
                  <span className="text-sm font-bold text-gray-800">
                    {team2ShortName || team2Name.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium truncate max-w-full text-center",
                  team2Won && "text-primary font-semibold"
                )}
              >
                {team2ShortName || team2Name}
              </span>
              {team2Won && (
                <Trophy className="h-3 w-3 text-primary mt-1" />
              )}
            </div>
          </div>
        </div>

        {/* Footer with date and comment indicator */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-t border-border/30">
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
      </div>
    )
  }
)
MatchCard.displayName = "MatchCard"

export { MatchCard }
