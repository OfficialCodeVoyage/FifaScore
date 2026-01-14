import { sql } from '@vercel/postgres'
import { Database, Player, Match, Comment, Achievement, defaultDatabase } from './data'

/**
 * Initialize database tables if they don't exist
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Create players table
    await sql`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        avatar VARCHAR(500) NOT NULL
      )
    `

    // Create matches table
    await sql`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        player1_id INTEGER NOT NULL,
        player2_id INTEGER NOT NULL,
        player1_score INTEGER NOT NULL DEFAULT 0,
        player2_score INTEGER NOT NULL DEFAULT 0,
        player1_team_id INTEGER NOT NULL,
        player2_team_id INTEGER NOT NULL,
        extra_time BOOLEAN DEFAULT FALSE,
        penalties BOOLEAN DEFAULT FALSE
      )
    `

    // Create comments table
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        match_id INTEGER NOT NULL,
        player_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create achievements table
    await sql`
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        player_id INTEGER NOT NULL,
        type VARCHAR(100) NOT NULL,
        unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        match_id INTEGER NOT NULL
      )
    `

    // Seed default players if none exist
    const { rows: existingPlayers } = await sql`SELECT COUNT(*) as count FROM players`
    if (parseInt(existingPlayers[0].count) === 0) {
      for (const player of defaultDatabase.players) {
        await sql`
          INSERT INTO players (id, name, avatar)
          VALUES (${player.id}, ${player.name}, ${player.avatar})
        `
      }
    } else {
      // Update existing players with correct avatars
      for (const player of defaultDatabase.players) {
        await sql`
          UPDATE players
          SET avatar = ${player.avatar}, name = ${player.name}
          WHERE id = ${player.id}
        `
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

// ============ Players ============

export async function getPlayers(): Promise<Player[]> {
  try {
    const { rows } = await sql`SELECT * FROM players ORDER BY id`
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      avatar: row.avatar
    }))
  } catch (error) {
    console.error('Error getting players:', error)
    return defaultDatabase.players
  }
}

export async function getPlayer(id: number): Promise<Player | undefined> {
  try {
    const { rows } = await sql`SELECT * FROM players WHERE id = ${id}`
    if (rows.length === 0) return undefined
    return {
      id: rows[0].id,
      name: rows[0].name,
      avatar: rows[0].avatar
    }
  } catch (error) {
    console.error('Error getting player:', error)
    return undefined
  }
}

// ============ Matches ============

export async function getMatches(): Promise<Match[]> {
  try {
    const { rows } = await sql`SELECT * FROM matches ORDER BY date DESC`
    return rows.map(row => ({
      id: row.id,
      date: row.date instanceof Date ? row.date.toISOString() : row.date,
      player1Id: row.player1_id,
      player2Id: row.player2_id,
      player1Score: row.player1_score,
      player2Score: row.player2_score,
      player1TeamId: row.player1_team_id,
      player2TeamId: row.player2_team_id,
      extraTime: row.extra_time,
      penalties: row.penalties
    }))
  } catch (error) {
    console.error('Error getting matches:', error)
    return []
  }
}

export async function getMatch(id: number): Promise<Match | undefined> {
  try {
    const { rows } = await sql`SELECT * FROM matches WHERE id = ${id}`
    if (rows.length === 0) return undefined
    const row = rows[0]
    return {
      id: row.id,
      date: row.date instanceof Date ? row.date.toISOString() : row.date,
      player1Id: row.player1_id,
      player2Id: row.player2_id,
      player1Score: row.player1_score,
      player2Score: row.player2_score,
      player1TeamId: row.player1_team_id,
      player2TeamId: row.player2_team_id,
      extraTime: row.extra_time,
      penalties: row.penalties
    }
  } catch (error) {
    console.error('Error getting match:', error)
    return undefined
  }
}

export interface AddMatchData {
  player1Id: number
  player2Id: number
  player1Score: number
  player2Score: number
  player1TeamId: number
  player2TeamId: number
  extraTime?: boolean
  penalties?: boolean
}

export async function addMatch(data: AddMatchData): Promise<Match> {
  const { rows } = await sql`
    INSERT INTO matches (player1_id, player2_id, player1_score, player2_score, player1_team_id, player2_team_id, extra_time, penalties)
    VALUES (${data.player1Id}, ${data.player2Id}, ${data.player1Score}, ${data.player2Score}, ${data.player1TeamId}, ${data.player2TeamId}, ${data.extraTime || false}, ${data.penalties || false})
    RETURNING *
  `
  const row = rows[0]
  return {
    id: row.id,
    date: row.date instanceof Date ? row.date.toISOString() : row.date,
    player1Id: row.player1_id,
    player2Id: row.player2_id,
    player1Score: row.player1_score,
    player2Score: row.player2_score,
    player1TeamId: row.player1_team_id,
    player2TeamId: row.player2_team_id,
    extraTime: row.extra_time,
    penalties: row.penalties
  }
}

export async function deleteMatch(id: number): Promise<boolean> {
  try {
    // Delete related comments first
    await sql`DELETE FROM comments WHERE match_id = ${id}`
    // Delete related achievements
    await sql`DELETE FROM achievements WHERE match_id = ${id}`
    // Delete the match
    const { rowCount } = await sql`DELETE FROM matches WHERE id = ${id}`
    return (rowCount ?? 0) > 0
  } catch (error) {
    console.error('Error deleting match:', error)
    return false
  }
}

// ============ Comments ============

export async function getComments(matchId: number): Promise<Comment[]> {
  try {
    const { rows } = await sql`SELECT * FROM comments WHERE match_id = ${matchId} ORDER BY created_at ASC`
    return rows.map(row => ({
      id: row.id,
      matchId: row.match_id,
      playerId: row.player_id,
      content: row.content,
      createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at
    }))
  } catch (error) {
    console.error('Error getting comments:', error)
    return []
  }
}

export async function addComment(matchId: number, playerId: number, content: string): Promise<Comment> {
  const { rows } = await sql`
    INSERT INTO comments (match_id, player_id, content)
    VALUES (${matchId}, ${playerId}, ${content})
    RETURNING *
  `
  const row = rows[0]
  return {
    id: row.id,
    matchId: row.match_id,
    playerId: row.player_id,
    content: row.content,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at
  }
}

// ============ Achievements ============

export async function getAchievements(playerId?: number): Promise<Achievement[]> {
  try {
    let rows
    if (playerId !== undefined) {
      const result = await sql`SELECT * FROM achievements WHERE player_id = ${playerId} ORDER BY unlocked_at DESC`
      rows = result.rows
    } else {
      const result = await sql`SELECT * FROM achievements ORDER BY unlocked_at DESC`
      rows = result.rows
    }
    return rows.map(row => ({
      id: row.id,
      playerId: row.player_id,
      type: row.type,
      unlockedAt: row.unlocked_at instanceof Date ? row.unlocked_at.toISOString() : row.unlocked_at,
      matchId: row.match_id
    }))
  } catch (error) {
    console.error('Error getting achievements:', error)
    return []
  }
}

export async function addAchievement(playerId: number, type: string, matchId: number): Promise<Achievement> {
  const { rows } = await sql`
    INSERT INTO achievements (player_id, type, match_id)
    VALUES (${playerId}, ${type}, ${matchId})
    RETURNING *
  `
  const row = rows[0]
  return {
    id: row.id,
    playerId: row.player_id,
    type: row.type,
    unlockedAt: row.unlocked_at instanceof Date ? row.unlocked_at.toISOString() : row.unlocked_at,
    matchId: row.match_id
  }
}

// ============ Full Database Read (for backward compatibility) ============

export async function readDatabase(): Promise<Database> {
  try {
    const [players, matches, commentsResult, achievements] = await Promise.all([
      getPlayers(),
      getMatches(),
      sql`SELECT * FROM comments ORDER BY created_at ASC`,
      getAchievements()
    ])

    const comments = commentsResult.rows.map(row => ({
      id: row.id,
      matchId: row.match_id,
      playerId: row.player_id,
      content: row.content,
      createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at
    }))

    return {
      players,
      matches,
      comments,
      achievements
    }
  } catch (error) {
    console.error('Error reading database:', error)
    return defaultDatabase
  }
}
