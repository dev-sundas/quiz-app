"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

import { Role, User, UserFormValues, userSchema } from "@/lib/types"
import { getAllRoles } from "@/lib/api"



interface UserFormProps {
  user?: User
  onSubmit: (data: UserFormValues) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function UserForm({ user, onSubmit, onCancel, isLoading = false }: UserFormProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [error, setError] = useState("")
  const [loadingRoles, setLoadingRoles] = useState(true)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role_id: "",
    },
  })

  // ✅ Populate form when editing a user
  useEffect(() => {
    if (user && roles.length) {
      const userRole = roles.find((r) => r.name.toLowerCase() === user.role.toLowerCase())
      form.reset({
        username: user.username,
        email: user.email,
        password: "",
        role_id: userRole?.id.toString() || "",
      })
    }
  }, [user, roles])

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getAllRoles()
        setRoles(rolesData)
      } catch {
        setError("Failed to load roles")
      } finally {
        setLoadingRoles(false)
      }
    }
    fetchRoles()
  }, [])

  if (loadingRoles) {
    return (
      <Card className="max-w-2xl">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading roles...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{user ? "Edit User" : "Create New User"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <Label>Username</Label>
                  <FormControl>
                    <Input {...field} placeholder="Enter username" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <FormControl>
                    <Input type="email" {...field} placeholder="Enter email" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!user && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Password</Label>
                    <FormControl>
                      <Input type="password" {...field} placeholder="Enter password" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <Label>Role</Label>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {user ? "Update User" : "Create User"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
