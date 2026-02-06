import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // 1. Check if Guest ID already exists (PRESERVES HISTORY)
    const existingGuest = cookieStore.get("guest_id");

    if (existingGuest) {
      return NextResponse.json({ 
        success: true, 
        guestId: existingGuest.value,
        isNew: false 
      });
    }

    // 2. Generate NEW Guest ID (Only if one doesn't exist)
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 3. Set 'guest_id' cookie (NOT 'session')
    // This keeps isAuthenticated = false, which is what we want for Guest Mode
    cookieStore.set("guest_id", guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days (Longer duration)
      path: "/",
    });

    return NextResponse.json({ 
      success: true, 
      guestId, 
      isNew: true 
    });
    
  } catch (error) {
    console.error("[Guest API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}