"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { LogIn, UserPlus, Users } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"

export function HeroSection() {
  const [greeting, setGreeting] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login")

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours()

      if (hour >= 5 && hour < 12) {
        setGreeting("Good Morning")
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good Afternoon")
      } else if (hour >= 17 && hour < 21) {
        setGreeting("Good Evening")
      } else {
        setGreeting("Good Night")
      }
    }

    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )
    }

    updateGreeting()
    updateTime()

    const timeInterval = setInterval(updateTime, 1000)
    const greetingInterval = setInterval(updateGreeting, 60000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(greetingInterval)
    }
  }, [])

  const handleLogin = () => {
    setAuthModalTab("login")
    setAuthModalOpen(true)
  }

  const handleSignup = () => {
    setAuthModalTab("signup")
    setAuthModalOpen(true)
  }

  const handleGuest = async () => {
    try {
      const response = await fetch("/api/auth/guest", { method: "POST" })
      if (response.ok) {
        window.location.href = "/menu"
      }
    } catch (error) {
      console.error("[v0] Guest login error:", error)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/modern-cozy-cafe-interior-with-warm-lighting-coffe.jpg"
          alt="Café background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Dynamic Greeting */}
        <div className="mb-6 animate-fade-in">
          <p className="text-accent-foreground/90 text-lg md:text-xl font-medium mb-2">
            {greeting}, Welcome to IntelliCafe!
          </p>
          <p className="text-accent-foreground/70 text-sm md:text-base font-mono">
            {currentTime}
          </p>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-accent-foreground mb-6 animate-fade-in-up text-balance">
          Welcome to IntelliCafe
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl text-accent-foreground/90 mb-12 max-w-3xl mx-auto animate-fade-in-up text-pretty">
          An Interactive and Intelligent Web-based Café System
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
          <Button size="lg" onClick={handleLogin}>
            <LogIn className="w-5 h-5 mr-2" />
            Login
          </Button>

          <Button size="lg" variant="outline" onClick={handleSignup}>
            <UserPlus className="w-5 h-5 mr-2" />
            Sign Up
          </Button>

          <Button size="lg" variant="secondary" onClick={handleGuest}>
            <Users className="w-5 h-5 mr-2" />
            Guest Mode
          </Button>
        </div>
      </div>

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab={authModalTab}
      />
    </section>
  )
}
