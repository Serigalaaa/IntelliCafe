"use client"

import { Navigation } from "@/components/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { MapPin, ExternalLink, Clock, Phone } from "lucide-react"

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

          <div className="mt-12 max-w-5xl mx-auto">
             <div className="grid md:grid-cols-2 gap-6">
                
                {/* Left: Contact Details */}
                <div className="p-8 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-center h-full">
                    <h3 className="font-bold text-2xl text-foreground mb-6 flex items-center gap-2">
                        <MapPin className="h-6 w-6 text-primary" /> 
                        Visit Us
                    </h3>
                    
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">IntelliCafe (Juwita Kopi)</p>
                                <p className="text-muted-foreground text-sm mt-1">
                                    Sutera Square, Masjid, Taman Sutera<br/>
                                    43000 Kajang, Selangor
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">Opening Hours</p>
                                <p className="text-muted-foreground text-sm mt-1">
                                    Mon - Fri: 5:00 PM - 11:00 PM<br/>
                                    Sat - Sun: 5:00 PM - 11:00 PM
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Phone className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">Contact</p>
                                <p className="text-muted-foreground text-sm mt-1">
                                    +6019-373 0446
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border">
                        {/* 1. FIXED LINK: Uses specific query to force a pin on the full map site */}
                        <a
                        href="https://www.google.com/maps/search/?api=1&query=Sutera+Square+Kajang"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline font-medium transition-all"
                        >
                        View Larger Map
                        <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                {/* Right: Embed Map */}
                <div className="h-[400px] md:h-auto min-h-[400px] bg-muted rounded-xl overflow-hidden border border-border shadow-sm relative z-0">
                    <iframe 
                        // 2. FIXED SRC: This is the exact link you provided. 
                        // If it still doesn't pin, re-generate the embed code specifically from the *marker* in Google Maps.
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.3174132943623!2d101.76519979999999!3d3.0090412000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cdcb496cdbcc75%3A0x9125ef86ced7772b!2sSutera%20Square!5e0!3m2!1sen!2smy!4v1768339845872!5m2!1sen!2smyn"
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0 w-full h-full"
                    ></iframe>
                </div>

             </div>
          </div>

        </div>
      </div>

    </main>
  )
}