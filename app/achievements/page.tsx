"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Lock } from "lucide-react"
import { achievementTypes, AchievementType } from "@/lib/achievements"

interface Achievement {
  id: number
  playerId: number
  type: string
  unlockedAt: string
  matchId: number
}

interface Player {
  id: number
  name: string
  avatar: string
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/achievements")
        const data = await response.json()
        setAchievements(data.achievements || [])
        setPlayers(data.players || [])
      } catch (err) {
        console.error("Failed to fetch achievements:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getPlayerAchievements = (playerId: number) => {
    return achievements.filter((a) => a.playerId === playerId)
  }

  const hasAchievement = (playerId: number, type: string) => {
    return achievements.some((a) => a.playerId === playerId && a.type === type)
  }

  const getAchievementDate = (playerId: number, type: string) => {
    const achievement = achievements.find(
      (a) => a.playerId === playerId && a.type === type
    )
    if (!achievement) return null
    return new Date(achievement.unlockedAt).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-48 bg-muted rounded" />
          <div className="h-48 bg-muted rounded" />
        </div>
      </div>
    )
  }

  const AchievementCard = ({
    achievement,
    isUnlocked,
    unlockedDate,
  }: {
    achievement: AchievementType
    isUnlocked: boolean
    unlockedDate: string | null
  }) => (
    <div
      className={`p-4 rounded-lg border transition-all ${
        isUnlocked
          ? "bg-primary/5 border-primary/20"
          : "bg-muted/30 border-muted opacity-60"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`text-3xl ${
            isUnlocked ? "" : "grayscale opacity-50"
          }`}
        >
          {achievement.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{achievement.name}</span>
            {isUnlocked ? (
              <Badge variant="success" className="text-xs">
                Unlocked
              </Badge>
            ) : (
              <Lock className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {achievement.description}
          </p>
          {unlockedDate && (
            <p className="text-xs text-muted-foreground mt-1">
              Unlocked on {unlockedDate}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Achievements</h1>
      </div>

      {/* Summary */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-around">
            {players.map((player) => {
              const playerAchievements = getPlayerAchievements(player.id)
              return (
                <div key={player.id} className="flex flex-col items-center">
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-12 h-12 rounded-full mb-2"
                  />
                  <span className="font-semibold">{player.name}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-lg font-bold">
                      {playerAchievements.length}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / {achievementTypes.length}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* All Achievements */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">All Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {achievementTypes.map((achievement) => {
              const player1Has = hasAchievement(1, achievement.type)
              const player2Has = hasAchievement(2, achievement.type)

              return (
                <div
                  key={achievement.type}
                  className={`p-4 rounded-lg border ${
                    player1Has || player2Has
                      ? "bg-primary/5 border-primary/20"
                      : "bg-muted/30 border-muted"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`text-3xl ${
                        player1Has || player2Has ? "" : "grayscale opacity-50"
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{achievement.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex gap-2">
                        {players.map((player) => {
                          const hasIt = hasAchievement(player.id, achievement.type)
                          return (
                            <div
                              key={player.id}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                hasIt
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <img
                                src={player.avatar}
                                alt={player.name}
                                className={`w-4 h-4 rounded-full ${
                                  hasIt ? "" : "grayscale opacity-50"
                                }`}
                              />
                              <span>{player.name}</span>
                              {hasIt ? (
                                <Badge variant="success" className="text-[10px] px-1 py-0">
                                  Yes
                                </Badge>
                              ) : (
                                <Lock className="h-3 w-3" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Per-Player Achievements */}
      {players.map((player) => {
        const playerAchievements = getPlayerAchievements(player.id)
        return (
          <Card key={player.id} className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-6 h-6 rounded-full"
                />
                {player.name}&apos;s Achievements
                <Badge variant="outline" className="ml-auto">
                  {playerAchievements.length} / {achievementTypes.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {achievementTypes.map((achievement) => (
                  <AchievementCard
                    key={achievement.type}
                    achievement={achievement}
                    isUnlocked={hasAchievement(player.id, achievement.type)}
                    unlockedDate={getAchievementDate(player.id, achievement.type)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
