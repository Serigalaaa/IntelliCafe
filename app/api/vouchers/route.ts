import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

// 1. GET: Fetch all vouchers (Paginated)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")
    const db = client.db("intellicafe")

    // Fetch paginated vouchers
    const vouchers = await db.collection("vouchers")
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count
    const totalVouchers = await db.collection("vouchers").countDocuments()

    return NextResponse.json({
      vouchers,
      currentPage: page,
      totalPages: Math.ceil(totalVouchers / limit),
      totalVouchers
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vouchers" }, { status: 500 })
  }
}

// 2. POST: Create a new Voucher (Unchanged)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { code, type, value, limitType, description } = body

    if (!code || !type || !value) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")
    const db = client.db("intellicafe")

    const existing = await db.collection("vouchers").findOne({ code: code.toUpperCase() })
    if (existing) {
      return NextResponse.json({ error: "Voucher code already exists" }, { status: 400 })
    }

    const newVoucher = {
      code: code.toUpperCase(),
      type,
      value: Number(value),
      limitType,
      isActive: true,
      description: description || "",
      createdAt: new Date(),
      usageCount: 0
    }

    await db.collection("vouchers").insertOne(newVoucher)

    return NextResponse.json({ success: true, voucher: newVoucher })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create voucher" }, { status: 500 })
  }
}

// 3. DELETE: Remove a Voucher (Unchanged)
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