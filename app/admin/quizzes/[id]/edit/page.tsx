"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navbar } from "@/components/admin/navbar"
import { QuizForm } from "@/components/admin/quiz-form"
import { getQuizzes, updateQuiz } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Quiz } from "@/lib/types"

export default function EditQuizPage() {
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

 useEffect(() => {
  if (!quizId) return
  let isMounted = true

  const fetchQuiz = async () => {
    setLoading(true) // start loading
    try {
      const quizzes = await getQuizzes()
      // console.log("quizez--->",quizzes)
      const foundQuiz = quizzes.find(q => String(q.id) === quizId)
      if (isMounted) {
        if (foundQuiz) setQuiz(foundQuiz)
        else setError("Quiz not found")
      }
    } catch (err) {
      if (isMounted) setError(err instanceof Error ? err.message : "Failed to load quiz")
    } finally {
      if (isMounted) setLoading(false)
    }
  }

  fetchQuiz()
  return () => { isMounted = false }
}, [quizId])

  const handleSubmit = async (data: { title: string; description: string; total_time: number ,max_attempts?:number,is_active:boolean}) => {
    if (!quiz) return
    await updateQuiz(quiz.id, data)
    router.push("/admin/quizzes")
  }

  const handleCancel = () => {
    router.push("/admin/quizzes")
  }

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading quiz...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !quiz) {
    return (
      <ProtectedRoute adminOnly>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error || "Quiz not found"}</AlertDescription>
          </Alert>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute adminOnly>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Quiz</h1>
          <p className="text-muted-foreground">Update quiz details</p>
        </div>

        <QuizForm quiz={quiz} onSubmit={handleSubmit} onCancel={handleCancel}  isLoading={loading}/>
      </div>
    </ProtectedRoute>
  )
}
