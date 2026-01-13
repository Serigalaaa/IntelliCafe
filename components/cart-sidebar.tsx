"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus, Trash2, Loader2 } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGlobalModal } from "@/components/providers/modal-provider"

export function CartSidebar() {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice, clearCart, addOrder } = useCartStore()
  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const { showSuccess, showError } = useGlobalModal()

  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isOpen, setIsOpen] = useState(false) 

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      const result = await response.json()

      if (response.ok) {
        // 1. CHANGED: Status is now "Pending" initially
        addOrder({
          orderNumber: result.orderNumber,
          items: [...items],
          total: totalPrice,
          date: new Date().toLocaleString(),
          status: "Pending" // <--- Updated here
        })
        
        // 2. Clear and Close
        clearCart()
        setIsOpen(false)
        
        // 3. Feedback
        showSuccess("Order Placed!", "Your order is pending confirmation.")
      } else {
        showError("Checkout Failed", result.error || "Something went wrong.")
      }
    } catch (error) {
      showError("System Error", "Could not connect to the server.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent border-none hover:bg-accent">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-in zoom-in">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>Your Cart ({totalItems} items)</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Add delicious items from the menu!</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-4 mt-6 -mr-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4 p-4 border rounded-lg bg-card/50">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                        <p className="text-sm font-bold text-primary mt-1">RM{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                         <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={isCheckingOut}><Minus className="h-3 w-3" /></Button>
                         <span className="text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>
                         <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={isCheckingOut}><Plus className="h-3 w-3" /></Button>
                         <Button size="sm" variant="ghost" className="h-7 w-7 p-0 ml-auto text-destructive hover:bg-destructive/10" onClick={() => removeItem(item._id)} disabled={isCheckingOut}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-end">
                      <p className="text-sm font-bold">RM{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 mt-4 space-y-4 mb-6">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary text-xl">RM{totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full font-bold" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                  {isCheckingOut ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Place Order"}
                </Button>
                
                <Button variant="outline" className="w-full" onClick={clearCart} disabled={isCheckingOut}>
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}