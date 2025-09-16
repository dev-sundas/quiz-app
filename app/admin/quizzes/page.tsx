"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/admin/navbar"
import { QuizTable } from "@/components/admin/quiz-table"
import { getQuizzes, deleteQuiz } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Quiz } from "@/lib/types"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string>("")

 useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true) // make sure loading starts before fetch
        const data = await getQuizzes()
        // console.log("data",data)
        setQuizzes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quizzes")
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteQuiz(id)
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quiz")
    } finally {
      setDeletingId("")
    }
  }

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading quizzes...</p>
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
          <h1 className="text-3xl font-bold">Quiz Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage your quizzes</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <QuizTable quizzes={quizzes} onDelete={handleDelete} isDeleting={deletingId} />
      </div>
    </ProtectedRoute>
  )
}
