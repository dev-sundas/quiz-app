"use client"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/admin/navbar"
import { UserForm } from "@/components/admin/user-form"
import { createUser } from "@/lib/api"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function NewUserPage() {
  const router = useRouter()

  const handleSubmit = async (data: { username: string; email: string; password?: string; role_id: string }) => {
    await createUser(data)
    router.push("/admin/users")
  }

  const handleCancel = () => {
    router.push("/admin/users")
  }

  return (
    <ProtectedRoute adminOnly>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New User</h1>
          <p className="text-muted-foreground">Add a new user to the system</p>
        </div>

        <UserForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </ProtectedRoute>
  )
}
