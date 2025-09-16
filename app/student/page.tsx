import { StudentLayout } from "@/components/student/student-layout"
import { StudentStats } from "@/components/student/student-stats"
import { QuizList } from "@/components/student/quiz-list"
import { StudentQuizHistory } from "@/components/student/StudentQuizHistory"

export default function StudentDashboard() {
  return (
    <StudentLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground">Ready to test your knowledge? Choose a quiz below to get started.</p>
        </div>
        <StudentStats />
        <div>
          <h2 className="text-2xl font-semibold mb-6">Your Quiz Attempts</h2>
          <StudentQuizHistory />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-6">Available Quizzes</h2>
          <QuizList />
        </div>
      </div>
    </StudentLayout>
  )
}
