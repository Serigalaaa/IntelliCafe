"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"

interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  available: boolean
}

export function AdminMenuManager() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("/api/menu")
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error("Failed to fetch menu items:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      await fetch(`/api/menu/${id}`, { method: "DELETE" })
      fetchMenuItems()
    } catch (error) {
      console.error("Failed to delete item:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.category} - RM{item.price}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(item._id)}>
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
