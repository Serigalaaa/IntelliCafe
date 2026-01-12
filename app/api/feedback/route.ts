import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("intellicafe")

    const feedbacks = await db.collection("feedback").find({}).sort({ createdAt: -1 }).limit(10).toArray()

    return NextResponse.json(feedbacks)
  } catch (error) {
    console.error("Failed to fetch feedback:", error)
    return NextResponse.json([
      {
        _id: "1",
        name: "John Doe",
        rating: 5,
        message: "Amazing coffee and great atmosphere!",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        name: "Jane Smith",
        rating: 4,
        message: "Love the menu variety. Will come back!",
        createdAt: new Date().toISOString(),
      },
    ])
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
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
