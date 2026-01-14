"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Trash2 } from "lucide-react"
// 1. Import Hook
import { useGlobalModal } from "@/components/providers/modal-provider"

interface Order {
  _id: string
  orderNumber: string
  totalAmount: number
  status: "pending" | "done" | "cancelled"
  items: any[]
  createdAt: string
}

export function AdminOrderManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // 2. Use Hook
  const { showConfirm, showSuccess, showError } = useGlobalModal()

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus as any } : o))
    } catch (error) {
      console.error("Failed to update status")
    }
  }

  // 3. Updated Delete Handler
  const handleDeleteClick = (id: string) => {
    showConfirm(
      "Delete Order Record?",
      "Are you sure you want to permanently delete this order history? This cannot be undone.",
      () => performDelete(id)
    )
  }

  const performDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/orders?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setOrders(prev => prev.filter(o => o._id !== id))
        showSuccess("Order Deleted", "The record has been removed.")
      } else {
        showError("Error", "Failed to delete order.")
      }
    } catch (error) {
      showError("System Error", "Could not connect to server.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": 
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
      case "done": 
        return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
      case "cancelled": 
        return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
      default: 
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Incoming Orders</h2>
        <Button variant="outline" size="sm" onClick={fetchOrders}>Refresh</Button>
      </div>

      <div className="space-y-4">
        {loading ? <p>Loading orders...</p> : orders.length === 0 ? <p>No orders yet.</p> : (
          orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
              
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-lg">{order.orderNumber}</span>
                  <Badge className={`border ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()} • {order.items.length} Items
                </p>
                <div className="text-sm text-muted-foreground">
                   {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <span className="font-bold text-xl">RM{order.totalAmount.toFixed(2)}</span>
                
                <div className="flex items-center gap-2">
                  {order.status === "pending" && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(order._id, "done")}>
                         <CheckCircle2 className="w-4 h-4 mr-1" /> Paid
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => updateStatus(order._id, "cancelled")}>
                         <XCircle className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </>
                  )}
                  {order.status === "done" && (
                      <span className="text-green-600 flex items-center text-sm font-medium mr-2">
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Completed
                      </span>
                  )}
                  {order.status === "cancelled" && (
                      <span className="text-destructive flex items-center text-sm font-medium mr-2">
                          <XCircle className="w-4 h-4 mr-1" /> Cancelled
                      </span>
                  )}

                  {/* 4. Use new handler */}
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(order._id)} title="Delete Record">
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-600 transition-colors" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}