import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "weekly"

    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")
    const db = client.db("intellicafe")

    let pipeline: any[] = []

    // 1. STRICT FILTER: Only 'completed' orders
    const matchStage = { $match: { status: "completed" } }

    // TIMEZONE FIX: Malaysia is UTC+8
    const MYT_OFFSET = "+08:00"

    if (range === "yearly") {
      // --- YEARLY LOGIC ---
      pipeline = [
        matchStage,
        {
          $group: {
            _id: { $year: { date: "$createdAt", timezone: MYT_OFFSET } },
            total: { $sum: "$totalAmount" },
            count: { $sum: 1 } // NEW: Count orders
          }
        },
        { $sort: { _id: 1 } }
      ]

      const data = await db.collection("orders").aggregate(pipeline).toArray()

      const formattedData = data.map(item => ({
        name: item._id.toString(),
        total: item.total,
        count: item.count // Include count
      }))

      return NextResponse.json(formattedData)

    } else if (range === "monthly") {
      // --- MONTHLY LOGIC ---
      const currentYear = new Date().getFullYear()

      pipeline = [
        {
          $match: {
            status: "completed",
            $expr: {
              $eq: [{ $year: { date: "$createdAt", timezone: MYT_OFFSET } }, currentYear]
            }
          }
        },
        {
          $group: {
            _id: { $month: { date: "$createdAt", timezone: MYT_OFFSET } },
            total: { $sum: "$totalAmount" },
            count: { $sum: 1 } // NEW: Count orders
          }
        }
      ]

      const data = await db.collection("orders").aggregate(pipeline).toArray()
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

      const formattedData = monthNames.map((name, index) => {
        const found = data.find(d => d._id === index + 1)
        return {
          name,
          total: found ? found.total : 0,
          count: found ? found.count : 0 // Include count
        }
      })

      return NextResponse.json(formattedData)

    } else {
      // --- WEEKLY LOGIC ---
      const now = new Date()
      const nowMYT = new Date(now.getTime() + (8 * 60 * 60 * 1000))

      const sevenDaysAgoMYT = new Date(nowMYT)
      sevenDaysAgoMYT.setDate(sevenDaysAgoMYT.getDate() - 6)
      sevenDaysAgoMYT.setHours(0, 0, 0, 0)

      const queryDateUTC = new Date(sevenDaysAgoMYT.getTime() - (8 * 60 * 60 * 1000))

      pipeline = [
        {
          $match: {
            status: "completed",
            createdAt: { $gte: queryDateUTC }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: MYT_OFFSET } },
            total: { $sum: "$totalAmount" },
            count: { $sum: 1 } // NEW: Count orders
          }
        }
      ]

      const data = await db.collection("orders").aggregate(pipeline).toArray()

      const formattedData = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date(nowMYT)
        d.setDate(d.getDate() - i)
        const dateString = d.toISOString().split('T')[0]
        const found = data.find(item => item._id === dateString)

        formattedData.push({
          name: d.toLocaleDateString('en-US', { weekday: 'short' }),
          total: found ? found.total : 0,
          count: found ? found.count : 0 // Include count
        })
      }

      return NextResponse.json(formattedData)
    }

  } catch (error) {
    console.error("Analytics API Error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}