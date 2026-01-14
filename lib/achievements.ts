import { Match, Achievement } from './data'
import { getTeamById, teams } from './teams'

export interface AchievementType {
  type: string
  name: string
  description: string
  icon: string
  category: 'wins' | 'goals' | 'defense' | 'streaks' | 'teams' | 'milestones' | 'special' | 'shame'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
}

export const achievementTypes: AchievementType[] = [
  // ============ WIN STREAKS ============
  {
    type: 'ON_FIRE',
    name: 'On Fire',
    description: '3 wins in a row',
    icon: '🔥',
    category: 'streaks',
    rarity: 'common'
  },
  {
    type: 'UNSTOPPABLE',
    name: 'Unstoppable',
    description: '5 wins in a row',
    icon: '⚡',
    category: 'streaks',
    rarity: 'uncommon'
  },
  {
    type: 'DOMINATION',
    name: 'Domination',
    description: '7 wins in a row',
    icon: '👑',
    category: 'streaks',
    rarity: 'rare'
  },
  {
    type: 'LEGENDARY_RUN',
    name: 'Legendary Run',
    description: '10 wins in a row',
    icon: '🏅',
    category: 'streaks',
    rarity: 'epic'
  },
  {
    type: 'IMMORTAL',
    name: 'Immortal',
    description: '15 wins in a row',
    icon: '🌟',
    category: 'streaks',
    rarity: 'legendary'
  },

  // ============ GOAL SCORING ============
  {
    type: 'SNIPER',
    name: 'Sniper',
    description: 'Score 5+ goals in a single match',
    icon: '🎯',
    category: 'goals',
    rarity: 'common'
  },
  {
    type: 'HAT_TRICK_HERO',
    name: 'Hat Trick Hero',
    description: 'Score exactly 3 goals in a match',
    icon: '🎩',
    category: 'goals',
    rarity: 'common'
  },
  {
    type: 'GOAL_MACHINE',
    name: 'Goal Machine',
    description: 'Score 7+ goals in a single match',
    icon: '🤖',
    category: 'goals',
    rarity: 'uncommon'
  },
  {
    type: 'DOUBLE_DIGITS',
    name: 'Double Digits',
    description: 'Score 10+ goals in a single match',
    icon: '🔟',
    category: 'goals',
    rarity: 'rare'
  },
  {
    type: 'CENTURY_SCORER',
    name: 'Century Scorer',
    description: 'Score 100 total goals',
    icon: '💯',
    category: 'goals',
    rarity: 'uncommon'
  },
  {
    type: 'GOAL_LEGEND',
    name: 'Goal Legend',
    description: 'Score 250 total goals',
    icon: '⚽',
    category: 'goals',
    rarity: 'rare'
  },
  {
    type: 'GOLDEN_BOOT',
    name: 'Golden Boot',
    description: 'Score 500 total goals',
    icon: '👟',
    category: 'goals',
    rarity: 'legendary'
  },

  // ============ DEFENSE / CLEAN SHEETS ============
  {
    type: 'THE_WALL',
    name: 'The Wall',
    description: 'Keep a clean sheet (opponent scores 0)',
    icon: '🧱',
    category: 'defense',
    rarity: 'common'
  },
  {
    type: 'FORTRESS',
    name: 'Fortress',
    description: '3 clean sheets total',
    icon: '🏰',
    category: 'defense',
    rarity: 'uncommon'
  },
  {
    type: 'IMPENETRABLE',
    name: 'Impenetrable',
    description: '5 clean sheets total',
    icon: '🛡️',
    category: 'defense',
    rarity: 'rare'
  },
  {
    type: 'CLEAN_SHEET_STREAK',
    name: 'Clean Sheet Streak',
    description: '2 clean sheets in a row',
    icon: '🔒',
    category: 'defense',
    rarity: 'rare'
  },
  {
    type: 'STINGY',
    name: 'Stingy',
    description: 'Concede 0-1 goals in 5 consecutive matches',
    icon: '🤏',
    category: 'defense',
    rarity: 'epic'
  },

  // ============ WINS BY MARGIN ============
  {
    type: 'DEMOLITION',
    name: 'Demolition',
    description: 'Win by 5+ goals',
    icon: '💥',
    category: 'wins',
    rarity: 'uncommon'
  },
  {
    type: 'MASSACRE',
    name: 'Massacre',
    description: 'Win by 7+ goals',
    icon: '☠️',
    category: 'wins',
    rarity: 'rare'
  },
  {
    type: 'ANNIHILATION',
    name: 'Annihilation',
    description: 'Win by 10+ goals',
    icon: '💀',
    category: 'wins',
    rarity: 'epic'
  },
  {
    type: 'NAIL_BITER',
    name: 'Nail Biter',
    description: 'Win by exactly 1 goal',
    icon: '😰',
    category: 'wins',
    rarity: 'common'
  },
  {
    type: 'CLUTCH_MASTER',
    name: 'Clutch Master',
    description: 'Win 5 matches by exactly 1 goal',
    icon: '🎰',
    category: 'wins',
    rarity: 'uncommon'
  },

  // ============ WIN MILESTONES ============
  {
    type: 'FIRST_BLOOD',
    name: 'First Blood',
    description: 'Win your first match',
    icon: '🩸',
    category: 'milestones',
    rarity: 'common'
  },
  {
    type: 'GETTING_STARTED',
    name: 'Getting Started',
    description: 'Win 5 matches total',
    icon: '🌱',
    category: 'milestones',
    rarity: 'common'
  },
  {
    type: 'COMPETITOR',
    name: 'Competitor',
    description: 'Win 10 matches total',
    icon: '🏃',
    category: 'milestones',
    rarity: 'common'
  },
  {
    type: 'VETERAN',
    name: 'Veteran',
    description: 'Win 25 matches total',
    icon: '🎖️',
    category: 'milestones',
    rarity: 'uncommon'
  },
  {
    type: 'CHAMPION',
    name: 'Champion',
    description: 'Win 50 matches total',
    icon: '🏆',
    category: 'milestones',
    rarity: 'rare'
  },
  {
    type: 'ELITE',
    name: 'Elite',
    description: 'Win 75 matches total',
    icon: '💎',
    category: 'milestones',
    rarity: 'epic'
  },
  {
    type: 'GOAT',
    name: 'G.O.A.T.',
    description: 'Win 100 matches total',
    icon: '🐐',
    category: 'milestones',
    rarity: 'legendary'
  },

  // ============ TEAM VARIETY ============
  {
    type: 'VARIETY_PACK',
    name: 'Variety Pack',
    description: 'Win with 5 different teams',
    icon: '🎨',
    category: 'teams',
    rarity: 'common'
  },
  {
    type: 'WELL_TRAVELED',
    name: 'Well Traveled',
    description: 'Win with 10 different teams',
    icon: '✈️',
    category: 'teams',
    rarity: 'uncommon'
  },
  {
    type: 'GLOBETROTTER',
    name: 'Globetrotter',
    description: 'Win with 20 different teams',
    icon: '🌍',
    category: 'teams',
    rarity: 'rare'
  },
  {
    type: 'MASTER_OF_ALL',
    name: 'Master of All',
    description: 'Win with 30 different teams',
    icon: '🧙',
    category: 'teams',
    rarity: 'epic'
  },

  // ============ TEAM LOYALTY ============
  {
    type: 'LOYAL_FAN',
    name: 'Loyal Fan',
    description: 'Win 5 matches with the same team',
    icon: '💙',
    category: 'teams',
    rarity: 'common'
  },
  {
    type: 'DIE_HARD',
    name: 'Die Hard',
    description: 'Win 10 matches with the same team',
    icon: '❤️‍🔥',
    category: 'teams',
    rarity: 'uncommon'
  },
  {
    type: 'ONE_CLUB_PLAYER',
    name: 'One Club Player',
    description: 'Win 20 matches with the same team',
    icon: '🏠',
    category: 'teams',
    rarity: 'rare'
  },

  // ============ LEAGUE CHAMPIONS ============
  {
    type: 'LA_LIGA_MASTER',
    name: 'La Liga Master',
    description: 'Win with 3 different La Liga teams',
    icon: '🇪🇸',
    category: 'teams',
    rarity: 'uncommon'
  },
  {
    type: 'PREMIER_LEAGUE_MASTER',
    name: 'Premier League Master',
    description: 'Win with 5 different Premier League teams',
    icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    category: 'teams',
    rarity: 'uncommon'
  },
  {
    type: 'BUNDESLIGA_MASTER',
    name: 'Bundesliga Master',
    description: 'Win with 3 different Bundesliga teams',
    icon: '🇩🇪',
    category: 'teams',
    rarity: 'uncommon'
  },
  {
    type: 'SERIE_A_MASTER',
    name: 'Serie A Master',
    description: 'Win with 4 different Serie A teams',
    icon: '🇮🇹',
    category: 'teams',
    rarity: 'uncommon'
  },
  {
    type: 'LIGUE_1_MASTER',
    name: 'Ligue 1 Master',
    description: 'Win with 3 different Ligue 1 teams',
    icon: '🇫🇷',
    category: 'teams',
    rarity: 'uncommon'
  },

  // ============ UNDERDOG / GIANT KILLER ============
  {
    type: 'GIANT_KILLER',
    name: 'Giant Killer',
    description: 'Win against a team rated 3+ higher than yours',
    icon: '🗡️',
    category: 'special',
    rarity: 'uncommon'
  },
  {
    type: 'DAVID_VS_GOLIATH',
    name: 'David vs Goliath',
    description: 'Win against a team rated 5+ higher than yours',
    icon: '🪨',
    category: 'special',
    rarity: 'rare'
  },
  {
    type: 'MIRACLE_WORKER',
    name: 'Miracle Worker',
    description: 'Win against a team rated 7+ higher than yours',
    icon: '✨',
    category: 'special',
    rarity: 'epic'
  },

  // ============ SPECIFIC SCORELINES ============
  {
    type: 'PERFECT_GAME',
    name: 'Perfect Game',
    description: 'Win 5-0',
    icon: '🎯',
    category: 'special',
    rarity: 'uncommon'
  },
  {
    type: 'CRICKET_SCORE',
    name: 'Cricket Score',
    description: 'Total goals in match exceeds 10',
    icon: '🏏',
    category: 'special',
    rarity: 'uncommon'
  },
  {
    type: 'BORING_BORING',
    name: 'Boring Boring',
    description: 'Win a 0-0 match (impossible without penalties)',
    icon: '😴',
    category: 'special',
    rarity: 'legendary'
  },
  {
    type: 'THE_CLASSIC',
    name: 'The Classic',
    description: 'Win 2-1',
    icon: '📖',
    category: 'special',
    rarity: 'common'
  },
  {
    type: 'THRILLER',
    name: 'Thriller',
    description: 'Win a match with 8+ total goals',
    icon: '🎢',
    category: 'special',
    rarity: 'uncommon'
  },

  // ============ EXTRA TIME & PENALTIES ============
  {
    type: 'EXTRA_TIME_HERO',
    name: 'Extra Time Hero',
    description: 'Win a match in extra time',
    icon: '⏱️',
    category: 'special',
    rarity: 'uncommon'
  },
  {
    type: 'PENALTY_KING',
    name: 'Penalty King',
    description: 'Win a match on penalties',
    icon: '🥅',
    category: 'special',
    rarity: 'uncommon'
  },
  {
    type: 'NERVES_OF_STEEL',
    name: 'Nerves of Steel',
    description: 'Win 3 matches on penalties',
    icon: '🧊',
    category: 'special',
    rarity: 'rare'
  },
  {
    type: 'DRAMA_KING',
    name: 'Drama King',
    description: 'Win 5 matches in extra time or penalties',
    icon: '🎭',
    category: 'special',
    rarity: 'rare'
  },

  // ============ COMEBACKS ============
  {
    type: 'COMEBACK_KID',
    name: 'Comeback Kid',
    description: 'Win after being 2+ goals down',
    icon: '🦸',
    category: 'special',
    rarity: 'rare'
  },
  {
    type: 'NEVER_SAY_DIE',
    name: 'Never Say Die',
    description: 'Win after being 3+ goals down',
    icon: '💪',
    category: 'special',
    rarity: 'epic'
  },
  {
    type: 'MIRACLE_OF_ISTANBUL',
    name: 'Miracle of Istanbul',
    description: 'Win after being 4+ goals down',
    icon: '🌙',
    category: 'special',
    rarity: 'legendary'
  },

  // ============ SPECIFIC TEAMS ============
  {
    type: 'EL_CLASICO_WINNER',
    name: 'El Clasico Winner',
    description: 'Win using Real Madrid or Barcelona',
    icon: '🇪🇸',
    category: 'teams',
    rarity: 'common'
  },
  {
    type: 'GALACTICO',
    name: 'Galactico',
    description: 'Win 10 matches with Real Madrid',
    icon: '⭐',
    category: 'teams',
    rarity: 'rare'
  },
  {
    type: 'TIKI_TAKA',
    name: 'Tiki Taka',
    description: 'Win 10 matches with Barcelona',
    icon: '🔵🔴',
    category: 'teams',
    rarity: 'rare'
  },
  {
    type: 'BLUE_MOON',
    name: 'Blue Moon',
    description: 'Win 10 matches with Manchester City',
    icon: '🌙',
    category: 'teams',
    rarity: 'rare'
  },
  {
    type: 'YOULL_NEVER_WALK_ALONE',
    name: "You'll Never Walk Alone",
    description: 'Win 10 matches with Liverpool',
    icon: '🔴',
    category: 'teams',
    rarity: 'rare'
  },
  {
    type: 'MIA_SAN_MIA',
    name: 'Mia San Mia',
    description: 'Win 10 matches with Bayern Munich',
    icon: '🔴⚪',
    category: 'teams',
    rarity: 'rare'
  },

  // ============ SHAME / LOSING ============
  {
    type: 'ROCK_BOTTOM',
    name: 'Rock Bottom',
    description: '5 losses in a row',
    icon: '📉',
    category: 'shame',
    rarity: 'uncommon'
  },
  {
    type: 'FREE_FALL',
    name: 'Free Fall',
    description: '7 losses in a row',
    icon: '🕳️',
    category: 'shame',
    rarity: 'rare'
  },
  {
    type: 'BOTTLEJOB',
    name: 'Bottlejob',
    description: '10 losses in a row',
    icon: '🍼',
    category: 'shame',
    rarity: 'epic'
  },
  {
    type: 'HUMILIATED',
    name: 'Humiliated',
    description: 'Lose by 5+ goals',
    icon: '😭',
    category: 'shame',
    rarity: 'common'
  },
  {
    type: 'DESTROYED',
    name: 'Destroyed',
    description: 'Lose by 7+ goals',
    icon: '💔',
    category: 'shame',
    rarity: 'uncommon'
  },
  {
    type: 'OBLITERATED',
    name: 'Obliterated',
    description: 'Lose by 10+ goals',
    icon: '🪦',
    category: 'shame',
    rarity: 'rare'
  },
  {
    type: 'CHOKER',
    name: 'Choker',
    description: 'Lose after leading by 3+ goals',
    icon: '🤮',
    category: 'shame',
    rarity: 'rare'
  },
  {
    type: 'LEAKY_DEFENSE',
    name: 'Leaky Defense',
    description: 'Concede 5+ goals in a match',
    icon: '🚰',
    category: 'shame',
    rarity: 'common'
  },
  {
    type: 'SWISS_CHEESE',
    name: 'Swiss Cheese',
    description: 'Concede 7+ goals in a match',
    icon: '🧀',
    category: 'shame',
    rarity: 'uncommon'
  },
  {
    type: 'WHAT_IS_DEFENSE',
    name: 'What is Defense?',
    description: 'Concede 10+ goals in a match',
    icon: '🤷',
    category: 'shame',
    rarity: 'rare'
  },
  {
    type: 'PARTICIPATION_TROPHY',
    name: 'Participation Trophy',
    description: 'Lose 10 matches total',
    icon: '🥉',
    category: 'shame',
    rarity: 'common'
  },
  {
    type: 'FREQUENT_LOSER',
    name: 'Frequent Loser',
    description: 'Lose 25 matches total',
    icon: '😞',
    category: 'shame',
    rarity: 'uncommon'
  },
  {
    type: 'PROFESSIONAL_LOSER',
    name: 'Professional Loser',
    description: 'Lose 50 matches total',
    icon: '🎓',
    category: 'shame',
    rarity: 'rare'
  },
  {
    type: 'PENALTY_BOTTLER',
    name: 'Penalty Bottler',
    description: 'Lose a match on penalties',
    icon: '❌',
    category: 'shame',
    rarity: 'common'
  },
  {
    type: 'SERIAL_BOTTLER',
    name: 'Serial Bottler',
    description: 'Lose 3 matches on penalties',
    icon: '🧴',
    category: 'shame',
    rarity: 'uncommon'
  },

  // ============ FUN / SPECIAL ============
  {
    type: 'FIRST_MATCH',
    name: 'First Match',
    description: 'Play your first match',
    icon: '🎮',
    category: 'milestones',
    rarity: 'common'
  },
  {
    type: 'RIVALRY_BEGINS',
    name: 'Rivalry Begins',
    description: 'Play 10 matches total',
    icon: '🤝',
    category: 'milestones',
    rarity: 'common'
  },
  {
    type: 'HEATED_RIVALRY',
    name: 'Heated Rivalry',
    description: 'Play 50 matches total',
    icon: '🔥',
    category: 'milestones',
    rarity: 'uncommon'
  },
  {
    type: 'ETERNAL_RIVALS',
    name: 'Eternal Rivals',
    description: 'Play 100 matches total',
    icon: '♾️',
    category: 'milestones',
    rarity: 'rare'
  },
  {
    type: 'FLIP_FLOPPER',
    name: 'Flip Flopper',
    description: 'Alternate between win and loss for 6 matches',
    icon: '🔄',
    category: 'special',
    rarity: 'rare'
  },
  {
    type: 'DRAW_SPECIALIST',
    name: 'Draw Specialist',
    description: 'Draw 3 matches in a row',
    icon: '🤷‍♂️',
    category: 'special',
    rarity: 'rare'
  },
  {
    type: 'NOBODY_WINS',
    name: 'Nobody Wins',
    description: 'Draw 5 matches total',
    icon: '🤝',
    category: 'special',
    rarity: 'uncommon'
  },
  {
    type: 'EVEN_STEVEN',
    name: 'Even Steven',
    description: 'Have exactly equal wins with your rival',
    icon: '⚖️',
    category: 'special',
    rarity: 'rare'
  },
  {
    type: 'NIGHT_OWL',
    name: 'Night Owl',
    description: 'Play a match after midnight',
    icon: '🦉',
    category: 'special',
    rarity: 'uncommon'
  },
  {
    type: 'WEEKEND_WARRIOR',
    name: 'Weekend Warrior',
    description: 'Play 5 matches on weekends',
    icon: '🎉',
    category: 'special',
    rarity: 'common'
  },
  {
    type: 'MARATHON_SESSION',
    name: 'Marathon Session',
    description: 'Play 5 matches in one day',
    icon: '🏃‍♂️',
    category: 'special',
    rarity: 'uncommon'
  },
  {
    type: 'LUCKY_SEVEN',
    name: 'Lucky Seven',
    description: 'Win a match 7-0',
    icon: '7️⃣',
    category: 'special',
    rarity: 'rare'
  },
  {
    type: 'DOUBLE_TROUBLE',
    name: 'Double Trouble',
    description: 'Both players score 3+ goals (you win)',
    icon: '👯',
    category: 'special',
    rarity: 'uncommon'
  },
  {
    type: 'REVENGE',
    name: 'Revenge',
    description: 'Win immediately after a loss',
    icon: '😤',
    category: 'special',
    rarity: 'common'
  },
  {
    type: 'SWEET_REVENGE',
    name: 'Sweet Revenge',
    description: 'Win by 3+ after losing by 3+ in previous match',
    icon: '😈',
    category: 'special',
    rarity: 'rare'
  },
  {
    type: 'SAME_TEAMS_DIFFERENT_RESULT',
    name: 'Same Teams Different Result',
    description: 'Win rematch with exact same teams after losing',
    icon: '🔁',
    category: 'special',
    rarity: 'uncommon'
  }
]

