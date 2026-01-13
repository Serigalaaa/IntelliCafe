"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, MessageSquare, Users, DollarSign, Download, TrendingUp } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export function AdminStats() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalFeedback: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [graphData, setGraphData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Summary Stats
        const statsRes = await fetch("/api/admin/stats")
        const statsData = await statsRes.json()
        setStats(statsData)

        // 2. Fetch Graph Data
        const graphRes = await fetch("/api/admin/analytics")
        const graphData = await graphRes.json()
        setGraphData(graphData)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // --- CSV REPORT GENERATION ---
  const handleDownloadReport = async () => {
    try {
      // Fetch all orders for the report
      const res = await fetch("/api/orders")
      const orders = await res.json()

      // Create CSV content
      const headers = ["Order Number,Date,Status,Total Amount (RM),Items\n"]
      const rows = orders.map((order: any) => {
        const date = new Date(order.createdAt).toLocaleDateString()
        const items = order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(" | ")
        return `${order.orderNumber},${date},${order.status},${order.totalAmount.toFixed(2)},"${items}"`
      })

      const csvContent = headers.concat(rows).join("\n")
      
      // Trigger Download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `sales_report_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Failed to generate report")
    }
  }

  const statCards = [
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, description: "All time orders" },
    { title: "Total Revenue", value: `RM${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, description: "From completed orders" },
    { title: "Feedback", value: stats.totalFeedback, icon: MessageSquare, description: "Customer reviews" },
    { title: "Users", value: stats.totalUsers, icon: Users, description: "Registered accounts" },
  ]

  return (
    <div className="space-y-6">
      {/* 1. TOP CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* REVENUE CHART (Takes up 4 columns) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> 
                Revenue Overview
            </CardTitle>
            <CardDescription>Daily revenue for the past 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">Loading chart...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                    />
                    <YAxis 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `RM${value}`} 
                    />
                    <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ACTIONS CARD (Takes up 3 columns) */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your reports and data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg flex items-center justify-between">
                <div>
                    <p className="font-medium">Sales Report</p>
                    <p className="text-sm text-muted-foreground">Export all orders to CSV</p>
                </div>
                <Button onClick={handleDownloadReport} className="gap-2">
                    <Download className="w-4 h-4" /> Download
                </Button>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-medium mb-2">System Health</p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                    Database Connected
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                    API Operational
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}