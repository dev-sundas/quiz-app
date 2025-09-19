"use client"

import { useState } from "react"
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
import { Edit, Trash2, Plus, CheckCircle } from "lucide-react"
import type { Question } from "@/lib/types"

interface QuestionListProps {
  questions: Question[]
  onEdit: (question: Question) => void
  onDelete: (id: string) => Promise<void>
  onCreateNew: () => void
  isDeleting?: string
}

export function QuestionList({ questions, onEdit, onDelete, onCreateNew, isDeleting }: QuestionListProps) {
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (deleteQuestionId) {
      await onDelete(deleteQuestionId)
      setDeleteQuestionId(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">Questions</CardTitle>
          <Button onClick={onCreateNew} className="flex items-center gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Question</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </CardHeader>
        <CardContent>
          {(questions?.length ?? 0) === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">No questions found</p>
              <Button onClick={onCreateNew} className="w-full sm:w-auto">
                Add Your First Question
              </Button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Q{index + 1}</span>
                        <Badge variant="secondary" className="text-xs">
                          {question.marks} marks
                        </Badge>
                      </div>
                      <p className="font-medium mb-3 text-sm sm:text-base break-words">{question.text}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(question)}
                        className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="hidden sm:inline ml-2">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteQuestionId(question.id)}
                        disabled={isDeleting === question.id}
                        className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline ml-2">Delete</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {question.options?.map((option, optIndex) => (
                      <div
                        key={option.id}
                        className={`flex items-start gap-2 p-2 rounded text-sm ${
                          option.is_correct ? "bg-green-50 border border-green-200" : "bg-gray-50"
                        }`}
                      >
                        <span className="font-medium text-muted-foreground flex-shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        <span className="flex-1 break-words">{option.text}</span>
                        {option.is_correct && <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteQuestionId} onOpenChange={() => setDeleteQuestionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this question? This action cannot be undone and will also delete all
              associated options.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete Question
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
