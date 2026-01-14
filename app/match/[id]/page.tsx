"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, MessageCircle, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MatchData {
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
  player1Name: string
  player2Name: string
  player1Avatar: string
  player2Avatar: string
  team1Name: string
  team2Name: string
  team1Logo: string
  team2Logo: string
}

interface Comment {
  id: number
  matchId: number
  playerId: number
  content: string
  createdAt: string
  playerName: string
  playerAvatar: string
}

export default function MatchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [match, setMatch] = useState<MatchData | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Comment form state
  const [newComment, setNewComment] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState<string>("1")
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    async function fetchMatch() {
      try {
        const response = await fetch(`/api/matches/${params.id}`)
        if (!response.ok) {
          throw new Error("Match not found")
        }
        const data = await response.json()
        setMatch(data.match)
        setComments(data.comments || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load match")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchMatch()
    }
  }, [params.id])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) return

    setSubmittingComment(true)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchId: parseInt(params.id as string),
          playerId: parseInt(selectedPlayer),
          content: newComment.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      const data = await response.json()
      setComments([...comments, data.comment])
      setNewComment("")
    } catch (err) {
      console.error("Error adding comment:", err)
    } finally {
      setSubmittingComment(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-48 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Match not found</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const player1Won = match.player1Score > match.player2Score
  const player2Won = match.player2Score > match.player1Score
  const isDraw = match.player1Score === match.player2Score

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
          <h1 className="text-2xl font-bold">Match Details</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(match.date)}
          </p>
        </div>
      </div>

      {/* Match Result Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {/* Player 1 / Team 1 */}
            <div className="flex flex-col items-center flex-1">
              <img
                src={match.team1Logo}
                alt={match.team1Name}
                className="w-16 h-16 rounded-lg mb-2"
              />
              <span className="font-semibold text-sm text-center">
                {match.team1Name}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <img
                  src={match.player1Avatar}
                  alt={match.player1Name}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-xs text-muted-foreground">
                  {match.player1Name}
                </span>
              </div>
              <span
                className={`text-4xl font-bold mt-3 ${
                  player1Won ? "text-primary" : ""
                }`}
              >
                {match.player1Score}
              </span>
            </div>

            {/* VS / Result */}
            <div className="flex flex-col items-center px-4">
              <span className="text-xl font-bold text-muted-foreground mb-2">
                -
              </span>
              {player1Won && (
                <Badge variant="success" className="text-xs">
                  {match.player1Name} wins!
                </Badge>
              )}
              {player2Won && (
                <Badge variant="success" className="text-xs">
                  {match.player2Name} wins!
                </Badge>
              )}
              {isDraw && (
                <Badge variant="secondary" className="text-xs">
                  Draw
                </Badge>
              )}
            </div>

            {/* Player 2 / Team 2 */}
            <div className="flex flex-col items-center flex-1">
              <img
                src={match.team2Logo}
                alt={match.team2Name}
                className="w-16 h-16 rounded-lg mb-2"
              />
              <span className="font-semibold text-sm text-center">
                {match.team2Name}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <img
                  src={match.player2Avatar}
                  alt={match.player2Name}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-xs text-muted-foreground">
                  {match.player2Name}
                </span>
              </div>
              <span
                className={`text-4xl font-bold mt-3 ${
                  player2Won ? "text-primary" : ""
                }`}
              >
                {match.player2Score}
              </span>
            </div>
          </div>

          {/* Match Tags */}
          {(match.extraTime || match.penalties) && (
            <div className="flex justify-center gap-2 mt-4 pt-4 border-t">
              {match.extraTime && <Badge variant="outline">After Extra Time</Badge>}
              {match.penalties && <Badge variant="outline">Penalties</Badge>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Trash Talk ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <img
                    src={comment.playerAvatar}
                    alt={comment.playerName}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {comment.playerName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatCommentDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 mb-4">
              <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No comments yet. Start the trash talk!
              </p>
            </div>
          )}

          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <div className="flex gap-2">
              <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    <div className="flex items-center gap-2">
                      <img
                        src="/pavlo.png"
                        alt="Pavlo"
                        className="w-4 h-4 rounded-full"
                      />
                      Pavlo
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex items-center gap-2">
                      <img
                        src="/sumeet.png"
                        alt="Sumeet"
                        className="w-4 h-4 rounded-full"
                      />
                      Sumeet
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Textarea
                placeholder="Drop some trash talk..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[60px]"
              />
              <Button
                type="submit"
                size="icon"
                className="flex-shrink-0"
                disabled={submittingComment || !newComment.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
