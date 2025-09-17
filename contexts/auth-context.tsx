"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types"
import { login as loginAPI, logout as logoutAPI, getCurrentUser, refreshAccessToken } from "@/lib/auth"
import { signupUser } from "@/lib/api"

interface LoginResult {
  success: boolean
  user?: User
  error?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<LoginResult>
  logout: () => Promise<void>
  signup: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser() // reads cookies from browser
        setUser(currentUser ?? null)
      } catch (err) {
        console.warn("No active session found")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  // Sliding token refresh
 useEffect(() => {
  let interval: NodeJS.Timeout

  const scheduleTokenRefresh = async () => {
    const refreshed = await refreshAccessToken()
    if (!refreshed.success) {
      await autlogout()
      return
    }

    // Use expiresIn if available, otherwise default 14 minutes
    const timeout = (refreshed.expiresIn ?? 14 * 60_000) - 60_000
    interval = setTimeout(scheduleTokenRefresh, timeout)
  }

  if (user) scheduleTokenRefresh()

  return () => clearTimeout(interval)
}, [user])


  // Login function
  const login = async (username: string, password: string): Promise<LoginResult> => {
    setIsLoading(true)
    try {
      const result = await loginAPI({ username, password }) // cookies set in backend
      if (!result.success) {
        setIsLoading(false)
        return { success: false, error: result.error }
      }

      const currentUser = await getCurrentUser()
      setUser(currentUser ?? null)
      setIsLoading(false)
      return { success: true, user: currentUser ?? undefined }
    } catch (err) {
      setIsLoading(false)
      return { success: false, error: err instanceof Error ? err.message : "Login failed" }
    }
  }

  // Logout function
  const autlogout = async (): Promise<void> => {
    await logoutAPI()
    setUser(null)
    router.push("/login")
  }

  // Signup function
  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true)
    try {
      await signupUser({ username, email, password })
      const loginResult = await login(username, password)
      if (loginResult.success && loginResult.user){
      setUser(loginResult.user)
      if (loginResult.user!.role === "admin") router.push("/admin")
      else if (loginResult.user!.role === "student") router.push("/student")
      else router.push("/login")
    }
    setIsLoading(false)
    return { success: true }
    } catch (err: any) {
      setIsLoading(false)
      return { success: false, error: err.message || "Signup failed" }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout: autlogout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
