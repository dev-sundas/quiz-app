"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Plus, UserIcon, Mail } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, parseISO } from "date-fns"
import type { User } from "@/lib/types"

interface UserTableProps {
  users: User[]
  onDelete: (id: string) => Promise<void>
  isDeleting?: string
}

export function UserTable({ users, onDelete, isDeleting }: UserTableProps) {
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (deleteUserId) {
      await onDelete(deleteUserId)
      setDeleteUserId(null)
    }
  }

  const getRoleBadgeVariant = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "default" // ✅ allowed
      case "student":
        return "secondary" // use secondary instead of "blue"
      default:
        return "outline" // fallback instead of "gray"
    }
  }
  const usersWithRole = users.map((u) => ({
    ...u,
    role: u.role ?? "unknown",
  }))
  return (
    <>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">User Management</CardTitle>
          <Link href="/admin/users/new">
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              <span className="">Create User</span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">No users found</p>
              <Link href="/admin/users/new">
                <Button className="w-full sm:w-auto">Create Your First User</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <h3 className="font-semibold text-sm sm:text-base break-words">{user.username}</h3>
                      </div>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs w-fit">
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="break-all">{user.email}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created {formatDistanceToNow(parseISO(user.created_at! + "Z"), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/admin/users/${user.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3 bg-transparent"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="hidden sm:inline ml-2">Edit</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteUserId(user.id)}
                      disabled={isDeleting === user.id}
                      className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone and will also delete all
              associated quiz attempts and results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
