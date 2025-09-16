"use client"

import type React from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AuthProvider } from "@/contexts/auth-context"
import { Navbar } from "../admin/navbar"
import { AuthRedirect } from "../auth/auth-redirect"

interface StudentLayoutProps {
  children: React.ReactNode
}

export function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <ProtectedRoute requireStudent>
      <AuthProvider>
        <div className="min-h-screen bg-background">
        <div>
          <Navbar />
        </div>
        <main className="container mx-auto px-6 py-8">{children}</main>
      </div>
      </AuthProvider>
    </ProtectedRoute>
  )
}
