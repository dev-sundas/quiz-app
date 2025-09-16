import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow, parseISO } from "date-fns"
import { QuizAttempt } from "@/lib/types"

interface RecentActivityProps {
  attempts: QuizAttempt[]
}

export function RecentActivity({ attempts }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Quiz Attempts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {attempts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent attempts</p>
          ) : (
            attempts.slice(0, 5).map((attempt) => (
              <div key={attempt.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  {/* <p className="text-sm font-medium">Quiz Attempt #{attempt.id.toString().slice(0, 8)}</p> */}
                  <p className="text-sm font-medium">Quiz Attempt #{attempt.id}</p>
                  <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(
                        parseISO(attempt.started_at + "Z"), // 👈 force UTC
                        { addSuffix: true }
                      )}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                  {attempt.submitted_at ? (
                    <Badge variant="secondary">
                      {attempt.score}/{attempt.max_score}
                    </Badge>
                  ) : (
                    <Badge variant="outline">In Progress</Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
