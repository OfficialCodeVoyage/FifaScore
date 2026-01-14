import Link from "next/link"
import { PlusCircle, Flame, TrendingUp, Trophy, Swords } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { readDatabase, initializeDatabase } from "@/lib/db"
import { getTeamById } from "@/lib/teams"
import { Database } from "@/lib/data"

function calculateStats(matches: Database['matches'], players: Database['players']) {
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
        player: lastWinner === 1 ? player1?.name || "" : player2?.name || "",
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

export default async function DashboardPage() {
  await initializeDatabase()
  const db = await readDatabase()
  const stats = calculateStats(db.matches, db.players)
  const recentMatches = [...db.matches]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen fifa-gradient">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-primary">FIFA</span>
              <span className="text-foreground">Score</span>
            </h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
              <Swords className="h-4 w-4" />
              Head-to-Head Rivalry Tracker
            </p>
          </div>
          <Link href="/match/new">
            <Button size="lg" className="gap-2 fifa-gradient-green text-primary-foreground shadow-lg hover:shadow-xl transition-all">
              <PlusCircle className="h-5 w-5" />
              Add Match
            </Button>
          </Link>
        </div>

        {/* Head to Head Card */}
        <div className="fifa-card mb-6 overflow-hidden">
          <div className="fifa-gradient-pitch pitch-pattern">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-lg flex items-center justify-center gap-2 text-white text-overlay-dark">
                <Trophy className="h-5 w-5 text-amber-400" />
                Head to Head
                <Trophy className="h-5 w-5 text-amber-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center justify-between">
                {/* Player 1 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="relative">
                    <img
                      src={stats.player1?.avatar}
                      alt={stats.player1?.name}
                      className="w-20 h-20 rounded-full border-4 border-white/20 shadow-lg"
                    />
                    {stats.player1?.wins > stats.player2?.wins && (
                      <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1">
                        <Trophy className="h-4 w-4 text-amber-900" />
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-lg mt-3 text-white text-overlay-dark">{stats.player1?.name}</span>
                  <span className="text-5xl font-bold text-primary mt-2 score-display">
                    {stats.player1?.wins}
                  </span>
                  <span className="text-sm text-white/70 text-overlay-dark">Wins</span>
                </div>

                {/* VS / Draws */}
                <div className="flex flex-col items-center px-4">
                  <div className="vs-badge">
                    <span className="text-white/80">VS</span>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-2xl font-bold text-amber-400 text-overlay-dark">{stats.draws}</span>
                    <p className="text-xs text-white/70 text-overlay-dark">Draws</p>
                  </div>
                </div>

                {/* Player 2 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="relative">
                    <img
                      src={stats.player2?.avatar}
                      alt={stats.player2?.name}
                      className="w-20 h-20 rounded-full border-4 border-white/20 shadow-lg"
                    />
                    {stats.player2?.wins > stats.player1?.wins && (
                      <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1">
                        <Trophy className="h-4 w-4 text-amber-900" />
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-lg mt-3 text-white text-overlay-dark">{stats.player2?.name}</span>
                  <span className="text-5xl font-bold text-primary mt-2 score-display">
                    {stats.player2?.wins}
                  </span>
                  <span className="text-sm text-white/70 text-overlay-dark">Wins</span>
                </div>
              </div>

              {/* Total matches */}
              <div className="text-center mt-6 pt-4 border-t border-white/10">
                <span className="text-white/60 text-sm text-overlay-dark">
                  {stats.totalMatches} matches played
                </span>
              </div>
            </CardContent>
          </div>
        </div>

        {/* Current Streak */}
        {stats.currentStreak.count > 0 && (
          <div className="fifa-card mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600/90 to-red-600/90">
              <CardContent className="py-4">
                <div className="flex items-center justify-center gap-3">
                  <Flame className="h-8 w-8 text-amber-300 streak-fire" />
                  <div className="text-center">
                    <p className="font-bold text-white text-lg">
                      {stats.currentStreak.player} is on fire!
                    </p>
                    <p className="text-sm text-white/80">
                      {stats.currentStreak.count} win streak
                    </p>
                  </div>
                  <Flame className="h-8 w-8 text-amber-300 streak-fire" />
                </div>
              </CardContent>
            </div>
          </div>
        )}

        {/* Recent Matches */}
        <div className="fifa-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Matches</CardTitle>
              <Link href="/history">
                <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentMatches.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">No matches yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add your first match to start tracking!
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
                      <div className="relative flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-transparent hover:border-primary/20">
                        {/* Team 1 color accent */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                          style={{ backgroundColor: player1Team?.primaryColor || '#666' }}
                        />

                        <div className="flex items-center gap-3 flex-1">
                          <div className="team-logo-sm flex items-center justify-center">
                            <img
                              src={player1Team?.logo}
                              alt={player1Team?.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              player1Won ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {player1Team?.shortName || player1Team?.name}
                          </span>
                          {player1Won && (
                            <Trophy className="h-3 w-3 text-primary" />
                          )}
                        </div>

                        <div className="flex items-center gap-3 px-4">
                          <span
                            className={`text-xl font-bold tabular-nums ${
                              player1Won ? "text-primary" : ""
                            }`}
                          >
                            {match.player1Score}
                          </span>
                          <span className="text-muted-foreground text-sm">-</span>
                          <span
                            className={`text-xl font-bold tabular-nums ${
                              player2Won ? "text-primary" : ""
                            }`}
                          >
                            {match.player2Score}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 flex-1 justify-end">
                          {player2Won && (
                            <Trophy className="h-3 w-3 text-primary" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              player2Won ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {player2Team?.shortName || player2Team?.name}
                          </span>
                          <div className="team-logo-sm flex items-center justify-center">
                            <img
                              src={player2Team?.logo}
                              alt={player2Team?.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>

                        {/* Team 2 color accent */}
                        <div
                          className="absolute right-0 top-0 bottom-0 w-1 rounded-r-xl"
                          style={{ backgroundColor: player2Team?.primaryColor || '#666' }}
                        />
                      </div>
                      {(match.extraTime || match.penalties) && (
                        <div className="flex justify-center gap-2 mt-1">
                          {match.extraTime && (
                            <Badge variant="secondary" className="text-xs">
                              AET
                            </Badge>
                          )}
                          {match.penalties && (
                            <Badge variant="secondary" className="text-xs bg-accent/20 text-accent">
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
        </div>
      </div>
    </div>
  )
}
