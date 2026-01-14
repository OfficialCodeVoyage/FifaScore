"use client"

import * as React from "react"
import { Trophy, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface PlayerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  avatar?: string
  wins: number
  losses: number
  onClick?: () => void
}

const PlayerCard = React.forwardRef<HTMLDivElement, PlayerCardProps>(
  ({ className, name, avatar, wins, losses, onClick, ...props }, ref) => {
    const totalGames = wins + losses
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0

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
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <Avatar className="h-14 w-14">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-lg font-medium">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">{name}</h3>
              <div className="flex items-center gap-4 mt-1.5">
                <div className="flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">
                    {wins}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">
                    {losses}
                  </span>
                </div>
              </div>
            </div>

            {/* Win Rate */}
            <div className="text-right">
              <div
                className={cn(
                  "text-2xl font-bold tabular-nums",
                  winRate >= 50 ? "text-green-500" : "text-destructive"
                )}
              >
                {winRate}%
              </div>
              <span className="text-xs text-muted-foreground">Win Rate</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)
PlayerCard.displayName = "PlayerCard"

export { PlayerCard }
