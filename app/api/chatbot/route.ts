import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  let message = ""

  try {
    const body = await request.json()
    message = body.message

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: `You are a helpful café assistant for IntelliCafe, an intelligent web-based café system. 
      You help customers with:
      - Menu information (coffee, tea, pastries, sandwiches, desserts)
      - Operating hours (Monday-Friday 7am-8pm, weekends 8am-9pm)
      - Location: Juwita Kopi, Sutera Square, Masjid, Taman Sutera, 43000 Kajang, Selangor
      - Google Maps: https://share.google/LUaIP82zGK89yeR3x
      - Recommendations based on their preferences
      - General café information
      
      Be friendly, concise, and helpful. Keep responses under 100 words.`,
      prompt: message,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("[v0] Chatbot error:", error)

    // Fallback to simple responses if AI fails
    const lowerMessage = message.toLowerCase()
    let response = "I'm here to help! You can ask me about our menu, hours, location, or get recommendations."

    if (lowerMessage.includes("menu")) {
      response =
        "Our menu includes premium coffee, fresh pastries, sandwiches, and delicious desserts. You can view the full menu on our Menu page!"
    } else if (lowerMessage.includes("hour") || lowerMessage.includes("open")) {
      response = "We're open Monday-Friday 7am-8pm, and weekends 8am-9pm. Come visit us anytime!"
    } else if (
      lowerMessage.includes("location") ||
      lowerMessage.includes("where") ||
      lowerMessage.includes("address")
    ) {
      response =
        "We're located at Juwita Kopi, Sutera Square, Masjid, Taman Sutera, 43000 Kajang, Selangor. Find us on Google Maps: https://share.google/LUaIP82zGK89yeR3x"
    } else if (lowerMessage.includes("recommend")) {
      response = "I'd recommend trying our signature cappuccino with a fresh croissant - it's a customer favorite!"
    }

    return NextResponse.json({ response })
  }
}
