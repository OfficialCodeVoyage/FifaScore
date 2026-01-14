"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Trophy, Swords, Clock, Target } from "lucide-react"
import Link from "next/link"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScoreInput } from "@/components/score-input"
import { TeamPicker } from "@/components/team-picker"
import { useAchievementToast } from "@/components/achievement-toast"
import { getTeamById } from "@/lib/teams"

export default function NewMatchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showAchievements } = useAchievementToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [player1TeamId, setPlayer1TeamId] = useState<string>("")
  const [player2TeamId, setPlayer2TeamId] = useState<string>("")

  // Pre-fill from URL params (from Random page)
  useEffect(() => {
    const p1Team = searchParams.get("p1Team")
    const p2Team = searchParams.get("p2Team")
    if (p1Team) setPlayer1TeamId(p1Team)
    if (p2Team) setPlayer2TeamId(p2Team)
  }, [searchParams])

  const [player1Score, setPlayer1Score] = useState<number>(0)
  const [player2Score, setPlayer2Score] = useState<number>(0)
  const [extraTime, setExtraTime] = useState(false)
  const [penalties, setPenalties] = useState(false)

  const player1Team = player1TeamId ? getTeamById(parseInt(player1TeamId)) : null
  const player2Team = player2TeamId ? getTeamById(parseInt(player2TeamId)) : null

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
          player1Score,
          player2Score,
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
        showAchievements(
          allNewAchievements.map((achievement: { id: string; name: string; description: string; emoji: string }) => ({
            id: achievement.id,
            title: achievement.name,
            description: achievement.description,
            emoji: achievement.emoji,
          }))
        )
      }

      router.push(`/match/${data.match.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen fifa-gradient">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-muted/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Swords className="h-6 w-6 text-primary" />
              New Match
            </h1>
            <p className="text-muted-foreground text-sm">Record a new game</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Player 1 - Pavlo */}
          <div
            className="fifa-card mb-4 overflow-hidden"
            style={{
              borderLeft: player1Team ? `4px solid ${player1Team.primaryColor}` : undefined
            }}
          >
            <CardHeader className="pb-2 bg-muted/30">
              <CardTitle className="text-lg flex items-center gap-3">
                <img
                  src="/pavlo.png"
                  alt="Pavlo"
                  className="w-10 h-10 rounded-full border-2 border-primary/30"
                />
                <div>
                  <span className="font-bold">Pavlo</span>
                  <p className="text-xs text-muted-foreground font-normal">Player 1</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Team</Label>
                <TeamPicker
                  value={player1TeamId}
                  onValueChange={setPlayer1TeamId}
                  selectedTeam={player1Team ?? null}
                  placeholder="Tap to select team"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Goals Scored
                </Label>
                <ScoreInput
                  value={player1Score}
                  onChange={setPlayer1Score}
                  min={0}
                  max={99}
                />
              </div>
            </CardContent>
          </div>

          {/* VS Divider */}
          <div className="flex items-center justify-center my-6">
            <div className="vs-badge">
              <span className="text-foreground">VS</span>
            </div>
          </div>

          {/* Player 2 - Summet */}
          <div
            className="fifa-card mb-4 overflow-hidden"
            style={{
              borderLeft: player2Team ? `4px solid ${player2Team.primaryColor}` : undefined
            }}
          >
            <CardHeader className="pb-2 bg-muted/30">
              <CardTitle className="text-lg flex items-center gap-3">
                <img
                  src="/sumeet.png"
                  alt="Sumeet"
                  className="w-10 h-10 rounded-full border-2 border-primary/30"
                />
                <div>
                  <span className="font-bold">Sumeet</span>
                  <p className="text-xs text-muted-foreground font-normal">Player 2</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Team</Label>
                <TeamPicker
                  value={player2TeamId}
                  onValueChange={setPlayer2TeamId}
                  selectedTeam={player2Team ?? null}
                  placeholder="Tap to select team"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Goals Scored
                </Label>
                <ScoreInput
                  value={player2Score}
                  onChange={setPlayer2Score}
                  min={0}
                  max={99}
                />
              </div>
            </CardContent>
          </div>

          {/* Match Options */}
          <div className="fifa-card mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Match Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <Label className="font-medium">Extra Time (AET)</Label>
                  <p className="text-sm text-muted-foreground">
                    Match went to extra time
                  </p>
                </div>
                <Switch checked={extraTime} onCheckedChange={setExtraTime} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <Label className="font-medium">Penalties (PEN)</Label>
                  <p className="text-sm text-muted-foreground">
                    Match decided by penalties
                  </p>
                </div>
                <Switch checked={penalties} onCheckedChange={setPenalties} />
              </div>
            </CardContent>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-destructive/20 border border-destructive/30 text-destructive text-sm flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full gap-2 h-14 fifa-gradient-green text-primary-foreground shadow-lg hover:shadow-xl transition-all text-lg font-bold"
            disabled={isSubmitting}
          >
            <Trophy className="h-6 w-6" />
            {isSubmitting ? "Saving Match..." : "Save Match Result"}
          </Button>
        </form>
      </div>
    </div>
  )
}