export function getAchievementInfo(type: string): AchievementType | undefined {
  return achievementTypes.find(a => a.type === type)
}

export function getAchievementsByCategory(category: AchievementType['category']): AchievementType[] {
  return achievementTypes.filter(a => a.category === category)
}

export function getAchievementsByRarity(rarity: AchievementType['rarity']): AchievementType[] {
  return achievementTypes.filter(a => a.rarity === rarity)
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
 * Check if match is a draw
 */
function isDraw(match: Match): boolean {
  return match.player1Score === match.player2Score
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
 * Get player's team ID in a match
 */
function getPlayerTeamId(match: Match, playerId: number): number {
  return match.player1Id === playerId ? match.player1TeamId : match.player2TeamId
}

/**
 * Get opponent's team ID in a match
 */
function getOpponentTeamId(match: Match, playerId: number): number {
  return match.player1Id === playerId ? match.player2TeamId : match.player1TeamId
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

  const playerScore = getPlayerScore(currentMatch, playerId)
  const opponentScore = getOpponentScore(currentMatch, playerId)
  const scoreDiff = playerScore - opponentScore
  const totalGoals = playerScore + opponentScore
  const won = isWinner(currentMatch, playerId)
  const lost = isLoser(currentMatch, playerId)
  const drew = isDraw(currentMatch)

  // Get stats
  const totalWins = playerMatches.filter(m => isWinner(m, playerId)).length
  const totalLosses = playerMatches.filter(m => isLoser(m, playerId)).length
  const totalDraws = playerMatches.filter(m => isDraw(m)).length
  const totalGoalsScored = playerMatches.reduce((sum, m) => sum + getPlayerScore(m, playerId), 0)
  const totalMatchesPlayed = playerMatches.length

  // Get winning teams
  const winningTeams = new Set(
    playerMatches
      .filter(m => isWinner(m, playerId))
      .map(m => getPlayerTeamId(m, playerId))
  )

  // Get clean sheets
  const cleanSheets = playerMatches.filter(
    m => isWinner(m, playerId) && getOpponentScore(m, playerId) === 0
  ).length

  // ============ WIN STREAK ACHIEVEMENTS ============
  const countWinStreak = () => {
    let streak = 0
    for (const match of playerMatches) {
      if (isWinner(match, playerId)) streak++
      else break
    }
    return streak
  }
  const winStreak = countWinStreak()

  if (!hasAchievement('ON_FIRE') && winStreak >= 3) {
    newAchievements.push('ON_FIRE')
  }
  if (!hasAchievement('UNSTOPPABLE') && winStreak >= 5) {
    newAchievements.push('UNSTOPPABLE')
  }
  if (!hasAchievement('DOMINATION') && winStreak >= 7) {
    newAchievements.push('DOMINATION')
  }
  if (!hasAchievement('LEGENDARY_RUN') && winStreak >= 10) {
    newAchievements.push('LEGENDARY_RUN')
  }
  if (!hasAchievement('IMMORTAL') && winStreak >= 15) {
    newAchievements.push('IMMORTAL')
  }

  // ============ LOSS STREAK ACHIEVEMENTS ============
  const countLossStreak = () => {
    let streak = 0
    for (const match of playerMatches) {
      if (isLoser(match, playerId)) streak++
      else break
    }
    return streak
  }
  const lossStreak = countLossStreak()

  if (!hasAchievement('ROCK_BOTTOM') && lossStreak >= 5) {
    newAchievements.push('ROCK_BOTTOM')
  }
  if (!hasAchievement('FREE_FALL') && lossStreak >= 7) {
    newAchievements.push('FREE_FALL')
  }
  if (!hasAchievement('BOTTLEJOB') && lossStreak >= 10) {
    newAchievements.push('BOTTLEJOB')
  }

  // ============ GOAL SCORING ACHIEVEMENTS ============
  if (!hasAchievement('HAT_TRICK_HERO') && playerScore === 3) {
    newAchievements.push('HAT_TRICK_HERO')
  }
  if (!hasAchievement('SNIPER') && playerScore >= 5) {
    newAchievements.push('SNIPER')
  }
  if (!hasAchievement('GOAL_MACHINE') && playerScore >= 7) {
    newAchievements.push('GOAL_MACHINE')
  }
  if (!hasAchievement('DOUBLE_DIGITS') && playerScore >= 10) {
    newAchievements.push('DOUBLE_DIGITS')
  }
  if (!hasAchievement('CENTURY_SCORER') && totalGoalsScored >= 100) {
    newAchievements.push('CENTURY_SCORER')
  }
  if (!hasAchievement('GOAL_LEGEND') && totalGoalsScored >= 250) {
    newAchievements.push('GOAL_LEGEND')
  }
  if (!hasAchievement('GOLDEN_BOOT') && totalGoalsScored >= 500) {
    newAchievements.push('GOLDEN_BOOT')
  }

  // ============ DEFENSE ACHIEVEMENTS ============
  if (!hasAchievement('THE_WALL') && won && opponentScore === 0) {
    newAchievements.push('THE_WALL')
  }
  if (!hasAchievement('FORTRESS') && cleanSheets >= 3) {
    newAchievements.push('FORTRESS')
  }
  if (!hasAchievement('IMPENETRABLE') && cleanSheets >= 5) {
    newAchievements.push('IMPENETRABLE')
  }
  // Clean sheet streak
  if (!hasAchievement('CLEAN_SHEET_STREAK') && playerMatches.length >= 2) {
    const lastTwo = playerMatches.slice(0, 2)
    if (lastTwo.every(m => isWinner(m, playerId) && getOpponentScore(m, playerId) === 0)) {
      newAchievements.push('CLEAN_SHEET_STREAK')
    }
  }

  // ============ WIN BY MARGIN ACHIEVEMENTS ============
  if (!hasAchievement('NAIL_BITER') && won && scoreDiff === 1) {
    newAchievements.push('NAIL_BITER')
  }
  if (!hasAchievement('DEMOLITION') && won && scoreDiff >= 5) {
    newAchievements.push('DEMOLITION')
  }
  if (!hasAchievement('MASSACRE') && won && scoreDiff >= 7) {
    newAchievements.push('MASSACRE')
  }
  if (!hasAchievement('ANNIHILATION') && won && scoreDiff >= 10) {
    newAchievements.push('ANNIHILATION')
  }
  // Clutch master - 5 wins by 1 goal
  if (!hasAchievement('CLUTCH_MASTER')) {
    const oneGoalWins = playerMatches.filter(m =>
      isWinner(m, playerId) &&
      Math.abs(getPlayerScore(m, playerId) - getOpponentScore(m, playerId)) === 1
    ).length
    if (oneGoalWins >= 5) {
      newAchievements.push('CLUTCH_MASTER')
    }
  }

  // ============ WIN MILESTONE ACHIEVEMENTS ============
  if (!hasAchievement('FIRST_BLOOD') && totalWins >= 1) {
    newAchievements.push('FIRST_BLOOD')
  }
  if (!hasAchievement('GETTING_STARTED') && totalWins >= 5) {
    newAchievements.push('GETTING_STARTED')
  }
  if (!hasAchievement('COMPETITOR') && totalWins >= 10) {
    newAchievements.push('COMPETITOR')
  }
  if (!hasAchievement('VETERAN') && totalWins >= 25) {
    newAchievements.push('VETERAN')
  }
  if (!hasAchievement('CHAMPION') && totalWins >= 50) {
    newAchievements.push('CHAMPION')
  }
  if (!hasAchievement('ELITE') && totalWins >= 75) {
    newAchievements.push('ELITE')
  }
  if (!hasAchievement('GOAT') && totalWins >= 100) {
    newAchievements.push('GOAT')
  }

  // ============ MATCH MILESTONE ACHIEVEMENTS ============
  if (!hasAchievement('FIRST_MATCH') && totalMatchesPlayed >= 1) {
    newAchievements.push('FIRST_MATCH')
  }
  if (!hasAchievement('RIVALRY_BEGINS') && totalMatchesPlayed >= 10) {
    newAchievements.push('RIVALRY_BEGINS')
  }
  if (!hasAchievement('HEATED_RIVALRY') && totalMatchesPlayed >= 50) {
    newAchievements.push('HEATED_RIVALRY')
  }
  if (!hasAchievement('ETERNAL_RIVALS') && totalMatchesPlayed >= 100) {
    newAchievements.push('ETERNAL_RIVALS')
  }

  // ============ TEAM VARIETY ACHIEVEMENTS ============
  if (!hasAchievement('VARIETY_PACK') && winningTeams.size >= 5) {
    newAchievements.push('VARIETY_PACK')
  }
  if (!hasAchievement('WELL_TRAVELED') && winningTeams.size >= 10) {
    newAchievements.push('WELL_TRAVELED')
  }
  if (!hasAchievement('GLOBETROTTER') && winningTeams.size >= 20) {
    newAchievements.push('GLOBETROTTER')
  }
  if (!hasAchievement('MASTER_OF_ALL') && winningTeams.size >= 30) {
    newAchievements.push('MASTER_OF_ALL')
  }

  // ============ TEAM LOYALTY ACHIEVEMENTS ============
  const teamWinCounts = new Map<number, number>()
  playerMatches.filter(m => isWinner(m, playerId)).forEach(m => {
    const teamId = getPlayerTeamId(m, playerId)
    teamWinCounts.set(teamId, (teamWinCounts.get(teamId) || 0) + 1)
  })
  const maxTeamWins = Math.max(...Array.from(teamWinCounts.values()), 0)

  if (!hasAchievement('LOYAL_FAN') && maxTeamWins >= 5) {
    newAchievements.push('LOYAL_FAN')
  }
  if (!hasAchievement('DIE_HARD') && maxTeamWins >= 10) {
    newAchievements.push('DIE_HARD')
  }
  if (!hasAchievement('ONE_CLUB_PLAYER') && maxTeamWins >= 20) {
    newAchievements.push('ONE_CLUB_PLAYER')
  }

  // ============ LEAGUE MASTER ACHIEVEMENTS ============
  const getLeagueWinningTeams = (league: string) => {
    const leagueTeamIds = teams.filter(t => t.league === league).map(t => t.id)
    return new Set(
      playerMatches
        .filter(m => isWinner(m, playerId) && leagueTeamIds.includes(getPlayerTeamId(m, playerId)))
        .map(m => getPlayerTeamId(m, playerId))
    )
  }

  if (!hasAchievement('LA_LIGA_MASTER') && getLeagueWinningTeams('La Liga').size >= 3) {
    newAchievements.push('LA_LIGA_MASTER')
  }
  if (!hasAchievement('PREMIER_LEAGUE_MASTER') && getLeagueWinningTeams('Premier League').size >= 5) {
    newAchievements.push('PREMIER_LEAGUE_MASTER')
  }
  if (!hasAchievement('BUNDESLIGA_MASTER') && getLeagueWinningTeams('Bundesliga').size >= 3) {
    newAchievements.push('BUNDESLIGA_MASTER')
  }
  if (!hasAchievement('SERIE_A_MASTER') && getLeagueWinningTeams('Serie A').size >= 4) {
    newAchievements.push('SERIE_A_MASTER')
  }
  if (!hasAchievement('LIGUE_1_MASTER') && getLeagueWinningTeams('Ligue 1').size >= 3) {
    newAchievements.push('LIGUE_1_MASTER')
  }

  // ============ GIANT KILLER ACHIEVEMENTS ============
  if (won) {
    const playerTeam = getTeamById(getPlayerTeamId(currentMatch, playerId))
    const opponentTeam = getTeamById(getOpponentTeamId(currentMatch, playerId))
    if (playerTeam && opponentTeam) {
      const ratingDiff = opponentTeam.rating - playerTeam.rating
      if (!hasAchievement('GIANT_KILLER') && ratingDiff >= 3) {
        newAchievements.push('GIANT_KILLER')
      }
      if (!hasAchievement('DAVID_VS_GOLIATH') && ratingDiff >= 5) {
        newAchievements.push('DAVID_VS_GOLIATH')
      }
      if (!hasAchievement('MIRACLE_WORKER') && ratingDiff >= 7) {
        newAchievements.push('MIRACLE_WORKER')
      }
    }
  }

  // ============ SPECIFIC SCORELINE ACHIEVEMENTS ============
  if (!hasAchievement('PERFECT_GAME') && won && playerScore === 5 && opponentScore === 0) {
    newAchievements.push('PERFECT_GAME')
  }
  if (!hasAchievement('THE_CLASSIC') && won && playerScore === 2 && opponentScore === 1) {
    newAchievements.push('THE_CLASSIC')
  }
  if (!hasAchievement('CRICKET_SCORE') && totalGoals > 10) {
    newAchievements.push('CRICKET_SCORE')
  }
  if (!hasAchievement('THRILLER') && won && totalGoals >= 8) {
    newAchievements.push('THRILLER')
  }
  if (!hasAchievement('LUCKY_SEVEN') && won && playerScore === 7 && opponentScore === 0) {
    newAchievements.push('LUCKY_SEVEN')
  }
  if (!hasAchievement('DOUBLE_TROUBLE') && won && playerScore >= 3 && opponentScore >= 3) {
    newAchievements.push('DOUBLE_TROUBLE')
  }

  // ============ EXTRA TIME & PENALTIES ============
  if (!hasAchievement('EXTRA_TIME_HERO') && won && currentMatch.extraTime) {
    newAchievements.push('EXTRA_TIME_HERO')
  }
  if (!hasAchievement('PENALTY_KING') && won && currentMatch.penalties) {
    newAchievements.push('PENALTY_KING')
  }

  // Count penalty wins
  const penaltyWins = playerMatches.filter(m => isWinner(m, playerId) && m.penalties).length
  if (!hasAchievement('NERVES_OF_STEEL') && penaltyWins >= 3) {
    newAchievements.push('NERVES_OF_STEEL')
  }

  // Drama king - ET or penalties
  const dramaWins = playerMatches.filter(m =>
    isWinner(m, playerId) && (m.extraTime || m.penalties)
  ).length
  if (!hasAchievement('DRAMA_KING') && dramaWins >= 5) {
    newAchievements.push('DRAMA_KING')
  }

  // ============ SHAME ACHIEVEMENTS ============
  if (!hasAchievement('HUMILIATED') && lost && scoreDiff <= -5) {
    newAchievements.push('HUMILIATED')
  }
  if (!hasAchievement('DESTROYED') && lost && scoreDiff <= -7) {
    newAchievements.push('DESTROYED')
  }
  if (!hasAchievement('OBLITERATED') && lost && scoreDiff <= -10) {
    newAchievements.push('OBLITERATED')
  }
  if (!hasAchievement('LEAKY_DEFENSE') && opponentScore >= 5) {
    newAchievements.push('LEAKY_DEFENSE')
  }
  if (!hasAchievement('SWISS_CHEESE') && opponentScore >= 7) {
    newAchievements.push('SWISS_CHEESE')
  }
  if (!hasAchievement('WHAT_IS_DEFENSE') && opponentScore >= 10) {
    newAchievements.push('WHAT_IS_DEFENSE')
  }
  if (!hasAchievement('PARTICIPATION_TROPHY') && totalLosses >= 10) {
    newAchievements.push('PARTICIPATION_TROPHY')
  }
  if (!hasAchievement('FREQUENT_LOSER') && totalLosses >= 25) {
    newAchievements.push('FREQUENT_LOSER')
  }
  if (!hasAchievement('PROFESSIONAL_LOSER') && totalLosses >= 50) {
    newAchievements.push('PROFESSIONAL_LOSER')
  }
  if (!hasAchievement('PENALTY_BOTTLER') && lost && currentMatch.penalties) {
    newAchievements.push('PENALTY_BOTTLER')
  }

  // Serial bottler - 3 penalty losses
  const penaltyLosses = playerMatches.filter(m => isLoser(m, playerId) && m.penalties).length
  if (!hasAchievement('SERIAL_BOTTLER') && penaltyLosses >= 3) {
    newAchievements.push('SERIAL_BOTTLER')
  }

  // ============ DRAW ACHIEVEMENTS ============
  if (!hasAchievement('NOBODY_WINS') && totalDraws >= 5) {
    newAchievements.push('NOBODY_WINS')
  }
  // Draw streak
  if (!hasAchievement('DRAW_SPECIALIST') && playerMatches.length >= 3) {
    const lastThree = playerMatches.slice(0, 3)
    if (lastThree.every(m => isDraw(m))) {
      newAchievements.push('DRAW_SPECIALIST')
    }
  }

  // ============ REVENGE ACHIEVEMENT ============
  if (!hasAchievement('REVENGE') && won && playerMatches.length >= 2) {
    const previousMatch = playerMatches[1]
    if (isLoser(previousMatch, playerId)) {
      newAchievements.push('REVENGE')
    }
  }

  // Sweet revenge
  if (!hasAchievement('SWEET_REVENGE') && won && scoreDiff >= 3 && playerMatches.length >= 2) {
    const previousMatch = playerMatches[1]
    const prevDiff = getPlayerScore(previousMatch, playerId) - getOpponentScore(previousMatch, playerId)
    if (isLoser(previousMatch, playerId) && prevDiff <= -3) {
      newAchievements.push('SWEET_REVENGE')
    }
  }

  // ============ SPECIFIC TEAM ACHIEVEMENTS ============
  // El Clasico Winner
  if (!hasAchievement('EL_CLASICO_WINNER') && won) {
    const teamId = getPlayerTeamId(currentMatch, playerId)
    if (teamId === 1 || teamId === 2) { // Real Madrid or Barcelona
      newAchievements.push('EL_CLASICO_WINNER')
    }
  }

  // Team-specific 10 win achievements
  const realMadridWins = teamWinCounts.get(1) || 0
  const barcelonaWins = teamWinCounts.get(2) || 0
  const manCityWins = teamWinCounts.get(6) || 0
  const liverpoolWins = teamWinCounts.get(7) || 0
  const bayernWins = teamWinCounts.get(16) || 0

  if (!hasAchievement('GALACTICO') && realMadridWins >= 10) {
    newAchievements.push('GALACTICO')
  }
  if (!hasAchievement('TIKI_TAKA') && barcelonaWins >= 10) {
    newAchievements.push('TIKI_TAKA')
  }
  if (!hasAchievement('BLUE_MOON') && manCityWins >= 10) {
    newAchievements.push('BLUE_MOON')
  }
  if (!hasAchievement('YOULL_NEVER_WALK_ALONE') && liverpoolWins >= 10) {
    newAchievements.push('YOULL_NEVER_WALK_ALONE')
  }
  if (!hasAchievement('MIA_SAN_MIA') && bayernWins >= 10) {
    newAchievements.push('MIA_SAN_MIA')
  }

  // ============ EVEN STEVEN ============
  if (!hasAchievement('EVEN_STEVEN') && totalWins === totalLosses && totalWins > 0) {
    newAchievements.push('EVEN_STEVEN')
  }

  return newAchievements
}
