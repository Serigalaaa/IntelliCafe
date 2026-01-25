import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { _id, ...updateData } = body

    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")

    const db = client.db("intellicafe")

    // USE "menu_items"
    const result = await db.collection("menu_items").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")

    const db = client.db("intellicafe")

    // USE "menu_items"
    await db.collection("menu_items").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}