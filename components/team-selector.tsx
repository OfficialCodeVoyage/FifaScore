"use client"

import * as React from "react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface Team {
  id: string
  name: string
  shortName?: string
  logo?: string
  rating?: number
  primaryColor?: string
}

export interface TeamSelectorProps {
  teams: Team[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const TeamSelector = ({
  teams,
  value,
  onValueChange,
  placeholder = "Select a team",
  disabled = false,
  className,
}: TeamSelectorProps) => {
  const selectedTeam = teams.find((team) => team.id === value)

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "w-full h-14 bg-muted/50 border-border/50 hover:bg-muted/70 transition-colors",
          className
        )}
        disabled={disabled}
      >
        <div className="flex items-center gap-3 w-full">
          {selectedTeam ? (
            <>
              <div
                className="team-logo-sm flex items-center justify-center flex-shrink-0"
                style={{
                  boxShadow: selectedTeam.primaryColor
                    ? `0 0 0 2px ${selectedTeam.primaryColor}30`
                    : undefined
                }}
              >
                {selectedTeam.logo ? (
                  <img
                    src={selectedTeam.logo}
                    alt={selectedTeam.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xs font-bold text-gray-800">
                    {selectedTeam.shortName || selectedTeam.name.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="truncate font-medium text-sm">{selectedTeam.name}</span>
                {selectedTeam.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-muted-foreground">{selectedTeam.rating}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {teams.map((team) => (
          <SelectItem key={team.id} value={team.id} className="py-2">
            <div className="flex items-center gap-3">
              <div
                className="team-logo-sm flex items-center justify-center flex-shrink-0"
                style={{
                  boxShadow: team.primaryColor
                    ? `0 0 0 2px ${team.primaryColor}30`
                    : undefined
                }}
              >
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xs font-bold text-gray-800">
                    {team.shortName || team.name.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{team.name}</span>
                {team.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-muted-foreground">{team.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { TeamSelector }
