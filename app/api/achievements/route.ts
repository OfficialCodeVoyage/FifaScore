import { NextRequest, NextResponse } from 'next/server'
import { getAchievements, getPlayers, ensureDatabase } from '@/lib/queries'
import { getAchievementInfo } from '@/lib/achievements'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await ensureDatabase()
    const { searchParams } = new URL(request.url)
    const playerIdParam = searchParams.get('playerId')

    let playerId: number | undefined
    if (playerIdParam) {
      playerId = parseInt(playerIdParam)
      if (isNaN(playerId)) {
        return NextResponse.json(
          { error: 'Invalid player ID' },
          { status: 400 }
        )
      }
    }

    const [achievements, players] = await Promise.all([
      getAchievements(playerId),
      getPlayers()
    ])

    // Enrich achievements with player and achievement info
    const enrichedAchievements = achievements.map(achievement => {
      const player = players.find(p => p.id === achievement.playerId)
      const achievementInfo = getAchievementInfo(achievement.type)

      return {
        ...achievement,
        playerName: player?.name || 'Unknown',
        playerAvatar: player?.avatar || '',
        name: achievementInfo?.name || achievement.type,
        description: achievementInfo?.description || '',
        icon: achievementInfo?.icon || ''
      }
    })

    // Sort by unlock date (most recent first)
    enrichedAchievements.sort((a, b) =>
      new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
    )

    return NextResponse.json({ achievements: enrichedAchievements, players })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}
