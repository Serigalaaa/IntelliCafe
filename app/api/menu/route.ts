import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// GET: Fetch all items
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")
    const db = client.db("intellicafe")

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // --- ADJUSTMENT HERE ---
    // Use Regex for Case-Insensitive matching ($options: 'i')
    // This allows "coffee" to match "Coffee", "COFFEE", etc.
    const query = category && category !== "all" 
      ? { category: { $regex: new RegExp(`^${category}$`, "i") } } 
      : {}

    const items = await db.collection("menu_items").find(query).toArray()

    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}

// POST: Create a new item
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")
    const db = client.db("intellicafe")

    const body = await request.json()
    
    // Basic validation
    if (!body.name || !body.price) {
        return NextResponse.json({ error: "Missing name or price" }, { status: 400 })
    }

    const newItem = {
      ...body,
      price: parseFloat(body.price),
      available: true,
      createdAt: new Date(),
    }

    const result = await db.collection("menu_items").insertOne(newItem)

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}