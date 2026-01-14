"use client"

import * as React from "react"
import { Trophy, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Achievement {
  id: string
  title: string
  description: string
  emoji: string
}

interface AchievementToastContextType {
  showAchievement: (achievement: Achievement) => void
  showAchievements: (achievements: Achievement[]) => void
}

const AchievementToastContext = React.createContext<AchievementToastContextType | null>(null)

export function useAchievementToast() {
  const context = React.useContext(AchievementToastContext)
  if (!context) {
    throw new Error("useAchievementToast must be used within AchievementToastProvider")
  }
  return context
}

interface AchievementToastProviderProps {
  children: React.ReactNode
}

export function AchievementToastProvider({ children }: AchievementToastProviderProps) {
  const [queue, setQueue] = React.useState<Achievement[]>([])
  const [current, setCurrent] = React.useState<Achievement | null>(null)
  const [isExiting, setIsExiting] = React.useState(false)

  const showAchievement = React.useCallback((achievement: Achievement) => {
    setQueue((prev) => [...prev, achievement])
  }, [])

  const showAchievements = React.useCallback((achievements: Achievement[]) => {
    setQueue((prev) => [...prev, ...achievements])
  }, [])

  const dismissCurrent = React.useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      setCurrent(null)
      setIsExiting(false)
    }, 200)
  }, [])

  // Process queue
  React.useEffect(() => {
    if (!current && queue.length > 0) {
      const [next, ...rest] = queue
      setCurrent(next)
      setQueue(rest)
    }
  }, [current, queue])

  // Auto-dismiss after 4 seconds
  React.useEffect(() => {
    if (current && !isExiting) {
      const timer = setTimeout(dismissCurrent, 4000)
      return () => clearTimeout(timer)
    }
  }, [current, isExiting, dismissCurrent])

  return (
    <AchievementToastContext.Provider value={{ showAchievement, showAchievements }}>
      {children}
      {current && (
        <div
          className={cn(
            "fixed top-4 left-1/2 z-50",
            isExiting ? "toast-exit" : "toast-enter"
          )}
        >
          <div className="fifa-card overflow-hidden shadow-2xl border-amber-400/50 min-w-[320px] max-w-[400px]">
            <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 p-4">
              <div className="flex items-start gap-3">
                <div className="text-4xl achievement-unlocked flex-shrink-0">
                  {current.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-amber-400 uppercase tracking-wide">
                      Achievement Unlocked
                    </span>
                  </div>
                  <h3 className="font-bold text-lg leading-tight">{current.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {current.description}
                  </p>
                </div>
                <button
                  onClick={dismissCurrent}
                  className="p-1 hover:bg-muted/50 rounded-full transition-colors flex-shrink-0"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-1 bg-muted/30">
              <div
                className="h-full bg-amber-400 transition-all duration-100"
                style={{
                  width: "100%",
                  animation: "shrink 4s linear forwards",
                }}
              />
            </div>
          </div>
          <style jsx>{`
            @keyframes shrink {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
        </div>
      )}
    </AchievementToastContext.Provider>
  )
}
