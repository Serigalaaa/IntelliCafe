import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET: Fetch all users
export async function GET() {
  try {
    const client = await clientPromise
    
    // FIX: Add this check to satisfy TypeScript
    if (!client) { 
        throw new Error("Database connection failed") 
    }

    const db = client.db("intellicafe")

    const users = await db.collection("users")
      .find({})
      .project({ password: 0 }) 
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// DELETE: Remove a user
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    const client = await clientPromise

    // FIX: Add this check here too
    if (!client) {
        throw new Error("Database connection failed")
    }

    const db = client.db("intellicafe")

    await db.collection("users").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}