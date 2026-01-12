"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Star, Trash2, Edit2, Save, X, Loader2 } from "lucide-react"
import { useGlobalModal } from "@/components/providers/modal-provider" // 1. Import hook

interface Feedback {
  _id: string
  name: string
  email: string
  rating: number
  message: string
  createdAt: string
}

export function AdminFeedbackView() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  
  // 2. Initialize the modal hook
  const { showSuccess, showError } = useGlobalModal()

  // State for Editing
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Feedback>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("/api/feedback")
      const data = await response.json()
      setFeedbacks(data)
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- DELETE FUNCTION ---
  const handleDelete = async (id: string) => {
    // Note: We can also replace this confirm with a custom modal later if you want
    if (!confirm("Are you sure you want to delete this feedback?")) return

    try {
      const res = await fetch(`/api/feedback?id=${id}`, { method: "DELETE" })

      if (res.ok) {
        setFeedbacks((prev) => prev.filter((item) => item._id !== id))
        // 3. Use success modal
        showSuccess("Deleted!", "The feedback has been removed successfully.")
      } else {
        // 4. Use error modal
        showError("Error", "Failed to delete feedback.")
      }
    } catch (error) {
      console.error("Delete error:", error)
      showError("Error", "An unexpected error occurred.")
    }
  }

  // --- EDIT FUNCTIONS ---
  const startEditing = (feedback: Feedback) => {
    setEditingId(feedback._id)
    setEditForm(feedback)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleSave = async () => {
    if (!editingId) return
    setIsSaving(true)

    try {
      const res = await fetch(`/api/feedback`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...editForm }),
      })

      if (res.ok) {
        setFeedbacks((prev) =>
          prev.map((item) => (item._id === editingId ? { ...item, ...editForm } : item))
        )
        setEditingId(null)
        // 5. Use success modal
        showSuccess("Updated!", "Customer feedback has been updated successfully.")
      } else {
        // 6. Use error modal
        showError("Error", "Failed to update feedback.")
      }
    } catch (error) {
      console.error("Update error:", error)
      showError("Error", "An unexpected error occurred.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Customer Feedback</h2>
      <div className="space-y-4">
        {loading ? <p>Loading feedback...</p> : feedbacks.map((feedback) => (
          <div key={feedback._id} className="p-4 border border-border rounded-lg transition-all hover:bg-accent/5">
            
            {editingId === feedback._id ? (
              // --- EDIT MODE ---
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    value={editForm.name || ""} 
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
                    placeholder="Name"
                  />
                  <Input 
                    value={editForm.email || ""} 
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} 
                    placeholder="Email"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Rating:</span>
                  <div className="flex gap-1 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 cursor-pointer ${
                          star <= (editForm.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }`}
                        onClick={() => setEditForm({ ...editForm, rating: star })}
                      />
                    ))}
                  </div>
                </div>

                <Textarea 
                  value={editForm.message || ""} 
                  onChange={(e) => setEditForm({ ...editForm, message: e.target.value })} 
                  placeholder="Feedback message"
                />

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={cancelEditing} disabled={isSaving}>
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              // --- VIEW MODE ---
              <>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-semibold">{feedback.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">({feedback.email})</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEditing(feedback)}>
                        <Edit2 className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(feedback._id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-foreground mb-2">{feedback.message}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(feedback.createdAt).toLocaleString()}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}