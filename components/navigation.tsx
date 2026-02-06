"use client";

import Link from "next/link";
import { Coffee, LogOut, UserIcon, UserCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
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
import { AuthModal } from "@/components/auth-modal";
import { useSearchParams } from "next/navigation"; // Added import

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  const [isGuestMode, setIsGuestMode] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { items, clearOrderHistory, clearCart } = useCartStore();
  const searchParams = useSearchParams(); // Get URL params

  // --- NEW: Check for redirect trigger ---
  useEffect(() => {
    if (searchParams.get("openLogin") === "true") {
        setAuthModalOpen(true);
        setAuthTab("login");
        
        // Clean URL to prevent loop/refresh issues
        const url = new URL(window.location.href);
        url.searchParams.delete("openLogin");
        window.history.replaceState({}, "", url);
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof window !== "undefined") {
        const isGuest = localStorage.getItem("guest_mode") === "true";
        setIsGuestMode(isGuest);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated && items.length > 0) {
        setIsGuestMode(true);
        localStorage.setItem("guest_mode", "true");
    }
  }, [items.length, isAuthenticated]);
  
  const isGuest = !isAuthenticated && (isGuestMode || items.length > 0);

  const handleLogout = async () => {
    clearCart();
    clearOrderHistory();
    await logout();
    setIsOpen(false);
    window.location.href = "/";
  };

  const handleGuestExit = async () => {
    clearCart();
    clearOrderHistory();
    setShowExitConfirm(false);
    setIsOpen(false);
    localStorage.removeItem("guest_mode");
    setIsGuestMode(false);
    try {
        await fetch("/api/auth/reset-guest", { method: "POST" });
    } catch (e) { console.error(e); }
    window.location.reload();
  };

  const openLogin = () => {
    setAuthTab("login");
    setAuthModalOpen(true);
    setIsOpen(false);
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
                   <Button onClick={openLogin} variant="default" size="sm" className="ml-2">
                      Login
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
                    <Button onClick={openLogin} className="w-full" variant="default">
                       Login / Sign Up
                    </Button>
                 )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} defaultTab={authTab} />

      <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <DialogContent className="sm:max-w-[400px]">
            <DialogHeader className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <DialogTitle>Exit Guest Mode?</DialogTitle>
                <DialogDescription className="pt-2">
                    This will clear your current cart and remove your temporary session. 
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