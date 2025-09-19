"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import type { Quiz, User } from "@/lib/types"

interface ResultsFiltersProps {
  quizzes: Quiz[]
  users: User[]
  onFilterChange: (filters: {
    search: string
    quizId: string
    userId: string
    status: string
    sortBy: string
    sortOrder: string
  }) => void
}

export function ResultsFilters({ quizzes, users, onFilterChange }: ResultsFiltersProps) {
  const [search, setSearch] = useState("")
  const [quizId, setQuizId] = useState("all")
  const [userId, setUserId] = useState("all")
  const [status, setStatus] = useState("all")
  const [sortBy, setSortBy] = useState("started_at")
  const [sortOrder, setSortOrder] = useState("desc")

  const handleFilterChange = () => {
    onFilterChange({
      search,
      quizId,
      userId,
      status,
      sortBy,
      sortOrder,
    })
  }

  const clearFilters = () => {
    setSearch("")
    setQuizId("all")
    setUserId("all")
    setStatus("all")
    setSortBy("started_at")
    setSortOrder("desc")
    onFilterChange({
      search: search.trim(),
      quizId: "all",
      userId: "all",
      status: "all",
      sortBy: "started_at",
      sortOrder: "desc",
    })
  }

  const hasActiveFilters =
    search ||
    quizId !== "all" ||
    userId !== "all" ||
    status !== "all" ||
    sortBy !== "started_at" ||
    sortOrder !== "desc"

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
          Filters & Search
        </CardTitle>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="w-full sm:w-auto bg-transparent">
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
          <div className="space-y-2 sm:col-span-2 lg:col-span-1 xl:col-span-2">
            <Label htmlFor="search" className="text-sm">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by username or quiz..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz" className="text-sm">
              Quiz
            </Label>
            <Select value={quizId} onValueChange={setQuizId}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="All quizzes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All quizzes</SelectItem>
                {quizzes.map((quiz) => (
                  <SelectItem key={quiz.id} value={quiz.id.toString()}>
                    {quiz.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user" className="text-sm">
              Student
            </Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="All students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All students</SelectItem>
                {users
                  .filter((user) => user.role && user.role.toLowerCase() === "student")
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.username}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortBy" className="text-sm">
              Sort By
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="started_at">Date Started</SelectItem>
                <SelectItem value="completed_at">Date Completed</SelectItem>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="username">Student Name</SelectItem>
                <SelectItem value="title">Quiz Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder" className="text-sm">
              Sort Order
            </Label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleFilterChange} className="w-full sm:w-auto">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}
