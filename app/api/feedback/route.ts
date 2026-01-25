import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Force dynamic to read query params
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // 1. Get Page & Limit from URL
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")

    const db = client.db("intellicafe")

    // 2. Fetch Paginated Data
    const feedbacks = await db.collection("feedback")
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip) // Skip previous pages
      .limit(limit) // Limit to 10
      .toArray()

    // 3. Get Total Count (to calculate total pages)
    const totalItems = await db.collection("feedback").countDocuments()

    return NextResponse.json({
      feedbacks,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems
    })

  } catch (error) {
    console.error("Failed to fetch feedback:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

// ... (Keep your POST, PUT, DELETE methods exactly as they are) ...
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")
    const db = client.db("intellicafe")
    const body = await request.json()
    const feedback = { ...body, createdAt: new Date() }
    await db.collection("feedback").insertOne(feedback)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, _id, ...updateData } = await request.json()
    const targetId = id || _id
    if (!targetId) return NextResponse.json({ error: "ID required" }, { status: 400 })
    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")

    const db = client.db("intellicafe")
    delete updateData.createdAt
    const result = await db.collection("feedback").updateOne(
      { _id: new ObjectId(targetId) },
      { $set: updateData }
    )
    if (result.matchedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")

    const db = client.db("intellicafe")
    await db.collection("feedback").deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}