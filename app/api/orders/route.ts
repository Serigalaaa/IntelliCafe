import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10") // 10 items per page
        const skip = (page - 1) * limit

        const client = await clientPromise
        if (!client) throw new Error("Database connection failed")
        const db = client.db("intellicafe")

        // 1. Fetch Paginated Orders (Sorted Newest First)
        const orders = await db.collection("orders")
            .find({})
            .sort({ createdAt: -1 }) // Show newest orders at the top
            .skip(skip)
            .limit(limit)
            .toArray()

        // 2. Get Total Count (For calculating total pages)
        const totalOrders = await db.collection("orders").countDocuments()

        return NextResponse.json({
            orders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders
        })

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }
}

// ... (Keep your existing POST, PUT, DELETE methods below) ...
export async function PUT(request: NextRequest) {
    // ... (Your existing Update Status code)
    try {
        const { id, status } = await request.json()
        const client = await clientPromise
        if (!client) throw new Error("Database connection failed")
        const db = client.db("intellicafe")
        await db.collection("orders").updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        )
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    // ... (Your existing Delete code)
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

        const client = await clientPromise
        if (!client) throw new Error("Database connection failed")
        const db = client.db("intellicafe")
        await db.collection("orders").deleteOne({ _id: new ObjectId(id) })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }
}