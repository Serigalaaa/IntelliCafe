"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coffee, Croissant, Cookie, IceCream, Cake, Pizza, Sandwich, Donut, Ticket, LogIn } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"

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
  
  const [voucher, setVoucher] = useState<string | null>(null)
  const { isAuthenticated, user } = useAuth()
  
  // Ref to prevent double-saving
  const voucherSavedRef = useRef(false)

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authTab, setAuthTab] = useState<"login" | "signup">("login")

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

  // --- SAVE TO DB LOGIC ---
  useEffect(() => {
    const saveVoucher = async (code: string) => {
        if (!user) return
        try {
          await fetch("/api/vouchers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code,
              userId: user.id || user.id,
              userName: user.name,
              game: "Memory",
              discount: "RM5 OFF"
            }),
          })
          console.log("Memory Game Voucher saved")
        } catch (error) {
          console.error("Failed to save voucher:", error)
        }
    }

    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setIsWon(true)
      
      if (isAuthenticated && !voucher && !voucherSavedRef.current) {
        const randomCode = `WIN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
        setVoucher(randomCode)
        voucherSavedRef.current = true
        
        saveVoucher(randomCode)
      }
    }
  }, [cards, isAuthenticated, voucher, user])

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
    setVoucher(null)
    voucherSavedRef.current = false // Reset save flag
  }

  const handleCardClick = (idx: number) => {
    if (flippedCards.length === 2 || cards[idx].isFlipped || cards[idx].isMatched) return

    setCards((prev) => prev.map((card, i) => (i === idx ? { ...card, isFlipped: true } : card)))
    setFlippedCards((prev) => [...prev, idx])
  }

  const openAuth = (tab: "login" | "signup") => {
    setAuthTab(tab)
    setShowAuthModal(true)
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
        <Card className="p-6 mb-8 bg-primary/10 border-primary animate-in fade-in zoom-in duration-300">
          <h2 className="text-2xl font-bold text-center text-primary mb-4">Congratulations! You won in {moves} moves!</h2>
          
          {isAuthenticated && voucher ? (
             <div className="flex flex-col items-center justify-center space-y-3">
                <p className="text-muted-foreground">Here is your discount voucher:</p>
                <div className="bg-background border-2 border-dashed border-primary px-8 py-3 rounded-xl flex items-center gap-3 shadow-sm">
                    <Ticket className="w-6 h-6 text-primary" />
                    <span className="text-2xl font-mono font-bold tracking-widest text-foreground">{voucher}</span>
                </div>
                <p className="text-xs text-muted-foreground">Take a screenshot and show this to the barista!</p>
             </div>
          ) : (
             <div className="text-center bg-background/50 p-6 rounded-lg border border-primary/20">
                <p className="text-foreground font-bold text-lg">You Won!</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                   Registered members get a discount voucher for winning. Log in now to claim yours!
                </p>
                <div className="flex justify-center gap-3">
                    <Button onClick={() => openAuth("login")} className="gap-2">
                        <LogIn className="w-4 h-4" /> Log In
                    </Button>
                    <Button onClick={() => openAuth("signup")} variant="outline">
                        Sign Up
                    </Button>
                </div>
             </div>
          )}
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

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} defaultTab={authTab} />
    </div>
  )
}