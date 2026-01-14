import { NextRequest, NextResponse } from 'next/server'
import { getMatch, getComments, getPlayers, ensureDatabase } from '@/lib/queries'
import { getTeamById } from '@/lib/teams'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await ensureDatabase()
    const { id } = await params
    const matchId = parseInt(id)

    if (isNaN(matchId)) {
      return NextResponse.json(
        { error: 'Invalid match ID' },
        { status: 400 }
      )
    }

    const match = await getMatch(matchId)

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Get related data
    const [comments, players] = await Promise.all([
      getComments(matchId),
      getPlayers()
    ])

    const player1 = players.find(p => p.id === match.player1Id)
    const player2 = players.find(p => p.id === match.player2Id)
    const team1 = getTeamById(match.player1TeamId)
    const team2 = getTeamById(match.player2TeamId)

    // Enrich comments with player info
    const enrichedComments = comments.map(comment => {
      const player = players.find(p => p.id === comment.playerId)
      return {
        ...comment,
        playerName: player?.name || 'Unknown',
        playerAvatar: player?.avatar || ''
      }
    })

    return NextResponse.json({
      match: {
        ...match,
        player1Name: player1?.name || 'Unknown',
        player2Name: player2?.name || 'Unknown',
        player1Avatar: player1?.avatar || '',
        player2Avatar: player2?.avatar || '',
        team1Name: team1?.name || 'Unknown',
        team2Name: team2?.name || 'Unknown',
        team1Logo: team1?.logo || '',
        team2Logo: team2?.logo || ''
      },
      comments: enrichedComments
    })
  } catch (error) {
    console.error('Error fetching match:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    )
  }
}
