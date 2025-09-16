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
  const storageKey = `quiz_timer_${quizId}`
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)

  // ✅ Sync with backend deadline (but resilient to nulls + changed deadlines)
  useEffect(() => {
    // console.log("Deadline prop changed:", deadline)

    if (!deadline) {
      // no new deadline from backend → try restore from localStorage
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        // console.log("Restoring deadline from localStorage:", saved)
        const savedDeadline = +saved
        setDeadlineMs(savedDeadline)
        setTimeLeft(Math.max(Math.floor((savedDeadline - Date.now()) / 1000), 0))
      }
      return
    }

    const backendDeadline = new Date(deadline).getTime()
    // console.log("Using backend deadline:", backendDeadline, "Now:", Date.now())

    if (backendDeadline <= Date.now()) {
      // expired → clear and auto-submit
      localStorage.removeItem(storageKey)
      setDeadlineMs(null)
      setTimeLeft(0)
      onTimeUp()
      return
    }

    // ✅ Only update if backend gave a *different* deadline (new attempt case)
    if (deadlineMs !== backendDeadline) {
      // console.log("New deadline detected, resetting timer")
      localStorage.setItem(storageKey, backendDeadline.toString())
      setDeadlineMs(backendDeadline)
      setTimeLeft(Math.floor((backendDeadline - Date.now()) / 1000))
    }
  }, [quizId, deadline]) // notice: no onTimeUp here

  // ✅ Countdown loop
  useEffect(() => {
    if (!isActive || !deadlineMs) return

    const timer = setInterval(() => {
      const remaining = Math.floor((deadlineMs - Date.now()) / 1000)

      if (remaining <= 0) {
        setTimeLeft(0)
        localStorage.removeItem(storageKey)
        clearInterval(timer)
        onTimeUp()
      } else {
        setTimeLeft(remaining)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, deadlineMs, onTimeUp, storageKey])

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









