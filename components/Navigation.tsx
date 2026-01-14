"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusCircle, BarChart3, Trophy, History, Skull } from "lucide-react"

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
  { href: "/hall-of-shame", label: "Shame", icon: Skull },
]

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({ className, ...props }, ref) => {
    const pathname = usePathname()

    return (
      <nav
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          className
        )}
        {...props}
      >
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-4">
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
                  "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all",
                    isActive && "scale-110"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
        {/* Safe area for mobile devices */}
        <div className="h-safe-area-inset-bottom bg-background" />
      </nav>
    )
  }
)
Navigation.displayName = "Navigation"

export { Navigation }
