import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// 1. GET: Fetch feedback (with your fallback data)
export async function GET() {
  try {
    const client = await clientPromise
    // Safety check: ensure client is connected
    if (!client) {
        throw new Error("Database connection failed")
    }
    
    const db = client.db("intellicafe")

    const feedbacks = await db.collection("feedback").find({}).sort({ createdAt: -1 }).limit(10).toArray()

    return NextResponse.json(feedbacks)
  } catch (error) {
    console.error("Failed to fetch feedback:", error)
    // Your existing fallback data
    return NextResponse.json([
      {
        _id: "1",
        name: "John Doe",
        rating: 5,
        message: "Amazing coffee and great atmosphere! (Mock Data)",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        name: "Jane Smith",
        rating: 4,
        message: "Love the menu variety. Will come back! (Mock Data)",
        createdAt: new Date().toISOString(),
      },
    ])
  }
}

// 2. POST: Create new feedback
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")
    
    const db = client.db("intellicafe")
    const body = await request.json()

    const feedback = {
      ...body,
      createdAt: new Date(),
    }

    await db.collection("feedback").insertOne(feedback)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}

// 3. PUT: Update existing feedback (New!)
export async function PUT(request: NextRequest) {
  try {
    const { id, _id, ...updateData } = await request.json()
    
    // We need an ID to know what to update (checks both id and _id)
    const targetId = id || _id
    
    if (!targetId) {
      return NextResponse.json({ error: "Feedback ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")

    const db = client.db("intellicafe")

    // Prevent overwriting the creation date
    delete updateData.createdAt 

    const result = await db.collection("feedback").updateOne(
      { _id: new ObjectId(targetId) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 })
  }
}

// 4. DELETE: Remove feedback (New!)
export async function DELETE(request: NextRequest) {
  try {
    // Get the ID from the URL (e.g., /api/feedback?id=123)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Feedback ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")

    const db = client.db("intellicafe")

    const result = await db.collection("feedback").deleteOne({ 
      _id: new ObjectId(id) 
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete feedback" }, { status: 500 })
  }
}