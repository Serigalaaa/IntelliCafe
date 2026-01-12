"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  email: string
  name: string
  role: "customer" | "admin" | "guest"
  createdAt: Date
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
      const response = await fetch("/api/auth/session")
      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error("[v0] Session check error:", error)
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
      console.error("[v0] Logout error:", error)
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
