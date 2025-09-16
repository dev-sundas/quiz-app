"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Question } from "@/lib/types"

interface QuizQuestionProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedAnswer: string | number | undefined
  onAnswerChange: (answer: string | number) => void
  showResult?: boolean
  isCorrect?: boolean
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerChange,
  showResult = false,
  isCorrect,
}: QuizQuestionProps) {
  // Since API doesn't provide `type`, assume multiple-choice by default
  const renderQuestionInput = () => {

    return (
      <RadioGroup
        value={selectedAnswer?.toString()}
        onValueChange={(value) => onAnswerChange(Number.parseInt(value))}
        disabled={showResult}
      >
        <div className="space-y-3">
          {question.options?.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
              <Label
                htmlFor={`option-${option.id}`}
                className={`flex-1 cursor-pointer p-3 rounded-md border transition-colors ${
                  showResult
                    ? option.is_correct
                      ? "bg-green-50 border-green-200 text-green-800"
                      : selectedAnswer !== undefined && Number(selectedAnswer) === Number(option.id)
                        ? "bg-red-50 border-red-200 text-red-800"
                        : "bg-muted  text-muted-foreground"
                  : selectedAnswer !== undefined && Number(selectedAnswer) === Number(option.id)
                      ? "bg-primary/10 border-primary/15"
                      : "hover:bg-muted"
                }`}
              >
                {option.text}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Question {questionNumber} of {totalQuestions}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{question.marks} points</span>
            {isCorrect !== undefined && (
              <div
                className={`mt-2 px-2 py-1 rounded text-xs font-medium ${
                  isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {isCorrect ? "Correct" : "Incorrect"}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-foreground font-medium text-balance">{question.text}</div>
          {renderQuestionInput()}
        </div>
      </CardContent>
    </Card>
  )
}
