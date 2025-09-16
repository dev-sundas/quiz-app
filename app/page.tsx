"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {BarChart3, GraduationCap, Shield, Users} from "lucide-react"

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [navigating, setNavigating] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect authenticated users to their dashboard
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/student")
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  // 🔹 Show loader either when auth is loading OR navigation is pending
  if (isLoading || isPending || navigating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Modern Quiz Management System
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              A comprehensive platform for creating, managing, and taking quizzes. Perfect for educators and students
              alike.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg"  onClick={() =>
                  startTransition(() => {
                  setNavigating(true)
                  router.push("/signup")
                  })
                }  className="text-lg px-8">
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() =>
                  startTransition(() => {
                  setNavigating(true)
                  router.push("/login")
                  })
                } className="text-lg px-8">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything you need for quiz management
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Streamline your educational workflow with our comprehensive quiz platform
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Student Portal</CardTitle>
                <CardDescription>
                  Intuitive interface for students to take quizzes, view results, and track progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Take quizzes with timer support</li>
                  <li>• View detailed results and feedback</li>
                  <li>• Track performance over time</li>
                  <li>• Retake quizzes for improvement</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>
                  Powerful tools for administrators to create and manage quizzes and users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Create and edit quizzes</li>
                  <li>• Manage student accounts</li>
                  <li>• View comprehensive analytics</li>
                  <li>• Monitor quiz performance</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>
                  Detailed reporting and analytics to understand quiz performance and student progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Real-time performance metrics</li>
                  <li>• Student progress tracking</li>
                  <li>• Quiz difficulty analysis</li>
                  <li>• Comprehensive reporting</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 lg:py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Ready to get started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of educators and students using our quiz management platform
            </p>
            <Button size="lg" onClick={() => router.push("/signup")} className="text-lg px-8">
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground">Quiz Management System</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with modern web technologies for the best user experience
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
