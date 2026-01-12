"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coffee, Croissant, Cookie, IceCream, Cake, Pizza, Sandwich, Donut } from "lucide-react"

const icons = [Coffee, Croissant, Cookie, IceCream, Cake, Pizza, Sandwich, Donut]

interface CardType {
  id: number
  icon: typeof Coffee
  isFlipped: boolean
  isMatched: boolean
}

export function CafeGame() {
  const [cards, setCards] = useState<CardType[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      if (cards[first].icon === cards[second].icon) {
        setCards((prev) =>
          prev.map((card, idx) => (idx === first || idx === second ? { ...card, isMatched: true } : card)),
        )
        setFlippedCards([])
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, idx) => (idx === first || idx === second ? { ...card, isFlipped: false } : card)),
          )
          setFlippedCards([])
        }, 1000)
      }
      setMoves((prev) => prev + 1)
    }
  }, [flippedCards, cards])

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setIsWon(true)
    }
  }, [cards])

  const initializeGame = () => {
    const gameCards = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((icon, idx) => ({
        id: idx,
        icon,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(gameCards)
    setFlippedCards([])
    setMoves(0)
    setIsWon(false)
  }

  const handleCardClick = (idx: number) => {
    if (flippedCards.length === 2 || cards[idx].isFlipped || cards[idx].isMatched) return

    setCards((prev) => prev.map((card, i) => (i === idx ? { ...card, isFlipped: true } : card)))
    setFlippedCards((prev) => [...prev, idx])
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-lg font-semibold">
          Moves: <span className="text-primary">{moves}</span>
        </div>
        <Button onClick={initializeGame}>New Game</Button>
      </div>

      {isWon && (
        <Card className="p-6 mb-8 bg-primary/10 border-primary">
          <h2 className="text-2xl font-bold text-center text-primary">Congratulations! You won in {moves} moves!</h2>
        </Card>
      )}

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              disabled={card.isMatched}
              className="aspect-square"
            >
              <Card
                className={`w-full h-full flex items-center justify-center transition-all hover:scale-105 ${
                  card.isFlipped || card.isMatched ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                {card.isFlipped || card.isMatched ? (
                  <Icon className="w-12 h-12" />
                ) : (
                  <div className="w-12 h-12 bg-primary/20 rounded-full" />
                )}
              </Card>
            </button>
          )
        })}
      </div>
    </div>
  )
}
