import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useAuth } from "@/contexts/auth-context"
import { updateMyProfile } from "@/lib/api"

export function ChangePasswordDialog() {
  const [newPassword, setNewPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)   // ✅ control dialog
  const { setUser } = useAuth()

  const handlePasswordChange = async () => {
    setIsLoading(true)
    try {
      const updatedUser = await updateMyProfile({ password: newPassword })
      setUser(updatedUser)

      // ✅ Reset field + close dialog
      setNewPassword("")
      setOpen(false)

      console.log("Password updated successfully!")
    } catch (err) {
      console.error(err)
      console.log("Failed to update password.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your new password below. Make sure it’s strong and secure.
          </DialogDescription>
        </DialogHeader>

        <Input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <DialogFooter>
          <Button
            onClick={handlePasswordChange}
            disabled={isLoading || !newPassword}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
