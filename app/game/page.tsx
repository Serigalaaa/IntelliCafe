"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { CafeGame } from "@/components/cafe-game"
import { CategorizationGame } from "@/components/categorization-game"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function GamePage() {
  const [activeGame, setActiveGame] = useState<"memory" | "categorization">("memory")

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Café Games</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Test your skills with our fun café-themed games!
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={() => setActiveGame("memory")}
              variant={activeGame === "memory" ? "default" : "outline"}
              size="lg"
            >
              Memory Game
            </Button>
            <Button
              onClick={() => setActiveGame("categorization")}
              variant={activeGame === "categorization" ? "default" : "outline"}
              size="lg"
            >
              Categorization Game
            </Button>
          </div>

          <Card className="p-8">
            {activeGame === "memory" && (
              <div>
                <h2 className="text-2xl font-bold text-center mb-6">Memory Matching Game</h2>
                <p className="text-center text-muted-foreground mb-8">Find all matching pairs of café items</p>
                <CafeGame />
              </div>
            )}

            {activeGame === "categorization" && (
              <div>
                <h2 className="text-2xl font-bold text-center mb-6">Food Categorization Game</h2>
                <p className="text-center text-muted-foreground mb-8">Drag each food item to its correct category</p>
                <CategorizationGame />
              </div>
            )}
          </Card>
        </div>
      </div>

    </main>
  )
}
