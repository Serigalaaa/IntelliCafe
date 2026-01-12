"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ShoppingCart, MessageSquare, Users, DollarSign } from "lucide-react"

export function AdminStats() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalFeedback: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    // Fetch stats from API
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const statCards = [
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-blue-500" },
    { title: "Feedback Received", value: stats.totalFeedback, icon: MessageSquare, color: "text-green-500" },
    { title: "Registered Users", value: stats.totalUsers, icon: Users, color: "text-purple-500" },
    { title: "Total Revenue", value: `RM${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-yellow-500" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </Card>
        )
      })}
    </div>
  )
}
