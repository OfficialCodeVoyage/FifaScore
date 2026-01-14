import {
  readDatabase,
  getPlayers as dbGetPlayers,
  getPlayer as dbGetPlayer,
  getMatches as dbGetMatches,
  getMatch as dbGetMatch,
  addMatch as dbAddMatch,
  getComments as dbGetComments,
  addComment as dbAddComment,
  getAchievements as dbGetAchievements,
  addAchievement,
  initializeDatabase,
  AddMatchData
} from './db'
import { Player, Match, Comment, Achievement } from './data'
import { teams, getTeamById } from './teams'
import { checkAchievements } from './achievements'

// Re-export AddMatchData for API routes
export type { AddMatchData } from './db'

// ============ Database Initialization ============

export async function ensureDatabase(): Promise<void> {
  await initializeDatabase()
}

// ============ Players ============

export async function getPlayers(): Promise<Player[]> {
  return dbGetPlayers()
}

export async function getPlayer(id: number): Promise<Player | undefined> {
  return dbGetPlayer(id)
}

// ============ Teams ============

export function getTeams() {
  return teams
}

// ============ Matches ============

export async function getMatches(): Promise<Match[]> {
  return dbGetMatches()
}

export async function getMatch(id: number): Promise<Match | undefined> {
  return dbGetMatch(id)
}

export async function addMatch(data: AddMatchData): Promise<Match> {
  return dbAddMatch(data)
}

// ============ Player Stats ============

export interface PlayerStats {
  playerId: number
  playerName: string
  wins: number
  losses: number
  draws: number
  goalsScored: number
  goalsConceded: number
  cleanSheets: number
  matchesPlayed: number
  winRate: number
  avgGoalsScored: number
  avgGoalsConceded: number
  currentStreak: { type: 'win' | 'loss' | 'draw', count: number }
  bestStreak: number
  worstStreak: number
  favoriteTeam: { teamId: number, teamName: string, timesUsed: number } | null
  mostUsedTeams: { teamId: number, teamName: string, timesUsed: number }[]
}

