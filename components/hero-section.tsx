"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { LogIn, UserPlus, Users, Coffee, ArrowRight } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export function HeroSection() {
  const [greeting, setGreeting] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login")

  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 12) setGreeting("Good Morning")
      else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon")
      else if (hour >= 17 && hour < 21) setGreeting("Good Evening")
      else setGreeting("Good Night")
    }

    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }))
    }

    updateGreeting()
    updateTime()
    const t = setInterval(updateTime, 1000)
    const g = setInterval(updateGreeting, 60000)
    return () => { clearInterval(t); clearInterval(g) }
  }, [])

  const handleLogin = () => { setAuthModalTab("login"); setAuthModalOpen(true) }
  const handleSignup = () => { setAuthModalTab("signup"); setAuthModalOpen(true) }
  
  // --- FIX STARTS HERE ---
  const handleGuest = async () => {
    try {
      // 1. Set the Cookie (Server Side)
      const response = await fetch("/api/auth/guest", { method: "POST" })
      
      if (response.ok) {
          // 2. Set the Flag (Client Side) - CRITICAL FOR UI
          if (typeof window !== "undefined") {
              localStorage.setItem("guest_mode", "true")
          }
          
          // 3. Redirect
          window.location.href = "/menu"
      }
    } catch (error) { 
        console.error("Guest login error:", error) 
    }
  }
  // --- FIX ENDS HERE ---

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/JuwitaKopiHomePage.png" alt="Café background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="mb-6 animate-fade-in">
          <p className="text-white/90 text-lg md:text-xl font-medium mb-2 drop-shadow-md">
            {greeting}, {isAuthenticated && user ? user.name : "Welcome to IntelliCafe!"}
          </p>
          <p className="text-white/80 text-sm md:text-base font-mono">{currentTime}</p>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up drop-shadow-xl">
          {isAuthenticated ? "Ready for Coffee?" : "Welcome to IntelliCafe"}
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fade-in-up drop-shadow-md">
          An Interactive and Intelligent Web-based Café System
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
          {isAuthenticated ? (
            <Link href="/menu">
                <Button size="lg" className="h-14 px-8 text-lg gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:scale-105 transition-all">
                    <Coffee className="w-6 h-6" />
                    Order Now
                    <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
            </Link>
          ) : (
            <>
                <Button size="lg" onClick={handleLogin}> <LogIn className="w-5 h-5 mr-2" /> Login </Button>
                <Button size="lg" variant="outline" onClick={handleSignup} className="border-white text-white bg-transparent hover:bg-white hover:text-black"> <UserPlus className="w-5 h-5 mr-2" /> Sign Up </Button>
                <Button size="lg" variant="secondary" onClick={handleGuest}> <Users className="w-5 h-5 mr-2" /> Guest Mode </Button>
            </>
          )}
        </div>
      </div>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} defaultTab={authModalTab} />
    </section>
  )
}