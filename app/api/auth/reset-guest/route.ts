import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
    const cookieStore = await cookies()

    // Delete the guest session cookie
    cookieStore.delete("guest_session_id")

    return NextResponse.json({ success: true })
}