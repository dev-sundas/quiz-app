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
import { Question } from "@/lib/types"

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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Questions</CardTitle>
          <Button onClick={onCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </CardHeader>
        <CardContent>
          {(questions?.length ?? 0) === 0 ?(
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No questions found</p>
              <Button onClick={onCreateNew}>Add Your First Question</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Q{index + 1}</span>
                        <Badge variant="secondary">{question.marks} marks</Badge>
                      </div>
                      <p className="font-medium mb-3">{question.text}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(question)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteQuestionId(question.id)}
                        disabled={isDeleting === question.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {question.options?.map((option, optIndex) => (
                      <div
                        key={option.id}
                        className={`flex items-center gap-2 p-2 rounded text-sm ${
                          option.is_correct ? "bg-green-50 border border-green-200" : "bg-gray-50"
                        }`}
                      >
                        <span className="font-medium text-muted-foreground">{String.fromCharCode(65 + optIndex)}.</span>
                        <span className="flex-1">{option.text}</span>
                        {option.is_correct && <CheckCircle className="h-4 w-4 text-green-600" />}
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
