"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/admin/navbar"
import { UserTable } from "@/components/admin/user-table"
import { getAllUsers, deleteUser } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User } from "@/lib/types"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string>("")

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const data = await getAllUsers()
      console.log("data",data)
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users")
    } finally {
      setLoading(false)
    }
  }
  fetchUsers()
  }, [])



  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteUser(id)
      setUsers(users.filter((user) => user.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user")
    } finally {
      setDeletingId("")
    }
  }

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute adminOnly>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage user accounts</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <UserTable users={users} onDelete={handleDelete} isDeleting={deletingId} />
      </div>
    </ProtectedRoute>
  )
}
