"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, User, LayoutDashboard, Trophy, Settings, Users, UserIcon } from "lucide-react"
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

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
  }

  const handleProfileClick = async () => {
    router.push("/profile")
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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={isAdmin(user) ? "/admin" : "/student"} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-md">Q</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Quiz Portal</h1>
                <p className="text-sm text-muted-foreground">Test your knowledge</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
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
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-foreground">
                      {user?.username?.charAt(0).toUpperCase() ?? "?"}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{user?.username}</span>
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

        {/* Mobile navigation */}
        <nav className="md:hidden flex items-center gap-1 mt-4 pt-4 border-t">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  size="sm"
                  className={cn("w-full flex items-center gap-2", item.active && "bg-secondary")}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
