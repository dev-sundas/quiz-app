import { ProtectedRoute } from "@/components/auth/protected-route"
import { ProfileForm } from "@/components/student/ProfileForm"
import { StudentLayout } from "@/components/student/student-layout"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <ProfileForm />
      </div>
    </ProtectedRoute>
  )
}
