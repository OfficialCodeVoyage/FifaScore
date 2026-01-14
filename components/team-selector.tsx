"use client"

import * as React from "react"

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
  logo?: string
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
        className={cn("w-full", className)}
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          {selectedTeam ? (
            <>
              {selectedTeam.logo ? (
                <img
                  src={selectedTeam.logo}
                  alt={selectedTeam.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {selectedTeam.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="truncate">{selectedTeam.name}</span>
            </>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </div>
      </SelectTrigger>
      <SelectContent>
        {teams.map((team) => (
          <SelectItem key={team.id} value={team.id}>
            <div className="flex items-center gap-2">
              {team.logo ? (
                <img
                  src={team.logo}
                  alt={team.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {team.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span>{team.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { TeamSelector }
