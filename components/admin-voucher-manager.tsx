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
import { Trash2, Ticket, Plus, Loader2 } from "lucide-react";
import { useGlobalModal } from "@/components/providers/modal-provider";

export function AdminVoucherManager() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { showSuccess, showError, showConfirm } = useGlobalModal();

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage", // 'percentage' | 'fixed'
    value: "",
    limitType: "daily", // 'daily' | 'unlimited'
    description: "",
  });

  const fetchVouchers = async () => {
    try {
      const res = await fetch("/api/vouchers");
      const data = await res.json();
      setVouchers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

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
        fetchVouchers();
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
        fetchVouchers();
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
            <Loader2 className="mx-auto animate-spin" />
          ) : vouchers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No vouchers created yet.
            </p>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
