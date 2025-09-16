"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { OptionData, Question, QuestionFormValues, questionSchema } from "@/lib/types"
import { useEffect } from "react"

interface QuestionFormProps {
  question?: Question | null
  quizId: string
  onSubmit: (data: QuestionFormValues) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function QuestionForm({
  question,
  onSubmit,
  onCancel,
  isLoading = false,
  
}: QuestionFormProps) {
  const form = useForm<QuestionFormValues>({
  resolver: zodResolver(questionSchema),
  defaultValues: {
    text: "",
    marks: 1,
    options: [
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ],
  },
})
useEffect(() => {
  if (question) {
    const initialOptions =
      question.options && question.options.length > 0
        ? question.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
            is_correct: opt.is_correct,
          }))
        : [
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
          ]

    form.reset({
      text: question.text,
      marks: question.marks,
      options: initialOptions,
    })
  }
}, [question, form])



  const options = form.watch("options")

 

  const addOption = () => {
    form.setValue("options", [...options, { text: "", is_correct: false }], {
      shouldValidate: true,
    })
  }

  const updateOption = (index: number, field: keyof OptionData, value: string | boolean) => {
  const newOpts = [...options]
  if (field === "is_correct" && value === true) {
    // only one option can be correct
    newOpts.forEach((opt, i) => {
      opt.is_correct = i === index
    })
  } else {
    newOpts[index] = { ...newOpts[index], [field]: value }
  }
  form.setValue("options", newOpts, { shouldValidate: true })
}


  const removeOption = (index: number) => {
    if (options.length > 2) {
      form.setValue(
        "options",
        options.filter((_, i) => i !== index),
        { shouldValidate: true },
      )
    }
  }

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>{question ? "Edit Question" : "Create New Question"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Question Text */}
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <Label>Question Text</Label>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      disabled={isLoading}
                      placeholder="Enter your question"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Marks */}
           <FormField
              control={form.control}
              name="marks"
              render={({ field }) => (
                <FormItem>
                  <Label>Marks</Label>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      value={field.value ?? 1}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

               
            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Answer Options</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    {/* Correct Checkbox */}
                   <Checkbox
                      checked={option.is_correct}
                      onCheckedChange={(val) => updateOption(index, "is_correct", val === true)}
                      disabled={isLoading}
                    />
                   
                    <Label htmlFor={`correct-${index}`} className="text-sm text-muted-foreground">
                      Correct
                    </Label>
                    

                    {/* Option Text */}
                    <FormField
                      control={form.control}
                      name={`options.${index}.text`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e) => updateOption(index, "text", e.target.value)}
                              value={field.value ?? ""}
                              placeholder={`Option ${index + 1}`}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Remove Option */}
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
            </div>

            {/* Submit / Cancel */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : question
                  ? "Update Question"
                  : "Create Question"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}