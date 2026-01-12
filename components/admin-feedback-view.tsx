"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Feedback {
  _id: string
  name: string
  email: string
  rating: number
  message: string
  createdAt: string
}

export function AdminFeedbackView() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])

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
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Customer Feedback</h2>
      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <div key={feedback._id} className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-semibold">{feedback.name}</span>
                <span className="text-sm text-muted-foreground ml-2">({feedback.email})</span>
              </div>
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
            <p className="text-sm text-foreground mb-2">{feedback.message}</p>
            <span className="text-xs text-muted-foreground">{new Date(feedback.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
