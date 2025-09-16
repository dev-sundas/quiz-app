"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context" // or "@/hooks/use-auth"
import { canAccessAdminRoutes } from "@/lib/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
  requireStudent?: boolean
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  adminOnly = false,
  requireStudent = false,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  // ✅ Admin-only check with Access Denied screen
  if (adminOnly && !canAccessAdminRoutes(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    )
  }

  // ✅ Student-only check (similar Access Denied UI)
  if (requireStudent && user?.role !== "student") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">This page is only available to students.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
