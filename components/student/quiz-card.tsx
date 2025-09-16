"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, FileText, Repeat } from "lucide-react"
import type { Quiz } from "@/lib/types"

interface QuizCardProps {
  quiz: Quiz
  loading?: boolean
  onStartQuiz: (quizId: string) => void
  attemptsMade:number
}

export function QuizCard({ quiz, loading = false, onStartQuiz,attemptsMade }: QuizCardProps) {
  const totalPoints = quiz.questions?.reduce((sum, q) => sum + q.marks, 0) || 0
  const maxReached = !!quiz.max_attempts && attemptsMade >= quiz.max_attempts

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{quiz.title}</CardTitle>
        <CardDescription className="mt-1">{quiz.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Quiz Info */}
        <div className="flex flex-col justify-between text-sm text-muted-foreground flex-wrap gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
             <span>{quiz.questions?.length || 0} questions</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{quiz.total_time} min</span>
          </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <Repeat className="h-4 w-4" />
            <span>
              {quiz.max_attempts && quiz.max_attempts > 0
                ? `${quiz.max_attempts} attempts`
                : "Unlimited attempts"}
            </span>
          </div>
          <div className="font-medium text-foreground">{totalPoints} points</div>
          </div>
        </div>


          <Button
            onClick={() => onStartQuiz(quiz.id)}
            disabled={loading || !quiz.is_active || maxReached}
            className="w-full"
          >
            {!quiz.is_active
              ? "Inactive"
              : maxReached
              ? "No Attempts Left"
              : loading
              ? "Starting..."
              : "Start Quiz"}
          </Button>
      </CardContent>
    </Card>
  )
}
