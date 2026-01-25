import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// Force dynamic to ensure stats are always fresh
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")
    const db = client.db("intellicafe")

    // 1. Total Orders (STRICT: Only 'completed')
    // previously: .countDocuments() -> counted pending/cancelled too
    const totalOrders = await db.collection("orders").countDocuments({
      status: "completed"
    })

    // 2. Total Users
    const totalUsers = await db.collection("users").countDocuments({ role: "user" })

    // 3. Total Feedback (Smart check for plural/singular collection name)
    let totalFeedback = await db.collection("feedbacks").countDocuments()
    if (totalFeedback === 0) {
      const singularCount = await db.collection("feedback").countDocuments()
      if (singularCount > 0) {
        totalFeedback = singularCount
      }
    }

    // 4. Total Revenue (STRICT: Only 'completed')
    const revenueResult = await db.collection("orders").aggregate([
      {
        $match: { status: "completed" }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]).toArray()

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0

    return NextResponse.json({
      totalOrders,
      totalUsers,
      totalFeedback,
      totalRevenue,
    })
  } catch (error) {
    console.error("Admin Stats API Error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}