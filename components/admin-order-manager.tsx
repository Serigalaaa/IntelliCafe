"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Trash2,
  User,
  Clock,
  ShoppingBag,
  TicketPercent,
} from "lucide-react";
import { useGlobalModal } from "@/components/providers/modal-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AdminOrderManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingUpdate, setPendingUpdate] = useState<{
    id: string;
    status: string;
  } | null>(null);

  const { showConfirm, showSuccess, showError } = useGlobalModal();

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const confirmStatusUpdate = async () => {
    if (!pendingUpdate) return;
    const { id, status } = pendingUpdate;

    try {
      await fetch("/api/orders", {
        method: "PUT",
        body: JSON.stringify({ id, status }),
      });

      setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
      showSuccess("Status Updated", `Order marked as ${status.toUpperCase()}`);
    } catch (error) {
      showError("Update Failed", "Could not update order status");
    } finally {
      setPendingUpdate(null);
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setPendingUpdate({ id, status: newStatus });
  };

  const handleDeleteClick = (id: string) => {
    showConfirm(
      "Delete Order?",
      "Are you sure you want to delete this order?",
      () => performDelete(id),
    );
  };

  const performDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/orders?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setOrders((prev) => prev.filter((o) => o._id !== id));
      showSuccess("Order Deleted", "The order has been removed successfully.");
    } catch (error) {
      showError("Delete Failed", "Could not remove the order.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "preparing":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "ready":
        return "bg-indigo-500 hover:bg-indigo-600 text-white";
      case "completed":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "cancelled":
        return "bg-slate-500 hover:bg-slate-600 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Incoming Orders</h2>
        <Button variant="outline" size="sm" onClick={fetchOrders}>
          Refresh List
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/20 text-muted-foreground">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No active orders</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* LEFT: Order Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">
                        {order.orderNumber}
                      </span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded w-fit">
                      <User className="w-4 h-4" />
                      <span>{order.userName || "Guest"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* MIDDLE: Items & Pricing */}
                  <div className="flex-1 border-l pl-4 border-gray-100 min-h-[60px]">
                    <div className="space-y-2 mb-3">
                      {order.items.map((item: any, idx: number) => (
                        // NEW: Flex container to split Name and Price
                        <div
                          key={idx}
                          className="flex justify-between items-start text-sm"
                        >
                          <span>
                            <span className="font-bold">{item.quantity}x</span>{" "}
                            {item.name}
                          </span>
                          <span className="text-muted-foreground font-mono">
                            RM{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total Section with Voucher Badge */}
                    <div className="space-y-1 border-t pt-2">
                      <div className="flex justify-between items-center">
                        {order.voucherCode ? (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 w-fit">
                            <TicketPercent className="w-3 h-3" />
                            <span>
                              {order.voucherCode} (-RM
                              {order.discount?.toFixed(2)})
                            </span>
                          </div>
                        ) : (
                          <span></span>
                        )}

                        <div className="font-bold text-sm">
                          Total: RM{order.totalAmount?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Actions */}
                  <div className="flex items-center gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(val) =>
                        handleStatusChange(order._id, val)
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(order._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!pendingUpdate}
        onOpenChange={() => setPendingUpdate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Status?</AlertDialogTitle>
            <AlertDialogDescription>
              Change status to{" "}
              <span className="font-bold text-foreground">
                "{pendingUpdate?.status.toUpperCase()}"
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusUpdate}>
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
