"use client";

import Link from "next/link";
import { Coffee, LogOut, UserIcon, UserCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react"; // Added useEffect
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CartSidebar } from "@/components/cart-sidebar";
import { ReceiptButton } from "@/components/receipt-button";
import { useCartStore } from "@/lib/cart-store";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  // --- NEW: Track Guest Mode Flag ---
  const [isGuestMode, setIsGuestMode] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { items, clearOrderHistory, clearCart } = useCartStore();

  // Check Local Storage on mount to see if Guest Mode is active
  useEffect(() => {
    if (typeof window !== "undefined") {
        const isGuest = localStorage.getItem("guest_mode") === "true";
        setIsGuestMode(isGuest);
    }
  }, []); // Run once on mount

  // Sync with items: If items exist + not auth, we are definitely guest
  useEffect(() => {
    if (!isAuthenticated && items.length > 0) {
        setIsGuestMode(true);
        localStorage.setItem("guest_mode", "true");
    }
  }, [items.length, isAuthenticated]);
  
  // LOGIC: Guest if (NOT Logged In) AND (Flag is True OR Items exist)
  const isGuest = !isAuthenticated && (isGuestMode || items.length > 0);

  // --- LOGOUT (Logged In Users) ---
  const handleLogout = async () => {
    clearCart();
    clearOrderHistory();
    await logout();
    setIsOpen(false);
    window.location.href = "/";
  };

  // --- EXIT GUEST MODE (Anonymous Users) ---
  const handleGuestExit = async () => {
    // 1. Clear Data
    clearCart();
    clearOrderHistory();
    setShowExitConfirm(false);
    setIsOpen(false);
    
    // 2. Remove UI Flag (IMPORTANT)
    localStorage.removeItem("guest_mode");
    setIsGuestMode(false);

    // 3. Call API to remove cookie
    try {
        await fetch("/api/auth/reset-guest", { method: "POST" });
    } catch (e) {
        console.error("Failed to reset guest");
    }

    // 4. Reload to reset state
    window.location.reload();
  };

  const baseItems = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
  ];

  const authItems = [
    { name: "Feedback", href: "/feedback" },
    { name: "Game", href: "/game" },
    { name: "Chatbot", href: "/chatbot" },
  ];

  const navItems = [
    ...baseItems,
    ...(isAuthenticated ? authItems : []),
    ...(user?.role === "admin" ? [{ name: "Admin", href: "/admin" }] : []),
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <Coffee className="w-6 h-6 text-primary transition-transform group-hover:rotate-12" />
              <span className="font-semibold text-lg text-foreground">
                IntelliCafe
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-6 mr-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-2 pl-4 border-l">
                <ReceiptButton />
                <CartSidebar />

                {isAuthenticated && user ? (
                  // LOGGED IN USER UI
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2 ml-2">
                        <UserIcon className="w-4 h-4" />
                        {user.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground font-normal">
                            {user.email}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : isGuest ? (
                  // GUEST USER UI (Matches User Style)
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2 ml-2">
                        <UserCircle className="w-4 h-4" />
                        Guest User
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span>Guest Session</span>
                          <span className="text-xs text-muted-foreground font-normal">
                            Temporary Access
                          </span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setShowExitConfirm(true)} 
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Exit Guest Mode
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // DEFAULT LOGIN BUTTON
                   <Button asChild variant="default" size="sm" className="ml-2">
                      <Link href="/auth">Login</Link>
                   </Button>
                )}
              </div>
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <ReceiptButton />
              <CartSidebar />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-foreground ml-1"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`w-full h-0.5 bg-current transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
                  <span className={`w-full h-0.5 bg-current transition-all ${isOpen ? "opacity-0" : ""}`} />
                  <span className={`w-full h-0.5 bg-current transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu Content */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-5">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3 px-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent/50 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="mt-4 pt-4 border-t">
                 {isAuthenticated && user ? (
                    <>
                      <div className="px-2 py-2 text-sm font-medium text-foreground/60">{user.name}</div>
                      <button onClick={handleLogout} className="w-full text-left px-2 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors">Logout</button>
                    </>
                 ) : isGuest ? (
                    <>
                       <div className="px-2 py-2 text-sm font-medium text-foreground/60 flex items-center gap-2">
                          <UserCircle className="w-4 h-4" /> Guest User
                       </div>
                       <button onClick={() => setShowExitConfirm(true)} className="w-full text-left px-2 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                          Exit Guest Mode
                       </button>
                    </>
                 ) : (
                    <Link href="/auth" className="block w-full text-center py-2 bg-primary text-primary-foreground rounded-md font-medium" onClick={() => setIsOpen(false)}>
                       Login / Sign Up
                    </Link>
                 )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* --- EXIT CONFIRMATION DIALOG --- */}
      <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <DialogContent className="sm:max-w-[400px]">
            <DialogHeader className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <DialogTitle>Exit Guest Mode?</DialogTitle>
                <DialogDescription className="pt-2">
                    This will clear your current cart and remove your temporary session. 
                    <br/><span className="font-semibold text-foreground">This action cannot be undone.</span>
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:justify-center mt-4 w-full">
                <Button variant="outline" onClick={() => setShowExitConfirm(false)} className="w-full sm:w-auto">
                    Cancel
                </Button>
                <Button variant="destructive" onClick={handleGuestExit} className="w-full sm:w-auto">
                    Yes, Exit
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}