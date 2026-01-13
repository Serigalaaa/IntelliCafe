"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Receipt, ArrowLeft, Clock } from "lucide-react"
import { useCartStore, OrderReceipt } from "@/lib/cart-store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ReceiptButton() {
  const { orderHistory } = useCartStore()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderReceipt | null>(null)

  if (!orderHistory || orderHistory.length === 0) return null

  const handleOpen = () => {
    setSelectedOrder(null)
    setIsOpen(true)
  }

  // Same helper function for consistency
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase() // Ensure case insensitivity
    if (s === "pending") return "bg-yellow-100 text-yellow-800 border-yellow-200"
    if (s === "done" || s === "paid") return "bg-green-100 text-green-800 border-green-200"
    if (s === "cancelled") return "bg-red-100 text-red-800 border-red-200"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-2 text-muted-foreground hover:text-primary"
        onClick={handleOpen}
      >
        <Receipt className="w-4 h-4" />
        <span className="hidden sm:inline">Orders</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md h-[500px] flex flex-col">
          
          {selectedOrder ? (
            /* --- DETAIL VIEW --- */
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedOrder(null)}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <DialogTitle>Order Receipt</DialogTitle>
                </div>
                <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-2">
                    <Receipt className="w-6 h-6 text-green-600" />
                </div>
                <DialogDescription className="text-center">
                  #{selectedOrder.orderNumber} • {selectedOrder.date}
                </DialogDescription>
                <div className="flex justify-center mt-2">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.toUpperCase()}
                     </span>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto bg-muted/30 p-4 rounded-lg border border-dashed border-gray-300">
                <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                        <div key={`${item._id}-${idx}`} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{item.quantity}x <span className="text-foreground">{item.name}</span></span>
                            <span className="font-medium">RM{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="my-4 border-t border-dashed border-gray-300" />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>RM{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => setIsOpen(false)} className="w-full mt-2">Close</Button>
              </DialogFooter>
            </>
          ) : (
            /* --- LIST VIEW --- */
            <>
              <DialogHeader>
                <DialogTitle>Order History</DialogTitle>
                <DialogDescription>
                  You have placed {orderHistory.length} orders.
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="space-y-3 mt-2">
                    {orderHistory.map((order) => (
                        <div 
                            key={order.orderNumber} 
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                            onClick={() => setSelectedOrder(order)}
                        >
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 p-2 rounded-full mt-1">
                                    <Clock className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{order.orderNumber}</h4>
                                    <p className="text-xs text-muted-foreground">{order.date}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {order.items.length} items
                                    </p>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1">
                                <p className="font-bold text-sm">RM{order.total.toFixed(2)}</p>
                                {/* UPDATED COLORS HERE */}
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
              </ScrollArea>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full mt-2">Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}