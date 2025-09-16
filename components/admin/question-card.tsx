"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Question } from "@/lib/types"



interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedAnswer: string | undefined
  onAnswerChange: (questionId: string, answerId: string) => void
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerChange,
}: QuestionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Question {questionNumber} of {totalQuestions}
          </CardTitle>
          <div className="text-sm text-muted-foreground">{selectedAnswer ? "Answered" : "Not answered"}</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-base leading-relaxed text-pretty">{question.question}</p>

        <RadioGroup
          value={selectedAnswer || ""}
          onValueChange={(value) => onAnswerChange(question.id, value)}
          className="space-y-3"
        >
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-3">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="flex-1 cursor-pointer leading-relaxed">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
