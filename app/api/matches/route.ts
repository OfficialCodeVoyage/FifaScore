import { NextRequest, NextResponse } from 'next/server'
import {
  getMatches,
  addMatch,
  checkAndUnlockAchievements,
  AddMatchData
} from '@/lib/queries'

export async function GET() {
  try {
    const matches = getMatches()
    return NextResponse.json({ matches })
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      'player1Id',
      'player2Id',
      'player1Score',
      'player2Score',
      'player1TeamId',
      'player2TeamId'
    ]

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate score values
    if (body.player1Score < 0 || body.player2Score < 0) {
      return NextResponse.json(
        { error: 'Scores cannot be negative' },
        { status: 400 }
      )
    }

    const matchData: AddMatchData = {
      player1Id: body.player1Id,
      player2Id: body.player2Id,
      player1Score: body.player1Score,
      player2Score: body.player2Score,
      player1TeamId: body.player1TeamId,
      player2TeamId: body.player2TeamId,
      extraTime: body.extraTime || false,
      penalties: body.penalties || false
    }

    // Add the match
    const newMatch = addMatch(matchData)

    // Check and unlock achievements for both players
    const player1Achievements = checkAndUnlockAchievements(
      matchData.player1Id,
      newMatch.id
    )
    const player2Achievements = checkAndUnlockAchievements(
      matchData.player2Id,
      newMatch.id
    )

    return NextResponse.json({
      match: newMatch,
      newAchievements: {
        player1: player1Achievements,
        player2: player2Achievements
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating match:', error)
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    )
  }
}
