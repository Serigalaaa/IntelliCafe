// HardCode (untuk admin ubah melalui code)
 
import { type NextRequest, NextResponse } from "next/server"
// import clientPromise from "@/lib/mongodb" // Database connection commented out

function getSampleMenuData(category?: string | null) {
  // IMPORTANT: Ensure these files exist in your "public/images/" folder!
  const allItems = [
    // Coffee
    {
      _id: "1",
      name: "Espresso",
      description: "Rich and bold Italian espresso shot",
      price: 12.0,
      category: "coffee",
      image: "/images/espresso.jpg",
      available: true,
    },
    {
      _id: "2",
      name: "Cappuccino",
      description: "Creamy cappuccino with beautiful latte art",
      price: 15.0,
      category: "coffee",
      image: "/images/cappuccino.jpg",
      available: true,
    },
    {
      _id: "3",
      name: "Latte",
      description: "Smooth and velvety café latte",
      price: 15.0,
      category: "coffee",
      image: "/images/latte.jpg",
      available: true,
    },
    {
      _id: "4",
      name: "Mocha",
      description: "Rich chocolate coffee blend",
      price: 17.0,
      category: "coffee",
      image: "/images/mocha.jpg",
      available: true,
    },
    {
      _id: "5",
      name: "Caramel Macchiato",
      description: "Sweet caramel and espresso delight",
      price: 18.0,
      category: "coffee",
      image: "/images/caramel-macchiato.jpg",
      available: true,
    },
    {
      _id: "6",
      name: "Iced Americano",
      description: "Refreshing cold espresso over ice",
      price: 14.0,
      category: "coffee",
      image: "/images/iced-americano.jpg",
      available: true,
    },

    // Tea
    {
      _id: "7",
      name: "Green Tea",
      description: "Organic Japanese green tea",
      price: 10.0,
      category: "tea",
      image: "/images/green-tea.jpg",
      available: true,
    },
    {
      _id: "8",
      name: "Earl Grey",
      description: "Classic black tea with bergamot",
      price: 10.0,
      category: "tea",
      image: "/images/earl-grey.jpg",
      available: true,
    },
    {
      _id: "9",
      name: "Chamomile Tea",
      description: "Soothing herbal chamomile infusion",
      price: 12.0,
      category: "tea",
      image: "/images/chamomile-tea.jpg",
      available: true,
    },
    {
      _id: "10",
      name: "Chai Latte",
      description: "Spiced tea with steamed milk",
      price: 15.0,
      category: "tea",
      image: "/images/chai-latte.jpg",
      available: true,
    },

    // Pastries
    {
      _id: "11",
      name: "Butter Croissant",
      description: "Flaky, buttery French croissant",
      price: 12.0,
      category: "pastry",
      image: "/images/butter-croissant.jpg",
      available: true,
    },
    {
      _id: "12",
      name: "Chocolate Croissant",
      description: "Croissant filled with rich chocolate",
      price: 14.0,
      category: "pastry",
      image: "/images/chocolate-croissant.jpg",
      available: true,
    },
    {
      _id: "13",
      name: "Blueberry Muffin",
      description: "Freshly baked with juicy blueberries",
      price: 12.0,
      category: "pastry",
      image: "/images/blueberry-muffin.jpg",
      available: true,
    },
    {
      _id: "14",
      name: "Cinnamon Roll",
      description: "Warm cinnamon roll with cream cheese frosting",
      price: 15.0,
      category: "pastry",
      image: "/images/cinnamon-roll.jpg",
      available: true,
    },
    {
      _id: "15",
      name: "Banana Bread",
      description: "Moist homemade banana bread slice",
      price: 10.0,
      category: "pastry",
      image: "/images/banana-bread.jpg",
      available: true,
    },
    {
      _id: "16",
      name: "Almond Croissant",
      description: "Croissant with almond cream and sliced almonds",
      price: 15.0,
      category: "pastry",
      image: "/images/almond-croissant.jpg",
      available: true,
    },

    // Sandwiches
    {
      _id: "17",
      name: "Turkey Panini",
      description: "Grilled turkey with cheese and pesto",
      price: 25.0,
      category: "sandwich",
      image: "/images/turkey-panini.jpg",
      available: true,
    },
    {
      _id: "18",
      name: "Caprese Sandwich",
      description: "Fresh mozzarella, tomato, and basil",
      price: 23.0,
      category: "sandwich",
      image: "/images/caprese-sandwich.jpg",
      available: true,
    },
    {
      _id: "19",
      name: "Chicken Avocado Wrap",
      description: "Grilled chicken with avocado and veggies",
      price: 27.0,
      category: "sandwich",
      image: "/images/chicken-wrap.jpg",
      available: true,
    },
    {
      _id: "20",
      name: "Veggie Bagel",
      description: "Toasted bagel with cream cheese and vegetables",
      price: 22.0,
      category: "sandwich",
      image: "/images/veggie-bagel.jpg",
      available: true,
    },
    {
      _id: "21",
      name: "BLT Sandwich",
      description: "Classic bacon, lettuce, and tomato",
      price: 23.0,
      category: "sandwich",
      image: "/images/blt-sandwich.jpg",
      available: true,
    },

    // Desserts
    {
      _id: "22",
      name: "Chocolate Cake",
      description: "Rich chocolate layer cake with ganache",
      price: 18.0,
      category: "dessert",
      image: "/images/chocolate-cake.jpg",
      available: true,
    },
    {
      _id: "23",
      name: "Cheesecake",
      description: "Creamy New York style cheesecake",
      price: 20.0,
      category: "dessert",
      image: "/images/cheesecake.jpg",
      available: true,
    },
    {
      _id: "24",
      name: "Tiramisu",
      description: "Classic Italian coffee-flavored dessert",
      price: 22.0,
      category: "dessert",
      image: "/images/tiramisu.jpg",
      available: true,
    },
    {
      _id: "25",
      name: "Apple Pie",
      description: "Warm apple pie with cinnamon",
      price: 17.0,
      category: "dessert",
      image: "/images/apple-pie.jpg",
      available: true,
    },
    {
      _id: "26",
      name: "Brownie",
      description: "Fudgy chocolate brownie",
      price: 14.0,
      category: "dessert",
      image: "/images/brownie.jpg",
      available: true,
    },
    {
      _id: "27",
      name: "Macarons",
      description: "French almond meringue cookies (3 pieces)",
      price: 18.0,
      category: "dessert",
      image: "/images/macarons.jpg",
      available: true,
    },
  ]

  if (category && category !== "all") {
    return allItems.filter((item) => item.category === category)
  }
  return allItems
}

