"use client"

import { useEffect, useState } from "react"
import { getMyQuizHistory } from "@/lib/api"
import { QuizHistory, QuizAttemptSummary } from "@/lib/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { Trophy, Target, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react"

export function StudentQuizHistory() {
  const [history, setHistory] = useState<QuizHistory[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return
      try {
        const data = await getMyQuizHistory()
        setHistory(data)
      } catch (error) {
        console.error("Failed to load student history:", error)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [user])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse w-32" />
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
          </Card>
        ))}
      </div>
    )
  }

  if (!history.length) return <p>No quiz history yet.</p>

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {history.map((quiz) => {
        const totalCorrect = quiz.attempts.reduce((sum, a) => sum + a.correctAnswers, 0)
        const totalWrong = quiz.attempts.reduce((sum, a) => sum + a.wrongAnswers, 0)

        const avg = Math.round(quiz.averageScore || 0)
        const best = Math.round(quiz.bestScore || 0)

        return (
          <Card key={quiz.quiz_id} className="flex flex-col">
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">{quiz.quiz_title}</CardTitle>
              <Badge variant="secondary">Attempts {quiz.totalAttempts}</Badge>
            </CardHeader>

            <CardContent className="space-y-4 px-3 md:px-6">
              {/* Overall Performance */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Best Score</span>
                  <span className="font-medium">{best}</span>
                </div>
                <Progress value={best} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Average</span>
                  <span className="font-medium">{avg}</span>
                </div>
              </div>

              {/* Total Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span>Total: {formatTime(quiz.totalTimeSpent)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{totalCorrect} Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span>{totalWrong} Wrong</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-600" />
                  <span>{quiz.totalQuestions} Questions</span>
                </div>
              </div>

              {/* Per Attempt Stats */}
              <div className="border-t pt-3 space-y-2 max-h-44 overflow-y-auto">
                {quiz.attempts.map((attempt: QuizAttemptSummary, idx: number) => (
                  <div
                    key={`${quiz.quiz_id}-${attempt.id}-${idx}`}
                    className="p-2 border rounded bg-muted/30 grid grid-cols-5 gap-2 text-xs text-center"
                  >
                    <span className="font-semibold">Attempt#{attempt.attempt_number}</span>
                    <span className="text-green-600">✔ {attempt.correctAnswers}</span>
                    <span className="text-red-600">✘ {attempt.wrongAnswers}</span>
                    <span>{attempt.score}/{attempt.totalPoints}</span>
                    <span className="text-purple-600">{formatTime(attempt.timeSpent)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
