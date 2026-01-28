// http://localhost:3000/api/seed
import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

export async function GET() {
  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    return NextResponse.json({ error: "MONGODB_URI is missing" }, { status: 500 })
  }

  // 1. Raw Menu Data (No need to manually type stock here)
  const menuItemsRaw = [
    {
      name: "Café Latte",
      description: "Smooth espresso with steamed milk",
      price: 13.0,
      category: "Coffee & Drinks",
      image: "/images/latte.jpg",
    },
    {
      name: "Mocha",
      description: "Chocolate and espresso blend",
      price: 13.0,
      category: "Coffee & Drinks",
      image: "/images/mocha.jpg",
    },
    {
      name: "Caramel Macchiato",
      description: "Espresso with vanilla and caramel",
      price: 12.0,
      category: "Coffee & Drinks",
      image: "/images/caramel-macchiato.jpg",
    },
    {
      name: "Iced Americano",
      description: "Chilled espresso with water",
      price: 11.0,
      category: "Coffee & Drinks",
      image: "/images/iced-americano.jpg",
    },
    {
      name: "Matcha Latte",
      description: "Premium matcha green tea latte",
      price: 14.0,
      category: "Coffee & Drinks",
      image: "/images/matcha-latte.jpg",
    },
    {
      name: "Butter Croissant",
      description: "Flaky French pastry",
      price: 8.0,
      category: "Mains",
      image: "/images/croissant.jpg",
    },
    {
      name: "Cinnamon Roll",
      description: "Warm roll with cream cheese frosting",
      price: 9.5,
      category: "Mains",
      image: "/images/cinnamon-roll.jpg",
    },
    {
      name: "Chocolate Chip Cookie",
      description: "Freshly baked and gooey",
      price: 6.0,
      category: "Sides",
      image: "/images/chocolate-chip-cookie.jpg",
    },
    {
      name: "Chocolate Cake",
      description: "Rich chocolate layer cake",
      price: 15.0,
      category: "Desserts",
      image: "/images/chocolate-layer-cake.jpg",
    },
    {
      name: "Tiramisu",
      description: "Italian coffee-flavored dessert",
      price: 16.5,
      category: "Desserts",
      image: "/images/tiramisu-dessert.jpg",
    },
    {
      name: "Chocolate Brownie",
      description: "Fudgy chocolate brownie",
      price: 12.0,
      category: "Desserts",
      image: "/images/chocolate-fudge-brownie.jpg",
    },

  ]

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("intellicafe")

    // 2. Prepare Data: Add 'stock' and 'available' to every item automatically
    const menuItems = menuItemsRaw.map((item) => ({
      ...item,
      stock: 20,       // <--- Sets default stock to 20
      available: true, // <--- Sets default availability to true
    }))

    // 3. Clear existing items
    await db.collection("menu_items").deleteMany({})

    // 4. Insert the prepared data
    const result = await db.collection("menu_items").insertMany(menuItems)

    return NextResponse.json({ 
      message: "Database seeded successfully with stock!", 
      insertedCount: result.insertedCount 
    })

  } catch (error) {
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  } finally {
    await client.close()
  }
}