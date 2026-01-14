import fs from 'fs'
import path from 'path'
import { Database, defaultDatabase } from './data'

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

/**
 * Ensures the data directory exists
 */
function ensureDataDirectory(): void {
  const dataDir = path.dirname(DB_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

/**
 * Reads the database from the JSON file
 * Returns default data if file doesn't exist or is empty
 */
export function readDatabase(): Database {
  try {
    ensureDataDirectory()

    if (!fs.existsSync(DB_PATH)) {
      // Initialize with default data if file doesn't exist
      writeDatabase(defaultDatabase)
      return defaultDatabase
    }

    const data = fs.readFileSync(DB_PATH, 'utf-8')

    if (!data || data.trim() === '') {
      // Initialize with default data if file is empty
      writeDatabase(defaultDatabase)
      return defaultDatabase
    }

    const parsed = JSON.parse(data) as Database

    // Ensure all required arrays exist
    return {
      players: parsed.players || defaultDatabase.players,
      matches: parsed.matches || [],
      comments: parsed.comments || [],
      achievements: parsed.achievements || []
    }
  } catch (error) {
    console.error('Error reading database:', error)
    // Return default data on error
    return defaultDatabase
  }
}

/**
 * Writes the database to the JSON file
 */
export function writeDatabase(data: Database): void {
  try {
    ensureDataDirectory()
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing database:', error)
    throw new Error('Failed to write database')
  }
}

/**
 * Initializes the database with default data if it doesn't exist
 */
export function initializeDatabase(): Database {
  return readDatabase()
}

/**
 * Resets the database to default values
 * Useful for testing
 */
export function resetDatabase(): Database {
  writeDatabase(defaultDatabase)
  return defaultDatabase
}
