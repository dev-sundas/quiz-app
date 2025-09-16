import { AuthResponse, LoginCredentials, User } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://quizappbackend-production-37c5.up.railway.app"

// Token management
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("quiz_access_token")
}

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("quiz_refresh_token")
}

export const setTokens = (accessToken: string, refreshToken?: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("quiz_access_token", accessToken)
  if (refreshToken) {
    localStorage.setItem("quiz_refresh_token", refreshToken)
  }
}

export const removeTokens = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("quiz_access_token")
  localStorage.removeItem("quiz_refresh_token")
}


// Helper: decode JWT expiry
export const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.exp ? payload.exp * 1000 : null
  } catch {
    return null
  }
}



const isTokenExpired = (token: string): boolean => {
  const expiry = getTokenExpiry(token)
  if (!expiry) return true
  return Date.now() > expiry
}


export const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  try {
    const formData = new URLSearchParams()
    formData.append("refresh_token", refreshToken)

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
      // headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ refresh_token: refreshToken }),
    })
    
    if (!response.ok) throw new Error("Refresh failed")

    const data = await response.json()
    // console.log("Refresh response:", data)

    // ⚠️ Some APIs only return new access_token, not refresh_token
    if (data.refresh_token) {
      setTokens(data.access_token, data.refresh_token)
    } else {
      setTokens(data.access_token, refreshToken) // keep old refresh token
    }

    return true
  } catch (err) {
    removeTokens()
    return false
  }
}



// Main API call with automatic token refresh
export const apiCall = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<T | null> => {
  let token = getToken()

  // 🔑 If access token expired, try refreshing before request
  if (token && isTokenExpired(token)) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      token = getToken()
    } else {
      removeTokens()
      // window.location.href = "/login"
      console.warn("Session expired, please log in again")
      return null  
    }
  }

  // const headers = {
  //   "Content-Type": "application/json",
  //   ...(token && { Authorization: `Bearer ${token}` }),
  //   ...options.headers,
  // }
   // ✅ detect FormData
  const isFormData = options.body instanceof FormData

  const headers: Record<string, string> = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(!isFormData && { "Content-Type": "application/json" }), // ✅ only JSON when not FormData
    ...(options.headers as Record<string, string>),
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers })

  if (response.status === 401 && retry) {
  const refreshed = await refreshAccessToken()
  if (refreshed) {
    return apiCall<T>(endpoint, options, false)
  } else {
    removeTokens()
    // No redirect, no throw
    console.warn("Authentication expired. User is logged out.")
    return null as any // or handle null in your components
  }
}
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}


export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const formData = new URLSearchParams()
  formData.append("username", credentials.username)
  formData.append("password", credentials.password)

  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    return {
      success: false,
      error: errorData.message || "Invalid credentials",
      access_token: "",
      refresh_token: "",
      user: { id: "", username: "", role: "" },
    }
  }

  const data = await response.json()

  // ✅ use setTokens consistently
  setTokens(data.access_token, data.refresh_token)

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    success: true,
    user: {
      id: data.userId,
      username: credentials.username,
      role: data.role,
    },
  }
}



export const logout = async (): Promise<void> => {
  const accessToken = getToken()
  const refreshToken = getRefreshToken()

  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: refreshToken ? JSON.stringify({ refresh_token: refreshToken }) : undefined,
    })
  } catch (err) {
    console.warn("Logout request failed:", err)
  } finally {
    removeTokens()
  }
}








export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = getToken()
    if (!token) return null

    const user = await apiCall("/user/me")
    // console.log("Current user fetched:", user)
    return user
  } catch (error) {
    console.error("Failed to fetch current user:", error)
    return null
  }
}


export const hasRole = (user: User | null, role: string): boolean => {
  return user?.role === role
}

export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, "admin")
}

export const isStudent = (user: User | null): boolean => {
  return hasRole(user, "student")
}

export const canAccessAdminRoutes = (user: User | null): boolean => {
  return isAdmin(user)
}
