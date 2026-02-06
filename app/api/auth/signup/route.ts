// app/api/auth/signup/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb" 
import { User } from "@/lib/db-models" 

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json()

    if (!email || !password || !name || !phone) {
      return NextResponse.json({ error: "Name, email, phone, and password are required" }, { status: 400 })
    }

    // --- UPDATED: Validate Email Format ---
    // Allows: example.com, example.com.my, example.my
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|com\.my|my)$/i;
    
    if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Email must end in .com, .my, or .com.my" }, { status: 400 })
    }
    // ----------------------------------

    const client = await clientPromise
    if (!client) {
        throw new Error("Database connection failed")
    }
    const db = client.db("intellicafe") 

    const existingUser = await db.collection<User>("users").findOne({
        $or: [
            { email: email },
            { phone: phone }
        ]
    })
    
    if (existingUser) {
      if (existingUser.email === email) {
          return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
      }
      if (existingUser.phone === phone) {
          return NextResponse.json({ error: "This phone number is already registered" }, { status: 400 })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser: User = {
      email,
      name,
      phone,
      password: hashedPassword,
      role: "user", 
      createdAt: new Date(),
    }

    const result = await db.collection<User>("users").insertOne(newUser)

    const sessionUser = {
      id: result.insertedId.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone
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