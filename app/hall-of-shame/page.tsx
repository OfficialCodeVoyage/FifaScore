"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skull, Shuffle, MessageSquare, Trophy, Frown } from "lucide-react"
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

interface BiggestLoss {
  match: Match
  loser: Player
  winner: Player
  loserScore: number
  winnerScore: number
  goalDifference: number
  loserTeam: typeof teams[0]
  winnerTeam: typeof teams[0]
}

const excuses = [
  "My controller disconnected!",
  "That was clearly offside!",
  "The ref was bought!",
  "I was trying a new formation...",
  "My cat walked across the keyboard!",
  "I let you win on purpose.",
  "The servers were lagging!",
  "I wasn't even trying.",
  "You got lucky with rebounds!",
  "The scripting was against me!",
  "My player didn't respond to inputs!",
  "I was distracted by my phone.",
  "This controller is broken!",
  "You only won because of pace abuse.",
  "I forgot to change my tactics!",
  "My team chemistry was messed up.",
  "The game is rigged against me!",
  "I was experimenting with new players.",
  "My internet connection dropped!",
  "You only scored tap-ins!",
  "The goalkeeper did nothing!",
  "I was playing with one hand.",
  "That was beginner's luck!",
  "You abused broken mechanics!",
  "I couldn't see the screen properly.",
]

const taunts = [
  "Is that the best you've got? My grandma plays better!",
  "Did you forget how to play or was this intentional?",
  "Maybe try playing with your hands next time!",
  "I've seen better defending from training cones!",
  "Your goalkeeper needs glasses, and so do you!",
  "That wasn't football, that was charity work!",
  "Did EA script that loss for you?",
  "Your controller was clearly working against you... and so was your brain!",
  "I think your team went on vacation mid-match!",
  "That performance deserves a participation trophy!",
  "Your defense had more holes than Swiss cheese!",
  "Did you confuse FIFA with a different game?",
  "That loss will be remembered for generations!",
  "Even the AI on Beginner would've done better!",
  "Your strikers couldn't score in an empty goal!",
  "That was so bad, it should be illegal!",
  "Did you let your pet play for you?",
  "That wasn't a match, that was a masterclass in losing!",
]

export default function HallOfShamePage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTaunt, setCurrentTaunt] = useState("")

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

        // Set initial random taunt
        setCurrentTaunt(taunts[Math.floor(Math.random() * taunts.length)])
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

  const generateRandomTaunt = () => {
    const newTaunt = taunts[Math.floor(Math.random() * taunts.length)]
    setCurrentTaunt(newTaunt)
  }

  const generateRandomExcuse = () => {
    return excuses[Math.floor(Math.random() * excuses.length)]
  }

  // Calculate biggest losses
  const biggestLosses: BiggestLoss[] = matches
    .map((match) => {
      const goalDiff = Math.abs(match.player1Score - match.player2Score)
      if (goalDiff === 0) return null // No losses in draws

      const player1Won = match.player1Score > match.player2Score
      const loser = getPlayerById(player1Won ? match.player2Id : match.player1Id)
      const winner = getPlayerById(player1Won ? match.player1Id : match.player2Id)
      const loserTeam = getTeamById(
        player1Won ? match.player2TeamId : match.player1TeamId
      )
      const winnerTeam = getTeamById(
        player1Won ? match.player1TeamId : match.player2TeamId
      )

      if (!loser || !winner || !loserTeam || !winnerTeam) return null

      return {
        match,
        loser,
        winner,
        loserScore: player1Won ? match.player2Score : match.player1Score,
        winnerScore: player1Won ? match.player1Score : match.player2Score,
        goalDifference: goalDiff,
        loserTeam,
        winnerTeam,
      }
    })
    .filter((loss): loss is BiggestLoss => loss !== null)
    .sort((a, b) => b.goalDifference - a.goalDifference)
    .slice(0, 10)

  // Calculate shame stats per player
  const shameStats = players.map((player) => {
    const playerLosses = biggestLosses.filter(
      (loss) => loss.loser.id === player.id
    )
    const totalGoalsConceded = playerLosses.reduce(
      (sum, loss) => sum + loss.winnerScore,
      0
    )
    const worstLoss = playerLosses[0]

    return {
      player,
      lossCount: playerLosses.length,
      totalGoalsConceded,
      worstLoss,
    }
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-32 bg-muted rounded" />
          <div className="h-48 bg-muted rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Skull className="h-6 w-6 text-destructive" />
        <h1 className="text-2xl font-bold">Hall of Shame</h1>
      </div>

      {/* Taunt Generator */}
      <Card className="mb-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-red-500" />
            Random Taunt Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 rounded-lg bg-background/50 text-center">
            <p className="text-lg italic">&ldquo;{currentTaunt}&rdquo;</p>
          </div>
          <Button
            onClick={generateRandomTaunt}
            className="w-full gap-2"
            variant="destructive"
          >
            <Shuffle className="h-4 w-4" />
            Generate New Taunt
          </Button>
        </CardContent>
      </Card>

      {/* Shame Stats */}
      {shameStats.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Shame Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {shameStats.map((stat) => (
                <div
                  key={stat.player.id}
                  className="p-4 rounded-lg bg-muted/50 text-center"
                >
                  <img
                    src={stat.player.avatar}
                    alt={stat.player.name}
                    className="w-12 h-12 rounded-full mx-auto mb-2"
                  />
                  <span className="font-semibold block">{stat.player.name}</span>
                  <div className="mt-2 space-y-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        In Top 10 Losses:{" "}
                      </span>
                      <span className="font-bold text-red-500">
                        {stat.lossCount}
                      </span>
                    </div>
                    {stat.worstLoss && (
                      <div className="text-xs text-muted-foreground">
                        Worst: {stat.worstLoss.loserScore}-
                        {stat.worstLoss.winnerScore}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Biggest Losses */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Frown className="h-5 w-5" />
            Biggest Losses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {biggestLosses.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                No shameful losses yet. Keep playing!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {biggestLosses.map((loss, index) => (
                <Link key={loss.match.id} href={`/match/${loss.match.id}`}>
                  <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={index === 0 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        #{index + 1}
                        {index === 0 && " WORST"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(loss.match.date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Loser */}
                      <div className="flex items-center gap-2 flex-1">
                        <img
                          src={loss.loser.avatar}
                          alt={loss.loser.name}
                          className="w-8 h-8 rounded-full opacity-50"
                        />
                        <div>
                          <div className="text-sm font-medium text-red-500">
                            {loss.loser.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {loss.loserTeam.name}
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-center px-4">
                        <div className="text-xl font-bold">
                          <span className="text-red-500">{loss.loserScore}</span>
                          <span className="text-muted-foreground mx-1">-</span>
                          <span className="text-green-500">{loss.winnerScore}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          -{loss.goalDifference} GD
                        </div>
                      </div>

                      {/* Winner */}
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-500">
                            {loss.winner.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {loss.winnerTeam.name}
                          </div>
                        </div>
                        <img
                          src={loss.winner.avatar}
                          alt={loss.winner.name}
                          className="w-8 h-8 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Excuses Board */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Excuses Board
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Pick one after your next devastating loss!
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {excuses.slice(0, 12).map((excuse, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-muted/50 text-sm text-center hover:bg-muted transition-colors cursor-pointer"
                onClick={() => {
                  navigator.clipboard?.writeText(excuse)
                }}
              >
                &ldquo;{excuse}&rdquo;
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => alert(generateRandomExcuse())}
              className="gap-2"
            >
              <Shuffle className="h-4 w-4" />
              Get Random Excuse
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
