import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  let message = ""

  try {
    const body = await request.json()
    message = body.message

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: `You are a helpful café assistant for Juwita Kopi (IntelliCafe system).
      
      YOUR KNOWLEDGE BASE:

      1. SPECIFIC STORE INFO:
         - **Name:** Juwita Kopi
         - **Favorites:** Juwita Signature Latte, Nasi Lemak Special, Hazelnut Croissant.
         - **Hours:** Mon-Sat 5pm-11pm (Closed Sundays).
         - **Location:** Juwita Kopi, Sutera Square, Masjid, Taman Sutera, 43000 Kajang, Selangor.
         - **Owner:** Mr. Azman (Started 2023).
         - **Contact:** +6012-345-6789 | hello@juwitakopi.com

      2. GENERAL COFFEE KNOWLEDGE (Use this to answer general questions):
         - **Latte vs Cappuccino:** A Latte is milky and smooth (more steamed milk); a Cappuccino is frothy and stronger (more foam).
         - **Flat White:** Similar to a latte but with less milk foam and a stronger coffee hit (microfoam).
         - **Americano:** Espresso shots topped with hot water.
         - **Mocha:** A latte mixed with chocolate powder/syrup.
         - **Espresso:** A concentrated shot of coffee, the base for most drinks.
         - **Cold Brew:** Coffee steeped in cold water for 12+ hours (smooth, less acidic).
         - **Roast Levels:** Light (acidic/fruity), Medium (balanced), Dark (bitter/bold).

      3. FOOD PAIRING KNOWLEDGE:
         - **Sweet Pastries (Croissants/Danishes):** Go best with Cappuccinos or Lattes.
         - **Savory Food (Sandwiches/Nasi Lemak):** Goes best with Americano, Teh O (Black Tea), or Iced Lemon Tea to cut the richness.
         - **Desserts (Cakes):** Go best with Long Black or Espresso to balance the sweetness.

      GUIDELINES:
      - Be friendly, concise (under 100 words).
      - If the user asks for a recommendation, try to link a General Fact to a Store Item (e.g., "If you like frothy coffee, try our Cappuccino! It goes great with a croissant.").
      `,
      prompt: message,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("[v0] Chatbot error:", error)

    // FALLBACK RESPONSES (Used if AI is down)
    const lowerMessage = message.toLowerCase()
    let response = "I'm here to help! You can ask me about our menu, favorites, owner, or contact info."

    if (lowerMessage.includes("menu")) {
      response = "Our menu includes premium coffee, fresh pastries, sandwiches, and delicious desserts."
    } else if (lowerMessage.includes("favourite") || lowerMessage.includes("favorite") || lowerMessage.includes("recommend")) {
      response = "Our customer favorites are the Juwita Signature Latte and Nasi Lemak Special."
    } else if (lowerMessage.includes("owner") || lowerMessage.includes("about")) {
      response = "Juwita Kopi is owned by Mr. Azman. We started in 2023 to serve the best coffee in Kajang."
    } else if (lowerMessage.includes("contact") || lowerMessage.includes("call")) {
      response = "You can contact us at +6012-345-6789."
    } else if (lowerMessage.includes("latte") || lowerMessage.includes("cappuccino") || lowerMessage.includes("flat white")) {
      // Basic fallback for coffee knowledge
      response = "Great question! A Latte is milky, a Cappuccino is frothy, and a Flat White is strong and smooth. We serve all three!"
    } else if (lowerMessage.includes("hour") || lowerMessage.includes("open")) {
      response = "We're open Monday-Saturday 5pm-11pm, and closed on Sundays."
    } else if (lowerMessage.includes("location") || lowerMessage.includes("where")) {
      response = "We're located at Sutera Square, Taman Sutera, 43000 Kajang, Selangor."
    }

    return NextResponse.json({ response })
  }
}