// app/api/auth/signup/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb" 
import { User } from "@/lib/db-models" 

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // --- FIX START ---
    const client = await clientPromise
    
    // Safety Check: If client is null, the DB didn't connect
    if (!client) {
        throw new Error("Database connection failed")
    }
    
    const db = client.db("intellicafe") 
    // --- FIX END ---

    const existingUser = await db.collection<User>("users").findOne({ email })
    
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser: User = {
      email,
      name,
      password: hashedPassword,
      role: "user", 
      createdAt: new Date(),
    }

    const result = await db.collection<User>("users").insertOne(newUser)

    const sessionUser = {
      id: result.insertedId.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }

    const session = {
      user: sessionUser,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
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
    console.error("[Signup API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}