// lib/mappers.ts

import { ApiQuestion, Question, Quiz } from "./types"

export function mapApiQuestion(apiQ: ApiQuestion, index: number): Question {
  const correctIndex = apiQ.options.findIndex((o) => o.is_correct)

  return {
    id: apiQ.id.toString(),
    quizId: apiQ.quiz_id.toString(),
    question: apiQ.text, // your old "question" field
    type: "multiple-choice" , // assume default since API doesn’t send it
    options: apiQ.options.map((o) => ({
      id: o.id.toString(),
      text: o.text,
      is_correct: o.is_correct,
    })),
    correctAnswer: correctIndex, // index of correct option
    points: apiQ.marks,
    order: index,
    text: apiQ.text,
    marks: apiQ.marks,
    created_at: new Date().toISOString(), // fallback since API doesn’t provide
  }
}

export function formatTime(seconds: number) {
  if (!seconds || seconds <= 0) return "0s"

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)

  if (mins > 0) {
    return `${mins}m ${secs}s`
  }
  return `${secs}s`
}

// utils/date.ts
import { parseISO } from "date-fns"

/**
 * Safely parse a backend date.
 * Accepts: Date object, ISO string with or without microseconds
 * Returns: Date object or undefined if invalid
 */
export const parseBackendDate = (input?: string | Date): Date | undefined => {
  if (!input) return undefined
  if (input instanceof Date) return input

  try {
    // Truncate microseconds to milliseconds
    const cleaned = input.replace(/\.(\d{3})\d+/, ".$1")
    const parsed = parseISO(cleaned)
    if (isNaN(parsed.getTime())) return undefined
    return parsed
  } catch {
    return undefined
  }
}

/**
 * Format a backend date for display
 * Returns formatted string or fallback
 */
export const formatBackendDate = (input: string | Date | undefined, fallback = "Not available"): string => {
  const parsed = parseBackendDate(input)
  if (!parsed) return fallback
  return parsed.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

/**
 * Get duration in minutes between two backend dates
 */
export const durationInMinutes = (start: string | Date | undefined, end: string | Date | undefined): number => {
  const startDate = parseBackendDate(start)
  const endDate = parseBackendDate(end)
  if (!startDate || !endDate) return 0
  return Math.round((endDate.getTime() - startDate.getTime()) / 1000 / 60)
}


export function toStudentQuiz(
  adminQuiz: Quiz,
  shuffle?: { questions: number[]; options: Record<string, number[]> }
): Quiz {
 
 
  // Convert admin questions to student-facing questions
  let questions: Question[] = adminQuiz.questions.map((q, index) => ({
    id: String(q.id),
    quizId: String(adminQuiz.id),
    question: q.text,          // required by Question
    text: q.text,              // optional
    marks: q.marks,            // required
    points: q.points ?? q.marks,
    order: index,
    created_at: q.created_at,
    type: q.type ?? "multiple-choice",
    correctAnswer: null,       // students never see this
    options: q.options.map(o => ({
      id: String(o.id),
      text: o.text,
      is_correct: false,       // hide correctness for students
    }))
  }))

  // Apply shuffle if provided
  if (shuffle) {
    // Shuffle question order
    questions.sort(
      (a, b) =>
        shuffle.questions.indexOf(Number(a.id)) -
        shuffle.questions.indexOf(Number(b.id))
    )
     

    // Shuffle options per question
    questions = questions.map(q => {
      const shuffledOptIds = shuffle.options[q.id]
      if (shuffledOptIds) {
        const optMap = Object.fromEntries(q.options.map(o => [o.id, o]))
        q.options = shuffledOptIds.map(id => optMap[String(id)]).filter(Boolean)
      }
      
      return q
    })
  }

  // Return a Quiz object with same top-level properties as adminQuiz
  return {
    ...adminQuiz,
    questions,
  }
}

