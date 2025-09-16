"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import { SignupFormValues, signupSchema } from "@/lib/types"
import { toast } from "sonner"



interface SignupFormProps {
  onSuccess?: () => void
  showLoginLink?: boolean
  onShowLogin?: () => void
}

export function SignupForm({ onSuccess, showLoginLink = true, onShowLogin }: SignupFormProps) {
  const { signup, isLoading } = useAuth()
  const [serverError, setServerError] = React.useState("")

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

const onSubmit = async (values: SignupFormValues) => {
  try {
    setServerError("")
    const result = await signup(values.email, values.password, values.name)
    if (result.success) {
      toast.success("You have signed up successfully.", {
        description: "Redirecting...",
        style: { background: "#22c55e", color: "#fff" },
      })
      // ✅ No need to redirect to /login,
      // because AuthProvider.login() already pushes user
      onSuccess?.()
    } else {
        setServerError(result.error || "Signup failed")
        toast.error(result.error || "Signup failed", {
          description: "Please use a different email or log in.",
          style: { background: "#ff0000", color: "#fff" },
        })
      }
  } catch (error) {
    toast.error("Unknown error occurred", {
      description: `Signup failed Error: "${error}"`,
      })
    }
  }
  
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up to start taking quizzes</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <Alert variant="destructive">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Full Name</Label>
                    <FormControl>
                      <Input id="name" placeholder="Enter your full name" {...field} />
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
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input id="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">Password</Label>
                    <FormControl>
                      <Input id="password" type="password" placeholder="Create a password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <FormControl>
                      <Input id="confirmPassword" type="password" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link  href={"/login"} className="text-primary hover:underline font-medium" >
                    Sign in here
                  </Link>
                </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
