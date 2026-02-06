import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const history = searchParams.get("history")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const skip = (page - 1) * limit

        const client = await clientPromise
        if (!client) throw new Error("Database connection failed")
        const db = client.db("intellicafe")

        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get("session")
        const guestCookie = cookieStore.get("guest_id")

        let currentUser = null
        let guestId = null

        if (sessionCookie) {
            currentUser = JSON.parse(sessionCookie.value).user
        } else if (guestCookie) {
            guestId = guestCookie.value
        }

        // --- ORDER HISTORY ---
        if (history === "true") {
            let query = {}
            if (currentUser) {
                query = { userId: currentUser.id || currentUser._id }
            } else if (guestId) {
                query = { guestId: guestId }
            } else {
                return NextResponse.json([])
            }

            const userOrders = await db.collection("orders")
                .find(query)
                .sort({ createdAt: -1 })
                .toArray()

            return NextResponse.json(userOrders)
        }

        // --- ADMIN DASHBOARD ---
        const orders = await db.collection("orders")
            .find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray()

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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const client = await clientPromise
        if (!client) throw new Error("Database connection failed")
        const db = client.db("intellicafe")
        
        // Add createdAt timestamp
        const order = { ...body, createdAt: new Date() }
        
        const result = await db.collection("orders").insertOne(order)
        return NextResponse.json({ success: true, orderId: result.insertedId })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
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

// --- UPDATED DELETE FUNCTION ---
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")
        const clearAll = searchParams.get("all") // Check for ?all=true

        const client = await clientPromise
        if (!client) throw new Error("Database connection failed")
        const db = client.db("intellicafe")

        // 1. DELETE ALL FOR USER (Clear History)
        if (clearAll === "true") {
             const cookieStore = await cookies()
             const sessionCookie = cookieStore.get("session")
             
             if (sessionCookie) {
                 const currentUser = JSON.parse(sessionCookie.value).user
                 // Delete all orders belonging to this user
                 await db.collection("orders").deleteMany({ userId: currentUser.id || currentUser._id })
                 return NextResponse.json({ success: true })
             }
             return NextResponse.json({ error: "User not found" }, { status: 401 })
        }

        // 2. DELETE SINGLE ORDER (Admin)
        if (id) {
            await db.collection("orders").deleteOne({ _id: new ObjectId(id) })
            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }
}