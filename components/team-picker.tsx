"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Search, X, Star, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Team } from "@/lib/data"
import { teams, getAllLeagues } from "@/lib/teams"
import { TeamLogo } from "@/components/team-logo"

interface TeamPickerProps {
  value: string
  onValueChange: (value: string) => void
  selectedTeam: Team | null
  placeholder?: string
  className?: string
}

export function TeamPicker({
  value,
  onValueChange,
  selectedTeam,
  placeholder = "Select team",
  className,
}: TeamPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [activeLeague, setActiveLeague] = React.useState("All")
  const [mounted, setMounted] = React.useState(false)

  // For portal - need to be mounted on client
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const leagues = ["All", ...getAllLeagues()]

  const filteredTeams = React.useMemo(() => {
    let filtered = teams

    // Filter by league
    if (activeLeague !== "All") {
      filtered = filtered.filter((team) => team.league === activeLeague)
    }

    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (team) =>
          team.name.toLowerCase().includes(searchLower) ||
          team.shortName.toLowerCase().includes(searchLower) ||
          team.league.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }, [activeLeague, search])

  const handleSelect = (teamId: string) => {
    onValueChange(teamId)
    setOpen(false)
    setSearch("")
  }

  const handleClose = () => {
    setOpen(false)
    setSearch("")
  }

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "w-full h-16 px-4 rounded-xl bg-muted/30 border border-border/50 transition-all",
          "hover:bg-muted/50 hover:border-primary/30",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
          "flex items-center justify-between gap-3",
          className
        )}
      >
        {selectedTeam ? (
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-12 h-12 rounded-lg bg-white p-1.5 flex items-center justify-center flex-shrink-0 shadow-md"
              style={{
                boxShadow: `0 4px 12px ${selectedTeam.primaryColor}40`,
              }}
            >
              <TeamLogo
                src={selectedTeam.logo}
                alt={selectedTeam.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="font-semibold text-base truncate">
                {selectedTeam.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {selectedTeam.league}
                </span>
                <div className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium text-amber-400">
                    {selectedTeam.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      </button>

      {/* Modal - rendered via portal to escape parent stacking context */}
      {mounted && open && createPortal(
        <div className="fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal Content */}
          <div className="absolute inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:h-[85vh] rounded-2xl bg-card border border-border/50 shadow-2xl flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h2 className="text-lg font-bold">Select Team</h2>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-muted/50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search teams..."
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-muted/30 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted/50"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* League Tabs */}
            <div className="px-4 py-3 border-b border-border/50 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 min-w-max">
                {leagues.map((league) => (
                  <button
                    key={league}
                    type="button"
                    onClick={() => setActiveLeague(league)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                      activeLeague === league
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {league}
                  </button>
                ))}
              </div>
            </div>

            {/* Teams Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredTeams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    No teams found
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try a different search or league
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredTeams.map((team) => {
                    const isSelected = value === team.id.toString()
                    return (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => handleSelect(team.id.toString())}
                        className={cn(
                          "relative p-3 pb-4 rounded-xl border-2 transition-all text-left",
                          "hover:scale-[1.02] active:scale-[0.98]",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border/50 bg-muted/20 hover:border-primary/30 hover:bg-muted/40"
                        )}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center z-10">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}

                        {/* Team color accent */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-[10px] opacity-70"
                          style={{ backgroundColor: team.primaryColor }}
                        />

                        <div className="flex flex-col items-center text-center">
                          {/* Logo */}
                          <div
                            className={cn(
                              "w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white p-1.5 mb-2 transition-all shadow-md flex-shrink-0",
                              isSelected && "shadow-lg ring-2 ring-primary/30"
                            )}
                          >
                            <TeamLogo
                              src={team.logo}
                              alt={team.name}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          {/* Name */}
                          <span
                            className={cn(
                              "font-medium text-xs leading-tight line-clamp-2 min-h-[2rem]",
                              isSelected && "text-primary"
                            )}
                          >
                            {team.name}
                          </span>

                          {/* Rating */}
                          <div
                            className={cn(
                              "mt-1.5 px-2 py-0.5 rounded text-xs font-bold",
                              team.rating >= 88
                                ? "bg-amber-400/20 text-amber-400"
                                : team.rating >= 84
                                ? "bg-primary/20 text-primary"
                                : "bg-muted/50 text-muted-foreground"
                            )}
                          >
                            {team.rating}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer with count */}
            <div className="p-3 border-t border-border/50 text-center">
              <span className="text-xs text-muted-foreground">
                {filteredTeams.length} team{filteredTeams.length !== 1 ? "s" : ""}{" "}
                {activeLeague !== "All" && `in ${activeLeague}`}
              </span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
