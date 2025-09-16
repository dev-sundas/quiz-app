"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QuizResult } from "@/lib/types"
import { ArrowLeft, Trophy, Target, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

interface ResultsHeaderProps {
  results: QuizResult[]
}

export function ResultsHeader({ results }: ResultsHeaderProps) {
  const router = useRouter()

  const totalQuizzes = results.length
  const averageScore =
    totalQuizzes > 0
      ? Math.round(results.reduce((sum, result) => sum + (result.score / result.max_score!) * 100, 0) / totalQuizzes)
      : 0
  const bestScore =
    totalQuizzes > 0 ? Math.max(...results.map((result) => Math.round((result.score / result.max_score!) * 100))) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/student")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Quiz Results</h1>
            <p className="text-muted-foreground">Your quiz performance history</p>
          </div>
        </div>
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
  )
}
