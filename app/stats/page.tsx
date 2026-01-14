"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Shield,
  TrendingUp,
  TrendingDown,
  Trophy,
  Flame,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface PlayerStats {
  playerId: number
  playerName: string
  wins: number
  losses: number
  draws: number
  goalsScored: number
  goalsConceded: number
  cleanSheets: number
  matchesPlayed: number
  winRate: number
  avgGoalsScored: number
  avgGoalsConceded: number
  currentStreak: { type: "win" | "loss" | "draw"; count: number }
  bestStreak: number
  worstStreak: number
  favoriteTeam: { teamId: number; teamName: string; timesUsed: number } | null
  mostUsedTeams: { teamId: number; teamName: string; timesUsed: number }[]
}

interface HeadToHead {
  player1: { id: number; name: string; avatar: string }
  player2: { id: number; name: string; avatar: string }
  player1Wins: number
  player2Wins: number
  draws: number
  totalMatches: number
  player1Goals: number
  player2Goals: number
}

interface StatsData {
  headToHead: HeadToHead | null
  player1Stats: PlayerStats | null
  player2Stats: PlayerStats | null
  totalMatches: number
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats")
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error("Failed to fetch stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

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

  if (!stats || stats.totalMatches === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Stats</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">No stats yet</h2>
            <p className="text-muted-foreground">
              Play some matches to see your stats!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { headToHead, player1Stats, player2Stats } = stats

  // Prepare chart data
  const winsChartData = [
    {
      name: player1Stats?.playerName || "Player 1",
      Wins: player1Stats?.wins || 0,
      Losses: player1Stats?.losses || 0,
      Draws: player1Stats?.draws || 0,
    },
    {
      name: player2Stats?.playerName || "Player 2",
      Wins: player2Stats?.wins || 0,
      Losses: player2Stats?.losses || 0,
      Draws: player2Stats?.draws || 0,
    },
  ]

  const goalsChartData = [
    {
      name: player1Stats?.playerName || "Player 1",
      Scored: player1Stats?.goalsScored || 0,
      Conceded: player1Stats?.goalsConceded || 0,
    },
    {
      name: player2Stats?.playerName || "Player 2",
      Scored: player2Stats?.goalsScored || 0,
      Conceded: player2Stats?.goalsConceded || 0,
    },
  ]

  const StatCard = ({
    player,
    stats,
  }: {
    player: { name: string; avatar: string }
    stats: PlayerStats
  }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <img
            src={player.avatar}
            alt={player.name}
            className="w-8 h-8 rounded-full"
          />
          {player.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{stats.wins}</div>
            <div className="text-xs text-muted-foreground">Wins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{stats.losses}</div>
            <div className="text-xs text-muted-foreground">Losses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.draws}</div>
            <div className="text-xs text-muted-foreground">Draws</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>Goals Scored</span>
            </div>
            <div className="font-semibold">{stats.goalsScored}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Goals Conceded</span>
            </div>
            <div className="font-semibold">{stats.goalsConceded}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span>Avg Goals/Match</span>
            </div>
            <div className="font-semibold">{stats.avgGoalsScored}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Clean Sheets</span>
            </div>
            <div className="font-semibold">{stats.cleanSheets}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span>Win Rate</span>
            </div>
            <Badge
              variant={stats.winRate >= 50 ? "success" : "secondary"}
              className="font-semibold"
            >
              {stats.winRate}%
            </Badge>
          </div>
        </div>

        {/* Streaks */}
        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>Current Streak</span>
            </div>
            <Badge
              variant={
                stats.currentStreak.type === "win"
                  ? "success"
                  : stats.currentStreak.type === "loss"
                  ? "destructive"
                  : "secondary"
              }
            >
              {stats.currentStreak.count}{" "}
              {stats.currentStreak.type === "win"
                ? "W"
                : stats.currentStreak.type === "loss"
                ? "L"
                : "D"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Best Win Streak</span>
            </div>
            <span className="font-semibold">{stats.bestStreak}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span>Worst Loss Streak</span>
            </div>
            <span className="font-semibold">{stats.worstStreak}</span>
          </div>
        </div>

        {/* Favorite Team */}
        {stats.favoriteTeam && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-2">Favorite Team</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{stats.favoriteTeam.teamName}</span>
              <span className="text-xs text-muted-foreground">
                ({stats.favoriteTeam.timesUsed} times)
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Stats</h1>

      {/* Overall Record */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Overall Record</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center flex-1">
              <img
                src={headToHead?.player1.avatar}
                alt={headToHead?.player1.name}
                className="w-12 h-12 rounded-full mb-1"
              />
              <span className="text-sm font-medium">
                {headToHead?.player1.name}
              </span>
              <span className="text-3xl font-bold text-primary mt-1">
                {headToHead?.player1Wins}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg text-muted-foreground">VS</span>
              <span className="text-xl font-semibold mt-1">
                {headToHead?.draws}
              </span>
              <span className="text-xs text-muted-foreground">Draws</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <img
                src={headToHead?.player2.avatar}
                alt={headToHead?.player2.name}
                className="w-12 h-12 rounded-full mb-1"
              />
              <span className="text-sm font-medium">
                {headToHead?.player2.name}
              </span>
              <span className="text-3xl font-bold text-primary mt-1">
                {headToHead?.player2Wins}
              </span>
            </div>
          </div>
          <div className="text-center mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">
              {stats.totalMatches} total matches played
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Wins Chart */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Match Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={winsChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="Wins" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Losses" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="Draws"
                  fill="hsl(48, 96%, 53%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Goals Chart */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Goals Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goalsChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="Scored"
                  fill="hsl(142, 76%, 36%)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Conceded"
                  fill="hsl(0, 84%, 60%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Individual Stats */}
      <div className="space-y-4">
        {player1Stats && headToHead?.player1 && (
          <StatCard player={headToHead.player1} stats={player1Stats} />
        )}
        {player2Stats && headToHead?.player2 && (
          <StatCard player={headToHead.player2} stats={player2Stats} />
        )}
      </div>
    </div>
  )
}
