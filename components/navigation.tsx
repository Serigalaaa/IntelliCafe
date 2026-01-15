"use client"

import Link from "next/link"
import { Coffee, LogOut, UserIcon } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { ReceiptButton } from "@/components/receipt-button"
import { useCartStore } from "@/lib/cart-store" 

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  
  const { clearOrderHistory } = useCartStore() 

  const handleLogout = async () => {
    // 1. Clear local cart/history data
    clearOrderHistory() 
    
    // 2. Perform the logout (await ensures cookie is cleared)
    await logout()
    
    // 3. Close menu
    setIsOpen(false)

    // 4. Force a hard refresh to the home page
    // This clears all state/cache instantly and resets the view to "Guest"
    window.location.href = "/"
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Feedback", href: "/feedback" },
    { name: "Game", href: "/game" },
    { name: "Chatbot", href: "/chatbot" },
    ...(user?.role === "admin" ? [{ name: "Admin", href: "/admin" }] : []),
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Coffee className="w-6 h-6 text-primary transition-transform group-hover:rotate-12" />
            <span className="font-semibold text-lg text-foreground">IntelliCafe</span>
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

              {isAuthenticated && user && (
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
                        <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="flex md:hidden items-center gap-2 p-2 text-foreground" aria-label="Toggle menu">
             <div className="flex md:hidden">
                <ReceiptButton />
                <CartSidebar />
             </div>
             
             <div className="w-6 h-5 flex flex-col justify-between ml-2">
              <span className={`w-full h-0.5 bg-current transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`w-full h-0.5 bg-current transition-all ${isOpen ? "opacity-0" : ""}`} />
              <span className={`w-full h-0.5 bg-current transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
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

            {isAuthenticated && user && (
              <div className="mt-4 pt-4 border-t">
                <div className="px-2 py-2 text-sm font-medium text-foreground/60">{user.name}</div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}