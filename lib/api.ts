// api.ts
import { apiCall } from "./auth"
import { mapApiQuestion } from "./helper"
import {
  AdminStats,
  DetailedQuizAttempt,
  Question,
  Quiz,
  QuizAttempt,
  QuizData,
  Role,
  User,
  Option,
  ApiQuestion,
  StudentStats,
  QuizHistory,
  QuizAnswerBase,
} from "./types"

// -------------------- QUIZ --------------------
export const getQuizById = async (id: string): Promise<Quiz> => {
  const res = await apiCall<Quiz | null>(`/quiz/${id}`)
  if (!res) throw new Error("Quiz not found")
  return res
}

export const getQuizzes = async (): Promise<Quiz[]> => {
  const res = await apiCall<Quiz[] | null>("/quiz/")
  return res ?? []
}

export const createQuiz = async (quiz: {
  title: string
  description: string
  total_time: number
}): Promise<Quiz> => {
  const res = await apiCall<Quiz | null>("/quiz/Create", {
    method: "POST",
    body: JSON.stringify(quiz),
  })
  if (!res) throw new Error("Failed to create quiz")
  return res
}

export const updateQuiz = async (
  id: string,
  quiz: { title: string; description: string; total_time: number ,is_active: boolean, max_attempts?: number | null }
): Promise<Quiz> => {
  const res = await apiCall<Quiz | null>(`/quiz/Update/${id}`, {
    method: "PUT",
    body: JSON.stringify(quiz),
  })
  if (!res) throw new Error("Failed to update quiz")
  return res
}

export const deleteQuiz = async (id: string): Promise<void> => {
  await apiCall(`/quiz/Delete/${id}`, { method: "DELETE" })
}
export const importQuiz = async (
  file: File
): Promise<{ message: string; quiz: Quiz }> => {
  const formData = new FormData()
  formData.append("file", file)

  const res = await apiCall<{ message: string; quiz: Quiz } | null>(
    "/quiz/import-quiz",
    {
      method: "POST",
      body: formData,
    }
  )

  if (!res) throw new Error("Failed to import quiz")
  return res
}






// ✅ Detailed quiz with mapped questions
export async function getQuizDetailById(id: number): Promise<Quiz> {
  const data = await apiCall<any>(`/quiz/${id}/detail`, { method: "GET" })
  if (!data) throw new Error("Quiz detail not found")

  return {
    ...data,
    questions: data.questions.map((q: ApiQuestion, idx: number) =>
      mapApiQuestion(q, idx)
    ),
  }
}

// -------------------- QUESTIONS --------------------
export const getQuizQuestionsbyid = async (
  quizId: string
): Promise<QuizData> => {
  const res = await apiCall<QuizData | null>(`/question/${quizId}`)
  if (!res) throw new Error("Questions not found")
  return res
}

export const getQuizQuestions = async (): Promise<QuizData> => {
  const res = await apiCall<QuizData | null>("/question")
  if (!res) throw new Error("Questions not found")
  return res
}

export const createQuestion = async (question: {
  quiz_id: string
  text: string
  marks: number
}): Promise<Question> => {
  const res = await apiCall<Question | null>("/question/Create", {
    method: "POST",
    body: JSON.stringify(question),
  })
  if (!res) throw new Error("Failed to create question")
  return res
}

export const updateQuestion = async (
  id: string,
  question: { text: string; marks: number }
): Promise<Question> => {
  const res = await apiCall<Question | null>(`/question/Update/${id}`, {
    method: "PUT",
    body: JSON.stringify(question),
  })
  if (!res) throw new Error("Failed to update question")
  return res
}

export const deleteQuestion = async (id: string): Promise<void> => {
  await apiCall(`/question/Delete/${id}`, { method: "DELETE" })
}

// -------------------- OPTIONS --------------------
export const createOption = async (option: {
  question_id: string
  text: string
  is_correct: boolean
}): Promise<Option> => {
  const res = await apiCall<Option | null>("/option/Create", {
    method: "POST",
    body: JSON.stringify(option),
  })
  if (!res) throw new Error("Failed to create option")
  return res
}

export const updateOption = async (
  id: string,
  option: { text: string; is_correct: boolean }
): Promise<Option> => {
  const res = await apiCall<Option | null>(`/option/Update/${id}`, {
    method: "PUT",
    body: JSON.stringify(option),
  })
  if (!res) throw new Error("Failed to update option")
  return res
}

export const deleteOption = async (id: string): Promise<void> => {
  await apiCall(`/option/Delete/${id}`, { method: "DELETE" })
}

// -------------------- USERS --------------------
export const getAllUsers = async (): Promise<User[]> => {
  const res = await apiCall<User[] | null>("/user/")
  return res ?? []
}

export const getCurrentUser = async (): Promise<User> => {
  const res = await apiCall<User | null>("/user/me")
  if (!res) throw new Error("User not found")
  return res
}

export const createUser = async (user: {
  username: string
  email: string
  password?: string
  role_id: string
}): Promise<User> => {
  const res = await apiCall<User | null>("/user/Create", {
    method: "POST",
    body: JSON.stringify(user),
  })
  if (!res) throw new Error("Failed to create user")
  return res
}

