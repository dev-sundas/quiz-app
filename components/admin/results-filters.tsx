"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import { Quiz, User } from "@/lib/types"

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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters & Search
        </CardTitle>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by username or quiz..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz">Quiz</Label>
            <Select value={quizId} onValueChange={setQuizId}>
              <SelectTrigger>
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
            <Label htmlFor="user">Student</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger>
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
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
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
            <Label htmlFor="sortBy">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
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
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleFilterChange} className="w-full md:w-auto">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}
