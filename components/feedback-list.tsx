"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Feedback {
  _id: string
  name: string
  rating: number
  message: string
  createdAt: string
}

export function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("/api/feedback")
      const data = await response.json()
      setFeedbacks(data)
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Recent Feedback</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-2" />
              <div className="h-3 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Recent Feedback</h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {feedbacks.map((feedback) => (
          <div key={feedback._id} className="border-b border-border pb-4 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-foreground">{feedback.name}</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{feedback.message}</p>
            <span className="text-xs text-muted-foreground mt-2 block">
              {new Date(feedback.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
