// import { type NextRequest, NextResponse } from "next/server"
// import clientPromise from "@/lib/mongodb"
// import { ObjectId } from "mongodb"

// export async function POST(request: NextRequest) {
//   try {
//     const client = await clientPromise
//     if (!client) throw new Error("Database connection failed")
//     const db = client.db("intellicafe")

//     const { items } = await request.json()

//     if (!items || items.length === 0) {
//       return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
//     }

//     // 1. Verify Stock for ALL items before processing
//     for (const item of items) {
//       const dbItem = await db.collection("menu_items").findOne({ _id: new ObjectId(item._id) })
      
//       if (!dbItem) {
//         return NextResponse.json({ error: `Item "${item.name}" no longer exists.` }, { status: 404 })
//       }
      
//       if (dbItem.stock < item.quantity) {
//         return NextResponse.json({ 
//             error: `Not enough stock for "${item.name}". Only ${dbItem.stock} left.` 
//         }, { status: 400 })
//       }
//     }

//     // 2. Create the Order Record
//     const order = {
//       items,
//       totalAmount: items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0),
//       status: "completed", // Simplified for this demo
//       createdAt: new Date(),
//     }

//     const orderResult = await db.collection("orders").insertOne(order)

//     // 3. Deduct Stock from Inventory
//     // Note: In a high-traffic production app, you would use a Transaction here.
//     for (const item of items) {
//         await db.collection("menu_items").updateOne(
//             { _id: new ObjectId(item._id) },
//             { $inc: { stock: -item.quantity } } // Decrement stock
//         )
//     }

//     return NextResponse.json({ success: true, orderId: orderResult.insertedId })

//   } catch (error) {
//     console.error("Checkout Error:", error)
//     return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 })
//   }
// }

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

    // 1. Calculate Total
    const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)

    // 2. Create Order Object
    const order = {
      items,
      totalAmount,
      status: "pending", // Default status
      createdAt: new Date(),
      // Generate a short "Order Number" for the receipt (e.g., ORD-1234)
      orderNumber: `JWT-${Math.floor(1000 + Math.random() * 9000)}` 
    }

    // 3. Save to Database
    const result = await db.collection("orders").insertOne(order)

    // 4. Deduct Stock (Optional: keep your stock logic here if you used it previously)
    for (const item of items) {
       await db.collection("menu_items").updateOne(
           { _id: new ObjectId(item._id) },
           { $inc: { stock: -item.quantity } }
       )
    }

    // 5. Return the Order Number for the Receipt
    return NextResponse.json({ 
      success: true, 
      orderId: result.insertedId,
      orderNumber: order.orderNumber 
    })

  } catch (error) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}