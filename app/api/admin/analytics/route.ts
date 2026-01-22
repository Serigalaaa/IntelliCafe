import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "weekly"

    const client = await clientPromise
    if (!client) throw new Error("Database connection failed")
    const db = client.db("intellicafe")

    let pipeline: any[] = []
    
    // ONLY count 'done' orders
    const matchStage = { $match: { status: "done" } }

    if (range === "yearly") {
      // --- YEARLY LOGIC (Last 5 Years) ---
      pipeline = [
        matchStage,
        {
          $group: {
            _id: { $year: "$createdAt" },
            total: { $sum: "$totalAmount" }
          }
        },
        { $sort: { _id: 1 } }
      ]

      const data = await db.collection("orders").aggregate(pipeline).toArray()
      
      const formattedData = data.map(item => ({
        name: item._id.toString(),
        total: item.total
      }))
      
      return NextResponse.json(formattedData)

    } else if (range === "monthly") {
      // --- MONTHLY LOGIC (Jan - Dec) ---
      const currentYear = new Date().getFullYear()
      pipeline = [
        { 
            $match: { 
                status: "done",
                createdAt: { 
                    $gte: new Date(`${currentYear}-01-01`), 
                    $lte: new Date(`${currentYear}-12-31`) 
                }
            } 
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: "$totalAmount" }
          }
        }
      ]

      const data = await db.collection("orders").aggregate(pipeline).toArray()
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      
      // Fill in all 12 months, even if 0
      const formattedData = monthNames.map((name, index) => {
          const found = data.find(d => d._id === index + 1)
          return { name, total: found ? found.total : 0 }
      })

      return NextResponse.json(formattedData)

    } else {
      // --- WEEKLY LOGIC (Last 7 Days) ---
      // 1. Calculate the date 7 days ago
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6) // -6 to include today
      sevenDaysAgo.setHours(0, 0, 0, 0)

      pipeline = [
        { 
            $match: { 
                status: "done",
                createdAt: { $gte: sevenDaysAgo }
            } 
        },
        {
          $group: {
            // Group by YYYY-MM-DD to match easier
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            total: { $sum: "$totalAmount" }
          }
        }
      ]

      const data = await db.collection("orders").aggregate(pipeline).toArray()

      // 2. Generate the last 7 days manually to ensure no gaps
      const formattedData = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateString = d.toISOString().split('T')[0] // "2024-03-20"
        
        // Find if we have sales for this specific date string
        const found = data.find(item => item._id === dateString)
        
        formattedData.push({
            name: d.toLocaleDateString('en-US', { weekday: 'short' }), // "Mon"
            total: found ? found.total : 0
        })
      }

      return NextResponse.json(formattedData)
    }

  } catch (error) {
    console.error("Analytics API Error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}