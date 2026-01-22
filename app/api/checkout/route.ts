import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")
    const db = client.db("intellicafe")

    // --- RECEIVE VOUCHER CODE ---
    const { items, voucherCode } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // 1. Identify User
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    const guestCookie = cookieStore.get("guest_session_id")

    let userId = null
    let userName = "Guest"
    let isNewGuest = false
    let guestIdToSet = ""

    if (sessionCookie) {
      const session = JSON.parse(sessionCookie.value)
      userId = session.user.id
      userName = session.user.name || "User"
    } else if (guestCookie) {
      userId = guestCookie.value
      userName = "Guest"
    } else {
      userId = `guest_${crypto.randomUUID()}`
      userName = "Guest"
      isNewGuest = true
      guestIdToSet = userId
    }

    // 2. Calculate Base Total
    let totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)
    let discountApplied = 0

    // 3. --- VERIFY VOUCHER AGAIN (Security) ---
    if (voucherCode) {
      const voucher = await db.collection("vouchers").findOne({ code: voucherCode })

      if (voucher && voucher.isActive) {
        // Check Daily Limit
        if (voucher.limitType === "daily") {
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);
          const existing = await db.collection("orders").findOne({
            userId,
            voucherCode,
            createdAt: { $gte: startOfDay }
          })

          // Apply if not used today
          if (!existing) {
            if (voucher.type === "percentage") {
              discountApplied = (totalAmount * voucher.value) / 100
            } else {
              discountApplied = voucher.value
            }
          }
        } else {
          // Unlimited or One-Time logic here
          if (voucher.type === "percentage") {
            discountApplied = (totalAmount * voucher.value) / 100
          } else {
            discountApplied = voucher.value
          }
        }
      }
    }

    const finalTotal = Math.max(0, totalAmount - discountApplied)

    // 4. Create Order
    const order = {
      userId,
      userName,
      items,
      subTotal: totalAmount,
      discount: discountApplied,
      voucherCode: discountApplied > 0 ? voucherCode : null,
      totalAmount: finalTotal,
      status: "pending",
      createdAt: new Date(),
      orderNumber: `JWT-${Math.floor(1000 + Math.random() * 9000)}`
    }

    const result = await db.collection("orders").insertOne(order)

    const response = NextResponse.json({
      success: true,
      orderId: result.insertedId,
      orderNumber: order.orderNumber
    })

    if (isNewGuest) {
      response.cookies.set("guest_session_id", guestIdToSet, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30
      })
    }

    return response

  } catch (error) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}