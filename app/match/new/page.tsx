"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trophy } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { teams, getAllLeagues } from "@/lib/teams"

export default function NewMatchPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [player1TeamId, setPlayer1TeamId] = useState<string>("")
  const [player2TeamId, setPlayer2TeamId] = useState<string>("")
  const [player1Score, setPlayer1Score] = useState<string>("0")
  const [player2Score, setPlayer2Score] = useState<string>("0")
  const [extraTime, setExtraTime] = useState(false)
  const [penalties, setPenalties] = useState(false)

  const leagues = getAllLeagues()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!player1TeamId || !player2TeamId) {
      setError("Please select teams for both players")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player1Id: 1, // Pavlo
          player2Id: 2, // Summet
          player1TeamId: parseInt(player1TeamId),
          player2TeamId: parseInt(player2TeamId),
          player1Score: parseInt(player1Score),
          player2Score: parseInt(player2Score),
          extraTime,
          penalties,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add match")
      }

      const data = await response.json()

      // Show achievement notification if any were unlocked
      const allNewAchievements = [
        ...(data.newAchievements?.player1 || []),
        ...(data.newAchievements?.player2 || []),
      ]

      if (allNewAchievements.length > 0) {
        // Could add a toast notification here
        console.log("New achievements unlocked:", allNewAchievements)
      }

      router.push(`/match/${data.match.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTeamsByLeague = (league: string) => {
    return teams.filter((team) => team.league === league)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New Match</h1>
          <p className="text-muted-foreground text-sm">Record a new game</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Player 1 - Pavlo */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pavlo"
                alt="Pavlo"
                className="w-8 h-8 rounded-full"
              />
              Pavlo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Team</Label>
              <Select value={player1TeamId} onValueChange={setPlayer1TeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {leagues.map((league) => (
                    <div key={league}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        {league}
                      </div>
                      {getTeamsByLeague(league).map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          <div className="flex items-center gap-2">
                            <img
                              src={team.logo}
                              alt={team.name}
                              className="w-5 h-5 rounded"
                            />
                            {team.name}
                            <span className="text-xs text-muted-foreground ml-auto">
                              {team.rating}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Score</Label>
              <Input
                type="number"
                min="0"
                max="99"
                value={player1Score}
                onChange={(e) => setPlayer1Score(e.target.value)}
                className="text-center text-2xl font-bold h-14"
              />
            </div>
          </CardContent>
        </Card>

        {/* VS Divider */}
        <div className="flex items-center justify-center my-4">
          <div className="bg-muted rounded-full px-4 py-2 font-bold text-muted-foreground">
            VS
          </div>
        </div>

        {/* Player 2 - Summet */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Summet"
                alt="Summet"
                className="w-8 h-8 rounded-full"
              />
              Summet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Team</Label>
              <Select value={player2TeamId} onValueChange={setPlayer2TeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {leagues.map((league) => (
                    <div key={league}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        {league}
                      </div>
                      {getTeamsByLeague(league).map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          <div className="flex items-center gap-2">
                            <img
                              src={team.logo}
                              alt={team.name}
                              className="w-5 h-5 rounded"
                            />
                            {team.name}
                            <span className="text-xs text-muted-foreground ml-auto">
                              {team.rating}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Score</Label>
              <Input
                type="number"
                min="0"
                max="99"
                value={player2Score}
                onChange={(e) => setPlayer2Score(e.target.value)}
                className="text-center text-2xl font-bold h-14"
              />
            </div>
          </CardContent>
        </Card>

        {/* Match Options */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Match Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Extra Time (AET)</Label>
                <p className="text-sm text-muted-foreground">
                  Match went to extra time
                </p>
              </div>
              <Switch checked={extraTime} onCheckedChange={setExtraTime} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Penalties</Label>
                <p className="text-sm text-muted-foreground">
                  Match decided by penalties
                </p>
              </div>
              <Switch checked={penalties} onCheckedChange={setPenalties} />
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full gap-2"
          disabled={isSubmitting}
        >
          <Trophy className="h-5 w-5" />
          {isSubmitting ? "Saving..." : "Save Match"}
        </Button>
      </form>
    </div>
  )
}
