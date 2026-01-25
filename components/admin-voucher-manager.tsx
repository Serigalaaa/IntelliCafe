"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
// Added ChevronLeft and ChevronRight
import {
  Trash2,
  Ticket,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGlobalModal } from "@/components/providers/modal-provider";

export function AdminVoucherManager() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // ------------------------

  const { showSuccess, showError, showConfirm } = useGlobalModal();

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    limitType: "daily",
    description: "",
  });

  // Updated Fetch to accept page
  const fetchVouchers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/vouchers?page=${page}&limit=10`);
      const data = await res.json();

      if (data.vouchers) {
        setVouchers(data.vouchers);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        setVouchers([]);
      }
    } catch (e) {
      console.error(e);
      showError("Error", "Failed to fetch vouchers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers(currentPage);
  }, [currentPage]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch("/api/vouchers", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        showSuccess("Voucher Created", `${formData.code} is now active.`);
        setFormData({
          code: "",
          type: "percentage",
          value: "",
          limitType: "daily",
          description: "",
        });
        // Refresh current page (or go to page 1 to see new item)
        fetchVouchers(1);
      } else {
        const err = await res.json();
        showError("Error", err.error);
      }
    } catch (e) {
      showError("Error", "Failed to create voucher");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string) => {
    showConfirm(
      "Delete Voucher?",
      "Users will no longer be able to use this code.",
      async () => {
        await fetch(`/api/vouchers?id=${id}`, { method: "DELETE" });
        fetchVouchers(currentPage); // Refresh current page
        showSuccess("Deleted", "Voucher removed.");
      },
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* 1. CREATE FORM */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" /> Create Voucher
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Voucher Code</Label>
                <Input
                  placeholder="e.g. DAILY10"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Limit Type</Label>
                <Select
                  value={formData.limitType}
                  onValueChange={(v) =>
                    setFormData({ ...formData, limitType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Once Per Day</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (RM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  type="number"
                  placeholder={formData.type === "percentage" ? "10" : "5.00"}
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="e.g. 10% off for loyal customers"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create Voucher"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 2. VOUCHER LIST */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="w-5 h-5" /> Active Vouchers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin" />
            </div>
          ) : vouchers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No vouchers created yet.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vouchers.map((v) => (
                    <TableRow key={v._id}>
                      <TableCell className="font-bold font-mono">
                        {v.code}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {v.type === "percentage"
                            ? `${v.value}%`
                            : `RM${v.value}`}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize text-xs">
                        {v.limitType}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(v._id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* --- PAGINATION CONTROLS --- */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 py-4 mt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
