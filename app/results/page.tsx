"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/admin/navbar"
import { ResultCard } from "@/components/admin/result-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, FileText, Trophy, Target, TrendingUp } from "lucide-react"
import { getQuizResults, getQuizzes, getCurrentUser } from "@/lib/api"
import { QuizResult } from "@/lib/types"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { durationInMinutes, parseBackendDate } from "@/lib/helper"

export default function ResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const fetchResults = async () => {
  setLoading(true)
  setError("")

  try {
    const [resultsData, quizzes, users] = await Promise.all([
      getQuizResults(), // DetailedQuizAttempt[]
      getQuizzes(),
      getCurrentUser(),
    ])
    // console.log("resultsData",resultsData)
    // console.log("quizzes",quizzes)
    // console.log("users",users)

   const currentUser = users; // your logged-in user


   const enhancedResults: QuizResult[] = resultsData
  .filter(r => r.student.id === currentUser.id) // <-- only their results
  .map(r => {
    const quiz = quizzes.find(q => q.id === r.quiz_id)
    const score = r.score ?? 0
    const max_score = r.max_score ?? 0
    const percentage = max_score > 0 ? (score / max_score) * 100 : 0
    const startedIso = r.started_at ? parseBackendDate(r.started_at + "Z") : undefined
    const completedIso = r.submitted_at ? parseBackendDate(r.submitted_at + "Z") : undefined
    const gradedIso = r.graded_at ? parseBackendDate(r.graded_at + "Z") : undefined
    const submittedIso = r.submitted_at ? parseBackendDate(r.submitted_at + "Z") : undefined
    const duration_minutes = durationInMinutes(r.started_at, r.submitted_at)

    return {
      id: String(r.id),
      quiz_id: String(quiz?.id ?? r.quiz_id),
      user_id: String(currentUser.id),
      answers: r.answers ?? [],
      totalPoints: r.totalPoints ?? max_score,
      started_at: startedIso ?? new Date(0),
      submitted_at: submittedIso,
      timeSpent: r.timeSpent ?? 0,
      score,
      max_score,
      title: quiz?.title ?? r.quiz_title ?? "Unknown Quiz",
      graded_at: gradedIso,
      duration_minutes,
      percentage,
      passed: percentage >= 50,
      attempt: r,
      quiz,
      student: currentUser,
    }
  })


    setResults(enhancedResults)
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to load results")
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchResults()
  }, [])

  const totalQuizzes = results.length
  const averageScore = totalQuizzes > 0 ? Math.round(results.reduce((sum, r) => sum + (r.score ?? 0) / (r.max_score ?? 1) * 100, 0) / totalQuizzes): 0
  const bestScore = totalQuizzes > 0 ? Math.max(...results.map(r => Math.round((r.score ?? 0) / (r.max_score ?? 1) * 100))) : 0

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Quiz Results</h1>
              <p className="text-muted-foreground">Your quiz performance history</p>
            </div>

            {totalQuizzes > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{totalQuizzes}</div>
                      <div className="text-sm text-muted-foreground">Quizzes Completed</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{averageScore}%</div>
                      <div className="text-sm text-muted-foreground">Average Score</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Target className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{bestScore}%</div>
                      <div className="text-sm text-muted-foreground">Best Score</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Quiz History</h2>
                <p className="text-muted-foreground">
                  {results.length > 0
                    ? `${results.length} quiz${results.length === 1 ? "" : "es"} completed`
                    : "No completed quizzes yet"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchResults}
                disabled={loading}
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No quiz results yet</p>
                  <p className="text-sm">Complete some quizzes to see your results here</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result) => (
                  <ResultCard key={result.id} result={result} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
