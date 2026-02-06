"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  Trash2,
  TicketPercent,
  Loader2,
  Minus,
  Plus,
  X,
  Gift,
  Lock,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGlobalModal } from "@/components/providers/modal-provider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export function CartSidebar() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    addOrder,
  } = useCartStore();
  const totalItems = getTotalItems();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { showSuccess, showError } = useGlobalModal();
  
  const { user, isAuthenticated } = useAuth();
  const prevUserIdRef = useRef<string | undefined>(user?.id || (user as any)?._id);

  // --- 1. LOGOUT DETECTION (Clear Cart) ---
  useEffect(() => {
    const currentUserId = user?.id || (user as any)?._id;
    if (prevUserIdRef.current && !currentUserId) {
      clearCart();
    }
    prevUserIdRef.current = currentUserId;
  }, [user, clearCart]);

// --- 2. GUEST MODE TRIGGER ---
  useEffect(() => {
    if (items.length > 0 && !isAuthenticated) {
        // A. Call API
        fetch("/api/auth/guest", { method: "POST" })
            .catch(err => console.error("Failed to init guest session", err));
            
        // B. Set UI Flag (NEW LINE)
        if (typeof window !== "undefined") {
            localStorage.setItem("guest_mode", "true");
        }
    }
  }, [items.length, isAuthenticated]);

  // --- VOUCHER LOGIC ---
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    amount: number;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetch("/api/vouchers?limit=100")
        .then((res) => res.json())
        .then((data) => {
          if (data.vouchers && Array.isArray(data.vouchers)) {
            const active = data.vouchers.filter((v: any) => v.isActive);
            setAvailableVouchers(active);
          }
        })
        .catch((err) => console.error("Failed to load vouchers", err));
    }
  }, [isOpen, isAuthenticated]);

  const subTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, subTotal - (appliedVoucher?.amount || 0));

  const validateVoucher = async (codeToUse: string) => {
    if (!codeToUse) return;
    setIsValidating(true);
    try {
      const res = await fetch("/api/vouchers/validate", {
        method: "POST",
        body: JSON.stringify({ code: codeToUse, cartTotal: subTotal }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedVoucher({ code: data.code, amount: data.discountAmount });
        setVoucherCode(data.code); 
        showSuccess("Voucher Applied!", `You saved RM${data.discountAmount.toFixed(2)}`);
      } else {
        setAppliedVoucher(null);
        showError("Invalid Voucher", data.error);
      }
    } catch (error) {
      showError("Error", "Could not validate voucher");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSelectVoucher = (value: string) => {
    setVoucherCode(value);
    validateVoucher(value);
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          voucherCode: appliedVoucher?.code,
          // If user exists use their ID, else mark as GUEST
          userId: user?.id || (user as any)?._id || "GUEST", 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addOrder({
          orderNumber: data.orderNumber,
          items: [...items],
          total: finalTotal,
          date: new Date().toLocaleString(),
          status: "Pending",
        });
        clearCart();
        setAppliedVoucher(null);
        setVoucherCode("");
        setIsOpen(false);
        showSuccess("Order Placed!", `Order #${data.orderNumber} confirmed.`);
      } else {
        showError("Checkout Failed", data.error);
      }
    } catch (error) {
      showError("Error", "Something went wrong.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to remove all items?")) {
        clearCart();
        setAppliedVoucher(null);
        setVoucherCode("");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-accent/50 transition-colors">
          <ShoppingCart className="h-5 w-5 text-foreground/80" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold bg-primary text-primary-foreground animate-in zoom-in border-2 border-background">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:max-w-md p-0 gap-0 border-l shadow-2xl">
        <SheetHeader className="p-6 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10 flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <ShoppingCart className="w-5 h-5" /> Your Cart
            <span className="text-sm font-normal text-muted-foreground ml-2">({totalItems})</span>
          </SheetTitle>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearCart} className="text-muted-foreground hover:text-destructive h-8 px-2" title="Clear Cart">
                <Trash2 className="w-4 h-4 mr-1" /><span className="text-xs">Clear</span>
            </Button>
          )}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center space-y-4">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 opacity-20" />
            </div>
            <div>
              <p className="font-semibold text-lg text-foreground">Your cart is empty</p>
            </div>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="mt-4">Browse Menu</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={item._id} className="group">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border bg-muted flex-shrink-0 shadow-sm">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-semibold text-base line-clamp-2">{item.name}</h4>
                            <p className="text-sm font-bold text-primary mt-1">RM{item.price.toFixed(2)}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item._id)} disabled={isCheckingOut}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center bg-muted/50 rounded-full border shadow-sm">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-l-full" onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} disabled={isCheckingOut || item.quantity <= 1}><Minus className="h-3 w-3" /></Button>
                            <span className="text-sm font-semibold w-8 text-center tabular-nums">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-r-full" onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={isCheckingOut}><Plus className="h-3 w-3" /></Button>
                          </div>
                          <span className="font-bold text-sm">RM{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    {index < items.length - 1 && <Separator className="mt-6 bg-border/50" />}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-6 bg-muted/10 border-t shadow-[0_-4px_16px_rgba(0,0,0,0.05)] space-y-4">
              
              {/* VOUCHER SECTION: DISABLED FOR GUESTS */}
              <div className="space-y-3">
                {isAuthenticated ? (
                  <>
                    {!appliedVoucher && availableVouchers.length > 0 && (
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground ml-1">Available Vouchers</label>
                            <Select onValueChange={handleSelectVoucher}>
                            <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select a voucher..." /></SelectTrigger>
                            <SelectContent>
                                {availableVouchers.map((v) => (
                                <SelectItem key={v._id} value={v.code}>
                                    <div className="flex items-center gap-2"><Gift className="w-4 h-4 text-orange-500" /><span className="font-bold">{v.code}</span><span className="text-muted-foreground text-xs">({v.type === "percentage" ? `${v.value}%` : `RM${v.value}`} Off)</span></div>
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        </div>
                    )}
                    {appliedVoucher ? (
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md">
                                <div className="flex items-center gap-2"><TicketPercent className="w-4 h-4" /><span className="text-sm font-medium">Code <strong>{appliedVoucher.code}</strong> applied</span></div>
                                <Button variant="ghost" size="sm" className="h-auto p-1 text-green-700 hover:bg-green-100" onClick={() => { setAppliedVoucher(null); setVoucherCode(""); }}><X className="w-4 h-4" /></Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                                <div className="relative flex-1"><TicketPercent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Or enter code manually" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value.toUpperCase())} className="pl-9 bg-background" /></div>
                                <Button variant="secondary" onClick={() => validateVoucher(voucherCode)} disabled={!voucherCode || isValidating}>{isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}</Button>
                        </div>
                    )}
                  </>
                ) : (
                  // GUEST LOCKED VIEW
                  <div className="flex items-center justify-between bg-muted/50 border border-dashed border-gray-300 px-4 py-3 rounded-lg text-sm text-muted-foreground">
                     <div className="flex items-center gap-2"><Lock className="w-4 h-4" /><span>Login to use vouchers</span></div>
                     <Button variant="link" size="sm" className="h-auto p-0 text-primary" asChild><Link href="/auth">Login</Link></Button>
                  </div>
                )}
              </div>

              <Separator className="bg-border/60" />
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>RM{subTotal.toFixed(2)}</span></div>
                {appliedVoucher && <div className="flex justify-between text-sm text-green-600 font-medium"><span>Discount</span><span>-RM{appliedVoucher.amount.toFixed(2)}</span></div>}
                <div className="flex justify-between items-end pt-2 mt-2"><span className="text-base font-medium">Total</span><span className="text-2xl font-bold tracking-tight text-primary">RM{finalTotal.toFixed(2)}</span></div>
              </div>
              <Button className="w-full text-lg font-bold h-12 shadow-md hover:shadow-lg transition-all" onClick={handleCheckout} disabled={isCheckingOut}>
                {isCheckingOut ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : "Checkout Now"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}