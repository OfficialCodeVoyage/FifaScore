"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shuffle, Swords, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TeamLogo } from "@/components/team-logo"
import { Team } from "@/lib/data"
import { getRandomBalancedTeams } from "@/lib/teams"

export default function RandomPage() {
  const router = useRouter()
  const [team1, setTeam1] = useState<Team | null>(null)
  const [team2, setTeam2] = useState<Team | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  const handleRandomize = () => {
    setIsSpinning(true)

    // Quick shuffle animation
    let count = 0
    const interval = setInterval(() => {
      const [t1, t2] = getRandomBalancedTeams(3)
      setTeam1(t1)
      setTeam2(t2)
      count++
      if (count >= 10) {
        clearInterval(interval)
        setIsSpinning(false)
      }
    }, 100)
  }

  const handleStartMatch = () => {
    if (team1 && team2) {
      router.push(`/match/new?p1Team=${team1.id}&p2Team=${team2.id}`)
    }
  }

  return (
    <div className="min-h-screen fifa-gradient">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Shuffle className="h-6 w-6 text-primary" />
            Random Teams
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Get balanced random matchups
          </p>
        </div>

        {/* Teams Display */}
        <div className="flex items-center justify-between gap-4 mb-8">
          {/* Player 1 Team */}
          <div className="flex-1">
            <p className="text-xs text-muted-foreground text-center mb-2">Pavlo</p>
            <div
              className={`fifa-card p-4 flex flex-col items-center transition-all ${isSpinning ? 'animate-pulse' : ''}`}
              style={{
                borderTop: team1 ? `3px solid ${team1.primaryColor}` : undefined
              }}
            >
              {team1 ? (
                <>
                  <div className="w-16 h-16 rounded-lg bg-white p-2 shadow-md mb-3">
                    <TeamLogo
                      src={team1.logo}
                      alt={team1.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="font-semibold text-sm text-center line-clamp-2 min-h-[2.5rem]">
                    {team1.name}
                  </span>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-amber-400">{team1.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{team1.league}</span>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 rounded-lg bg-muted/30 mb-3 mx-auto flex items-center justify-center">
                    <Shuffle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">Press Randomize</span>
                </div>
              )}
            </div>
          </div>

          {/* VS Badge */}
          <div className="flex-shrink-0">
            <div className="vs-badge">
              <Swords className="h-5 w-5" />
            </div>
          </div>

          {/* Player 2 Team */}
          <div className="flex-1">
            <p className="text-xs text-muted-foreground text-center mb-2">Sumeet</p>
            <div
              className={`fifa-card p-4 flex flex-col items-center transition-all ${isSpinning ? 'animate-pulse' : ''}`}
              style={{
                borderTop: team2 ? `3px solid ${team2.primaryColor}` : undefined
              }}
            >
              {team2 ? (
                <>
                  <div className="w-16 h-16 rounded-lg bg-white p-2 shadow-md mb-3">
                    <TeamLogo
                      src={team2.logo}
                      alt={team2.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="font-semibold text-sm text-center line-clamp-2 min-h-[2.5rem]">
                    {team2.name}
                  </span>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-amber-400">{team2.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{team2.league}</span>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 rounded-lg bg-muted/30 mb-3 mx-auto flex items-center justify-center">
                    <Shuffle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">Press Randomize</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rating Difference Info */}
        {team1 && team2 && (
          <div className="text-center mb-6">
            <span className="text-xs text-muted-foreground">
              Rating difference: {Math.abs(team1.rating - team2.rating)} pts
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleRandomize}
            disabled={isSpinning}
            size="lg"
            className="w-full gap-2 h-14 fifa-gradient-blue text-white shadow-lg hover:shadow-xl transition-all text-lg font-bold"
          >
            <Shuffle className={`h-6 w-6 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? "Shuffling..." : "Randomize Teams"}
          </Button>

          {team1 && team2 && !isSpinning && (
            <Button
              onClick={handleStartMatch}
              size="lg"
              className="w-full gap-2 h-14 fifa-gradient-green text-primary-foreground shadow-lg hover:shadow-xl transition-all text-lg font-bold"
            >
              Start Match
              <ArrowRight className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
