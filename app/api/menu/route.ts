import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const pageParam = searchParams.get("page")

    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")

    const db = client.db("intellicafe")

    // --- MODE 1: CUSTOMER MENU (No pagination, filter by category) ---
    if (category) {
      const query: any = { available: true }

      if (category !== "all") {
        // Case-insensitive category match
        query.category = { $regex: new RegExp(`^${category}$`, "i") }
      }

      // USE "menu_items" COLLECTION
      const items = await db.collection("menu_items")
        .find(query)
        .sort({ name: 1 })
        .toArray()

      return NextResponse.json(items) // Returns simple Array []
    }

    // --- MODE 2: ADMIN DASHBOARD (With Pagination) ---
    const page = parseInt(pageParam || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // USE "menu_items" COLLECTION
    const items = await db.collection("menu_items")
      .find({})
      .sort({ category: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const totalItems = await db.collection("menu_items").countDocuments()

    return NextResponse.json({
      items,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems
    })

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")

    const db = client.db("intellicafe")

    // Save to "menu_items"
    const result = await db.collection("menu_items").insertOne(body)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}