export const updateUser = async (
  id: string,
  user: { username: string; email: string; role_id: string }
): Promise<User> => {
  const res = await apiCall<User | null>(`/user/Update/${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
  })
  if (!res) throw new Error("Failed to update user")
  return res
}

export const deleteUser = async (id: string): Promise<void> => {
  await apiCall(`/user/Delete/${id}`, { method: "DELETE" })
}

export const signupUser = async (user: {
  username: string
  email: string
  password: string
}): Promise<User> => {
  const res = await apiCall<User | null>("/user/signup", {
    method: "POST",
    body: JSON.stringify(user),
  })
  if (!res) throw new Error("Failed to signup user")
  return res
}

// Only allow username and email
export const updateMyProfile = async (user: { username: string; email: string }) => {
  const res = await apiCall<User | null>(`/user/me/update`, {
    method: "PUT",
    body: JSON.stringify(user),
  })
  if (!res) throw new Error("Failed to update profile")
  return res
}


// -------------------- ROLES --------------------
export const getAllRoles = async (): Promise<Role[]> => {
  const res = await apiCall<Role[] | null>("/role")
  return res ?? []
}

export const createRole = async (role: {
  name: string
  description: string
}): Promise<Role> => {
  const res = await apiCall<Role | null>("/role/Create", {
    method: "POST",
    body: JSON.stringify(role),
  })
  if (!res) throw new Error("Failed to create role")
  return res
}

export const updateRole = async (
  id: string,
  role: { name: string; description: string }
): Promise<Role> => {
  const res = await apiCall<Role | null>(`/role/Update/${id}`, {
    method: "PUT",
    body: JSON.stringify(role),
  })
  if (!res) throw new Error("Failed to update role")
  return res
}

export const deleteRole = async (id: string): Promise<void> => {
  await apiCall(`/role/Delete/${id}`, { method: "DELETE" })
}
// -------------------- QUIZ ATTEMPTS --------------------
export const startQuizAttempt = async (quizId: string): Promise<QuizAttempt> => {
  const res = await apiCall<QuizAttempt | null>("/quiz_attempt", {
    method: "POST",
    body: JSON.stringify({ quiz_id: quizId, attempt_number: 1 }),
  })
  if (!res) throw new Error("Failed to start attempt")
  return res
}

export const getOrCreateQuizAttempt = async (
  quizId: number
): Promise<QuizAttempt> => {
  const res = await apiCall<QuizAttempt | null>(
    `/quiz_attempt/${quizId}/get-or-create-attempt`,
    { method: "POST" }
  )
  if (!res) throw new Error("Failed to get/create attempt")
  return res
}

export const getQuizAttempt = async (
  attempt_id: string
): Promise<QuizAttempt> => {
  const res = await apiCall<QuizAttempt | null>(`/quiz_attempt/${attempt_id}`)
  if (!res) throw new Error("Attempt not found")
  return res
}

export async function getMyQuizHistory(): Promise<QuizHistory[]> {
  const res = await apiCall<QuizHistory[] | null>("/quiz/my-history", {
    method: "GET",
  })
  return res ?? []
}

// lib/api.ts
export async function saveQuizAnswer(
  attemptId: number,
  answer: QuizAnswerBase
): Promise<QuizAttempt> {
  const res = await apiCall<QuizAttempt | null>(
    `/quiz_answer/${attemptId}/save-answer`,
    {
      method: "POST",
      body: JSON.stringify(answer),
    }
  )
  if (!res) throw new Error("Failed to save answer")
  return res
}

export const getStudentStats = async (
  user_id: string
): Promise<StudentStats> => {
  const res = await apiCall<StudentStats | null>(
    `/quiz_attempt/user/${user_id}/stats`
  )
  if (!res) throw new Error("Failed to load student stats")
  return res
}

export const submitQuizAttempt = async (
  attemptId: number,
  answers: { question_id: number; selected_option_id: number | null }[]
) => {
  const res = await apiCall<any>(`/quiz_attempt/submit/${attemptId}`, {
    method: "POST",
    body: JSON.stringify(answers),
  })
  if (!res) throw new Error("Failed to submit quiz")
  return res
}

// -------------------- QUIZ ANSWERS --------------------
export const submitQuizAnswers = async (
  attemptId: string,
  answers: Record<string, string>
) => {
  const res = await apiCall<any | null>("/quiz_answer", {
    method: "POST",
    body: JSON.stringify({ attempt_id: attemptId, answers }),
  })
  if (!res) throw new Error("Failed to submit answers")
  return res
}

export const getQuizAnswers = async (attemptId: string) => {
  const res = await apiCall<any | null>(`/quiz_answer/${attemptId}`)
  if (!res) throw new Error("Answers not found")
  return res
}

// -------------------- QUIZ RESULTS --------------------
export const getQuizResults = async (): Promise<DetailedQuizAttempt[]> => {
  const res = await apiCall<DetailedQuizAttempt[] | null>("/quiz_result/")
  return res ?? []
}

// -------------------- ADMIN STATS --------------------
export const getAdminStats = async (): Promise<AdminStats> => {
  const res = await apiCall<AdminStats | null>("/user/admin/stats")
  if (!res) throw new Error("Failed to load admin stats")
  return res
}
