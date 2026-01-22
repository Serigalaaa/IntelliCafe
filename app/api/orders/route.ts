import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

// 1. GET: Fetch Orders
// - If ?history=true: Returns orders for the specific Logged-In User OR Guest
// - If no params (Admin): Returns ALL orders
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const historyMode = searchParams.get("history") === "true"

        const client = await clientPromise
        if (!client) throw new Error("Database connection failed")
        const db = client.db("intellicafe")

        // Get both Session (Login) and Guest Cookies
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get("session")
        const guestCookie = cookieStore.get("guest_session_id")

        let query = {}

        // --- FILTERING LOGIC ---
        if (historyMode) {
            if (sessionCookie) {
                // CASE A: Logged In User -> Show their account history
                const session = JSON.parse(sessionCookie.value)
                query = { userId: session.user.id }
            } else if (guestCookie) {
                // CASE B: Guest with Cookie -> Show their temporary history
                query = { userId: guestCookie.value }
            } else {
                // CASE C: New Guest (No Cookie) -> Show nothing (Empty History)
                // We return an empty array immediately to avoid showing "All Orders"
                return NextResponse.json([])
            }
        }
        // Else: If historyMode is FALSE (Admin Dashboard), query stays {} (Show All)

        const orders = await db.collection("orders")
            .find(query)
            .sort({ createdAt: -1 })
            .toArray()

        return NextResponse.json(orders)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }
}

// 2. PUT: Update Order Status (Used by Admin)
export async function PUT(request: NextRequest) {
    try {
        const { id, status } = await request.json()

        if (!id || typeof id !== "string") {
            return NextResponse.json({ error: "Invalid Order ID" }, { status: 400 })
        }

        const client = await clientPromise
        if (!client) throw new Error("Database connection failed")
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

// 3. DELETE: Remove Order (Used by Admin)
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
        }

        const client = await clientPromise
        if (!client) throw new Error("Database connection failed")
        const db = client.db("intellicafe")

        await db.collection("orders").deleteOne({ _id: new ObjectId(id) })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
    }
}