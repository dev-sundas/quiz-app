"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { User, Mail, Calendar, Shield } from "lucide-react"

export function ProfileForm() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.username || "",
    email: user?.email || "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // In a real app, this would update the user in the backend
      // For now, we'll just update localStorage
      const updatedUser = { ...user, ...formData, updatedAt: new Date() }
      localStorage.setItem("quiz_current_user", JSON.stringify(updatedUser))

      setIsEditing(false)
      // You might want to refresh the auth context here
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.username || "",
      email: user?.email || "",
    })
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">{user.username.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{user.role}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Manage your personal information and account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{user.username}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Account Created</Label>
              <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {user?.created_at && (
                  <span>{new Date(user.created_at).toLocaleDateString()}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Last Updated</Label>
              <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {user?.updated_at && (
                  <span>{new Date(user.updated_at).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your account security and password</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Password</h4>
                <p className="text-sm text-muted-foreground">Last changed: Never (Demo account)</p>
              </div>
              <Button variant="outline" disabled>
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline" disabled>
                Enable 2FA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
