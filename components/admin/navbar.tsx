"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Trophy, Settings, Users, UserIcon, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isAdmin } from "@/lib/auth"
import { useState } from "react"

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  const handleProfileClick = async () => {
    router.push("/profile")
  }

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  const studentNavItems = [
    {
      href: "/student",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/student",
    },
    {
      href: "/results",
      label: "Results",
      icon: Trophy,
      active: pathname === "/results",
    },
  ]

  const adminNavItems = [
    {
      href: "/admin",
      label: "Admin Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      href: "/admin/quizzes",
      label: "Quizzes",
      icon: Settings,
      active: pathname.startsWith("/admin/quizzes"),
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
      active: pathname.startsWith("/admin/users"),
    },
    {
      href: "/admin/results",
      label: "All Results",
      icon: Trophy,
      active: pathname === "/admin/results",
    },
  ]

  const navItems = isAdmin(user) ? adminNavItems : studentNavItems

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <Link href={isAdmin(user) ? "/admin" : "/student"} className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm sm:text-md">Q</span>
              </div>
              <div className="hidden xs:block sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Quiz Portal</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Test your knowledge</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={item.active ? "secondary" : "ghost"}
                      size="sm"
                      className={cn("flex items-center gap-2", item.active && "bg-secondary")}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-medium text-primary-foreground">
                      {user?.username?.charAt(0).toUpperCase() ?? "?"}
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="max-w-24 lg:max-w-none truncate">{user?.username}</span>
                    <span className="text-xs bg-secondary px-2 py-1 rounded-full">{user?.role}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} onClick={handleNavClick}>
                    <Button
                      variant={item.active ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "w-full flex items-center justify-start gap-3 py-3 text-sm",
                        item.active && "bg-secondary",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
