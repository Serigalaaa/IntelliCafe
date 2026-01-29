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

      1. COFFEE & DRINKS (Prices Hot/Cold in RM):
         - Basic: Americano (6/7), Latte (8/9).
         - Flavoured Latte: Caramel Macchiato (11/12), Vanilla/Hazelnut/Spanish Latte (11/12), Mocha (12/13), Tiramisu Latte (16).
         - Greeny (Matcha): Matcha (11/12), Strawberry/Mango/Blueberry/Banana Matcha (14), Buttercream Sea-Salt Matcha (16).
         - General Coffee Info: Lattes are milky/smooth; Cappuccinos are frothy; Americanos are espresso with water; Mochas include chocolate.

      2. FOOD & DESCRIPTIONS (Prices in RM):
         - Entree: Roti Bakar Kaya/Butter (2.50) - Classic toasted bread with coconut jam or butter.
         - Spaghetti Mains: 
            * Chicken Buttermilk (12): Creamy, rich, and slightly spicy sauce with tender chicken.
            * Creamy Tomyam Seafood (16): A fusion of spicy/sour Tomyam with a creamy pasta base.
            * Chicken Alfredo (14): Classic white creamy sauce.
            * Marry Me Pasta (15): A rich, sun-dried tomato cream sauce.
            * Pesto Pasta (16): Fragrant basil and nut-based green sauce.
         - Other Mains: Cheesy Chicken Chop (18), Fish N Chip (16), Mac N Cheese (16).
         - Sides: Popia Big Mac (10), Korean Spicy Chicken (14/18), Mantou with Chilli Butter Clam (12).

      3. FOOD PAIRING & RECOMMENDATIONS:
         - Pair spicy food (Tomyam/Korean Chicken) with "Greeny" Matcha or Iced Lemon Tea to balance the heat.
         - Pair creamy pasta (Alfredo/Buttermilk) with an Americano or Black Coffee to cut through the richness.
         - Pair sweet Roti Bakar with a hot Latte or Kopi Kampung.

      4. STORE INFO:
         - Location: Sutera Square, Kajang.
         - Hours: Mon-Sat 5pm-11pm.
         - Owner: Miss Farhana.

      GUIDELINES:
      - When asked "what is [food item]", explain the taste profile based on the descriptions above.
      - Be friendly, professional, and keep answers under 100 words.`,
      prompt: message,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("[v0] Chatbot error:", error)

    const lowerMessage = message.toLowerCase()
    let response = "I'm here to help! Ask me about our menu, like our signature Chicken Buttermilk Spaghetti or our Greeny Matcha series."

    // Comprehensive Fallback Logic
    if (lowerMessage.includes("buttermilk")) {
      response = "Our Chicken Buttermilk Spaghetti (RM12) is a fan favorite! It features a rich, creamy, and slightly spicy sauce that pairs perfectly with a fresh Matcha."
    } else if (lowerMessage.includes("tomyam")) {
      response = "Our Creamy Tomyam Seafood Spaghetti (RM16) is a spicy-sour fusion dish. It's great if you want something with a kick!"
    } else if (lowerMessage.includes("matcha") || lowerMessage.includes("greeny")) {
      response = "We have a wide range of 'Greeny' Matcha drinks, including our specialty Buttercream Sea-Salt Matcha (RM16)."
    } else if (lowerMessage.includes("roti bakar")) {
      response = "We serve classic Roti Bakar (RM2.50) and a special set with Kopi Kampung for only RM4.50!"
    }

    return NextResponse.json({ response })
  }
}