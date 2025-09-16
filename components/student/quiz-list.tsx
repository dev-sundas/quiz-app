"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { QuizCard } from "./quiz-card"
import { useAuth } from "@/contexts/auth-context"
import type { Quiz } from "@/lib/types"
import { FileText } from "lucide-react"
import { getQuizzes } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadQuizzes = async () => {
      setIsLoading(true)
      try {
        const allQuizzes = await getQuizzes()
        // console.log("allQuizzes------->",allQuizzes)
        // setQuizzes(allQuizzes)
        setQuizzes(allQuizzes.map(q => ({ ...q })))
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load quizzes.",
          variant: "destructive",
        })
        console.error("Failed to load quizzes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadQuizzes()
  }, [user])

  const handleStartQuiz = (quizId: string) => {
    router.push(`/student/quiz/${quizId}`)
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-10 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No quizzes available</h3>
          <p className="text-muted-foreground">
            There are currently no active quizzes. Check back later for new quizzes to take.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          attemptsMade={quiz.attempts_made} // dynamically computed
          onStartQuiz={handleStartQuiz}
        />
      ))}
    </div>
  )
}
