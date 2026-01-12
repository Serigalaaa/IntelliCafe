"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus, Trash2, Loader2 } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGlobalModal } from "@/components/providers/modal-provider" // 1. Import Modal

export function CartSidebar() {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice, clearCart } = useCartStore()
  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  // 2. Local state for loading
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isOpen, setIsOpen] = useState(false) // To control closing the sheet
  
  // 3. Use Global Modal for feedback
  const { showSuccess, showError } = useGlobalModal()

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
        // Success Logic
        clearCart()
        setIsOpen(false) // Close sidebar
        showSuccess("Order Placed!", "Thank you for your purchase. Your order is being prepared.")
      } else {
        // Error Logic (e.g., Out of stock)
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
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Cart ({totalItems} items)</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Add items from the menu to get started</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[calc(100vh-250px)] pr-4 mt-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                      <p className="text-sm font-bold text-primary">RM{item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0 bg-transparent"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={isCheckingOut}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0 bg-transparent"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={isCheckingOut}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 ml-auto text-destructive"
                          onClick={() => removeItem(item._id)}
                          disabled={isCheckingOut}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">RM{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 mt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">RM{totalPrice.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                {/* CHECKOUT BUTTON */}
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleCheckout} 
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Checkout"
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent" 
                  onClick={clearCart}
                  disabled={isCheckingOut}
                >
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