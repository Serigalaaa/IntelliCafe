import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export const dynamic = "force-dynamic"

// GET: Admin Pagination
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const skip = (page - 1) * limit

        const client = await clientPromise
        if (!client) throw new Error("Database connection failed")

        const db = client.db("intellicafe")

        const items = await db.collection("menu")
            .find({}) // Admin sees everything (even hidden)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray()

        const totalItems = await db.collection("menu").countDocuments()

        return NextResponse.json({
            items,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems
        })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch admin menu" }, { status: 500 })
    }
}

// POST: Create Item (Admin Only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const client = await clientPromise
        if (!client) throw new Error("Database connection failed")

        const db = client.db("intellicafe")

        // Ensure numeric values
        const newItem = {
            ...body,
            price: parseFloat(body.price),
            stock: parseInt(body.stock),
            createdAt: new Date()
        }

        const result = await db.collection("menu").insertOne(newItem)
        return NextResponse.json({ success: true, id: result.insertedId })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
    }
}