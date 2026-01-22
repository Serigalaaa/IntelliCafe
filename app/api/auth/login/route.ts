import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { User } from "@/lib/db-models"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const client = await clientPromise
    if (!client) {
      throw new Error("Database connection failed")
    }
    const db = client.db("intellicafe")

    // 1. Find the user in MongoDB
    const user = await db.collection<User>("users").findOne({ email })

    // 2. Check if user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // 3. CRITICAL: Save the Database ID (_id) to the session
    // We map user._id (ObjectId) to a string 'id'
    const sessionUser = {
      id: user._id!.toString(), 
      name: user.name,
      email: user.email,
      role: user.role,
    }

    // 4. Create the Session Cookie
    const session = {
      user: sessionUser,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    }

    const cookieStore = await cookies()
    cookieStore.set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, 
      path: "/",
    })

    return NextResponse.json({ success: true, user: sessionUser })

  } catch (error) {
    console.error("Login Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}