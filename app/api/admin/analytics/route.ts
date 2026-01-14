import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
    try {
        const client = await clientPromise
        if (!client) {
            throw new Error("Database connection failed")
        }
        const db = client.db("intellicafe")

        // 1. Get Last 7 Days of Revenue
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const dailyRevenue = await db.collection("orders").aggregate([
            {
                $match: {
                    status: "done",
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray()

        // 2. Format for Recharts (Fill in missing days with 0)
        const formattedData = []
        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dateString = d.toISOString().split('T')[0]

            const found = dailyRevenue.find((r: any) => r._id === dateString)

            formattedData.push({
                name: d.toLocaleDateString('en-US', { weekday: 'short' }), // "Mon", "Tue"
                date: dateString,
                total: found ? found.total : 0,
                orders: found ? found.count : 0
            })
        }

        return NextResponse.json(formattedData)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
    }
}