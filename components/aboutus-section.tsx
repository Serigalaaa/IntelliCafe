"use client"

import { useState, useEffect } from "react"
import { Facebook, Instagram, MessageCircle } from "lucide-react" // MessageCircle as a TikTok alternative or use SVG
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const CAFE_IMAGES = [
  "/images/ChocCakeMini.jpg", // Replace with your actual image paths
  "/images/PopiaBigMac.jpg",
  "/images/SpaghAglioOlio.jpg",
]

export function AboutUsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-playing slideshow logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAFE_IMAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE: Slideshow */}
          <div className="relative aspect-video overflow-hidden rounded-2xl shadow-xl">
            {CAFE_IMAGES.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`Cafe view ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            {/* Slideshow Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {CAFE_IMAGES.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === currentIndex ? "bg-primary w-4" : "bg-white/50"
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Information & Socials */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Visit JuwitaKopi</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to JuwitaKopi, where we use IntelliCafe and meets the art of brewing. 
                Our space is designed for comfort, creativity, and the perfect cup of coffee. 
                Whether you're here for a quick espresso or a long study session, we provide 
                the smartest cafe experience in town.
              </p>
            </div>

            <Card className="p-6 bg-muted/50 border-none">
              <h3 className="font-semibold mb-3">Opening Hours</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex justify-between"><span>Mon - Fri:</span> <span>8:00 AM - 10:00 PM</span></li>
                <li className="flex justify-between"><span>Sat - Sun:</span> <span>9:00 AM - 11:00 PM</span></li>
              </ul>
            </Card>

            <div className="flex flex-wrap gap-4 pt-4">
              {/* Instagram: Replace href with your actual link */}
              <a href="https://www.instagram.com/juwitakopi" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10">
                  <Instagram className="w-5 h-5" /> Instagram
                </Button>
              </a>

              {/* TikTok: Replace href with your actual link */}
              <a href="https://www.tiktok.com/@juwitakopi" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.53 1.13-.3 2.15-1.18 2.4-2.33.09-.51.05-1.04.05-1.55V0h-.01z"/>
                  </svg>
                  TikTok
                </Button>
              </a>

              {/* WhatsApp Link (Additional) */}
              <a href="https://wa.me/60193730446" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10">
                <MessageCircle className="w-5 h-5" /> WhatsApp
                </Button>
              </a>

              {/* Facebook: Replace href with your actual link */}
              <a href="https://www.facebook.com/groups/172621476419802/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10">
                  <Facebook className="w-5 h-5" /> Facebook
                </Button>
              </a>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}