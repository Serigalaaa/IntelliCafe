import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// 1. GET: Fetch all vouchers (Used by Admin Dashboard)
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")
    const db = client.db("intellicafe")

    // Fetch all vouchers, newest first
    const vouchers = await db.collection("vouchers")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(vouchers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vouchers" }, { status: 500 })
  }
}

// 2. POST: Create a new Voucher (Used by Admin Dashboard)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { code, type, value, limitType, description } = body

    // Basic Validation
    if (!code || !type || !value) {
      return NextResponse.json({ error: "Missing required fields (code, type, value)" }, { status: 400 })
    }

    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")
    const db = client.db("intellicafe")

    // Check if code already exists (Prevent Duplicates)
    const existing = await db.collection("vouchers").findOne({ code: code.toUpperCase() })
    if (existing) {
      return NextResponse.json({ error: "Voucher code already exists" }, { status: 400 })
    }

    // Create the Voucher Object
    const newVoucher = {
      code: code.toUpperCase(),
      type,       // 'percentage' or 'fixed'
      value: Number(value),
      limitType,  // 'daily', 'once', 'unlimited'
      isActive: true,
      description: description || "",
      createdAt: new Date(),
      usageCount: 0 // Track how many times it's been used globally
    }

    await db.collection("vouchers").insertOne(newVoucher)

    return NextResponse.json({ success: true, voucher: newVoucher })
  } catch (error) {
    console.error("Create Voucher Error:", error)
    return NextResponse.json({ error: "Failed to create voucher" }, { status: 500 })
  }
}

// 3. DELETE: Remove a Voucher (Used by Admin Dashboard)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ error: "Voucher ID required" }, { status: 400 })

    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")
    const db = client.db("intellicafe")

    await db.collection("vouchers").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}