import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET: Admin fetches all vouchers
export async function GET(req: Request) {
    try {
        const client = await clientPromise
        if (!client) {
            throw new Error("Database connection failed")
        }
        const db = client.db("intellicafe")

        // Optional: Filter by code if query param exists
        const { searchParams } = new URL(req.url)
        const code = searchParams.get("code")

        if (code) {
            const voucher = await db.collection("vouchers").findOne({ code })
            return NextResponse.json(voucher ? [voucher] : [])
        }

        const vouchers = await db.collection("vouchers")
            .find({})
            .sort({ createdAt: -1 })
            .toArray()

        return NextResponse.json(vouchers)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch vouchers" }, { status: 500 })
    }
}

// POST: Game saves a new voucher
export async function POST(req: Request) {
    try {
        const client = await clientPromise
        if (!client) {
            throw new Error("Database connection failed")
        }
        const db = client.db("intellicafe")
        const body = await req.json()

        // body should have: { code, userId, userName, game, discount }
        const newVoucher = {
            ...body,
            status: "active", // active | redeemed
            createdAt: new Date(),
            redeemedAt: null
        }

        await db.collection("vouchers").insertOne(newVoucher)
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create voucher" }, { status: 500 })
    }
}

// PUT: Admin marks voucher as REDEEMED
export async function PUT(req: Request) {
    try {
        const client = await clientPromise
        if (!client) {
            throw new Error("Database connection failed")
        }
        const db = client.db("intellicafe")
        const { id } = await req.json()

        await db.collection("vouchers").updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: "redeemed", redeemedAt: new Date() } }
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to redeem" }, { status: 500 })
    }
}