"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface AuthRedirectProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthRedirect({ children, redirectTo = "/login" }: AuthRedirectProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const publicRoutes = ["/", "/login", "/signup"]

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      // Not logged in → allow public routes, redirect otherwise
      if (!publicRoutes.includes(pathname)) {
        router.push(redirectTo)
      }
    } else {
      // Logged in → redirect away from login/signup
      if (pathname === "/login" || pathname === "/signup") {
        if (user?.role === "admin") router.push("/admin")
        else if (user?.role === "student") router.push("/student")
        else router.push("/") // fallback if role missing
      }
    }
  }, [isAuthenticated, isLoading, pathname, redirectTo, router, user])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Allow render
  return <>{children}</>
}
