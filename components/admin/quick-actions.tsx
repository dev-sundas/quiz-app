import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, FileText, BarChart3 } from "lucide-react"
import Link from "next/link"


export function QuickActions() {
  const actions = [
    {
      title: "Create Quiz",
      description: "Add a new quiz",
      href: "/admin/quizzes/new",
      icon: Plus,
    },
    {
      title: "Manage Users",
      description: "View and edit users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "View Results",
      description: "See all quiz results",
      href: "/admin/results",
      icon: BarChart3,
    },
    {
      title: "All Quizzes",
      description: "Manage existing quizzes",
      href: "/admin/quizzes",
      icon: FileText,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 w-full bg-transparent">
                  <Icon className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
