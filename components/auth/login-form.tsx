"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { LoginFormValues, loginSchema } from "@/lib/types"
import { toast } from "sonner"



export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [serverError, setServerError] = React.useState("")
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" }
  })

 const onSubmit = async (values: LoginFormValues) => {
  try {
    setServerError("")
    const result = await login(values.username, values.password)

    if (result.success && result.user) {
      toast.success("You have logged in successfully.", {
        description: "Redirecting...",
        style: { background: "#22c55e", color: "#fff" },
      })

      // 🔹 Small delay so toast is visible before redirect
      setTimeout(() => {
        if (result.user!.role === "admin") router.push("/admin")
        else if (result.user!.role === "student") router.push("/student")
        else router.push("/login")
      }, 400)
    } else {
      setServerError(result.error || "Login failed")
      toast.error(result.error || "Login failed", {
        description: "SignIn failed",
        style: { background: "#ff0000", color: "#fff" },
      })
    }
  } catch (error) {
    toast.error("Unknown error occurred", {
      description: `SignIn failed Error: "${error}"`,
    })
  }
}

 
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Quiz App Login</CardTitle>
          <CardDescription>Enter your credentials to access your quizzes</CardDescription>
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="username">Username</Label>
                    <FormControl>
                      <Input id="username" placeholder="Enter your username" {...field} />
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
                      <Input id="password" type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign In
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Do not have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Sign up here
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
