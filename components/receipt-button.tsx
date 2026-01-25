"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Receipt, Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";

export function ReceiptButton() {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders?history=true");
      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data.orders && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to load history");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchHistory();
  }, [open]);

  const handleClearGuestHistory = async () => {
    if (!confirm("This will clear your temporary order history. Are you sure?"))
      return;
    try {
      await fetch("/api/auth/reset-guest", { method: "POST" });
      setOrders([]);
      toast({
        title: "History Cleared",
        description: "You are now a new guest.",
      });
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to reset");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "preparing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ready":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      // UPDATED: Completed is now Green
      case "completed":
        return "bg-green-600 text-white border-green-600 hover:bg-green-700";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Receipt className="h-4 w-4" />
          <span className="hidden md:inline font-semibold">Order History</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order History</DialogTitle>
          <DialogDescription>
            Review your past orders and status.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin" />
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No past orders found.
          </div>
        ) : (
          <ScrollArea className="h-[50vh] pr-4 -mr-4 border rounded-md bg-slate-50 p-2">
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-4 rounded-lg border shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-lg">{order.orderNumber}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        RM{order.totalAmount?.toFixed(2)}
                      </p>
                      <Badge
                        variant="outline"
                        className={`mt-1 ${getStatusColor(order.status)}`}
                      >
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 border-t pt-2 mt-2">
                    {order.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between text-xs py-0.5"
                      >
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {!user && orders && orders.length > 0 && (
          <div className="mt-4 pt-2 border-t flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleClearGuestHistory}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Clear Guest History
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