export async function GET(request: NextRequest) {
  // We strictly ignore the database connection here and always return the array above.
  const category = request.nextUrl.searchParams.get("category")
  const data = getSampleMenuData(category)
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
    // Disabled POST since we are using hardcoded data
    return NextResponse.json({ error: "Hardcoded mode is active. Cannot add items." }, { status: 405 })
}

// Data in MongoDB (untuk admin ubah gambar guna MongoDB je tak perlu guna code)
/*
import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

function getSampleMenuData(category?: string | null) {
  const allItems = [
    // Coffee
    {
      _id: "1",
      name: "Espresso",
      description: "Rich and bold Italian espresso shot",
      price: 12.0,
      category: "coffee",
      image: "/images/espresso.jpg",
      available: true,
    },
    {
      _id: "2",
      name: "Cappuccino",
      description: "Creamy cappuccino with beautiful latte art",
      price: 15.0,
      category: "coffee",
      image: "/images/cappuccino.jpg",
      available: true,
    },
    {
      _id: "3",
      name: "Latte",
      description: "Smooth and velvety café latte",
      price: 15.0,
      category: "coffee",
      image: "/images/latte.jpg",
      available: true,
    },
    {
      _id: "4",
      name: "Mocha",
      description: "Rich chocolate coffee blend",
      price: 17.0,
      category: "coffee",
      image: "/images/mocha.jpg",
      available: true,
    },
    {
      _id: "5",
      name: "Caramel Macchiato",
      description: "Sweet caramel and espresso delight",
      price: 18.0,
      category: "coffee",
      image: "/images/caramel-macchiato.jpg",
      available: true,
    },
    {
      _id: "6",
      name: "Iced Americano",
      description: "Refreshing cold espresso over ice",
      price: 14.0,
      category: "coffee",
      image: "/images/iced-americano.jpg",
      available: true,
    },

    // Tea
    {
      _id: "7",
      name: "Green Tea",
      description: "Organic Japanese green tea",
      price: 10.0,
      category: "tea",
      image: "/images/green-tea.jpg",
      available: true,
    },
    {
      _id: "8",
      name: "Earl Grey",
      description: "Classic black tea with bergamot",
      price: 10.0,
      category: "tea",
      image: "/images/earl-grey.jpg",
      available: true,
    },
    {
      _id: "9",
      name: "Chamomile Tea",
      description: "Soothing herbal chamomile infusion",
      price: 12.0,
      category: "tea",
      image: "/images/chamomile-tea.jpg",
      available: true,
    },
    {
      _id: "10",
      name: "Chai Latte",
      description: "Spiced tea with steamed milk",
      price: 15.0,
      category: "tea",
      image: "/images/chai-latte.jpg",
      available: true,
    },

    // Pastries
    {
      _id: "11",
      name: "Butter Croissant",
      description: "Flaky, buttery French croissant",
      price: 12.0,
      category: "pastry",
      image: "/images/butter-croissant.jpg",
      available: true,
    },
    {
      _id: "12",
      name: "Chocolate Croissant",
      description: "Croissant filled with rich chocolate",
      price: 14.0,
      category: "pastry",
      image: "/images/chocolate-croissant.jpg",
      available: true,
    },
    {
      _id: "13",
      name: "Blueberry Muffin",
      description: "Freshly baked with juicy blueberries",
      price: 12.0,
      category: "pastry",
      image: "/images/blueberry-muffin.jpg",
      available: true,
    },
    {
      _id: "14",
      name: "Cinnamon Roll",
      description: "Warm cinnamon roll with cream cheese frosting",
      price: 15.0,
      category: "pastry",
      image: "/images/cinnamon-roll.jpg",
      available: true,
    },
    {
      _id: "15",
      name: "Banana Bread",
      description: "Moist homemade banana bread slice",
      price: 10.0,
      category: "pastry",
      image: "/images/banana-bread.jpg",
      available: true,
    },
    {
      _id: "16",
      name: "Almond Croissant",
      description: "Croissant with almond cream and sliced almonds",
      price: 15.0,
      category: "pastry",
      image: "/images/almond-croissant.jpg",
      available: true,
    },

    // Sandwiches
    {
      _id: "17",
      name: "Turkey Panini",
      description: "Grilled turkey with cheese and pesto",
      price: 25.0,
      category: "sandwich",
      image: "/images/turkey-panini.jpg",
      available: true,
    },
    {
      _id: "18",
      name: "Caprese Sandwich",
      description: "Fresh mozzarella, tomato, and basil",
      price: 23.0,
      category: "sandwich",
      image: "/images/caprese-sandwich.jpg",
      available: true,
    },
    {
      _id: "19",
      name: "Chicken Avocado Wrap",
      description: "Grilled chicken with avocado and veggies",
      price: 27.0,
      category: "sandwich",
      image: "/images/chicken-wrap.jpg",
      available: true,
    },
    {
      _id: "20",
      name: "Veggie Bagel",
      description: "Toasted bagel with cream cheese and vegetables",
      price: 22.0,
      category: "sandwich",
      image: "/images/veggie-bagel.jpg",
      available: true,
    },
    {
      _id: "21",
      name: "BLT Sandwich",
      description: "Classic bacon, lettuce, and tomato",
      price: 23.0,
      category: "sandwich",
      image: "/images/blt-sandwich.jpg",
      available: true,
    },

    // Desserts
    {
      _id: "22",
      name: "Chocolate Cake",
      description: "Rich chocolate layer cake with ganache",
      price: 18.0,
      category: "dessert",
      image: "/images/chocolate-cake.jpg",
      available: true,
    },
    {
      _id: "23",
      name: "Cheesecake",
      description: "Creamy New York style cheesecake",
      price: 20.0,
      category: "dessert",
      image: "/images/cheesecake.jpg",
      available: true,
    },
    {
      _id: "24",
      name: "Tiramisu",
      description: "Classic Italian coffee-flavored dessert",
      price: 22.0,
      category: "dessert",
      image: "/images/tiramisu.jpg",
      available: true,
    },
    {
      _id: "25",
      name: "Apple Pie",
      description: "Warm apple pie with cinnamon",
      price: 17.0,
      category: "dessert",
      image: "/images/apple-pie.jpg",
      available: true,
    },
    {
      _id: "26",
      name: "Brownie",
      description: "Fudgy chocolate brownie",
      price: 14.0,
      category: "dessert",
      image: "/images/brownie.jpg",
      available: true,
    },
    {
      _id: "27",
      name: "Macarons",
      description: "French almond meringue cookies (3 pieces)",
      price: 18.0,
      category: "dessert",
      image: "/images/macarons.jpg",
      available: true,
    },
  ]

  if (category && category !== "all") {
    return allItems.filter((item) => item.category === category)
  }
  return allItems
}

export async function GET(request: NextRequest) {
  try {
    if (!clientPromise) {
      const category = request.nextUrl.searchParams.get("category")
      return NextResponse.json(getSampleMenuData(category))
    }

    const client = await clientPromise
    const db = client.db("intellicafe")

    const category = request.nextUrl.searchParams.get("category")
    const query = category && category !== "all" ? { category } : {}

    const items = await db.collection("menu_items").find(query).toArray()

    return NextResponse.json(items)
  } catch (error) {
    console.error("Failed to fetch menu items:", error)
    const category = request.nextUrl.searchParams.get("category")
    return NextResponse.json(getSampleMenuData(category))
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!clientPromise) {
      return NextResponse.json({ error: "MongoDB not configured. Cannot add menu items." }, { status: 503 })
    }

    const client = await clientPromise
    const db = client.db("intellicafe")
    const body = await request.json()

    const result = await db.collection("menu_items").insertOne(body)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 })
  }
}
*/