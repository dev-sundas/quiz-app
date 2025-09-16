"use client"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/admin/navbar"
import { QuizForm } from "@/components/admin/quiz-form"
import { createQuiz } from "@/lib/api"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useState } from "react"

export default function NewQuizPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
   const handleSubmit = async (data: { title: string; description: string; total_time: number }) => {
    setLoading(true) // start loading
    try {
      await createQuiz(data)
      router.push("/admin/quizzes")
    } finally {
      setLoading(false) // stop loading (in case of error)
    }
  }
  const handleCancel = () => {
    router.push("/admin/quizzes")
  }

  return (
    <ProtectedRoute adminOnly>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Quiz</h1>
          <p className="text-muted-foreground">Add a new quiz to your collection</p>
        </div>

        <QuizForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={loading} />
      </div>
    </ProtectedRoute>
  )
}
