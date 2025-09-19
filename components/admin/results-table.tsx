"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, User, FileText, Trophy, Calendar } from "lucide-react"
import { formatDistanceToNow, format, parseISO } from "date-fns"
import type { DetailedQuizAttempt } from "@/lib/types"

interface ResultsTableProps {
  results: DetailedQuizAttempt[]
  loading?: boolean
}

export function ResultsTable({ results, loading }: ResultsTableProps) {
  // console.log("ResultsTable received results:", results)
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading results...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No quiz results found matching your criteria.</p>
        </CardContent>
      </Card>
    )
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusBadge = (attempt: DetailedQuizAttempt) => {
    if (attempt.completed_at) {
      return <Badge variant="secondary">Completed</Badge>
    }
    return <Badge variant="outline">In Progress</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Quiz Results ({results.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.map((result) => {
            const percentage =
              result.percentage || (result.score && result.max_score ? (result.score / result.max_score) * 100 : 0)

            return (
              <div key={result.id} className="border rounded-lg p-3 sm:p-4">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <h3 className="font-semibold text-sm sm:text-base truncate">
                          {result.quiz_title || "Unknown Quiz"}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">{getStatusBadge(result)}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{result.student?.username || "Unknown Student"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          Started {formatDistanceToNow(parseISO(result.started_at + "Z"), { addSuffix: true })}
                        </span>
                      </div>
                      {result.completed_at && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            Completed {format(parseISO(result.completed_at + "Z"), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {result.completed_at && result.score !== undefined && result.max_score && (
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2 lg:text-right">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span className={`font-bold text-sm sm:text-base ${getScoreColor(percentage)}`}>
                          {result.score}/{result.max_score}
                        </span>
                        <span className={`text-xs sm:text-sm ${getScoreColor(percentage)}`}>
                          ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="w-20 sm:w-24" />
                    </div>
                  )}
                </div>

                {result.completed_at && result.score !== undefined && result.max_score && (
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Performance</span>
                      <span className={getScoreColor(percentage)}>
                        {percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Improvement"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
