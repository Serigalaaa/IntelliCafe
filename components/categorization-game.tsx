"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Coffee,
  Sandwich,
  Cookie,
  IceCream,
  Salad,
  Pizza,
  Ticket,
  RefreshCcw,
  LogIn,
  MousePointerClick,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "@/components/auth-modal";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  icon: typeof Coffee;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

const categories: Category[] = [
  {
    id: "beverages",
    name: "Beverages",
    color: "bg-amber-100 border-amber-300",
  },
  { id: "main", name: "Main Dishes", color: "bg-orange-100 border-orange-300" },
  { id: "desserts", name: "Desserts", color: "bg-pink-100 border-pink-300" },
  { id: "salads", name: "Salads", color: "bg-green-100 border-green-300" },
];

const foodItems: FoodItem[] = [
  { id: "1", name: "Espresso", category: "beverages", icon: Coffee },
  { id: "2", name: "Cappuccino", category: "beverages", icon: Coffee },
  { id: "3", name: "Sandwich", category: "main", icon: Sandwich },
  { id: "4", name: "Pizza", category: "main", icon: Pizza },
  { id: "5", name: "Cookie", category: "desserts", icon: Cookie },
  { id: "6", name: "Ice Cream", category: "desserts", icon: IceCream },
  { id: "7", name: "Caesar Salad", category: "salads", icon: Salad },
  { id: "8", name: "Garden Salad", category: "salads", icon: Salad },
];

