"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { CafeGame } from "@/components/cafe-game"
import { CategorizationGame } from "@/components/categorization-game"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Info } from "lucide-react"

export default function GamePage() {
  const [activeGame, setActiveGame] = useState<"memory" | "categorization">("memory")

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Café Games</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Test your skills with our fun café-themed games and enjoy an interactive experience.
            </p>
          </div>

          {/* Game Selector */}
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
            {/* ================= MEMORY GAME ================= */}
            {activeGame === "memory" && (
              <div>
                <h2 className="text-2xl font-bold text-center mb-4">Memory Matching Game</h2>

                {/* Tutorial */}
                <div className="mb-6 p-4 rounded-lg bg-muted/40 flex gap-3 items-start">
                  <Info className="w-5 h-5 mt-1 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Flip the cards and try to match all café-themed pairs. The goal is to complete the game
                    using the fewest moves possible. This game is designed to test memory and concentration.
                  </p>
                </div>

                <p className="text-center text-muted-foreground mb-8">
                  Find all matching pairs of café items.
                </p>

                <CafeGame />
              </div>
            )}

            {/* ================= CATEGORIZATION GAME ================= */}
            {activeGame === "categorization" && (
              <div>
                <h2 className="text-2xl font-bold text-center mb-4">Food Categorization Game</h2>

                {/* Tutorial + Voucher Info */}
                <div className="mb-6 p-4 rounded-lg bg-muted/40 flex gap-3 items-start">
                  <Info className="w-5 h-5 mt-1 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop each food or drink item into its correct category. This game helps users
                    learn about the café menu in a fun and interactive way. <br />
                    <span className="font-medium text-foreground">
                      Logged-in users who complete this game successfully may receive special discount vouchers.
                    </span>
                  </p>
                </div>

                <p className="text-center text-muted-foreground mb-8">
                  Drag each food item to its correct category.
                </p>

                <CategorizationGame />
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  )
}
