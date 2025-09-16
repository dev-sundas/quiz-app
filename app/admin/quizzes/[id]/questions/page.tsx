"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/admin/navbar"
import { QuestionList } from "@/components/admin/question-list"
import { QuestionForm } from "@/components/admin/question-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createOption,
  updateOption,
  deleteOption,
  getQuizDetailById,
} from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Question, Quiz } from "@/lib/types"

export default function QuestionManagementPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const quizId = params.id

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [deletingId, setDeletingId] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)


  useEffect(() => {
    fetchData()
  }, [quizId])

  const fetchData = async () => {
    setLoading(true)
    try {
      const quiz = await getQuizDetailById(Number(quizId)) // ✅ fetch with options included
      setQuiz(quiz)
      setQuestions(quiz.questions ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }



  const handleCreateNew = () => {
    setEditingQuestion(null)
    setShowForm(true)
  }

  const handleEdit = (question: Question) => {
    setEditingQuestion(question)
    setShowForm(true)
  }
 const handleFormSubmit = async (data: {
  text: string
  marks: number
  options: { text?: string; is_correct: boolean; id?: string }[]
}) => {
  setSubmitting(true)
  try {
    let question: Question

    if (editingQuestion) {
      // 1. Update question text & marks
      question = await updateQuestion(editingQuestion.id, {
        text: data.text,
        marks: data.marks,
      })

      // 2. Delete removed options
      const existingOptionIds = editingQuestion.options?.map((opt) => opt.id) || []
      const submittedOptionIds = data.options.filter((opt) => opt.id).map((opt) => opt.id!)

      for (const optionId of existingOptionIds) {
        if (!submittedOptionIds.includes(optionId)) {
          await deleteOption(optionId)
        }
      }

      // 3. Update existing or create new options
      const updatedOptions: Question["options"] = []
      // for (const optionData of data.options) {
      //   if (optionData.id) {
      //     // ✅ Update existing option
      //     const updatedOption = await updateOption(optionData.id, {
      //       text: optionData.text,
      //       is_correct: optionData.is_correct,
      //     })
      //     updatedOptions.push(updatedOption)
      //   } else if (optionData.text.trim() !== "") {
      //     // ✅ Only create if text is not empty
      //     const newOption = await createOption({
      //       question_id: question.id,
      //       text: optionData.text,
      //       is_correct: optionData.is_correct,
      //     })
      //     updatedOptions.push(newOption)
      //   }
      // }
    for (const optionData of data.options) {
      const text = optionData.text?.trim()
      if (!text) continue // skip empty or undefined

      if (optionData.id) {
        const updatedOption = await updateOption(optionData.id, {
          text, // ✅ safe, always a string here
          is_correct: optionData.is_correct,
        })
        updatedOptions.push(updatedOption)
      } else {
        const newOption = await createOption({
          question_id: question.id,
          text, // ✅ safe
          is_correct: optionData.is_correct,
        })
        updatedOptions.push(newOption)
      }
    }



      // 4. Assign back to question
      question.options = updatedOptions
    } else {
      // ✅ Create new question
      question = await createQuestion({
        quiz_id: quizId,
        text: data.text,
        marks: data.marks,
      })

      // ✅ Create options
      // const createdOptions: Question["options"] = []
      // for (const optionData of data.options) {
      //   if (optionData.text.trim() !== "") {
      //     const option = await createOption({
      //       question_id: question.id,
      //       text: optionData.text,
      //       is_correct: optionData.is_correct,
      //     })
      //     createdOptions.push(option)
      //   }
      // }

      // question.options = createdOptions
      const createdOptions: Question["options"] = []
      for (const optionData of data.options) {
        const text = optionData.text?.trim()
        if (!text) continue // skip if undefined or empty string

        const option = await createOption({
          question_id: question.id,
          text, // ✅ safe string here
          is_correct: optionData.is_correct,
        })
        createdOptions.push(option)
      }

      question.options = createdOptions

    }

    // ✅ Refresh list
    await fetchData()
    setShowForm(false)
    setEditingQuestion(null)
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to save question")
  } finally {
    setSubmitting(false)
  }
}




  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteQuestion(id)
      setQuestions(questions.filter((q) => q.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete question")
    } finally {
      setDeletingId("")
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingQuestion(null)
  }

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading questions...</p>
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
          <Button variant="ghost" onClick={() => router.push("/admin/quizzes")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quizzes
          </Button>
          <h1 className="text-3xl font-bold">Manage Questions</h1>
          <p className="text-muted-foreground">
            Quiz: <span className="font-medium">{quiz.title}</span>
          </p>
        </div>

        {showForm ? (
          <QuestionForm
            question={editingQuestion}
            quizId={quizId}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isLoading={submitting}
          />
        ) : (
          <QuestionList
            questions={questions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreateNew={handleCreateNew}
            isDeleting={deletingId}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
