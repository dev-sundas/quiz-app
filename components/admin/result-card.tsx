"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Trophy, Target } from "lucide-react"
import { QuizResult } from "@/lib/types"
import { format, parseISO } from "date-fns"
import { formatBackendDate } from "@/lib/helper"



interface ResultCardProps {
  result: QuizResult
}

export function ResultCard({ result }: ResultCardProps) {
  
  const percentage = result.max_score 
  ? Math.round((result.score / result.max_score) * 100) 
  : 0  
   // ✅ pick graded -> submitted -> started
  const rawDate = result.graded_at ?? result.submitted_at ?? result.started_at
  const formattedDate = formatBackendDate(rawDate)

  const getScoreBadgeVariant = (percentage: number) => {
    if (percentage >= 90) return "default"
    if (percentage >= 70) return "secondary"
    return "destructive"
  }

  const getPerformanceText = (percentage: number) => {
  if (percentage >= 90) return { text: "Excellent", className: "bg-green-100 text-green-700" }
  if (percentage >= 80) return { text: "Good", className: "bg-blue-100 text-blue-700" }
  if (percentage >= 70) return { text: "Fair", className: "bg-yellow-100 text-yellow-700" }
  return { text: "Needs Improvement", className: "bg-red-100 text-red-700" }
}
const { text, className } = getPerformanceText(percentage)


  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-balance">{result.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
          <Badge variant={getScoreBadgeVariant(percentage)}>{percentage}%</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Score</span>
            <span className="font-medium">
              {result.score} / {result.max_score ?? 0}
            </span>
          </div>
          <Progress value={percentage} className="h-2" />

            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${className}`}>
              {text}
            </div>
          {/* <div className="text-center text-sm font-medium text-muted-foreground">{getPerformanceText(percentage)}</div> */}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2">
              <div className="font-medium">{result.score}</div>
              <div className="text-muted-foreground">Points</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-muted-foreground" />
             <div className="flex gap-2">
              <div className="text-muted-foreground">Duration</div>
              <div className="font-medium">{result.duration_minutes}m</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
