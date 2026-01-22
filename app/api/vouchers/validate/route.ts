import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
    try {
        const { code, cartTotal } = await req.json()
        const client = await clientPromise
        if (!client) throw new Error("Database connection failed")

        const db = client.db("intellicafe")

        // 1. Identify User (Guest or Logged In)
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get("session")
        const guestCookie = cookieStore.get("guest_session_id")

        let userId = null
        if (sessionCookie) {
            userId = JSON.parse(sessionCookie.value).user.id
        } else if (guestCookie) {
            userId = guestCookie.value
        } else {
            // Optional: Force login for vouchers? For now, allow guests if they have a cookie.
            return NextResponse.json({ error: "Please log in or start an order to use vouchers." }, { status: 401 })
        }

        // 2. Find Voucher
        const voucher = await db.collection("vouchers").findOne({ code: code.toUpperCase() })

        if (!voucher) return NextResponse.json({ error: "Invalid voucher code" }, { status: 404 })
        if (!voucher.isActive) return NextResponse.json({ error: "This voucher is inactive" }, { status: 400 })

        // 3. CHECK LIMITS (The "Once Per Day" Logic)
        if (voucher.limitType === "daily") {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const usageCount = await db.collection("orders").countDocuments({
                userId: userId,
                voucherCode: code.toUpperCase(),
                createdAt: { $gte: startOfDay }
            })

            if (usageCount > 0) {
                return NextResponse.json({ error: "You have already used this voucher today!" }, { status: 400 })
            }
        }

        // 4. Calculate Discount
        let discountAmount = 0
        if (voucher.type === "percentage") {
            discountAmount = (cartTotal * voucher.value) / 100
            // Cap discount if needed (e.g. max RM20)
            // if (discountAmount > 20) discountAmount = 20
        } else {
            discountAmount = voucher.value
        }

        return NextResponse.json({
            success: true,
            discountAmount,
            code: voucher.code
        })

    } catch (error) {
        return NextResponse.json({ error: "Validation failed" }, { status: 500 })
    }
}