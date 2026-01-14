"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface TeamLogoProps {
  src: string
  alt: string
  className?: string
  fallbackClassName?: string
}

export function TeamLogo({ src, alt, className, fallbackClassName }: TeamLogoProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  if (error) {
    // Show team initials as fallback
    const initials = alt
      .split(" ")
      .map(word => word[0])
      .join("")
      .slice(0, 3)
      .toUpperCase()

    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted/50 text-muted-foreground font-bold",
          fallbackClassName || className
        )}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(className, loading && "opacity-0")}
      onError={() => setError(true)}
      onLoad={() => setLoading(false)}
      loading="lazy"
    />
  )
}
