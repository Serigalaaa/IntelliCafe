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
import { Receipt, Loader2, Trash2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";

export function ReceiptButton() {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // --- NEW: Confirmation State ---
  const [isConfirming, setIsConfirming] = useState(false);

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
    if (open) {
        fetchHistory();
        setIsConfirming(false); // Reset view on open
    }
  }, [open]);

  // --- CONFIRMATION ACTION ---
  const handleConfirmClear = async () => {
    try {
        // Using the unified API we set up
        const res = await fetch("/api/orders?all=true", { method: "DELETE" });
        
        if (res.ok) {
            setOrders([]); 
            setIsConfirming(false);
            toast({ title: "History Cleared", description: "Your order history has been reset." });
            setOpen(false);
            
            // Reload for guests to clear cookies visually
            if (!user) {
                window.location.reload(); 
            }
        } else {
             toast({ title: "Error", description: "Failed to clear history", variant: "destructive" });
        }
    } catch (error) {
        console.error("Failed to clear history", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "preparing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "ready": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "completed": return "bg-green-600 text-white border-green-600 hover:bg-green-700";
      default: return "bg-slate-100 text-slate-800";
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

      <DialogContent className="sm:max-w-[425px] transition-all duration-200">
        <DialogHeader className="flex flex-row items-center justify-between pr-4 space-y-0">
          <div>
            <DialogTitle>
                {isConfirming ? "Clear History?" : "Order History"}
            </DialogTitle>
            <DialogDescription>
                {isConfirming ? "This action cannot be undone." : "Review your past orders."}
            </DialogDescription>
          </div>
          
          {/* SHOW TRASH BUTTON (Only in List View) */}
          {!isConfirming && orders.length > 0 && (
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsConfirming(true)}
                className="text-muted-foreground hover:text-destructive"
                title="Clear All History"
             >
                <Trash2 className="w-4 h-4" />
             </Button>
          )}
        </DialogHeader>

        {isConfirming ? (
            // --- CUSTOM CONFIRMATION UI ---
            <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in-95">
                <div className="bg-red-100 p-4 rounded-full mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Are you sure?</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-[90%]">
                    This will permanently delete your entire order history. You will not be able to view these receipts again.
                </p>
                <div className="flex gap-2 w-full justify-center">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsConfirming(false)}
                        className="w-1/2"
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleConfirmClear}
                        className="w-1/2"
                    >
                        Yes, Clear History
                    </Button>
                </div>
            </div>
        ) : (
            // --- NORMAL LIST VIEW ---
            <>
                {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                ) : !orders || orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                    <Receipt className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p>No past orders found.</p>
                </div>
                ) : (
                <ScrollArea className="h-[50vh] pr-4 -mr-4 border rounded-md bg-slate-50 p-2">
                    <div className="space-y-3">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                            <h4 className="font-bold text-lg">{order.orderNumber}</h4>
                            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                            <p className="font-bold">RM{order.totalAmount?.toFixed(2)}</p>
                            <Badge variant="outline" className={`mt-1 ${getStatusColor(order.status)}`}>
                                {order.status.toUpperCase()}
                            </Badge>
                            </div>
                        </div>
                        <div className="text-sm text-slate-600 border-t pt-2 mt-2">
                            {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-xs py-0.5">
                                <span>{item.quantity}x {item.name}</span>
                            </div>
                            ))}
                        </div>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
                )}
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}