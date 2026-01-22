"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// FIX 1: Import Trash2 instead of Trash to match Order Manager
import { Edit, Trash2, Plus, Loader2, ImageIcon, Package } from "lucide-react";
import { useGlobalModal } from "@/components/providers/modal-provider";

// ... (Keep your existing Interface & Categories) ...
interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  available: boolean;
}
const CATEGORIES = ["coffee", "tea", "pastry", "sandwich", "dessert"];

export function AdminMenuManager() {
  // ... (Keep all your existing State & Logic unchanged) ...
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { showSuccess, showError, showConfirm } = useGlobalModal();
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    stock: 20,
    category: "coffee",
    image: "",
    available: true,
  });

  // ... (Keep your fetch, upload, and submit functions exactly as they were) ...
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("/api/menu");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      showError("Error", "Failed to load");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock: 20,
      category: "coffee",
      image: "",
      available: true,
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingId(item._id);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... (Keep your existing upload logic) ...
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.path }));
        showSuccess("Success", "Uploaded");
      }
    } catch (e) {
      showError("Error", "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // ... (Keep your existing submit logic) ...
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/menu/${editingId}` : "/api/menu";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsDialogOpen(false);
        fetchMenuItems();
        resetForm();
        showSuccess("Success", "Saved");
      }
    } catch (e) {
      showError("Error", "Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    showConfirm("Delete Item?", "Permanently remove this item?", async () => {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMenuItems();
        showSuccess("Deleted", "Item removed");
      }
    });
  };

  return (
    <div className="space-y-4">
      {" "}
      {/* FIX 2: Matched spacing with Order Manager */}
      {/* FIX 3: Standardized Header (text-xl instead of 2xl, match Order Manager) */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Menu Management</h2>
        <Button onClick={handleOpenAdd} size="sm">
          {" "}
          {/* FIX 4: Added size="sm" */}
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Item" : "Add New Item"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... (Keep your form inputs exactly as they were) ... */}
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.10"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={formData.stock || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Image</Label>
              <div className="flex gap-4 items-center mt-2">
                {formData.image ? (
                  <img
                    src={formData.image}
                    className="w-16 h-16 rounded border object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded border bg-muted flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <Input
                  type="file"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editingId ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Card className="p-0 border-0 shadow-none bg-transparent">
        <div className="space-y-4">
          {items.map((item) => (
            // FIX 5: Updated Card styling to match the Order Cards better
            <Card key={item._id} className="overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <div
                      className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${item.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      <Package className="w-3 h-3" />
                      {item.stock > 0
                        ? `${item.stock} in stock`
                        : "Out of Stock"}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {item.category} • RM
                    {item.price ? item.price.toFixed(2) : "0.00"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleOpenEdit(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {/* FIX 6: Switched to Trash2 to match Order Manager */}
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDeleteClick(item._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
