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
  BarChart3,
  Star,
} from "lucide-react"
import { Skeleton, SkeletonCard } from "@/components/skeleton"
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
      <div className="min-h-screen fifa-gradient">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-8 w-32" />
          </div>

          {/* Overall Record Skeleton */}
          <div className="fifa-card mb-6 overflow-hidden">
            <div className="p-6 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center flex-1">
                  <Skeleton className="w-16 h-16 rounded-full mb-2" />
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-10 w-10 mt-1" />
                </div>
                <div className="flex flex-col items-center">
                  <Skeleton className="h-10 w-14 rounded-full" />
                  <Skeleton className="h-8 w-8 mt-3" />
                  <Skeleton className="h-3 w-12 mt-1" />
                </div>
                <div className="flex flex-col items-center flex-1">
                  <Skeleton className="w-16 h-16 rounded-full mb-2" />
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-10 w-10 mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Chart Skeleton */}
          <SkeletonCard className="mb-6" />
          <SkeletonCard className="mb-6" />

          {/* Stats Cards Skeleton */}
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    )
  }

  if (!stats || stats.totalMatches === 0) {
    return (
      <div className="min-h-screen fifa-gradient">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Statistics
          </h1>
          <div className="fifa-card">
            <CardContent className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                <Trophy className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold mb-2">No stats yet</h2>
              <p className="text-muted-foreground">
                Play some matches to see your stats!
              </p>
            </CardContent>
          </div>
        </div>
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
    <div className="fifa-card overflow-hidden">
      <CardHeader className="pb-2 bg-muted/30">
        <CardTitle className="text-lg flex items-center gap-3">
          <img
            src={player.avatar}
            alt={player.name}
            className="w-10 h-10 rounded-full border-2 border-primary/30"
          />
          <div>
            <span className="font-bold">{player.name}</span>
            <p className="text-xs text-muted-foreground font-normal">Career Stats</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-primary/10">
            <div className="text-2xl font-bold text-primary">{stats.wins}</div>
            <div className="text-xs text-muted-foreground">Wins</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-destructive/10">
            <div className="text-2xl font-bold text-destructive">{stats.losses}</div>
            <div className="text-xs text-muted-foreground">Losses</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-accent/10">
            <div className="text-2xl font-bold text-amber-400">{stats.draws}</div>
            <div className="text-xs text-muted-foreground">Draws</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-primary" />
              <span>Goals Scored</span>
            </div>
            <div className="font-bold">{stats.goalsScored}</div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Goals Conceded</span>
            </div>
            <div className="font-bold">{stats.goalsConceded}</div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span>Avg Goals/Match</span>
            </div>
            <div className="font-bold">{stats.avgGoalsScored}</div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Clean Sheets</span>
            </div>
            <div className="font-bold">{stats.cleanSheets}</div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span>Win Rate</span>
            </div>
            <Badge
              className={`font-bold ${stats.winRate >= 50 ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}
            >
              {stats.winRate}%
            </Badge>
          </div>
        </div>

        {/* Streaks */}
        <div className="mt-4 pt-4 border-t border-border/30 space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>Current Streak</span>
            </div>
            <Badge
              className={`font-bold ${
                stats.currentStreak.type === "win"
                  ? "bg-primary/20 text-primary"
                  : stats.currentStreak.type === "loss"
                  ? "bg-destructive/20 text-destructive"
                  : "bg-accent/20 text-amber-400"
              }`}
            >
              {stats.currentStreak.count}{" "}
              {stats.currentStreak.type === "win"
                ? "W"
                : stats.currentStreak.type === "loss"
                ? "L"
                : "D"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Best Win Streak</span>
            </div>
            <span className="font-bold">{stats.bestStreak}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span>Worst Loss Streak</span>
            </div>
            <span className="font-bold">{stats.worstStreak}</span>
          </div>
        </div>

        {/* Favorite Team */}
        {stats.favoriteTeam && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              Favorite Team
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
              <span className="font-bold">{stats.favoriteTeam.teamName}</span>
              <span className="text-xs text-muted-foreground">
                ({stats.favoriteTeam.timesUsed} matches)
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  )

  return (
    <div className="min-h-screen fifa-gradient">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Statistics
        </h1>

        {/* Overall Record */}
        <div className="fifa-card mb-6 overflow-hidden">
          <div className="fifa-gradient-pitch pitch-pattern">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-center flex items-center justify-center gap-2 text-white text-overlay-dark">
                <Trophy className="h-5 w-5 text-amber-400" />
                Overall Record
                <Trophy className="h-5 w-5 text-amber-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center flex-1">
                  <img
                    src={headToHead?.player1.avatar}
                    alt={headToHead?.player1.name}
                    className="w-16 h-16 rounded-full border-4 border-white/20 shadow-lg mb-2"
                  />
                  <span className="text-sm font-medium text-white text-overlay-dark">
                    {headToHead?.player1.name}
                  </span>
                  <span className="text-4xl font-bold text-primary mt-1 score-display">
                    {headToHead?.player1Wins}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="vs-badge">
                    <span className="text-white/80 text-sm">VS</span>
                  </div>
                  <span className="text-2xl font-bold text-amber-400 mt-3 text-overlay-dark">
                    {headToHead?.draws}
                  </span>
                  <span className="text-xs text-white/70 text-overlay-dark">Draws</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <img
                    src={headToHead?.player2.avatar}
                    alt={headToHead?.player2.name}
                    className="w-16 h-16 rounded-full border-4 border-white/20 shadow-lg mb-2"
                  />
                  <span className="text-sm font-medium text-white text-overlay-dark">
                    {headToHead?.player2.name}
                  </span>
                  <span className="text-4xl font-bold text-primary mt-1 score-display">
                    {headToHead?.player2Wins}
                  </span>
                </div>
              </div>
              <div className="text-center mt-4 pt-4 border-t border-white/10">
                <span className="text-sm text-white/60 text-overlay-dark">
                  {stats.totalMatches} total matches played
                </span>
              </div>
            </CardContent>
          </div>
        </div>

        {/* Wins Chart */}
        <div className="fifa-card mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Match Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={winsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Wins" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Losses" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Draws" fill="hsl(45, 93%, 47%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </div>

        {/* Goals Chart */}
        <div className="fifa-card mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Goals Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goalsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Scored" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Conceded" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </div>

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
    </div>
  )
}
