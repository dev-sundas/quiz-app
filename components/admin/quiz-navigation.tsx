"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface QuizNavigationProps {
  currentQuestion: number
  totalQuestions: number
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  canSubmit: boolean
  isSubmitting: boolean
}

export function QuizNavigation({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  canSubmit,
  isSubmitting,
}: QuizNavigationProps) {
  const isFirstQuestion = currentQuestion === 0
  const isLastQuestion = currentQuestion === totalQuestions - 1

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion || isSubmitting}
        className="flex items-center gap-2 bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === currentQuestion ? "bg-primary" : i < currentQuestion ? "bg-primary/50" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {isLastQuestion ? (
        <Button onClick={onSubmit} disabled={!canSubmit || isSubmitting} className="flex items-center gap-2">
          {isSubmitting ? "Submitting..." : "Submit Quiz"}
        </Button>
      ) : (
        <Button onClick={onNext} disabled={isSubmitting} className="flex items-center gap-2">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
