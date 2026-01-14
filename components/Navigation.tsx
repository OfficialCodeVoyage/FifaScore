"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusCircle, BarChart3, Trophy, History } from "lucide-react"

import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/match/new", label: "New", icon: PlusCircle },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/achievements", label: "Awards", icon: Trophy },
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
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 text-[10px] font-medium transition-all",
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
