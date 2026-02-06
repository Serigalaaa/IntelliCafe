import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")
    const db = client.db("intellicafe")

    // --- RECEIVE CART DATA ---
    const { items, voucherCode } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // 1. IDENTIFY USER (Logged In or Guest)
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    const guestCookie = cookieStore.get("guest_id") // Matches api/auth/guest

    let userId = null
    let guestId = null
    let userName = "Guest"

    if (sessionCookie) {
      // SCENARIO A: Logged In User
      const session = JSON.parse(sessionCookie.value)
      userId = session.user.id || session.user._id
      userName = session.user.name || "User"
    } else if (guestCookie) {
      // SCENARIO B: Guest User (Persistent ID)
      guestId = guestCookie.value
      userName = "Guest User"
    } else {
      // SCENARIO C: No Session (Shouldn't happen if frontend works)
      // Return 401 to force frontend to call /api/auth/guest first
      return NextResponse.json({ error: "Session expired. Please refresh." }, { status: 401 })
    }

    // 2. Calculate Base Total
    let totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)
    let discountApplied = 0

    // 3. --- VERIFY VOUCHER ---
    if (voucherCode) {
      const voucher = await db.collection("vouchers").findOne({ code: voucherCode })

      if (voucher && voucher.isActive) {
        if (voucher.limitType === "daily") {
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);
          
          // Check if THIS specific user/guest used the voucher today
          // We build a query dynamically based on who is logged in
          const query: any = {
             voucherCode,
             createdAt: { $gte: startOfDay }
          }

          if (userId) query.userId = userId;
          if (guestId) query.guestId = guestId;

          const existing = await db.collection("orders").findOne(query)

          if (!existing) {
             // Apply discount
             if (voucher.type === "percentage") {
                discountApplied = (totalAmount * voucher.value) / 100
             } else {
                discountApplied = voucher.value
             }
          }
        } else {
          // Unlimited Logic
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
    // We explicitly save userId OR guestId so the History API can find it later
    const order = {
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`, 
      userId,   // Saved if Logged In
      guestId,  // Saved if Guest
      userName,
      items,
      subTotal: totalAmount,
      discount: discountApplied,
      voucherCode: discountApplied > 0 ? voucherCode : null,
      totalAmount: finalTotal,
      status: "pending",
      createdAt: new Date(),
    }

    const result = await db.collection("orders").insertOne(order)

    return NextResponse.json({
      success: true,
      orderId: result.insertedId,
      orderNumber: order.orderNumber
    })

  } catch (error) {
    console.error("Checkout Error:", error)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}