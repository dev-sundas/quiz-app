"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DetailedQuizAttempt } from "@/lib/types"
import { TrendingUp, Users, Target, Clock } from "lucide-react"

interface ResultsStatsProps {
  results: DetailedQuizAttempt[]
}

export function ResultsStats({ results }: ResultsStatsProps) {
  const completedResults = results.filter((r) => r.graded_at && r.max_score !== undefined && r.max_score)
  const inProgressResults = results.filter((r) => !r.graded_at)

  const totalAttempts = results.length
  const completedAttempts = completedResults.length
  const completionRate = totalAttempts > 0 ? (completedAttempts / totalAttempts) * 100 : 0

  const averageScore =
    completedResults.length > 0
      ? completedResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / completedResults.length
      : 0

  const highScores = completedResults.filter((r) => (r.percentage || 0) >= 80).length
  const mediumScores = completedResults.filter((r) => (r.percentage || 0) >= 60 && (r.percentage || 0) < 80).length
  const lowScores = completedResults.filter((r) => (r.percentage || 0) < 60).length

  const uniqueStudents = new Set(results.map((r) => r.user_id)).size
  const uniqueQuizzes = new Set(results.map((r) => r.quiz_id)).size

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAttempts}</div>
          <div className="flex items-center gap-2 mt-2">
            <div className="text-xs text-muted-foreground">
              {completedAttempts} completed, {inProgressResults.length} in progress
            </div>
          </div>
          <Progress value={completionRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">{completionRate.toFixed(1)}% completion rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground mt-2">Based on {completedAttempts} completed attempts</div>
          <Progress value={averageScore} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueStudents}</div>
          <div className="text-xs text-muted-foreground mt-2">Across {uniqueQuizzes} different quizzes</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance Distribution</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-green-600">Excellent (80%+)</span>
              <span className="font-medium">{highScores}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-yellow-600">Good (60-79%)</span>
              <span className="font-medium">{mediumScores}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-red-600">Needs Work (&lt;60%)</span>
              <span className="font-medium">{lowScores}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
