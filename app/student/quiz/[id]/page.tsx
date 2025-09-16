"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { StudentLayout } from "@/components/student/student-layout"
import { QuizQuestion } from "@/components/student/quiz-question"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import type {Quiz, QuizAttempt } from "@/lib/types"
import { ChevronLeft, ChevronRight, Clock, CheckCircle } from "lucide-react"
import {
  getOrCreateQuizAttempt,
  getQuizDetailById,
  submitQuizAttempt,
  saveQuizAnswer,
} from "@/lib/api"
import { QuizTimer } from "@/components/admin/quiz-timer"
import { toStudentQuiz } from "@/lib/helper"

export default function QuizTakingPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [startTime] = useState(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [redirecting, setRedirecting] = useState(false)


useEffect(() => {
  const loadQuizAndAttempt = async () => {
    setIsLoading(true)
    setError("")
    try {
      // 1️⃣ Ensure attempt exists first
      let existingAttempt: QuizAttempt | null = null
      try {
        existingAttempt = await getOrCreateQuizAttempt(Number(params.id))
      } catch {
        await new Promise((res) => setTimeout(res, 300))
        existingAttempt = await getOrCreateQuizAttempt(Number(params.id))
      }

      if (!existingAttempt) throw new Error("No attempt returned")
       

      if (existingAttempt.submitted_at) {
        setRedirecting(true)
        router.replace(`/student/quiz/${params.id}/results/${existingAttempt.id}`)
        return
      }

      // 2️⃣ Fetch quiz definition
      const quizData = await getQuizDetailById(Number(params.id))
     
      // 3️⃣ Convert to student quiz and apply shuffle
      const studentQuiz = toStudentQuiz(quizData, existingAttempt.shuffle_data)

      setQuiz(studentQuiz)
      setAttempt(existingAttempt)

      if (existingAttempt.deadline) {
        localStorage.setItem(
          `quiz_timer_${quizData.id}`,
          new Date(existingAttempt.deadline).getTime().toString()
        )
      }

      if (existingAttempt.answers?.length) {
        const savedAnswers: Record<string, string | number> = {}
        existingAttempt.answers.forEach((a) => {
          if (a.selected_option_id !== undefined) {
            savedAnswers[String(a.question_id)] = a.selected_option_id
          }
        })
        setAnswers(savedAnswers)
      }

    } catch (err) {
      console.error("Error loading quiz or starting attempt:", err)
      setError("Failed to load quiz or start attempt. Please refresh.")
    } finally {
      setIsLoading(false)
    }
  }

  loadQuizAndAttempt()
}, [params.id, router])




  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))

    if (attempt) {
      saveQuizAnswer(Number(attempt.id), {
        question_id: Number(questionId),
        selected_option_id: Number(answer),
      })
        .then((updatedAttempt) => {
          setAttempt(updatedAttempt)
          // ✅ keep local answer to avoid "last question bug"
          setAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
          }))
        })
        .catch((err: unknown) => console.error("Auto-save failed:", err))
    }
  }

  const handleTimeUp = () => {
    setTimeout(() => {
      handleSubmitQuiz()
    }, 0)
  }

  const handleSubmitQuiz = async () => {
    if (!quiz || !user || !attempt || isSubmitting) return

    setIsSubmitting(true)
    try {
      const endTime = new Date()
      const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

      const answersPayload = quiz.questions.map((q) => ({
        question_id: Number(q.id),
        selected_option_id: answers[q.id] !== undefined ? Number(answers[q.id]) : null,
      }))

      const savedAttempt = await submitQuizAttempt(Number(attempt.id), answersPayload)
      router.push(`/student/quiz/${quiz.id}/results/${savedAttempt.id}`)
    } catch (err: any) {
      console.error("Submit quiz failed:", err)
      setError("Failed to submit quiz")
      setIsSubmitting(false)
    }
  }

  const canSubmit = () => {
    return quiz?.questions.every((q) => Object.hasOwn(answers, q.id)) ?? false
  }

  const unansweredCount =
    quiz?.questions.filter((q) => !Object.hasOwn(answers, q.id)).length ?? 0

  const progress = quiz ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0

  if (isLoading || redirecting) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </StudentLayout>
    )
  }

  if (error || !quiz) {
    return (
      <StudentLayout>
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>{error || "Quiz not found"}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => router.push("/student")}>Back to Dashboard</Button>
          </div>
        </div>
      </StudentLayout>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Quiz Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                <p className="text-muted-foreground">{quiz.description}</p>
              </div>
              {quiz.total_time > 0 && (
                <QuizTimer
                  quizId={Number(quiz.id)}
                  deadline={attempt?.deadline}
                  timeLimit={quiz.total_time}
                  onTimeUp={handleTimeUp}
                  isActive={!isSubmitting}
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Current Question */}
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quiz.questions.length}
          selectedAnswer={answers[currentQuestion.id]}
          onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {quiz.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? "bg-primary text-primary-foreground"
                    : Object.hasOwn(answers, q.id)
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button onClick={handleSubmitQuiz} disabled={isSubmitting || !canSubmit()}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Quiz
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() =>
                setCurrentQuestionIndex(
                  Math.min(quiz.questions.length - 1, currentQuestionIndex + 1),
                )
              }
              disabled={currentQuestionIndex === quiz.questions.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Submit Warning */}
        {!canSubmit() && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Please answer all questions before submitting. You have {unansweredCount} unanswered
              questions.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </StudentLayout>
  )
}
