import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
    try {
        const { userId, game } = await req.json()

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 })
        }

        const client = await clientPromise
        if (!client) throw new Error("Database connection failed")

        const db = client.db("intellicafe")

        // 1. CHECK DAILY LIMIT (Max 2 wins per day per user)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const winCount = await db.collection("user_rewards").countDocuments({
            userId: userId,
            createdAt: { $gte: today } // Count rewards created today
        })

        if (winCount >= 2) {
            return NextResponse.json({
                error: "Daily limit reached",
                message: "You can only win 2 vouchers per day. Come back tomorrow!"
            }, { status: 429 })
        }

        // 2. FETCH A REAL VOUCHER FROM ADMIN
        // We look for any ACTIVE voucher. 
        // Optional: You can filter by code starting with "GAME" if you want specific game vouchers.
        const voucher = await db.collection("vouchers").findOne({
            isActive: true,
            // Optional: code: { $regex: /^GAME/ } 
        })

        if (!voucher) {
            return NextResponse.json({ error: "No vouchers available right now." }, { status: 404 })
        }

        // 3. RECORD THE WIN (To enforce the limit next time)
        await db.collection("user_rewards").insertOne({
            userId,
            game,
            voucherCode: voucher.code,
            createdAt: new Date()
        })

        return NextResponse.json({
            success: true,
            code: voucher.code,
            discount: voucher.type === 'percentage' ? `${voucher.value}% OFF` : `RM${voucher.value} OFF`
        })

    } catch (error) {
        console.error("Reward API Error:", error)
        return NextResponse.json({ error: "Failed to process reward" }, { status: 500 })
    }
}