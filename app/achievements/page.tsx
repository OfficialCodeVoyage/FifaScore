"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Lock, Filter } from "lucide-react"
import { achievementTypes, AchievementType, getAchievementsByCategory } from "@/lib/achievements"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

const categoryLabels: Record<AchievementType['category'], string> = {
  wins: 'Wins',
  goals: 'Goals',
  defense: 'Defense',
  streaks: 'Streaks',
  teams: 'Teams',
  milestones: 'Milestones',
  special: 'Special',
  shame: 'Hall of Shame'
}

const categoryIcons: Record<AchievementType['category'], string> = {
  wins: '🏆',
  goals: '⚽',
  defense: '🛡️',
  streaks: '🔥',
  teams: '👕',
  milestones: '🎯',
  special: '✨',
  shame: '😭'
}

const rarityColors: Record<AchievementType['rarity'], string> = {
  common: 'bg-slate-500',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-amber-500'
}

const rarityLabels: Record<AchievementType['rarity'], string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary'
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterRarity, setFilterRarity] = useState<string>("all")

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

  // Filter achievements
  const filteredAchievements = achievementTypes.filter(a => {
    if (filterCategory !== "all" && a.category !== filterCategory) return false
    if (filterRarity !== "all" && a.rarity !== filterRarity) return false
    return true
  })

  // Group by category for display
  const categories = Object.keys(categoryLabels) as AchievementType['category'][]

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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Achievements</h1>
        <Badge variant="outline" className="ml-auto">
          {achievementTypes.length} Total
        </Badge>
      </div>

      {/* Summary */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-around">
            {players.map((player) => {
              const playerAchievements = getPlayerAchievements(player.id)
              const percentage = Math.round((playerAchievements.length / achievementTypes.length) * 100)
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
                  <div className="w-24 h-2 bg-muted rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{percentage}%</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Rarity Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(rarityLabels) as AchievementType['rarity'][]).map(rarity => {
          const count = achievementTypes.filter(a => a.rarity === rarity).length
          return (
            <Badge
              key={rarity}
              variant="outline"
              className="flex items-center gap-1.5"
            >
              <span className={`w-2 h-2 rounded-full ${rarityColors[rarity]}`} />
              {rarityLabels[rarity]} ({count})
            </Badge>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {categoryIcons[cat]} {categoryLabels[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterRarity} onValueChange={setFilterRarity}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Rarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rarities</SelectItem>
            {(Object.keys(rarityLabels) as AchievementType['rarity'][]).map(rarity => (
              <SelectItem key={rarity} value={rarity}>
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${rarityColors[rarity]}`} />
                  {rarityLabels[rarity]}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Achievements by Category */}
      {filterCategory === "all" ? (
        // Show grouped by category
        categories.map(category => {
          const categoryAchievements = filteredAchievements.filter(a => a.category === category)
          if (categoryAchievements.length === 0) return null

          return (
            <Card key={category} className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-xl">{categoryIcons[category]}</span>
                  {categoryLabels[category]}
                  <Badge variant="outline" className="ml-auto">
                    {categoryAchievements.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {categoryAchievements.map((achievement) => {
                    const player1Has = hasAchievement(1, achievement.type)
                    const player2Has = hasAchievement(2, achievement.type)

                    return (
                      <div
                        key={achievement.type}
                        className={`p-3 rounded-lg border transition-all ${
                          player1Has || player2Has
                            ? "bg-primary/5 border-primary/20"
                            : "bg-muted/30 border-muted"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`text-2xl ${
                              player1Has || player2Has ? "" : "grayscale opacity-50"
                            }`}
                          >
                            {achievement.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold text-sm">{achievement.name}</span>
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 flex items-center gap-1"
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${rarityColors[achievement.rarity]}`} />
                                {rarityLabels[achievement.rarity]}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {achievement.description}
                            </p>
                            <div className="flex gap-1">
                              {players.map((player) => {
                                const hasIt = hasAchievement(player.id, achievement.type)
                                return (
                                  <div
                                    key={player.id}
                                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${
                                      hasIt
                                        ? "bg-primary/10 text-primary"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    <img
                                      src={player.avatar}
                                      alt={player.name}
                                      className={`w-3 h-3 rounded-full ${
                                        hasIt ? "" : "grayscale opacity-50"
                                      }`}
                                    />
                                    {hasIt ? "✓" : <Lock className="h-2.5 w-2.5" />}
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
          )
        })
      ) : (
        // Show filtered list
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl">{categoryIcons[filterCategory as AchievementType['category']]}</span>
              {categoryLabels[filterCategory as AchievementType['category']]}
              <Badge variant="outline" className="ml-auto">
                {filteredAchievements.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredAchievements.map((achievement) => {
                const player1Has = hasAchievement(1, achievement.type)
                const player2Has = hasAchievement(2, achievement.type)

                return (
                  <div
                    key={achievement.type}
                    className={`p-3 rounded-lg border transition-all ${
                      player1Has || player2Has
                        ? "bg-primary/5 border-primary/20"
                        : "bg-muted/30 border-muted"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`text-2xl ${
                          player1Has || player2Has ? "" : "grayscale opacity-50"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-sm">{achievement.name}</span>
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 flex items-center gap-1"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${rarityColors[achievement.rarity]}`} />
                            {rarityLabels[achievement.rarity]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex gap-1">
                          {players.map((player) => {
                            const hasIt = hasAchievement(player.id, achievement.type)
                            return (
                              <div
                                key={player.id}
                                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${
                                  hasIt
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                <img
                                  src={player.avatar}
                                  alt={player.name}
                                  className={`w-3 h-3 rounded-full ${
                                    hasIt ? "" : "grayscale opacity-50"
                                  }`}
                                />
                                {hasIt ? "✓" : <Lock className="h-2.5 w-2.5" />}
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
      )}
    </div>
  )
}
