"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types"
import {getCurrentUser, getToken, getTokenExpiry, login as loginAPI, logout, refreshAccessToken, setTokens } from "@/lib/auth"
import {signupUser } from "@/lib/api"

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


  
  //Load current user on mount
useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if(currentUser){
         setUser(currentUser)
      }else{
        setUser(null)
      }
    } catch (err) {
      console.warn("No active session found")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }
  fetchCurrentUser()
}, [])

useEffect(() => {
  let interval: NodeJS.Timeout

  const scheduleTokenRefresh = async () => {
    const token = getToken()
    if (!token) return

    const expiry: number | null = getTokenExpiry(token) // no await
    if (!expiry) return

    const timeout = expiry - Date.now() - 60_000 // refresh 1 min before expiry
    if (timeout <= 0) return

    interval = setTimeout(async () => {
      const refreshed = await refreshAccessToken()
      if (refreshed) scheduleTokenRefresh()
      else await autlogout()
    }, timeout)
  }

  if (user) scheduleTokenRefresh()

  return () => clearTimeout(interval)
}, [user])


  // Login function
  const login = async (username: string, password: string): Promise<LoginResult> => {
    setIsLoading(true)
    try {
      const authResponse = await loginAPI({ username, password })
      setTokens(authResponse.access_token, authResponse.refresh_token)
      if (!authResponse.success) {
        setIsLoading(false)
        return { success: false, error: authResponse.error }
}

      const currentUser = await getCurrentUser()
      if (!currentUser) {
        setIsLoading(false)
        return {success:false,error:"Failed to fetch user"}
      }
       

      setUser(currentUser)
      setIsLoading(false)

      // if (currentUser.role === "admin") router.push("/admin")
      // else if (currentUser.role === "student") router.push("/student")
      // else router.push("/login")

      return { success: true, user: currentUser }
    } catch (err) {
      console.error(err)
      setIsLoading(false)
      return { success: false, error: err instanceof Error ? err.message : "Login failed" }
    }
  }

  const autlogout = async (): Promise<void> => {
    await logout()
    setUser(null)
    router.push("/login")
  }


  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true)
    try {
      // Call backend endpoint
      await signupUser({
        username,
        email,
        password,
      })

      // Auto-login after signup
      const loginResult = await login(username, password)
      if (loginResult.success && loginResult.user){
        setUser(loginResult.user)
        // ✅ Redirect based on role
        if (loginResult.user!.role === "admin") router.push("/admin")
        else if (loginResult.user!.role === "student") router.push("/student")
        else router.push("/login")
    }
      setIsLoading(false)
      return { success: true }
      
    } catch (error: any) {
      setIsLoading(false)
      return { success: false, error: error.message || "Signup failed" }
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout: autlogout,
    signup,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
// function getTokenExpiry(token: string) {
//   throw new Error("Function not implemented.")
// }

