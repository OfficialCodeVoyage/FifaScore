"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusCircle, Shuffle, BarChart3, Trophy, History } from "lucide-react"

import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
  highlight?: boolean
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/random", label: "Random", icon: Shuffle },
  { href: "/match/new", label: "New", icon: PlusCircle, highlight: true },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/history", label: "History", icon: History },
]

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({ className, ...props }, ref) => {
    const pathname = usePathname()

    return (
      <nav
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80",
          className
        )}
        {...props}
      >
        <div className="mx-auto flex h-16 max-w-lg items-center justify-evenly px-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href))
            const Icon = item.icon

            // Special highlighted button (New)
            if (item.highlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex min-w-[56px] flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-all"
                >
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary shadow-lg shadow-primary/30">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-primary mt-0.5">{item.label}</span>
                </Link>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-medium transition-all",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-primary/10" />
                )}
                <Icon
                  className={cn(
                    "relative h-5 w-5 transition-all",
                    isActive && "scale-110 text-primary"
                  )}
                />
                <span className="relative">{item.label}</span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </div>
        {/* Safe area for mobile devices */}
        <div
          className="bg-card/95 backdrop-blur-xl"
          style={{ height: 'env(safe-area-inset-bottom, 0px)' }}
        />
      </nav>
    )
  }
)
Navigation.displayName = "Navigation"

export { Navigation }
