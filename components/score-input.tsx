"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"

export interface ScoreInputProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  label?: string
  className?: string
  disabled?: boolean
}

const ScoreInput = ({
  value = 0,
  onChange,
  min = 0,
  max = 99,
  label,
  className,
  disabled = false,
}: ScoreInputProps) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange?.(value + 1)
    }
  }

  const handleDecrement = () => {
    if (value > min) {
      onChange?.(value - 1)
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {label && (
        <label className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="score-stepper-btn"
          aria-label="Decrease score"
        >
          <Minus className="h-6 w-6" />
        </button>

        <div className="w-24 text-center">
          <span className="text-score score-display">{value}</span>
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className="score-stepper-btn"
          aria-label="Increase score"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}

export { ScoreInput }
