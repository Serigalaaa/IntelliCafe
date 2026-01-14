import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET: Fetch all orders
export async function GET() {
    try {
        const client = await clientPromise
        if (!client) {
            throw new Error("Database connection failed")
        }
        const db = client.db("intellicafe")

        const orders = await db.collection("orders")
            .find({})
            .sort({ createdAt: -1 })
            .toArray()

        return NextResponse.json(orders)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }
}

// PUT: Update Order Status
export async function PUT(request: NextRequest) {
    try {
        const { id, status } = await request.json()
        const client = await clientPromise
        if (!client) {
            throw new Error("Database connection failed")
        }
        const db = client.db("intellicafe")

        await db.collection("orders").updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: status } }
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }
}

// DELETE: Remove an Order (NEW)
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
        }

        const client = await clientPromise
        if (!client) {
            throw new Error("Database connection failed")
        }
        const db = client.db("intellicafe")

        await db.collection("orders").deleteOne({ _id: new ObjectId(id) })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
    }
}