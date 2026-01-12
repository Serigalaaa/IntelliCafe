"use client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AdminDashboard } from "@/components/admin-dashboard"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/")
    }
  }, [loading, isAdmin, router])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back, {user?.name}</p>
          </div>

          <AdminDashboard />
        </div>
      </div>

      <Footer />
    </main>
  )
}
