
import * as z from "zod"

// -------------------- TYPES --------------------
export interface Quiz {
  id: string
  title: string
  description: string
  total_time: number
  question_count: number
  created_at: string
  questions: Question[] 
  max_attempts:number | null 
  attempts_made:number
  timeLimit?: number // in minutes
  is_active: boolean
  createdBy: string // admin user id
  createdAt: Date
  updatedAt: Date
}



export interface QuizAttempt {
  id: string
  quiz_id: string
  user_id: string
  answers: Answer[]
  score: number
  totalPoints: number
  started_at: Date
  submitted_at?: Date
  timeSpent: number // in seconds
  max_score?: number
  attempt_number: number
  deadline: string   
  // shuffle_data?: {
  //   questions: number[]
  //   options: Record<string, number[]>
  // },
  questions?: {
    id: number
    text: string
    marks: number
    options: {
      id: number
      text: string
    }[]
   
  }[]
}
export interface QuizAttempt {
  id: string
  quiz_id: string
  user_id: string
  answers: Answer[]
  score: number
  totalPoints: number
  started_at: Date
  submitted_at?: Date
  timeSpent: number // in seconds
  max_score?: number
  attempt_number: number
  deadline: string   
  shuffle_data?: {
    questions: number[]
    options: Record<string, number[]>
  },
  questions?: {
    id: number
    text: string
    marks: number
    options: {
      id: number
      text: string
    }[]
   
  }[]
}



export interface ApiQuestion {
  id: number
  quiz_id: number
  text: string
  marks: number
  options: {
    id: number
    text: string
    is_correct: boolean
    question_id: number
  }[]
}


export interface Question {
  id: string
  quizId: string
  question: string
  type: "multiple-choice" | "true-false" | "short-answer"
  options: {
    id: string
    text: string
    is_correct:boolean
  }[]
  correctAnswer: string | number | null // index for multiple choice, string for others
  points: number
  order: number
  text: string
  marks: number
  created_at: string
}
export interface OptionData {
  id?: string
  text: string
  is_correct: boolean
}
export interface QuizData {
  quiz: {
    id: string
    title: string
    total_time: number
  }
  questions: Question[]
}


export interface Option {
  id: string
  question_id: string
  text: string
  is_correct: boolean
}

export interface Role {
  id: string
  name: string
  description: string
}

export interface AdminStats {
  total_quizzes: number
  total_users: number
  total_attempts: number
  total_questions: number
  recent_attempts: QuizAttempt[]
}

export interface DetailedQuizAttempt extends QuizAttempt {
  quiz_title?: string
  username?: string
  email?: string
  percentage?: number
  graded_at?: string // <--- add this
  completed_at?:Date
  quiz: {
    id: string
    title: string
    total_time: number
  }
  student: {
    id: string
    username: string
    email: string
  }
}

export interface Answer {
  id: string
  attempt_id: string
  question_id: string
  selected_option_id?: number
  isCorrect?: boolean
}

export interface StudentStats {
  totalAttempts: number
  averageScore: number
  bestScore: number
  totalTimeSpent: number
}

export interface QuizResult {
  id: string
  quiz_id: string
  user_id: string
  answers: Answer[]
  score: number
  totalPoints: number
  started_at: Date
  submitted_at?: Date
  timeSpent: number
  max_score?: number

  // 🔥 Added fields (used in UI)
  title: string
  graded_at?: Date
  duration_minutes: number
  percentage: number
  passed: boolean

  // Extra relations
  attempt: any
  quiz: any
  student: any
}


// Authentication utilities for JWT token management
export interface User {
  id: string
  username: string
  role: string
  email?:string
  created_at?: string
  updated_at?:string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  // access_token: string
  // refresh_token: string
  user: User
  success: boolean
  error?: string
}

export interface QuizAttemptSummary {
    id:number
    attempt_number: number
    score: number
    totalPoints: number
    timeSpent: number // in seconds
    correctAnswers: number
    wrongAnswers: number
    started_at: string
    submitted_at: string | null
  }

export interface QuizHistory {
  quiz_id: number
  quiz_title: string
  totalAttempts: number
  averageScore: number
  bestScore: number
  totalTimeSpent: number // in minutes
  totalQuestions: number
  attempts: QuizAttemptSummary[]
}

export interface QuizAnswerBase {
  question_id: number
  selected_option_id: number
}

// ---------------------------
// Zod schema for validation
// ---------------------------
export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").regex(/^[A-Za-z\s]+$/, "Name must contain letters only"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})

export type SignupFormValues = z.infer<typeof signupSchema>

// ---------------------------
// Validation schema
// ---------------------------
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
})

export type LoginFormValues = z.infer<typeof loginSchema>
// -----------------------------
// Zod Schema
// -----------------------------
export const quizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  total_time: z.coerce.number().min(1, "Total time must be greater than 0"),
   max_attempts: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional(),
    is_active: z.boolean().default(true),
})

export type QuizFormValues = z.infer<typeof quizSchema>


// -------------------------
// Zod Schema
// -------------------------
export const optionSchema = z.object({
  text: z.string().min(1, "option text is required & at least one valid option must be marked correct"),
  is_correct: z.boolean({
    required_error: "At least one option must be marked correct",
  }),
  id: z.string().optional(),
})

export const questionSchema = z.object({
  text: z.string().min(1, "Question text is required "),
  marks: z.preprocess((val) => Number(val), z.number().min(1, "Marks must be greater than 0")),
    options: z
    .array(optionSchema)
    .refine(
      (opts) => opts.some((o) => o.text && o.text.trim() !== ""),
      { message: "At least one option must have text"}
    )
    .refine(
      (opts) =>
        opts.filter((o) => o.text && o.text.trim() !== "").some((o) => o.is_correct),
      { message: "At least one valid option must be marked correct"}
    )
  })   

export type QuestionFormValues = z.infer<typeof questionSchema>



// -------------------------
// Zod Schema
// -------------------------
export const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  password: z.string().optional(),
  role_id: z.string().min(1, "Role is required"),
})

export type UserFormValues = z.infer<typeof userSchema>