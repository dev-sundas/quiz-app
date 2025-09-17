"use client"

import { AuthResponse, LoginCredentials, User } from "./types"
import { useRouter } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL||"https://https://myquizapp.rf.gd"



// -------------------- API CALL --------------------
export const apiCall = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> => {
  const isFormData = options.body instanceof FormData

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    ...(!isFormData ? { "Content-Type": "application/json" } : {}), // ✅ only JSON when not FormData
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include", // ✅ cookies
    headers,
  })

  if (response.status === 401) {
    console.warn("Unauthorized - session expired")
    return null
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }
  return response.json() as Promise<T>
}


// -------------------- LOGIN --------------------
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const formData = new URLSearchParams()
  formData.append("username", credentials.username)
  formData.append("password", credentials.password)

  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
    credentials: "include", // cookies are set automatically
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    return {
      success: false,
      error: errorData.message || "Invalid credentials",
      access_token: "",
      refresh_token: "",
      user: { id: "", username: "", role: "" }, // still required by type
    }
  }

  const data = await response.json()
  return {
    success: true,
    access_token: data.access_token || "", // keep type happy
    refresh_token: data.refresh_token || "", // even if stored in cookie
    user: { id: data.userId, username: credentials.username, role: data.role },
  }
}


// -------------------- LOGOUT --------------------
export const logout = async (): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // ✅ send cookies automatically
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // ✅ always send valid JSON body
    })
  } catch (err) {
    console.warn("Logout request failed:", err)
  } finally {
    // ✅ No need to clear cookies manually, server deletes them
    console.log("Logout complete")
  }
}


// -------------------- CURRENT USER --------------------
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await apiCall<User>("/user/me")
    return user
  } catch {
    return null
  }
}

export const refreshAccessToken = async (): Promise<{ success: boolean; expiresIn?: number }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
    if (!res.ok) return { success: false }
    const data = await res.json()
    return { success: true, expiresIn: 15 * 60 * 1000 } // assuming 15 min access token
  } catch {
    return { success: false }
  }
}


// Check if user has a specific role
export const hasRole = (user: User | null, role: string): boolean => {
  return user?.role === role
}

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, "admin")
}

// Check if user is student
export const isStudent = (user: User | null): boolean => {
  return hasRole(user, "student")
}

// Used in ProtectedRoute to allow admin-only access
export const canAccessAdminRoutes = (user: User | null): boolean => {
  return isAdmin(user)
}

