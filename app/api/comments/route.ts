import { NextRequest, NextResponse } from 'next/server'
import { addComment, getComments, getPlayers, getMatch, ensureDatabase } from '@/lib/queries'

export async function POST(request: NextRequest) {
  try {
    await ensureDatabase()
    const body = await request.json()

    // Validate required fields
    if (!body.matchId || body.matchId === undefined) {
      return NextResponse.json(
        { error: 'Missing required field: matchId' },
        { status: 400 }
      )
    }

    if (!body.playerId || body.playerId === undefined) {
      return NextResponse.json(
        { error: 'Missing required field: playerId' },
        { status: 400 }
      )
    }

    if (!body.content || body.content.trim() === '') {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
        { status: 400 }
      )
    }

    // Validate match exists
    const match = await getMatch(body.matchId)
    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Validate player exists
    const players = await getPlayers()
    const player = players.find(p => p.id === body.playerId)
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Add the comment
    const newComment = await addComment(
      body.matchId,
      body.playerId,
      body.content.trim()
    )

    return NextResponse.json({
      comment: {
        ...newComment,
        playerName: player.name,
        playerAvatar: player.avatar
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureDatabase()
    const { searchParams } = new URL(request.url)
    const matchIdParam = searchParams.get('matchId')

    if (!matchIdParam) {
      return NextResponse.json(
        { error: 'Missing required parameter: matchId' },
        { status: 400 }
      )
    }

    const matchId = parseInt(matchIdParam)
    if (isNaN(matchId)) {
      return NextResponse.json(
        { error: 'Invalid match ID' },
        { status: 400 }
      )
    }

    const [comments, players] = await Promise.all([
      getComments(matchId),
      getPlayers()
    ])

    // Enrich comments with player info
    const enrichedComments = comments.map(comment => {
      const player = players.find(p => p.id === comment.playerId)
      return {
        ...comment,
        playerName: player?.name || 'Unknown',
        playerAvatar: player?.avatar || ''
      }
    })

    return NextResponse.json({ comments: enrichedComments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