export function CategorizationGame() {
  const { isAuthenticated, user } = useAuth();

  const [availableItems, setAvailableItems] = useState<FoodItem[]>([]);
  const [categorizedItems, setCategorizedItems] = useState<
    Record<string, FoodItem[]>
  >({
    beverages: [],
    main: [],
    desserts: [],
    salads: [],
  });

  const [activeItem, setActiveItem] = useState<FoodItem | null>(null);
  const [score, setScore] = useState(100);
  const [isComplete, setIsComplete] = useState(false);

  const [voucher, setVoucher] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Ref to prevent double-saving
  const voucherSavedRef = useRef(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  useEffect(() => {
    resetGame();
  }, []);

  // --- NEW REWARD LOGIC ---
  useEffect(() => {
    const claimReward = async () => {
      if (!user) return;

      try {
        const res = await fetch("/api/game/reward", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: (user as any).id || (user as any)._id,
            game: "Categorization",
          }),
        });
        const data = await res.json();

        if (res.ok) {
          setVoucher(data.code);
        } else {
          setErrorMsg(data.message || "Reward unavailable");
        }
      } catch (error) {
        console.error("Failed to claim reward", error);
        setErrorMsg("Connection error");
      }
    };

    if (
      isComplete &&
      score >= 80 &&
      isAuthenticated &&
      !voucher &&
      !errorMsg &&
      !voucherSavedRef.current
    ) {
      voucherSavedRef.current = true;
      claimReward();
    }
  }, [isComplete, score, isAuthenticated, voucher, user, errorMsg]);

  const selectItem = (item: FoodItem) => {
    if (activeItem?.id === item.id) {
      setActiveItem(null);
    } else {
      setActiveItem(item);
    }
  };

  const processMove = (categoryId: string) => {
    if (!activeItem) return;

    const isCorrect = activeItem.category === categoryId;

    if (isCorrect) {
      const remainingItems = availableItems.filter(
        (item) => item.id !== activeItem.id,
      );
      setAvailableItems(remainingItems);

      setCategorizedItems((prev) => ({
        ...prev,
        [categoryId]: [...prev[categoryId], activeItem],
      }));

      if (remainingItems.length === 0) {
        setIsComplete(true);
      }
    } else {
      setScore((prev) => Math.max(0, prev - 10));
    }
    setActiveItem(null);
  };

  const handleDragStart = (item: FoodItem) => setActiveItem(item);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (categoryId: string) => processMove(categoryId);
  const handleCategoryClick = (categoryId: string) => {
    if (activeItem) processMove(categoryId);
  };

  const resetGame = () => {
    setAvailableItems([...foodItems].sort(() => Math.random() - 0.5));
    setCategorizedItems({ beverages: [], main: [], desserts: [], salads: [] });
    setScore(100);
    setIsComplete(false);
    setActiveItem(null);
    setVoucher(null);
    setErrorMsg(null);
    voucherSavedRef.current = false;
  };

  const openAuth = (tab: "login" | "signup") => {
    setAuthTab(tab);
    setShowAuthModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto relative select-none">
      <div className="flex items-center justify-between mb-8">
        <div className="text-lg font-semibold">
          Score:{" "}
          <span
            className={`font-bold ${score >= 80 ? "text-green-600" : "text-red-500"}`}
          >
            {score}%
          </span>
        </div>
        <Button
          onClick={resetGame}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCcw className="w-4 h-4" /> Reset
        </Button>
      </div>

      {isComplete && (
        <Card className="p-6 mb-8 border-primary animate-in zoom-in duration-300">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Game Complete!</h2>
            <div className="text-4xl font-black text-primary">{score}%</div>

            {score >= 80 ? (
              <>
                <div className="bg-green-100 text-green-800 p-3 rounded-md font-medium inline-block px-6">
                  PASSED! Excellent sorting skills.
                </div>

                {isAuthenticated ? (
                  <div className="mt-4 flex flex-col items-center justify-center space-y-3 p-4 border border-primary/20 rounded-xl bg-primary/5 max-w-md mx-auto">
                    {voucher ? (
                      <>
                        <p className="text-sm font-medium">Your Reward:</p>
                        <div className="bg-background border-2 border-dashed border-primary px-8 py-3 rounded-xl flex items-center gap-3 shadow-sm">
                          <Ticket className="w-6 h-6 text-primary" />
                          <span className="text-2xl font-mono font-bold tracking-widest text-foreground">
                            {voucher}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Show this code at the counter!
                        </p>
                      </>
                    ) : errorMsg ? (
                      <p className="text-red-600 font-semibold">{errorMsg}</p>
                    ) : (
                      <p className="animate-pulse text-sm">
                        Fetching reward...
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 max-w-md mx-auto bg-muted/50 p-6 rounded-lg border border-dashed border-gray-300">
                    <p className="font-bold text-lg">Claim Your Reward!</p>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      You won! Log in now to reveal your voucher code instantly.
                      No need to replay.
                    </p>
                    <div className="flex justify-center gap-3">
                      <Button
                        onClick={() => openAuth("login")}
                        className="gap-2"
                      >
                        <LogIn className="w-4 h-4" /> Log In
                      </Button>
                      <Button
                        onClick={() => openAuth("signup")}
                        variant="outline"
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-red-100 text-red-800 p-3 rounded-md font-medium inline-block px-6">
                Score too low. You need 80% to earn a reward.
              </div>
            )}

            <div className="pt-2">
              <Button variant="ghost" onClick={resetGame}>
                Play Again
              </Button>
            </div>
          </div>
        </Card>
      )}

      {!isComplete && (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {activeItem
                  ? "Now tap a category below 👇"
                  : "Tap an item to select it 👇"}
              </h3>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <MousePointerClick className="w-3 h-3" /> Tap to select
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 min-h-[100px]">
              {availableItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeItem?.id === item.id;
                return (
                  <Card
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    onClick={() => selectItem(item)}
                    className={`p-4 cursor-pointer transition-all active:scale-95 flex flex-col items-center gap-2
                            ${
                              isSelected
                                ? "border-primary ring-2 ring-primary ring-offset-2 bg-primary/5 shadow-lg scale-105"
                                : "hover:border-primary/50 hover:shadow-md border-2"
                            }`}
                  >
                    <Icon
                      className={`w-8 h-8 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span className="text-sm font-medium text-center">
                      {item.name}
                    </span>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(category.id)}
                onClick={() => handleCategoryClick(category.id)}
                className={`${category.color} border-2 border-dashed rounded-lg p-6 min-h-[180px] transition-all relative cursor-pointer
                      ${activeItem ? "hover:scale-[1.01] hover:shadow-md ring-offset-2" : ""}
                      ${activeItem ? "hover:ring-2 hover:ring-primary/50" : ""}
                    `}
              >
                <h3 className="text-lg font-bold mb-4 text-center">
                  {category.name}
                </h3>
                {activeItem && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                    <span className="font-bold text-primary bg-white px-3 py-1 rounded-full shadow-sm">
                      Tap to Drop
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  {categorizedItems[category.id].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Card
                        key={item.id}
                        className="p-3 bg-white shadow-sm animate-in zoom-in-50"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Icon className="w-5 h-5 text-primary" />
                          <span className="text-xs font-medium text-center">
                            {item.name}
                          </span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                {categorizedItems[category.id].length === 0 && !activeItem && (
                  <div className="text-center text-muted-foreground text-sm italic opacity-50 mt-8">
                    Drop items here
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>Desktop: Drag & Drop • Mobile: Tap Item then Tap Category</p>
          </div>
        </>
      )}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab={authTab}
      />
    </div>
  );
}
