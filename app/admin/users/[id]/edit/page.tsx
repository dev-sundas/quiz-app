"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navbar } from "@/components/admin/navbar"
import { UserForm } from "@/components/admin/user-form"
import { getAllUsers, updateUser } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User } from "@/lib/types"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await getAllUsers()
        const foundUser = users.find((u) => String(u.id) === userId)
        if (foundUser) {
          setUser(foundUser)
        } else {
          setError("User not found")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  const handleSubmit = async (data: { username: string; email: string; role_id: string }) => {
    if (!user) return
    await updateUser(user.id, data)
    router.push("/admin/users")
  }

  const handleCancel = () => {
    router.push("/admin/users")
  }

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading user...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !user) {
    return (
      <ProtectedRoute adminOnly>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error || "User not found"}</AlertDescription>
          </Alert>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute adminOnly>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit User</h1>
          <p className="text-muted-foreground">Update user account details</p>
        </div>

        <UserForm user={user} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </ProtectedRoute>
  )
}
