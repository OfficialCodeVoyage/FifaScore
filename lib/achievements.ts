import { Match, Achievement } from './data'

export interface AchievementType {
  type: string
  name: string
  description: string
  icon: string
}

export const achievementTypes: AchievementType[] = [
  {
    type: 'ON_FIRE',
    name: 'On Fire',
    description: '3 wins in a row',
    icon: '🔥'
  },
  {
    type: 'THE_WALL',
    name: 'The Wall',
    description: 'Keep a clean sheet (opponent scores 0 goals)',
    icon: '🧱'
  },
  {
    type: 'DEMOLITION',
    name: 'Demolition',
    description: 'Win by 5+ goals',
    icon: '💥'
  },
  {
    type: 'COMEBACK_KID',
    name: 'Comeback Kid',
    description: 'Win after being 2+ goals down',
    icon: '🦸'
  },
  {
    type: 'SNIPER',
    name: 'Sniper',
    description: 'Score 5+ goals in a single match',
    icon: '🎯'
  },
  {
    type: 'CHAMPION',
    name: 'Champion',
    description: 'Win 50 matches total',
    icon: '🏆'
  },
  {
    type: 'ROCK_BOTTOM',
    name: 'Rock Bottom',
    description: '5 losses in a row',
    icon: '📉'
  }
]

export function getAchievementInfo(type: string): AchievementType | undefined {
  return achievementTypes.find(a => a.type === type)
}

/**
 * Check if player has won the match
 */
function isWinner(match: Match, playerId: number): boolean {
  if (match.player1Id === playerId) {
    return match.player1Score > match.player2Score
  }
  return match.player2Score > match.player1Score
}

/**
 * Check if player has lost the match
 */
function isLoser(match: Match, playerId: number): boolean {
  if (match.player1Id === playerId) {
    return match.player1Score < match.player2Score
  }
  return match.player2Score < match.player1Score
}

/**
 * Get player's score in a match
 */
function getPlayerScore(match: Match, playerId: number): number {
  return match.player1Id === playerId ? match.player1Score : match.player2Score
}

/**
 * Get opponent's score in a match
 */
function getOpponentScore(match: Match, playerId: number): number {
  return match.player1Id === playerId ? match.player2Score : match.player1Score
}

/**
 * Check which achievements should be unlocked for a player after a match
 * Returns array of achievement types that should be unlocked
 */
export function checkAchievements(
  playerId: number,
  matchId: number,
  allMatches: Match[],
  existingAchievements: Achievement[]
): string[] {
  const newAchievements: string[] = []
  const currentMatch = allMatches.find(m => m.id === matchId)

  if (!currentMatch) return newAchievements

  // Get player's matches sorted by date (most recent first)
  const playerMatches = allMatches
    .filter(m => m.player1Id === playerId || m.player2Id === playerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Helper to check if achievement already exists
  const hasAchievement = (type: string) =>
    existingAchievements.some(a => a.playerId === playerId && a.type === type)

  // ON_FIRE: 3 wins in a row
  if (!hasAchievement('ON_FIRE') && playerMatches.length >= 3) {
    const lastThree = playerMatches.slice(0, 3)
    if (lastThree.every(m => isWinner(m, playerId))) {
      newAchievements.push('ON_FIRE')
    }
  }

  // THE_WALL: Clean sheet (opponent 0 goals)
  if (!hasAchievement('THE_WALL')) {
    if (isWinner(currentMatch, playerId) && getOpponentScore(currentMatch, playerId) === 0) {
      newAchievements.push('THE_WALL')
    }
  }

  // DEMOLITION: Win by 5+ goals
  if (!hasAchievement('DEMOLITION')) {
    const playerScore = getPlayerScore(currentMatch, playerId)
    const opponentScore = getOpponentScore(currentMatch, playerId)
    if (isWinner(currentMatch, playerId) && (playerScore - opponentScore) >= 5) {
      newAchievements.push('DEMOLITION')
    }
  }

  // SNIPER: Score 5+ goals
  if (!hasAchievement('SNIPER')) {
    if (getPlayerScore(currentMatch, playerId) >= 5) {
      newAchievements.push('SNIPER')
    }
  }

  // CHAMPION: 50 total wins
  if (!hasAchievement('CHAMPION')) {
    const totalWins = playerMatches.filter(m => isWinner(m, playerId)).length
    if (totalWins >= 50) {
      newAchievements.push('CHAMPION')
    }
  }

  // ROCK_BOTTOM: 5 losses in a row
  if (!hasAchievement('ROCK_BOTTOM') && playerMatches.length >= 5) {
    const lastFive = playerMatches.slice(0, 5)
    if (lastFive.every(m => isLoser(m, playerId))) {
      newAchievements.push('ROCK_BOTTOM')
    }
  }

  // COMEBACK_KID: This would require tracking in-game score progression
  // For now, we'll skip this as it requires more complex match data
  // In a real implementation, you might track score history during match entry

  return newAchievements
}
