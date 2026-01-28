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
      
      // <<-- CHANGED: Added validation to ensure 'data' is an array before setting state
      if (Array.isArray(data)) {
        setFeedbacks(data)
      } else if (data && typeof data === 'object' && Array.isArray(data.feedbacks)) {
        // <<-- CHANGED: Handles cases where the API returns { feedbacks: [...] }
        setFeedbacks(data.feedbacks)
      } else {
        console.error("API did not return an array:", data)
        setFeedbacks([]) // <<-- CHANGED: Fallback to empty array to prevent map error
      }
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error)
      setFeedbacks([]) // <<-- CHANGED: Ensure state remains an array even on fetch failure
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
        {/* <<-- CHANGED: Added '?.' (Optional Chaining) to map to prevent 'not a function' crash */}
        {feedbacks?.map((feedback) => (
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
              {/* <<-- CHANGED: Added check for valid date to prevent 'Invalid Date' errors */}
              {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : 'No date'}
            </span>
          </div>
        ))}
        
        {/* <<-- ADDED: User-friendly message if no feedback is found */}
        {feedbacks.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No feedback yet.</p>
        )}
      </div>
    </Card>
  )
}