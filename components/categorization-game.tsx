"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coffee, Sandwich, Cookie, IceCream, Salad, Pizza } from "lucide-react"

interface FoodItem {
  id: string
  name: string
  category: string
  icon: typeof Coffee
}

interface Category {
  id: string
  name: string
  color: string
}

const categories: Category[] = [
  { id: "beverages", name: "Beverages", color: "bg-amber-100 border-amber-300" },
  { id: "main", name: "Main Dishes", color: "bg-orange-100 border-orange-300" },
  { id: "desserts", name: "Desserts", color: "bg-pink-100 border-pink-300" },
  { id: "salads", name: "Salads", color: "bg-green-100 border-green-300" },
]

const foodItems: FoodItem[] = [
  { id: "1", name: "Espresso", category: "beverages", icon: Coffee },
  { id: "2", name: "Cappuccino", category: "beverages", icon: Coffee },
  { id: "3", name: "Sandwich", category: "main", icon: Sandwich },
  { id: "4", name: "Pizza", category: "main", icon: Pizza },
  { id: "5", name: "Cookie", category: "desserts", icon: Cookie },
  { id: "6", name: "Ice Cream", category: "desserts", icon: IceCream },
  { id: "7", name: "Caesar Salad", category: "salads", icon: Salad },
  { id: "8", name: "Garden Salad", category: "salads", icon: Salad },
]

export function CategorizationGame() {
  const [availableItems, setAvailableItems] = useState<FoodItem[]>([...foodItems].sort(() => Math.random() - 0.5))
  const [categorizedItems, setCategorizedItems] = useState<Record<string, FoodItem[]>>({
    beverages: [],
    main: [],
    desserts: [],
    salads: [],
  })
  const [draggedItem, setDraggedItem] = useState<FoodItem | null>(null)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const handleDragStart = (item: FoodItem) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (categoryId: string) => {
    if (!draggedItem) return

    const isCorrect = draggedItem.category === categoryId

    if (isCorrect) {
      // Remove from available items
      setAvailableItems((prev) => prev.filter((item) => item.id !== draggedItem.id))

      // Add to categorized items
      setCategorizedItems((prev) => ({
        ...prev,
        [categoryId]: [...prev[categoryId], draggedItem],
      }))

      setScore((prev) => prev + 10)
    } else {
      setScore((prev) => Math.max(0, prev - 5))
    }

    setDraggedItem(null)

    // Check if game is complete
    if (availableItems.length === 1 && isCorrect) {
      setIsComplete(true)
    }
  }

  const resetGame = () => {
    setAvailableItems([...foodItems].sort(() => Math.random() - 0.5))
    setCategorizedItems({
      beverages: [],
      main: [],
      desserts: [],
      salads: [],
    })
    setScore(0)
    setIsComplete(false)
    setDraggedItem(null)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-lg font-semibold">
          Score: <span className="text-primary">{score}</span>
        </div>
        <Button onClick={resetGame}>Reset Game</Button>
      </div>

      {isComplete && (
        <Card className="p-6 mb-8 bg-primary/10 border-primary">
          <h2 className="text-2xl font-bold text-center text-primary">Perfect! You scored {score} points!</h2>
        </Card>
      )}

      {/* Available Items */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Drag the items to their correct category:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableItems.map((item) => {
            const Icon = item.icon
            return (
              <Card
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                className="p-4 cursor-move hover:shadow-lg transition-all border-2 hover:border-primary"
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className="w-8 h-8 text-primary" />
                  <span className="text-sm font-medium text-center">{item.name}</span>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Category Drop Zones */}
      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(category.id)}
            className={`${category.color} border-2 border-dashed rounded-lg p-6 min-h-[200px] transition-all ${
              draggedItem ? "border-primary scale-[1.02]" : ""
            }`}
          >
            <h3 className="text-lg font-bold mb-4 text-center">{category.name}</h3>
            <div className="grid grid-cols-2 gap-3">
              {categorizedItems[category.id].map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.id} className="p-3 bg-white">
                    <div className="flex flex-col items-center gap-2">
                      <Icon className="w-6 h-6 text-primary" />
                      <span className="text-xs font-medium text-center">{item.name}</span>
                    </div>
                  </Card>
                )
              })}
            </div>
            {categorizedItems[category.id].length === 0 && (
              <div className="text-center text-muted-foreground text-sm italic">Drop items here</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Correct placement: +10 points | Wrong placement: -5 points</p>
      </div>
    </div>
  )
}
