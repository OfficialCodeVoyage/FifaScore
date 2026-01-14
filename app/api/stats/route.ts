import { NextResponse } from 'next/server'
import { getFullStats, getPlayers, getAchievements, ensureDatabase } from '@/lib/queries'
import { getTeamById } from '@/lib/teams'

export async function GET() {
  try {
    await ensureDatabase()
    const [stats, players, achievements] = await Promise.all([
      getFullStats(),
      getPlayers(),
      getAchievements()
    ])

    // Count achievements per player
    const player1Achievements = achievements.filter(a => a.playerId === 1).length
    const player2Achievements = achievements.filter(a => a.playerId === 2).length

    // Enrich recent matches with player and team names
    const enrichedRecentMatches = stats.recentMatches.map(match => {
      const player1 = players.find(p => p.id === match.player1Id)
      const player2 = players.find(p => p.id === match.player2Id)
      const team1 = getTeamById(match.player1TeamId)
      const team2 = getTeamById(match.player2TeamId)

      return {
        ...match,
        player1Name: player1?.name || 'Unknown',
        player2Name: player2?.name || 'Unknown',
        player1Avatar: player1?.avatar || '',
        player2Avatar: player2?.avatar || '',
        team1Name: team1?.name || 'Unknown',
        team2Name: team2?.name || 'Unknown',
        team1Logo: team1?.logo || '',
        team2Logo: team2?.logo || ''
      }
    })

    // Enrich head to head recent matches
    let enrichedH2H = null
    if (stats.headToHead) {
      enrichedH2H = {
        ...stats.headToHead,
        recentMatches: stats.headToHead.recentMatches.map(match => {
          const player1 = players.find(p => p.id === match.player1Id)
          const player2 = players.find(p => p.id === match.player2Id)
          const team1 = getTeamById(match.player1TeamId)
          const team2 = getTeamById(match.player2TeamId)

          return {
            ...match,
            player1Name: player1?.name || 'Unknown',
            player2Name: player2?.name || 'Unknown',
            team1Name: team1?.name || 'Unknown',
            team2Name: team2?.name || 'Unknown',
            team1Logo: team1?.logo || '',
            team2Logo: team2?.logo || ''
          }
        })
      }
    }

    return NextResponse.json({
      headToHead: enrichedH2H,
      player1Stats: stats.player1Stats,
      player2Stats: stats.player2Stats,
      recentMatches: enrichedRecentMatches,
      totalMatches: stats.totalMatches,
      players,
      achievementCounts: {
        player1: player1Achievements,
        player2: player2Achievements
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
