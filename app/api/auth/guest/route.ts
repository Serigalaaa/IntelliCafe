import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createGuestSession } from "@/lib/auth"

export async function POST() {
  try {
    const guestUser = await createGuestSession()

    // Create guest session
    const session = {
      user: guestUser,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day for guests
    }

    const cookieStore = await cookies()
    cookieStore.set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 1 day
      path: "/",
    })

    return NextResponse.json({ success: true, user: guestUser })
  } catch (error) {
    console.error("[v0] Guest session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
