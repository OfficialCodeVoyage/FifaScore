"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10)
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange?.(newValue)
    } else if (e.target.value === "") {
      onChange?.(min)
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {label && (
        <label className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="h-12 w-12 rounded-full"
        >
          <Minus className="h-5 w-5" />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          disabled={disabled}
          className="h-16 w-20 text-center text-3xl font-bold tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className="h-12 w-12 rounded-full"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export { ScoreInput }
