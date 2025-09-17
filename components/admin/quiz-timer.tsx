"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface QuizTimerProps {
  timeLimit: number // minutes (display only)
  onTimeUp: () => void
  isActive: boolean
  quizId: number
  deadline?: string | null // backend ISO deadline
}

export function QuizTimer({ timeLimit, onTimeUp, isActive, quizId, deadline }: QuizTimerProps) {
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)

  // ✅ Always trust backend deadline
  useEffect(() => {
    if (!deadline) return

    const backendDeadline = new Date(deadline).getTime()

    if (backendDeadline <= Date.now()) {
      setDeadlineMs(null)
      setTimeLeft(0)
      onTimeUp()
      return
    }

    setDeadlineMs(backendDeadline)
    setTimeLeft(Math.floor((backendDeadline - Date.now()) / 1000))
  }, [quizId, deadline])

  // ✅ Countdown loop
  useEffect(() => {
    if (!isActive || !deadlineMs) return

    const timer = setInterval(() => {
      const remaining = Math.floor((deadlineMs - Date.now()) / 1000)

      if (remaining <= 0) {
        setTimeLeft(0)
        clearInterval(timer)
        onTimeUp()
      } else {
        setTimeLeft(remaining)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, deadlineMs, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isLowTime = timeLeft < 300 // < 5 min

  return (
    <Badge
      variant={isLowTime ? "destructive" : "secondary"}
      className="flex items-center gap-2 px-3 py-1"
    >
      <Clock className="h-4 w-4" />
      <span className="font-mono">
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
    </Badge>
  )
}
