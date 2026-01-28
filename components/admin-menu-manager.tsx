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
import {
  Edit,
  Trash2,
  Plus,
  Loader2,
  ImageIcon,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGlobalModal } from "@/components/providers/modal-provider";

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
const CATEGORIES = ["coffee", "mains", "sides", "desserts", "entree", "add-on"];

export function AdminMenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const fetchMenuItems = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/menu?page=${page}&limit=10`);

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      if (data.items && Array.isArray(data.items)) {
        setItems(data.items);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      } else if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }
    } catch (error) {
      showError("Error", "Failed to load menu");
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems(currentPage);
  }, [currentPage]);

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
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // FIX: Use Dynamic Route for PUT
      const url = editingId ? `/api/menu/${editingId}` : "/api/menu";
      const method = editingId ? "PUT" : "POST";

      // We don't need to send _id in body for PUT if it's in the URL,
      // but keeping it safe doesn't hurt.
      const bodyData = formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        setIsDialogOpen(false);
        fetchMenuItems(currentPage);
        resetForm();
        showSuccess("Success", "Saved");
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
    } catch (e: any) {
      showError("Error", e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    showConfirm("Delete Item?", "Permanently remove this item?", async () => {
      // FIX: Use Dynamic Route for DELETE (No query param ?id=)
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMenuItems(currentPage);
        showSuccess("Deleted", "Item removed");
      } else {
        showError("Error", "Failed to delete");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Menu Management</h2>
        <Button onClick={handleOpenAdd} size="sm">
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
                    alt="Preview"
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
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin" />
            </div>
          ) : !items || items.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-muted/20 text-muted-foreground">
              No menu items found.
            </div>
          ) : (
            items.map((item) => (
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
            ))
          )}
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 py-4 mt-4 border-t">
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
    </div>
  );
}
