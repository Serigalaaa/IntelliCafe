"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MenuGrid } from "@/components/menu-grid"
import { CartSidebar } from "@/components/cart-sidebar"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    { id: "all", label: "All Items" },
    { id: "coffee", label: "Coffee" },
    { id: "tea", label: "Tea" },
    { id: "pastry", label: "Pastries" },
    { id: "sandwich", label: "Sandwiches" },
    { id: "dessert", label: "Desserts" },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="fixed bottom-8 right-8 z-50">
        <CartSidebar />
      </div>

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Menu</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully curated selection of premium coffee, delicious pastries, and more
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="transition-all"
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Menu Grid */}
          <MenuGrid category={selectedCategory} />
        </div>
      </div>

      <Footer />
    </main>
  )
}
