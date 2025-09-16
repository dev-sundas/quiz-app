"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/admin/navbar"
import { StatsCard } from "@/components/admin/stats-card"
import { RecentActivity } from "@/components/admin/recent-activity"
import { QuickActions } from "@/components/admin/quick-actions"
import { getAdminStats } from "@/lib/api"
import { Users, FileText, ClipboardList, HelpCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdminStats } from "@/lib/types"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats()
        // console.log("data",data)
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard stats")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your quiz application</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {stats && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Quizzes"
                value={stats.total_quizzes}
                icon={FileText}
                description="Active quizzes in system"
              />
              <StatsCard title="Total Users" value={stats.total_users} icon={Users} description="Registered users" />
              <StatsCard
                title="Quiz Attempts"
                value={stats.total_attempts}
                icon={ClipboardList}
                description="All time attempts"
              />
              <StatsCard
                title="Total Questions"
                value={stats.total_questions}
                icon={HelpCircle}
                description="Questions across all quizzes"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity attempts={stats.recent_attempts} />
              <QuickActions />
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}
