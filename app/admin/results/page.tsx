"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/admin/navbar"
import { ResultsFilters } from "@/components/admin/results-filters"
import { ResultsTable } from "@/components/admin/results-table"
import { ResultsStats } from "@/components/admin/results-stats"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAllUsers, getQuizResults, getQuizzes} from "@/lib/api"
import { DetailedQuizAttempt, Quiz, User } from "@/lib/types"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AdminResultsPage() {
  const [results, setResults] = useState<DetailedQuizAttempt[]>([])
  const [filteredResults, setFilteredResults] = useState<DetailedQuizAttempt[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [resultsData, quizzesData, usersData] = await Promise.all([
        getQuizResults(), // use this
        getQuizzes(),
        getAllUsers(),
      ])
      // console.log("usersData",usersData)
      // console.log("resultsData", resultsData,"quizzesData",quizzesData)
      
      // Enhance results with additional data
      const enhancedResults: DetailedQuizAttempt[] = resultsData.map((result) => {
      const quiz = quizzesData.find((q) => q.id === result.quiz_id)
      // const user = usersData.find((u) => u.id === result.user_id)
      const percentage = result.score && result.max_score ? (result.score / result.max_score) * 100 : 0

      return {
        ...result,
        quiz_title: quiz?.title,
        quiz: {
          id: quiz?.id || "",
          title: quiz?.title || "Unknown Quiz",
          total_time: quiz?.total_time || 0,
        },
        student: result.student || { id: "", username: "Unknown Student", email: "" },
        percentage,
      }
    })
      setResults(enhancedResults)
      setFilteredResults(enhancedResults)
      setQuizzes(quizzesData)
      setUsers(usersData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load results")
    } finally {
      setLoading(false)
    }
  }

 const handleFilterChange = (filters: {
  search: string
  quizId: string
  userId: string
  status: string
  sortBy: string
  sortOrder: string
}) => {
  let filtered = [...results]

  // Apply search filter
  if (filters.search.trim()) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (result) =>
        result.student?.username.toLowerCase().includes(searchLower) ||
        result.quiz_title?.toLowerCase().includes(searchLower) ||
        result.student?.email.toLowerCase().includes(searchLower)
    )
  }

  // Apply quiz filter if not "all"
  if (filters.quizId && filters.quizId !== "all") {
    filtered = filtered.filter((result) => result.quiz_id.toString() === filters.quizId)
  }

  // Apply user filter if not "all"
  if (filters.userId && filters.userId !== "all") {
    filtered = filtered.filter((result) => result.student?.id.toString() === filters.userId)
  }

  // Apply status filter if not "all"
  if (filters.status && filters.status !== "all") {
    if (filters.status === "completed") {
      filtered = filtered.filter((result) => !!result.completed_at)
    } else if (filters.status === "in-progress") {
      filtered = filtered.filter((result) => !result.completed_at)
    }
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (filters.sortBy) {
      case "started_at":
        aValue = new Date(a.started_at)
        bValue = new Date(b.started_at)
        break
      case "completed_at":
        aValue = a.completed_at ? new Date(a.completed_at) : new Date(0)
        bValue = b.completed_at ? new Date(b.completed_at) : new Date(0)
        break
      case "score":
        aValue = a.score || 0
        bValue = b.score || 0
        break
      case "percentage":
        aValue = a.percentage || 0
        bValue = b.percentage || 0
        break
      case "username":
        aValue = a.student?.username || ""
        bValue = b.student?.username || ""
        break
      case "quiz_quiz_title":
        aValue = a.quiz_title || ""
        bValue = b.quiz_title || ""
        break
      default:
        aValue = a.started_at
        bValue = b.started_at
    }

    if (filters.sortOrder === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  setFilteredResults(filtered)
}


  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading results...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute adminOnly>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Quiz Results</h1>
          <p className="text-muted-foreground">View and analyze all student quiz performance</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ResultsStats results={filteredResults} />

        <div className="space-y-6">
          <ResultsFilters quizzes={quizzes} users={users} onFilterChange={handleFilterChange} />
          <ResultsTable results={filteredResults} />
        </div>
      </div>
    </ProtectedRoute>
  )
}
function getAllQuizResults(): any {
  throw new Error("Function not implemented.")
}

