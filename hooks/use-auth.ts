"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// --- UPDATED TYPES ---
export interface User {
  id: string
  email: string
  name: string
  // Updated: Added "user" to match your MongoDB schema default
  role: "user" | "customer" | "admin" | "guest"
  // Updated: JSON returns dates as strings, so we allow both
  createdAt: string | Date 
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    try {
      // Ensure you have an app/api/auth/session/route.ts created for this to work!
      const response = await fetch("/api/auth/session")
      
      // If no session exists (401/404), stop here
      if (!response.ok) {
        setLoading(false)
        return
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      // Silent error is fine for session checks
      console.log("[Auth] No active session found") 
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      setUser(data.user)
      // Updated: Check for both "admin" and potentially other roles
      router.push(data.user.role === "admin" ? "/admin" : "/menu")
      router.refresh()

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      }
    }
  }

  async function signup(email: string, password: string, name: string) {
    try {
      // This connects to the route we just built in app/api/auth/signup/route.ts
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }

      setUser(data.user)
      router.push("/menu")
      router.refresh()

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Signup failed",
      }
    }
  }

  async function loginAsGuest() {
    try {
      const response = await fetch("/api/auth/guest", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Guest login failed")
      }

      setUser(data.user)
      router.push("/menu")
      router.refresh()

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Guest login failed",
      }
    }
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("[Auth] Logout error:", error)
    }
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isGuest: user?.role === "guest",
    login,
    signup,
    loginAsGuest,
    logout,
  }
}