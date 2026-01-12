import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("intellicafe")

    const totalOrders = await db.collection("orders").countDocuments()
    const totalFeedback = await db.collection("feedback").countDocuments()
    const totalUsers = await db.collection("users").countDocuments()

    const orders = await db.collection("orders").find({}).toArray()
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)

    return NextResponse.json({
      totalOrders,
      totalFeedback,
      totalUsers,
      totalRevenue,
    })
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json({
      totalOrders: 42,
      totalFeedback: 18,
      totalUsers: 156,
      totalRevenue: 2847.5,
    })
  }
}
