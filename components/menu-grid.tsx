"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  stock: number;
}

interface MenuGridProps {
  category: string;
}

export function MenuGrid({ category }: MenuGridProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { items: cartItems, addItem, updateQuantity } = useCartStore();

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        // FIX 1: Add limit=100 to fetch all items for the customer view (since we don't have pagination UI here yet)
        const response = await fetch(
          `/api/menu?category=${category}&limit=100`,
        );
        const data = await response.json();

        // FIX 2: Handle the new paginated object structure ({ items: [...] })
        if (data.items && Array.isArray(data.items)) {
          setItems(data.items);
        } else if (Array.isArray(data)) {
          setItems(data); // Fallback for old API format
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [category]);

  const getItemQuantity = (itemId: string) => {
    const cartItem = cartItems.find((item) => item._id === itemId);
    return cartItem?.quantity || 0;
  };

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  const handleIncrement = (item: MenuItem) => {
    const currentQuantity = getItemQuantity(item._id);
    if (currentQuantity < item.stock) {
      updateQuantity(item._id, currentQuantity + 1);
    } else {
      alert("Sorry, we don't have enough stock!");
    }
  };

  const handleDecrement = (itemId: string) => {
    const currentQuantity = getItemQuantity(itemId);
    updateQuantity(itemId, currentQuantity - 1);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="aspect-square bg-muted rounded-lg mb-4" />
            <div className="h-6 bg-muted rounded mb-2" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
        <div className="bg-muted p-4 rounded-full mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No items found</h3>
        <p>We couldn't find any items in the "{category}" category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const quantity = getItemQuantity(item._id);
        const isOutOfStock = item.stock <= 0 || !item.available;
        const isLowStock = item.stock > 0 && item.stock < 5;

        return (
          <Card
            key={item._id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square relative overflow-hidden bg-muted group">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                unoptimized={true}
                className={`object-cover transition-transform duration-300 ${!isOutOfStock ? "group-hover:scale-105" : "grayscale"}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  if (target.parentElement) {
                    target.parentElement.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                        <span class="text-4xl font-bold text-amber-900">${item.name.charAt(0)}</span>
                      </div>
                    `;
                  }
                }}
              />

              {isOutOfStock && (
                <Badge className="absolute top-3 right-3 bg-destructive hover:bg-destructive">
                  Out of Stock
                </Badge>
              )}
              {!isOutOfStock && isLowStock && (
                <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600">
                  Only {item.stock} left
                </Badge>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {item.name}
                </h3>
                <span className="text-lg font-bold text-primary">
                  RM{item.price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {item.description}
              </p>

              {quantity > 0 ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDecrement(item._id)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-semibold min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleIncrement(item)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    className="gap-2 pointer-events-none opacity-90"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    In Cart
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full gap-2"
                  onClick={() => handleAddToCart(item)}
                  disabled={isOutOfStock}
                  variant={isOutOfStock ? "secondary" : "default"}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
