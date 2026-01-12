"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FeedbackForm } from "@/components/feedback-form"
import { FeedbackList } from "@/components/feedback-list"

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Feedback</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We value your opinion! Share your experience with us
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <FeedbackForm />
            <FeedbackList />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
