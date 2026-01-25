import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { _id, ...updateData } = body

        // Ensure numeric values
        if (updateData.price) updateData.price = parseFloat(updateData.price)
        if (updateData.stock) updateData.stock = parseInt(updateData.stock)

        const client = await clientPromise
        if (!client) throw new Error("Database connection failed")

        const db = client.db("intellicafe")

        await db.collection("menu").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const client = await clientPromise
        if (!client) throw new Error("Database connection failed")

        const db = client.db("intellicafe")

        await db.collection("menu").deleteOne({ _id: new ObjectId(id) })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }
}