"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ChatInterface } from "@/components/chat-interface"
import { MapPin, ExternalLink } from "lucide-react"

export default function ChatbotPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Café Assistant</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ask me anything about our menu, hours, or recommendations!
            </p>
          </div>

          <ChatInterface />

          <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl max-w-2xl mx-auto border border-primary/20">
            <div className="flex items-start gap-3">
              <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground mb-2">Visit Us</h3>
                <p className="text-muted-foreground mb-1">Juwita Kopi, Sutera Square, Masjid, Taman Sutera</p>
                <p className="text-muted-foreground mb-3">43000 Kajang, Selangor</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Juwita+Kopi+Sutera+Square+Masjid+Taman+Sutera+43000+Kajang+Selangor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  <MapPin className="h-4 w-4" />
                  View on Google Maps
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
