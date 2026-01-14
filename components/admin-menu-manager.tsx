"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Edit, Trash, Plus, Loader2, ImageIcon, Package } from "lucide-react" 
import { useGlobalModal } from "@/components/providers/modal-provider"

interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  image: string
  available: boolean
}

const CATEGORIES = ["coffee", "tea", "pastry", "sandwich", "dessert"]

export function AdminMenuManager() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false) 

  // 1. Destructure showConfirm
  const { showSuccess, showError, showConfirm } = useGlobalModal()
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    stock: 20,
    category: "coffee",
    image: "", 
    available: true,
  })

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
      showError("Connection Error", "Could not load menu items.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock: 20,
      category: "coffee",
      image: "", 
      available: true,
    })
  }

  const handleOpenAdd = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (item: MenuItem) => {
    setEditingId(item._id)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const uploadData = new FormData()
    uploadData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      })
      const data = await res.json()

      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.path }))
        showSuccess("Upload Complete", "Image uploaded successfully")
      } else {
        showError("Upload Failed", "Could not upload image")
      }
    } catch (error) {
      showError("Error", "Something went wrong during upload")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingId ? `/api/menu/${editingId}` : "/api/menu"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setIsDialogOpen(false)
        fetchMenuItems()
        resetForm()
        showSuccess(editingId ? "Item Updated" : "Item Created", "Inventory updated successfully.")
      } else {
        showError("Save Failed", "Could not save the menu item.")
      }
    } catch (error) {
      showError("System Error", "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 2. Updated Delete Handler
  const handleDeleteClick = (id: string) => {
    showConfirm(
      "Delete Menu Item?",
      "Are you sure you want to remove this item from the menu?",
      () => performDelete(id)
    )
  }

  const performDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchMenuItems()
        showSuccess("Deleted", "The menu item has been removed.")
      }
    } catch (error) {
      showError("Error", "An error occurred while deleting.")
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Menu Management</h2>
          <Button onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Item" : "Add New Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* (Same Form Inputs as before) */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (RM)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.10"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Qty</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock || 0}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="image">Item Image</Label>
                <div className="flex gap-4 items-center mt-2">
                  {formData.image ? (
                    <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-md border flex items-center justify-center bg-muted">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex-1">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="cursor-pointer"
                    />
                    {isUploading && <p className="text-xs text-muted-foreground mt-1 animate-pulse">Uploading image...</p>}
                    {!isUploading && formData.image && <p className="text-xs text-green-600 mt-1">Image path set: {formData.image}</p>}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || isUploading}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingId ? "Update Item" : "Create Item"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
                 {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                 ) : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${item.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        <Package className="w-3 h-3" />
                        {item.stock > 0 ? `${item.stock} in stock` : "Out of Stock"}
                    </div>
                </div>
                <p className="text-sm text-muted-foreground capitalize">
                  {item.category} • RM{item.price ? item.price.toFixed(2) : "0.00"}
                </p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleOpenEdit(item)}>
                  <Edit className="w-4 h-4" />
                </Button>
                {/* 3. Use new handler */}
                <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(item._id)}>
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