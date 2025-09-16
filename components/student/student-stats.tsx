"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Trophy, Target, Clock, TrendingUp } from "lucide-react"
import { getStudentStats } from "@/lib/api"

interface StudentStats {
  totalAttempts: number
  averageScore: number
  bestScore: number
  totalTimeSpent: number
}

export function StudentStats() {
  const [stats, setStats] = useState<StudentStats>({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    totalTimeSpent: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return

      try {
        // ✅ Now expecting StudentStats directly from backend
        const data: StudentStats = await getStudentStats(user.id)
        // console.log("student stats----->", data)
        setStats(data)
      } catch (error) {
        console.error("Failed to load student stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [user])

  const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}
  const statCards = [
    {
      title: "Quizzes Taken",
      value: stats.totalAttempts,
      icon: Target,
      description: "Total completed",
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}%`,
      icon: TrendingUp,
      description: "Overall performance",
    },
    {
      title: "Best Score",
      value: `${stats.bestScore}%`,
      icon: Trophy,
      description: "Personal best",
    },
    {
      title: "Time Spent",
      value: `${formatTime(stats.totalTimeSpent)}`,
      icon: Clock,
      description: "Total study time",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse mb-1" />
              <div className="h-3 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
