import Link from "next/link"
import { PlusCircle, Flame, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { readDatabase } from "@/lib/db"
import { getTeamById } from "@/lib/teams"

function calculateStats(matches: any[], players: any[]) {
  const player1 = players.find((p) => p.id === 1)
  const player2 = players.find((p) => p.id === 2)

  let player1Wins = 0
  let player2Wins = 0
  let draws = 0

  matches.forEach((match) => {
    if (match.player1Score > match.player2Score) {
      player1Wins++
    } else if (match.player2Score > match.player1Score) {
      player2Wins++
    } else {
      draws++
    }
  })

  // Calculate current streak
  let currentStreak = { player: "", count: 0 }
  const sortedMatches = [...matches].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  if (sortedMatches.length > 0) {
    const lastMatch = sortedMatches[0]
    let lastWinner =
      lastMatch.player1Score > lastMatch.player2Score
        ? 1
        : lastMatch.player2Score > lastMatch.player1Score
        ? 2
        : 0

    if (lastWinner !== 0) {
      let streakCount = 0
      for (const match of sortedMatches) {
        const winner =
          match.player1Score > match.player2Score
            ? 1
            : match.player2Score > match.player1Score
            ? 2
            : 0
        if (winner === lastWinner) {
          streakCount++
        } else {
          break
        }
      }
      currentStreak = {
        player: lastWinner === 1 ? player1?.name : player2?.name,
        count: streakCount,
      }
    }
  }

  return {
    player1: { ...player1, wins: player1Wins },
    player2: { ...player2, wins: player2Wins },
    draws,
    totalMatches: matches.length,
    currentStreak,
  }
}

export default function DashboardPage() {
  const db = readDatabase()
  const stats = calculateStats(db.matches, db.players)
  const recentMatches = [...db.matches]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">FifaScore</h1>
          <p className="text-muted-foreground text-sm">Head-to-Head Tracker</p>
        </div>
        <Link href="/match/new">
          <Button size="lg" className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Add Match
          </Button>
        </Link>
      </div>

      {/* Head to Head Card */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-lg">Head to Head</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {/* Player 1 */}
            <div className="flex flex-col items-center flex-1">
              <img
                src={stats.player1?.avatar}
                alt={stats.player1?.name}
                className="w-16 h-16 rounded-full mb-2"
              />
              <span className="font-semibold text-lg">{stats.player1?.name}</span>
              <span className="text-4xl font-bold text-primary mt-2">
                {stats.player1?.wins}
              </span>
              <span className="text-sm text-muted-foreground">Wins</span>
            </div>

            {/* VS / Draws */}
            <div className="flex flex-col items-center px-4">
              <span className="text-2xl font-bold text-muted-foreground">VS</span>
              <div className="mt-2 text-center">
                <span className="text-lg font-semibold">{stats.draws}</span>
                <p className="text-xs text-muted-foreground">Draws</p>
              </div>
            </div>

            {/* Player 2 */}
            <div className="flex flex-col items-center flex-1">
              <img
                src={stats.player2?.avatar}
                alt={stats.player2?.name}
                className="w-16 h-16 rounded-full mb-2"
              />
              <span className="font-semibold text-lg">{stats.player2?.name}</span>
              <span className="text-4xl font-bold text-primary mt-2">
                {stats.player2?.wins}
              </span>
              <span className="text-sm text-muted-foreground">Wins</span>
            </div>
          </div>

          {/* Total matches */}
          <div className="text-center mt-4 pt-4 border-t">
            <span className="text-muted-foreground text-sm">
              {stats.totalMatches} matches played
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Current Streak */}
      {stats.currentStreak.count > 0 && (
        <Card className="mb-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-3">
              <Flame className="h-6 w-6 text-orange-500" />
              <div className="text-center">
                <p className="font-semibold">
                  {stats.currentStreak.player} is on fire!
                </p>
                <p className="text-sm text-muted-foreground">
                  {stats.currentStreak.count} win streak
                </p>
              </div>
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Matches */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Matches</CardTitle>
            <Link href="/history">
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentMatches.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No matches yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first match to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMatches.map((match) => {
                const player1Team = getTeamById(match.player1TeamId)
                const player2Team = getTeamById(match.player2TeamId)
                const player1Won = match.player1Score > match.player2Score
                const player2Won = match.player2Score > match.player1Score

                return (
                  <Link key={match.id} href={`/match/${match.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-2 flex-1">
                        <img
                          src={player1Team?.logo}
                          alt={player1Team?.name}
                          className="w-8 h-8 rounded"
                        />
                        <span
                          className={`text-sm font-medium ${
                            player1Won ? "text-primary" : ""
                          }`}
                        >
                          {player1Team?.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 px-4">
                        <span
                          className={`text-lg font-bold ${
                            player1Won ? "text-primary" : ""
                          }`}
                        >
                          {match.player1Score}
                        </span>
                        <span className="text-muted-foreground">-</span>
                        <span
                          className={`text-lg font-bold ${
                            player2Won ? "text-primary" : ""
                          }`}
                        >
                          {match.player2Score}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span
                          className={`text-sm font-medium ${
                            player2Won ? "text-primary" : ""
                          }`}
                        >
                          {player2Team?.name}
                        </span>
                        <img
                          src={player2Team?.logo}
                          alt={player2Team?.name}
                          className="w-8 h-8 rounded"
                        />
                      </div>
                    </div>
                    {(match.extraTime || match.penalties) && (
                      <div className="flex justify-center gap-2 mt-1">
                        {match.extraTime && (
                          <Badge variant="secondary" className="text-xs">
                            AET
                          </Badge>
                        )}
                        {match.penalties && (
                          <Badge variant="secondary" className="text-xs">
                            PEN
                          </Badge>
                        )}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
