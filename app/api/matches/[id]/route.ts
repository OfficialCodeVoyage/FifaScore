import { NextRequest, NextResponse } from 'next/server'
import { getMatch, getComments, getPlayers, ensureDatabase, getMatchAchievements } from '@/lib/queries'
import { deleteMatch, updateMatch, UpdateMatchData } from '@/lib/db'
import { getTeamById } from '@/lib/teams'
import { achievementTypes } from '@/lib/achievements'

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
    const [comments, players, matchAchievements] = await Promise.all([
      getComments(matchId),
      getPlayers(),
      getMatchAchievements(matchId)
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

    // Enrich achievements with player info and achievement details
    const enrichedAchievements = matchAchievements.map(achievement => {
      const player = players.find(p => p.id === achievement.playerId)
      const achievementType = achievementTypes.find(a => a.type === achievement.type)
      return {
        ...achievement,
        playerName: player?.name || 'Unknown',
        playerAvatar: player?.avatar || '',
        name: achievementType?.name || achievement.type,
        description: achievementType?.description || '',
        icon: achievementType?.icon || '',
        rarity: achievementType?.rarity || 'common'
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
      comments: enrichedComments,
      achievements: enrichedAchievements
    })
  } catch (error) {
    console.error('Error fetching match:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const body = await request.json()

    // Validate score values if provided
    if (body.player1Score !== undefined && body.player1Score < 0) {
      return NextResponse.json(
        { error: 'Scores cannot be negative' },
        { status: 400 }
      )
    }
    if (body.player2Score !== undefined && body.player2Score < 0) {
      return NextResponse.json(
        { error: 'Scores cannot be negative' },
        { status: 400 }
      )
    }

    const updateData: UpdateMatchData = {}
    if (body.player1Score !== undefined) updateData.player1Score = body.player1Score
    if (body.player2Score !== undefined) updateData.player2Score = body.player2Score
    if (body.player1TeamId !== undefined) updateData.player1TeamId = body.player1TeamId
    if (body.player2TeamId !== undefined) updateData.player2TeamId = body.player2TeamId
    if (body.extraTime !== undefined) updateData.extraTime = body.extraTime
    if (body.penalties !== undefined) updateData.penalties = body.penalties

    const updatedMatch = await updateMatch(matchId, updateData)

    if (!updatedMatch) {
      return NextResponse.json(
        { error: 'Match not found or could not be updated' },
        { status: 404 }
      )
    }

    return NextResponse.json({ match: updatedMatch })
  } catch (error) {
    console.error('Error updating match:', error)
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const deleted = await deleteMatch(matchId)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Match not found or could not be deleted' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting match:', error)
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    )
  }
}
