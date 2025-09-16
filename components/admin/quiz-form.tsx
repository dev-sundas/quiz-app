"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Quiz, QuizFormValues, quizSchema } from "@/lib/types"



interface QuizFormProps {
  quiz?: Quiz
  onSubmit: (data: { title: string; description: string; total_time: number; max_attempts?: number ,is_active:boolean}) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function QuizForm({ quiz, onSubmit, onCancel, isLoading = false }: QuizFormProps) {
  const [serverError, setServerError] = React.useState("")

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: quiz?.title || "",
      description: quiz?.description || "",
      total_time: quiz?.total_time || 30,
      max_attempts: quiz?.max_attempts ?? null,
      is_active:quiz?.is_active ?? true
    },
  })

  const submitHandler = async (values: QuizFormValues) => {
    setServerError("")
    try {
    
      await onSubmit({ ...values, max_attempts: values.max_attempts ?? undefined,})
    } catch (err: any) {
      setServerError(err?.message || "Failed to save quiz")
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{quiz ? "Edit Quiz" : "Create New Quiz"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-6">
            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quiz title" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter quiz description" {...field} disabled={isLoading} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Total Time */}
            <FormField
              control={form.control}
              name="total_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Time (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter total time" {...field} disabled={isLoading} min={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Max Attempts */}
            <FormField
              control={form.control}
              name="max_attempts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Attempts (leave empty for unlimited)</FormLabel>
                  <FormControl>
                      <Input
                        type="number"
                        placeholder="Unlimited if empty"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                     /> 
                 </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : quiz ? "Update Quiz" : "Create Quiz"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
