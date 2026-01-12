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
      name: "Espresso",
      description: "Rich and bold shot of Italian espresso",
      price: 8.5,
      category: "Coffee",
      image: "/images/espresso.jpg",
    },
    {
      name: "Cappuccino",
      description: "Espresso with steamed milk and foam",
      price: 12.0,
      category: "Coffee",
      image: "/images/cappuccino.jpg",
    },
    {
      name: "Café Latte",
      description: "Smooth espresso with steamed milk",
      price: 13.0,
      category: "Coffee",
      image: "/images/latte.jpg",
    },
    {
      name: "Mocha",
      description: "Chocolate and espresso blend",
      price: 14.5,
      category: "Coffee",
      image: "/images/mocha.jpg",
    },
    {
      name: "Caramel Macchiato",
      description: "Espresso with vanilla and caramel",
      price: 15.0,
      category: "Coffee",
      image: "/images/caramel-macchiato.jpg",
    },
    {
      name: "Iced Americano",
      description: "Chilled espresso with water",
      price: 11.0,
      category: "Coffee",
      image: "/images/iced-americano.jpg",
    },
    {
      name: "Green Tea",
      description: "Premium Japanese green tea",
      price: 9.0,
      category: "Tea",
      image: "/images/green-tea.jpg",
    },
    {
      name: "Earl Grey",
      description: "Classic English breakfast tea",
      price: 9.0,
      category: "Tea",
      image: "/images/earl-grey.jpg",
    },
    {
      name: "Chamomile Tea",
      description: "Calming herbal tea blend",
      price: 9.5,
      category: "Tea",
      image: "/images/chamomile-tea.jpg",
    },
    {
      name: "Chai Latte",
      description: "Spiced tea with steamed milk",
      price: 12.5,
      category: "Tea",
      image: "/images/chai-latte.jpg",
    },
    {
      name: "Matcha Latte",
      description: "Premium matcha green tea latte",
      price: 14.0,
      category: "Tea",
      image: "/images/matcha-latte.jpg",
    },
    {
      name: "Butter Croissant",
      description: "Flaky French pastry",
      price: 8.0,
      category: "Pastry",
      image: "/images/croissant.jpg",
    },
    {
      name: "Blueberry Muffin",
      description: "Fresh baked with real blueberries",
      price: 7.5,
      category: "Pastry",
      image: "/images/blueberry-muffin.jpg",
    },
    {
      name: "Cinnamon Roll",
      description: "Warm roll with cream cheese frosting",
      price: 9.5,
      category: "Pastry",
      image: "/images/cinnamon-roll.jpg",
    },
    {
      name: "Chocolate Chip Cookie",
      description: "Freshly baked and gooey",
      price: 6.0,
      category: "Pastry",
      image: "/images/chocolate-chip-cookie.jpg",
    },
    {
      name: "Almond Biscotti",
      description: "Italian twice-baked cookie",
      price: 7.0,
      category: "Pastry",
      image: "/images/almond-biscotti.jpg",
    },
    {
      name: "Turkey Panini",
      description: "Grilled sandwich with turkey and cheese",
      price: 18.0,
      category: "Sandwich",
      image: "/images/turkey-panini.jpg",
    },
    {
      name: "Chicken Avocado Wrap",
      description: "Grilled chicken with fresh avocado",
      price: 19.5,
      category: "Sandwich",
      image: "/images/chicken-avocado-wrap.jpg",
    },
    {
      name: "Veggie Bagel",
      description: "Fresh vegetables with cream cheese",
      price: 16.0,
      category: "Sandwich",
      image: "/images/veggie-bagel.jpg",
    },
    {
      name: "BLT Sandwich",
      description: "Classic bacon, lettuce, and tomato",
      price: 17.5,
      category: "Sandwich",
      image: "/images/blt-sandwich.jpg",
    },
    {
      name: "Chocolate Cake",
      description: "Rich chocolate layer cake",
      price: 15.0,
      category: "Dessert",
      image: "/images/chocolate-layer-cake.jpg",
    },
    {
      name: "New York Cheesecake",
      description: "Creamy classic cheesecake",
      price: 16.0,
      category: "Dessert",
      image: "/images/new-york-cheesecake.jpg",
    },
    {
      name: "Tiramisu",
      description: "Italian coffee-flavored dessert",
      price: 16.5,
      category: "Dessert",
      image: "/images/tiramisu-dessert.jpg",
    },
    {
      name: "Apple Pie",
      description: "Warm apple pie with cinnamon",
      price: 14.0,
      category: "Dessert",
      image: "/images/apple-pie-slice.jpg",
    },
    {
      name: "Chocolate Brownie",
      description: "Fudgy chocolate brownie",
      price: 12.0,
      category: "Dessert",
      image: "/images/chocolate-fudge-brownie.jpg",
    },
    {
      name: "Macarons (6 pcs)",
      description: "Assorted French macarons",
      price: 18.0,
      category: "Dessert",
      image: "/images/french-macarons-assorted.jpg",
    },
    {
      name: "Lemon Tart",
      description: "Tangy lemon custard tart",
      price: 13.5,
      category: "Dessert",
      image: "/images/lemon-tart.jpg",
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