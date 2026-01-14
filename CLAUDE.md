# FifaScore - FIFA Rivalry Tracker

A web application to track FIFA match scores between Pavlo and Summet. Mobile-friendly, full of stats, achievements, and trash talk.

**Live**: http://localhost:3000
**GitHub**: https://github.com/OfficialCodeVoyage/FifaScore

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: JSON file storage (easily swappable to Vercel Postgres)
- **UI Components**: shadcn/ui (custom implementation)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Project Structure

```
fifascore/
├── app/
│   ├── page.tsx                 # Dashboard
│   ├── layout.tsx               # Root layout with navigation
│   ├── globals.css              # Tailwind + CSS variables
│   ├── match/
│   │   ├── new/page.tsx         # Add new match form
│   │   └── [id]/page.tsx        # Match details + comments
│   ├── stats/page.tsx           # Statistics dashboard
│   ├── achievements/page.tsx    # Achievement badges
│   ├── history/page.tsx         # Full match history
│   ├── hall-of-shame/page.tsx   # Trash talk zone
│   └── api/
│       ├── matches/route.ts     # GET/POST matches
│       ├── matches/[id]/route.ts
│       ├── stats/route.ts       # GET statistics
│       ├── achievements/route.ts
│       └── comments/route.ts    # GET/POST comments
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   ├── avatar.tsx
│   │   ├── label.tsx
│   │   ├── switch.tsx
│   │   └── textarea.tsx
│   ├── match-card.tsx           # Match result display
│   ├── player-card.tsx          # Player profile card
│   ├── team-selector.tsx        # Team dropdown with logos
│   ├── score-input.tsx          # +/- score input
│   ├── stat-card.tsx            # Stat display card
│   ├── achievement-badge.tsx    # Achievement display
│   ├── Navigation.tsx           # Bottom mobile nav
│   └── ThemeProvider.tsx        # Dark mode support
├── lib/
│   ├── data.ts                  # TypeScript interfaces
│   ├── db.ts                    # JSON database layer
│   ├── queries.ts               # Data query functions
│   ├── teams.ts                 # 35 FIFA teams
│   ├── achievements.ts          # Achievement definitions
│   └── utils.ts                 # cn() utility
└── data/
    └── db.json                  # Local database (gitignored)
```

## Features

### Match Recording
- Select teams for both players (35 teams available)
- Enter scores with +/- buttons
- Toggle extra time / penalties
- Auto-saves to database

### Statistics Dashboard
- Head-to-head overall record
- Goals scored / conceded
- Win rate percentages
- Current and best winning streaks
- Favorite teams per player
- Bar charts for visual comparison

### Achievement Badges
| Badge | Requirement |
|-------|-------------|
| 🔥 On Fire | 3 wins in a row |
| 🧱 The Wall | Keep a clean sheet |
| 💀 Demolition | Win by 5+ goals |
| 🎯 Sniper | Score 5+ goals |
| 🏆 Champion | 50 total wins |
| 😢 Rock Bottom | 5 losses in a row |
| 😤 Comeback Kid | Win after being 2+ down |

### Hall of Shame
- Top 10 biggest losses
- Random taunt generator (18+ taunts)
- Excuses board (25 pre-made excuses)
- Shame stats per player

### Other Features
- Dark mode support
- Mobile-first responsive design
- Match comments / trash talk
- Filter match history by player, team, result

## Teams Included

**La Liga**: Real Madrid, Barcelona, Atletico Madrid, Sevilla
**Premier League**: Man City, Liverpool, Arsenal, Chelsea, Man United, Tottenham, Newcastle, Aston Villa
**Bundesliga**: Bayern Munich, Dortmund, RB Leipzig, Bayer Leverkusen
**Serie A**: Inter, AC Milan, Juventus, Napoli, Roma, Lazio
**Ligue 1**: PSG, Marseille, Monaco, Lyon
**Other**: Benfica, Porto, Sporting, Ajax, PSV, Celtic, Rangers, Galatasaray, Fenerbahce

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/matches` | GET | Get all matches |
| `/api/matches` | POST | Create new match |
| `/api/matches/[id]` | GET | Get single match with comments |
| `/api/stats` | GET | Get full statistics |
| `/api/achievements` | GET | Get all achievements |
| `/api/comments` | GET | Get comments for match |
| `/api/comments` | POST | Add comment to match |

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deploy to Vercel

1. Push to GitHub (already done)
2. Connect repo in Vercel dashboard
3. Deploy automatically

Or via CLI:
```bash
vercel
```

## Switching to Vercel Postgres

1. Create a Vercel Postgres database
2. Add `POSTGRES_URL` to environment variables
3. Update `lib/db.ts` to use `@vercel/postgres` instead of JSON file
4. Run database migrations

## Players

- **Pavlo** (ID: 1)
- **Summet** (ID: 2)

---

Built with Claude Code
