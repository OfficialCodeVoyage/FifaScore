export interface Player {
  id: number
  name: string
  avatar: string
}

export interface Team {
  id: number
  name: string
  logo: string
  league: string
  rating: number
}

export interface Match {
  id: number
  date: string
  player1Id: number
  player2Id: number
  player1Score: number
  player2Score: number
  player1TeamId: number
  player2TeamId: number
  extraTime: boolean
  penalties: boolean
}

export interface Comment {
  id: number
  matchId: number
  playerId: number
  content: string
  createdAt: string
}

export interface Achievement {
  id: number
  playerId: number
  type: string
  unlockedAt: string
  matchId: number
}

export interface Database {
  players: Player[]
  matches: Match[]
  comments: Comment[]
  achievements: Achievement[]
}

export const defaultDatabase: Database = {
  players: [
    {
      id: 1,
      name: "Pavlo",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pavlo"
    },
    {
      id: 2,
      name: "Summet",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Summet"
    }
  ],
  matches: [],
  comments: [],
  achievements: []
}
