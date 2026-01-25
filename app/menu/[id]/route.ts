import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")

    const db = client.db("intellicafe")

    const { id, ...updateData } = body

    const result = await db
      .collection("menu_items")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, ...body })
  } catch (error) {
    console.error("Error updating menu item:", error)
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")

    const db = client.db("intellicafe")

    const result = await db
      .collection("menu_items")
      .deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return NextResponse.json(
      { error: "Failed to delete menu item" },
      { status: 500 }
    )
  }
}