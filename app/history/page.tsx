"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { History, Filter, Calendar, Trophy } from "lucide-react"
import { teams } from "@/lib/teams"

interface Match {
  id: number
  date: string
  player1Id: number
  player2Id: number
  player1Score: number
  player2Score: number
  player1TeamId: number
  player2TeamId: number
  extraTime: boolean
  penalties: boolean
}

interface Player {
  id: number
  name: string
  avatar: string
}

export default function HistoryPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [filterPlayer, setFilterPlayer] = useState<string>("all")
  const [filterTeam, setFilterTeam] = useState<string>("all")
  const [filterResult, setFilterResult] = useState<string>("all")

  useEffect(() => {
    async function fetchData() {
      try {
        const [matchesRes, statsRes] = await Promise.all([
          fetch("/api/matches"),
          fetch("/api/stats"),
        ])
        const matchesData = await matchesRes.json()
        const statsData = await statsRes.json()

        setMatches(matchesData.matches || [])
        setPlayers([
          statsData.headToHead?.player1,
          statsData.headToHead?.player2,
        ].filter(Boolean))
      } catch (err) {
        console.error("Failed to fetch data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getTeamById = (id: number) => {
    return teams.find((t) => t.id === id)
  }

  const getPlayerById = (id: number) => {
    return players.find((p) => p.id === id)
  }

  // Filter matches
  const filteredMatches = matches.filter((match) => {
    // Player filter
    if (filterPlayer !== "all") {
      const playerId = parseInt(filterPlayer)
      if (match.player1Id !== playerId && match.player2Id !== playerId) {
        return false
      }
    }

    // Team filter
    if (filterTeam !== "all") {
      const teamId = parseInt(filterTeam)
      if (match.player1TeamId !== teamId && match.player2TeamId !== teamId) {
        return false
      }
    }

    // Result filter (based on filterPlayer)
    if (filterResult !== "all" && filterPlayer !== "all") {
      const playerId = parseInt(filterPlayer)
      const isPlayer1 = match.player1Id === playerId
      const playerScore = isPlayer1 ? match.player1Score : match.player2Score
      const opponentScore = isPlayer1 ? match.player2Score : match.player1Score

      if (filterResult === "win" && playerScore <= opponentScore) return false
      if (filterResult === "loss" && playerScore >= opponentScore) return false
      if (filterResult === "draw" && playerScore !== opponentScore) return false
    }

    return true
  })

  // Get unique teams used in matches
  const usedTeamIds = new Set<number>()
  matches.forEach((match) => {
    usedTeamIds.add(match.player1TeamId)
    usedTeamIds.add(match.player2TeamId)
  })
  const usedTeams = teams.filter((t) => usedTeamIds.has(t.id))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const clearFilters = () => {
    setFilterPlayer("all")
    setFilterTeam("all")
    setFilterResult("all")
  }

  const hasActiveFilters =
    filterPlayer !== "all" || filterTeam !== "all" || filterResult !== "all"

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-16 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <History className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Match History</h1>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Clear all
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Player
              </label>
              <Select value={filterPlayer} onValueChange={setFilterPlayer}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All players" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All players</SelectItem>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.id.toString()}>
                      <div className="flex items-center gap-2">
                        <img
                          src={player.avatar}
                          alt={player.name}
                          className="w-4 h-4 rounded-full"
                        />
                        {player.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Team
              </label>
              <Select value={filterTeam} onValueChange={setFilterTeam}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All teams</SelectItem>
                  {usedTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      <div className="flex items-center gap-2">
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-4 h-4 rounded"
                        />
                        {team.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Result
              </label>
              <Select
                value={filterResult}
                onValueChange={setFilterResult}
                disabled={filterPlayer === "all"}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All results" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All results</SelectItem>
                  <SelectItem value="win">Wins</SelectItem>
                  <SelectItem value="loss">Losses</SelectItem>
                  <SelectItem value="draw">Draws</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          {filteredMatches.length} match{filteredMatches.length !== 1 ? "es" : ""}{" "}
          found
        </span>
      </div>

      {/* Match List */}
      {filteredMatches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">No matches found</h2>
            <p className="text-muted-foreground text-sm">
              {matches.length === 0
                ? "No matches have been played yet."
                : "Try adjusting your filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredMatches.map((match) => {
            const team1 = getTeamById(match.player1TeamId)
            const team2 = getTeamById(match.player2TeamId)
            const player1 = getPlayerById(match.player1Id)
            const player2 = getPlayerById(match.player2Id)
            const player1Won = match.player1Score > match.player2Score
            const player2Won = match.player2Score > match.player1Score

            return (
              <Link key={match.id} href={`/match/${match.id}`}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(match.date)}
                      </div>
                      <div className="flex gap-1">
                        {match.extraTime && (
                          <Badge variant="secondary" className="text-[10px]">
                            AET
                          </Badge>
                        )}
                        {match.penalties && (
                          <Badge variant="secondary" className="text-[10px]">
                            PEN
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <img
                          src={team1?.logo}
                          alt={team1?.name}
                          className="w-8 h-8 rounded"
                        />
                        <div className="min-w-0">
                          <div
                            className={`text-sm font-medium truncate ${
                              player1Won ? "text-primary" : ""
                            }`}
                          >
                            {team1?.name}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <img
                              src={player1?.avatar}
                              alt={player1?.name}
                              className="w-3 h-3 rounded-full"
                            />
                            {player1?.name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-4">
                        <span
                          className={`text-xl font-bold ${
                            player1Won ? "text-primary" : ""
                          }`}
                        >
                          {match.player1Score}
                        </span>
                        <span className="text-muted-foreground">-</span>
                        <span
                          className={`text-xl font-bold ${
                            player2Won ? "text-primary" : ""
                          }`}
                        >
                          {match.player2Score}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <div className="min-w-0 text-right">
                          <div
                            className={`text-sm font-medium truncate ${
                              player2Won ? "text-primary" : ""
                            }`}
                          >
                            {team2?.name}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                            {player2?.name}
                            <img
                              src={player2?.avatar}
                              alt={player2?.name}
                              className="w-3 h-3 rounded-full"
                            />
                          </div>
                        </div>
                        <img
                          src={team2?.logo}
                          alt={team2?.name}
                          className="w-8 h-8 rounded"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
