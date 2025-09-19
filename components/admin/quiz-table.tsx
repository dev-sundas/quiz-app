"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Plus, Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, parseISO } from "date-fns"
import type { Quiz } from "@/lib/types"
import { importQuiz, updateQuiz } from "@/lib/api"
import { Switch } from "../ui/switch"
import { Input } from "../ui/input"

interface QuizTableProps {
  quizzes: Quiz[]
  onDelete: (id: string) => Promise<void>
  isDeleting?: string
}

export function QuizTable({ quizzes: initialQuizzes, onDelete, isDeleting }: QuizTableProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes) // ✅ now we have setQuizzes
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const handleDelete = async () => {
    if (deleteQuizId) {
      await onDelete(deleteQuizId)
      setQuizzes((prev) => prev.filter((q) => q.id !== deleteQuizId)) // ✅ keep quizzes in sync
      setDeleteQuizId(null)
    }
  }
  const handleImportQuiz = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const res = await importQuiz(file)

      // alert(res.message)

      // ✅ Add new quiz to state without refreshing
      setQuizzes((prev) => [res.quiz, ...prev])
    } catch (err: any) {
      console.error("Upload failed", err)
      alert("Error: " + err.message)
    } finally {
      // ✅ Reset input so user can re-select same file
      e.target.value = ""
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Quiz Management</CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Link href="/admin/quizzes/new" className="w-full sm:w-auto">
              <Button className="flex items-center justify-center gap-2 w-full">
                <Plus className="h-4 w-4" />
                Create Quiz
              </Button>
            </Link>
            <Button
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="h-4 w-4" />
              Import Quiz
            </Button>

            {/* Hidden shadcn input */}
            <Input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImportQuiz} />
          </div>
        </CardHeader>
        <CardContent>
          {quizzes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No quizzes found</p>
              <Link href="/admin/quizzes/new">
                <Button>Create Your First Quiz</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="border rounded-lg p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{quiz.title}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          {quiz.total_time}m
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {quiz.questions?.length || 0} questions
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {quiz.max_attempts && quiz.max_attempts > 0 ? `${quiz.max_attempts} attempts` : "Unlimited"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{quiz.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Created {formatDistanceToNow(parseISO(quiz.created_at + "Z"), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0 sm:min-w-fit">
                    <Link href={`/admin/quizzes/${quiz.id}/questions`} className="w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm bg-transparent">
                        Manage Questions
                      </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/quizzes/${quiz.id}/edit`}>
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteQuizId(quiz.id)}
                        disabled={isDeleting === quiz.id}
                        className="flex-1 sm:flex-none"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={quiz.is_active}
                        onCheckedChange={async (checked) => {
                          try {
                            await updateQuiz(String(quiz.id), {
                              title: quiz.title,
                              description: quiz.description,
                              total_time: quiz.total_time,
                              max_attempts: quiz.max_attempts,
                              is_active: checked,
                            })
                            // ✅ trigger re-render instead of mutating quiz
                            setQuizzes((prev) => prev.map((q) => (q.id === quiz.id ? { ...q, is_active: checked } : q)))
                          } catch (err) {
                            console.error("Failed to toggle quiz", err)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteQuizId} onOpenChange={() => setDeleteQuizId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quiz? This action cannot be undone and will also delete all
              associated questions and student attempts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