export async function getPlayerStats(playerId: number): Promise<PlayerStats | null> {
  const db = await readDatabase()
  const player = db.players.find(p => p.id === playerId)

  if (!player) return null

  const playerMatches = db.matches.filter(
    m => m.player1Id === playerId || m.player2Id === playerId
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  let wins = 0
  let losses = 0
  let draws = 0
  let goalsScored = 0
  let goalsConceded = 0
  let cleanSheets = 0

  const teamUsage: Record<number, number> = {}

  // Streak tracking
  let currentStreak = { type: 'win' as 'win' | 'loss' | 'draw', count: 0 }
  let bestStreak = 0
  let worstStreak = 0
  let tempWinStreak = 0
  let tempLossStreak = 0

  for (const match of playerMatches) {
    const isPlayer1 = match.player1Id === playerId
    const playerScore = isPlayer1 ? match.player1Score : match.player2Score
    const opponentScore = isPlayer1 ? match.player2Score : match.player1Score
    const playerTeamId = isPlayer1 ? match.player1TeamId : match.player2TeamId

    goalsScored += playerScore
    goalsConceded += opponentScore

    if (opponentScore === 0) cleanSheets++

    teamUsage[playerTeamId] = (teamUsage[playerTeamId] || 0) + 1

    if (playerScore > opponentScore) {
      wins++
      tempWinStreak++
      tempLossStreak = 0
      bestStreak = Math.max(bestStreak, tempWinStreak)
    } else if (playerScore < opponentScore) {
      losses++
      tempLossStreak++
      tempWinStreak = 0
      worstStreak = Math.max(worstStreak, tempLossStreak)
    } else {
      draws++
      tempWinStreak = 0
      tempLossStreak = 0
    }
  }

  // Calculate current streak from most recent matches
  const recentMatches = [...playerMatches].reverse()
  if (recentMatches.length > 0) {
    const firstMatch = recentMatches[0]
    const isPlayer1 = firstMatch.player1Id === playerId
    const playerScore = isPlayer1 ? firstMatch.player1Score : firstMatch.player2Score
    const opponentScore = isPlayer1 ? firstMatch.player2Score : firstMatch.player1Score

    if (playerScore > opponentScore) {
      currentStreak.type = 'win'
    } else if (playerScore < opponentScore) {
      currentStreak.type = 'loss'
    } else {
      currentStreak.type = 'draw'
    }

    currentStreak.count = 1

    for (let i = 1; i < recentMatches.length; i++) {
      const match = recentMatches[i]
      const isP1 = match.player1Id === playerId
      const pScore = isP1 ? match.player1Score : match.player2Score
      const oScore = isP1 ? match.player2Score : match.player1Score

      let matchResult: 'win' | 'loss' | 'draw'
      if (pScore > oScore) matchResult = 'win'
      else if (pScore < oScore) matchResult = 'loss'
      else matchResult = 'draw'

      if (matchResult === currentStreak.type) {
        currentStreak.count++
      } else {
        break
      }
    }
  }

  // Get most used teams
  const mostUsedTeams = Object.entries(teamUsage)
    .map(([teamId, count]) => {
      const team = getTeamById(parseInt(teamId))
      return {
        teamId: parseInt(teamId),
        teamName: team?.name || 'Unknown',
        timesUsed: count
      }
    })
    .sort((a, b) => b.timesUsed - a.timesUsed)

  const matchesPlayed = playerMatches.length

  return {
    playerId,
    playerName: player.name,
    wins,
    losses,
    draws,
    goalsScored,
    goalsConceded,
    cleanSheets,
    matchesPlayed,
    winRate: matchesPlayed > 0 ? Math.round((wins / matchesPlayed) * 100) : 0,
    avgGoalsScored: matchesPlayed > 0 ? Math.round((goalsScored / matchesPlayed) * 10) / 10 : 0,
    avgGoalsConceded: matchesPlayed > 0 ? Math.round((goalsConceded / matchesPlayed) * 10) / 10 : 0,
    currentStreak,
    bestStreak,
    worstStreak,
    favoriteTeam: mostUsedTeams[0] || null,
    mostUsedTeams: mostUsedTeams.slice(0, 5)
  }
}

// ============ Head to Head ============

export interface HeadToHead {
  player1: Player
  player2: Player
  player1Wins: number
  player2Wins: number
  draws: number
  totalMatches: number
  player1Goals: number
  player2Goals: number
  recentMatches: Match[]
}

export async function getHeadToHead(): Promise<HeadToHead | null> {
  const db = await readDatabase()

  if (db.players.length < 2) return null

  const player1 = db.players[0]
  const player2 = db.players[1]

  const h2hMatches = db.matches.filter(
    m => (m.player1Id === player1.id && m.player2Id === player2.id) ||
         (m.player1Id === player2.id && m.player2Id === player1.id)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  let player1Wins = 0
  let player2Wins = 0
  let draws = 0
  let player1Goals = 0
  let player2Goals = 0

  for (const match of h2hMatches) {
    const p1Score = match.player1Id === player1.id ? match.player1Score : match.player2Score
    const p2Score = match.player1Id === player1.id ? match.player2Score : match.player1Score

    player1Goals += p1Score
    player2Goals += p2Score

    if (p1Score > p2Score) player1Wins++
    else if (p2Score > p1Score) player2Wins++
    else draws++
  }

  return {
    player1,
    player2,
    player1Wins,
    player2Wins,
    draws,
    totalMatches: h2hMatches.length,
    player1Goals,
    player2Goals,
    recentMatches: h2hMatches.slice(0, 5)
  }
}

// ============ Achievements ============

export async function getAchievements(playerId?: number): Promise<Achievement[]> {
  return dbGetAchievements(playerId)
}

export async function checkAndUnlockAchievements(playerId: number, matchId: number): Promise<Achievement[]> {
  const db = await readDatabase()

  const newAchievementTypes = checkAchievements(
    playerId,
    matchId,
    db.matches,
    db.achievements
  )

  const newAchievements: Achievement[] = []

  for (const type of newAchievementTypes) {
    const achievement = await addAchievement(playerId, type, matchId)
    newAchievements.push(achievement)
  }

  return newAchievements
}

// ============ Comments ============

export async function getComments(matchId: number): Promise<Comment[]> {
  return dbGetComments(matchId)
}

export async function addComment(matchId: number, playerId: number, content: string): Promise<Comment> {
  return dbAddComment(matchId, playerId, content)
}

// ============ Full Stats Object ============

export interface FullStats {
  headToHead: HeadToHead | null
  player1Stats: PlayerStats | null
  player2Stats: PlayerStats | null
  recentMatches: Match[]
  totalMatches: number
}

export async function getFullStats(): Promise<FullStats> {
  const db = await readDatabase()
  const player1 = db.players[0]
  const player2 = db.players[1]

  const [headToHead, player1Stats, player2Stats, recentMatches] = await Promise.all([
    getHeadToHead(),
    player1 ? getPlayerStats(player1.id) : null,
    player2 ? getPlayerStats(player2.id) : null,
    getMatches()
  ])

  return {
    headToHead,
    player1Stats,
    player2Stats,
    recentMatches: recentMatches.slice(0, 10),
    totalMatches: db.matches.length
  }
}
