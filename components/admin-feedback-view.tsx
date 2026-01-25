"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Added Chevron icons
import {
  Star,
  Trash2,
  Edit2,
  Save,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGlobalModal } from "@/components/providers/modal-provider";

interface Feedback {
  _id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  createdAt: string;
}

export function AdminFeedbackView() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // ------------------------

  const { showSuccess, showError, showConfirm } = useGlobalModal();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Feedback>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Update fetch to use page
  const fetchFeedbacks = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/feedback?page=${page}&limit=10`);
      const data = await response.json();

      if (data.feedbacks) {
        setFeedbacks(data.feedbacks);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        setFeedbacks([]);
      }
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks(currentPage);
  }, [currentPage]);

  const handleDeleteClick = (id: string) => {
    showConfirm("Delete Feedback?", "Are you sure?", () => performDelete(id));
  };

  const performDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/feedback?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        // Refresh current page to keep data consistent
        fetchFeedbacks(currentPage);
        showSuccess("Deleted!", "Feedback removed.");
      } else {
        showError("Error", "Failed to delete.");
      }
    } catch (error) {
      showError("Error", "Unexpected error.");
    }
  };

  // ... (Keep startEditing, cancelEditing, handleSave exactly as they are) ...
  const startEditing = (feedback: Feedback) => {
    setEditingId(feedback._id);
    setEditForm(feedback);
  };
  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };
  const handleSave = async () => {
    if (!editingId) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/feedback`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...editForm }),
      });
      if (res.ok) {
        fetchFeedbacks(currentPage); // Refresh
        setEditingId(null);
        showSuccess("Updated!", "Feedback updated.");
      } else {
        showError("Error", "Failed to update.");
      }
    } catch (error) {
      showError("Error", "Unexpected error.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customer Feedback</h2>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin" />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">
            No feedback found.
          </div>
        ) : (
          feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="p-4 border border-border rounded-lg transition-all hover:bg-accent/5"
            >
              {editingId === feedback._id ? (
                // EDIT MODE (Same as before)
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={editForm.name || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      placeholder="Name"
                    />
                    <Input
                      value={editForm.email || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      placeholder="Email"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Rating:</span>
                    <div className="flex gap-1 cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 cursor-pointer ${star <= (editForm.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                          onClick={() =>
                            setEditForm({ ...editForm, rating: star })
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <Textarea
                    value={editForm.message || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, message: e.target.value })
                    }
                    placeholder="Feedback message"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelEditing}
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-1" />
                      )}{" "}
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                // VIEW MODE
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold">{feedback.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({feedback.email})
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(feedback)}
                        >
                          <Edit2 className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(feedback._id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-2">
                    {feedback.message}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(feedback.createdAt).toLocaleString()}
                  </span>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-4 mt-6 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          <span className="text-sm font-medium text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </Card>
  );
}
