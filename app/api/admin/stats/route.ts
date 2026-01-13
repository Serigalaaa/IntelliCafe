import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("intellicafe")

    // Count documents
    const totalOrders = await db.collection("orders").countDocuments()
    const totalFeedback = await db.collection("feedback").countDocuments()
    const totalUsers = await db.collection("users").countDocuments()

    // Calculate Revenue: Only sum 'totalAmount' for orders with status 'done'
    const revenueAggregation = await db.collection("orders").aggregate([
      { 
        $match: { status: "done" } // Only count completed/paid orders
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: "$totalAmount" } // Sum the 'totalAmount' field
        } 
      }
    ]).toArray()

    const totalRevenue = revenueAggregation[0]?.total || 0

    return NextResponse.json({
      totalOrders,
      totalFeedback,
      totalUsers,
      totalRevenue,
    })
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json({
      totalOrders: 0,
      totalFeedback: 0,
      totalUsers: 0,
      totalRevenue: 0,
    }, { status: 500 })
  }
}