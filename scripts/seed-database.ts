import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || ""

const menuItems = [
  {
    name: "Americano Hot",
    description: "Smooth espresso with steamed milk",
    price: 6.0,
    category: "Coffee & Drinks",
    image: "/images/iced-americano-coffee-in-tall-glass.jpg",
  },
  {
    name: "Americano Iced",
    description: "Chilled espresso with water",
    price: 7.0,
    category: "Coffee & Drinks",
    image: "/images/iced-americano.jpg",
  },
  {
    name: "Banana Pudding Chocolate",
    description: "Smooth espresso with steamed milk",
    price: 16.0,
    category: "Coffee & Drinks",
    image: "/images/BananaPuddingChoc.jpg",
  },
  {
    name: "Banana Pudding Matcha",
    description: "Smooth espresso with steamed milk",
    price: 16.0,
    category: "Coffee & Drinks",
    image: "/images/BananaPuddingChoc.jpg",
  },
  {
    name: "Blueberry Matcha",
    description: "Smooth espresso with steamed milk",
    price: 14.0,
    category: "Coffee & Drinks",
    image: "/images/BananaPuddingChoc.jpg",
  },
  {
    name: "Butter Croissant",
    description: "Flaky French pastry",
    price: 8.0,
    category: "Desserts",
    image: "/images/croissant.jpg",
  },
  {
    name: "Buttercream Chocolatta",
    description: "Flaky French pastry",
    price: 14.0,
    category: "Coffe & Drinks",
    image: "/images/croissant.jpg",
  },
  {
    name: "Café Latte",
    description: "Smooth espresso with steamed milk",
    price: 8.0,
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
    name: "Matcha Latte",
    description: "Premium matcha green tea latte",
    price: 14.0,
    category: "Coffee & Drinks",
    image: "/images/matcha-latte.jpg",
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
    image: "/images/ChocCakeMini.jpg",
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

async function seedDatabase() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env.local")
    process.exit(1)
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db("intellicafe")

    // Clear existing menu items
    await db.collection("menu_items").deleteMany({})
    console.log("🗑️  Cleared existing menu items")

    // Insert new menu items
    const result = await db.collection("menu_items").insertMany(menuItems)
    console.log(`✅ Inserted ${result.insertedCount} menu items`)

    console.log("🎉 Database seeded successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

seedDatabase()