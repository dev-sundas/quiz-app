"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { StudentLayout } from "@/components/student/student-layout"
import { QuizQuestion } from "@/components/student/quiz-question"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Quiz, QuizAttempt } from "@/lib/types"
import { Trophy, Clock, Target, RotateCcw, Home, File, FileText } from "lucide-react"

// ✅ import your new API functions
import { getQuizDetailById, getQuizAttempt, getQuizzes } from "@/lib/api"
import { formatTime } from "@/lib/helper"

interface QuizResultsPageProps {
    params: { id: string; attemptId: string } | Promise<{ id: string; attemptId: string }>
}

export default function QuizResultsPage({ params }: QuizResultsPageProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

useEffect(() => {
    const load = async () => {
      const { id, attemptId } = await params  // unwrap the Promise
      try {
        const [quizData, attemptData,allQuizzes] = await Promise.all([
          getQuizDetailById(Number(id)),
          getQuizAttempt(attemptId),
          getQuizzes(),
        ])
        // console.log("quizData, attemptData",quizData, attemptData)
        if (!quizData || !attemptData) {
          router.push("/student")
          return
        }
        const quizFromList = allQuizzes.find((q: any) => q.id === Number(id))

        if (quizFromList) {
          quizData.attempts_made = quizFromList.attempts_made
          quizData.max_attempts = quizFromList.max_attempts
          quizData.is_active = quizFromList.is_active
        }

        // quizData.questions.sort((a, b) => a.order - b.order)
        setQuiz(quizData)
        setAttempt(attemptData)
      } catch (err) {
        console.error("Failed to load results:", err)
        router.push("/student")
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [params])



  if (isLoading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </StudentLayout>
    )
  }

  if (!quiz || !attempt) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Results not found</p>
          <Button onClick={() => router.push("/student")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </StudentLayout>
    )
  }

 
  

  const percentage = Math.round((attempt.score / attempt.totalPoints) * 100)
  const timeSpent = attempt.timeSpent ?? 0
  // const timeSpentMinutes = Math.floor(attempt.timeSpent / 60)
  // const timeSpentSeconds = attempt.timeSpent % 60
  const attemptsMade = quiz?.attempts_made ?? 0
  const maxAttempts = quiz?.max_attempts ?? Infinity
  const canRetake = quiz?.is_active && attemptsMade < maxAttempts



const formattedTime = formatTime(attempt.timeSpent ?? 0) 

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 90) return { text: "Excellent", variant: "default" as const }
    if (percentage >= 80) return { text: "Good", variant: "secondary" as const }
    if (percentage >= 60) return { text: "Fair", variant: "secondary" as const }
    return { text: "Needs Improvement", variant: "destructive" as const }
  }

  const performanceBadge = getPerformanceBadge(percentage)

  return (
    
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
            <p className="text-muted-foreground">{quiz.title}</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getPerformanceColor(percentage)}`}>{percentage}%</div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <Badge variant={performanceBadge.variant} className="mt-2">
                  {performanceBadge.text}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {attempt.score}/{attempt.totalPoints}
                </div>
                <p className="text-sm text-muted-foreground">Points Earned</p>
                <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4 mr-1" />
                  {attempt.answers?.filter((a) => a.isCorrect).length ?? 0}/{attempt.answers?.length ?? 0} Correct
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {/* {timeSpentMinutes}:{timeSpentSeconds.toString().padStart(2, "0")} */}
                   {formattedTime}
                </div>
                <p className="text-sm text-muted-foreground">Time Spent</p>
                <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {/* {quiz.timeLimit ? `${quiz.timeLimit} min limit` : "No time limit"} */}
                  {quiz.total_time ? `${quiz.total_time} min limit` : "No time limit"}
                </div>
               
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Question Review</h2>
          {quiz.questions.map((question, index) => {
            const answer = attempt?.answers?.find(
                (a) => String(a.question_id) === String(question.id)
              )
                // console.log("answer for question", question.id, answer)

            return (
              <QuizQuestion
                key={question.id}
                question={question}
                questionNumber={index + 1}
                totalQuestions={quiz.questions.length}
                selectedAnswer={answer?.selected_option_id}
                onAnswerChange={() => {}} // Read-only
                showResult={true}             
                isCorrect={answer?.isCorrect}
              />
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-3">
           {/* Back to Dashboard */}
          <Button onClick={() => router.push("/student")} variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

         <Button
            onClick={() => router.push(`/student/quiz/${quiz.id}`)}
            disabled={!canRetake}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {attemptsMade >= maxAttempts ? "No Attempts Left" : "Retake Quiz"}          
            </Button>
        </div>
      </div>
    </StudentLayout>
  )
}
