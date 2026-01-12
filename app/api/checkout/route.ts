import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")
    const db = client.db("intellicafe")

    const { items } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // 1. Verify Stock for ALL items before processing
    for (const item of items) {
      const dbItem = await db.collection("menu_items").findOne({ _id: new ObjectId(item._id) })
      
      if (!dbItem) {
        return NextResponse.json({ error: `Item "${item.name}" no longer exists.` }, { status: 404 })
      }
      
      if (dbItem.stock < item.quantity) {
        return NextResponse.json({ 
            error: `Not enough stock for "${item.name}". Only ${dbItem.stock} left.` 
        }, { status: 400 })
      }
    }

    // 2. Create the Order Record
    const order = {
      items,
      totalAmount: items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0),
      status: "completed", // Simplified for this demo
      createdAt: new Date(),
    }

    const orderResult = await db.collection("orders").insertOne(order)

    // 3. Deduct Stock from Inventory
    // Note: In a high-traffic production app, you would use a Transaction here.
    for (const item of items) {
        await db.collection("menu_items").updateOne(
            { _id: new ObjectId(item._id) },
            { $inc: { stock: -item.quantity } } // Decrement stock
        )
    }

    return NextResponse.json({ success: true, orderId: orderResult.insertedId })

  } catch (error) {
    console.error("Checkout Error:", error)
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 })
  }
}