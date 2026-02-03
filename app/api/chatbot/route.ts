import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  let userMessage = ""

  try {
    const body = await request.json()
    userMessage = body.message || ""
    const msg = userMessage.toLowerCase()

    /* ==========================
       LANGUAGE DETECTION
    ========================== */
    const isMalay =
      msg.includes("nak") ||
      msg.includes("apa") ||
      msg.includes("manis") ||
      msg.includes("pedas") ||
      msg.includes("tak") ||
      msg.includes("boleh") ||
      msg.includes("sedap")

    /* ==========================
       INTENT DETECTION
    ========================== */
    const intent = {
      sweet: msg.includes("sweet") || msg.includes("manis"),
      spicy: msg.includes("spicy") || msg.includes("pedas"),
      creamy: msg.includes("creamy") || msg.includes("lemak"),
      nonCoffee:
        msg.includes("tak nak kopi") ||
        msg.includes("no coffee") ||
        msg.includes("tanpa kopi"),
      recommend:
        msg.includes("recommend") ||
        msg.includes("suggest") ||
        msg.includes("apa best") ||
        msg.includes("cadang") ||
        msg.includes("popular"),
    }

    /* ==========================
       SYSTEM PROMPT (BILINGUAL)
    ========================== */
    const systemPrompt = `
You are a friendly and intelligent café assistant for **JuwitaKopi** (IntelliCafe System).

LANGUAGE RULE:
• Reply in ${isMalay ? "Bahasa Melayu" : "English"}
• Keep tone friendly, natural, and café-style

INTENT AWARENESS:
• SWEET → recommend sweet drinks or desserts
• SPICY → recommend spicy food
• CREAMY → recommend creamy pasta or latte
• NON-COFFEE → recommend matcha or chocolate drinks
• RECOMMEND → suggest best sellers

MENU KNOWLEDGE:

DRINKS (Hot / Cold):
• Americano – espresso with hot water, strong & bold
• Latte – smooth milk coffee
• Caramel Macchiato – sweet caramel coffee
• Vanilla / Hazelnut / Spanish Latte – flavoured creamy coffee
• Mocha – chocolate coffee
• Tiramisu Latte – dessert-style coffee
• Matcha – earthy green tea
• Strawberry / Mango / Blueberry Matcha – fruity matcha
• Buttercream Sea-Salt Matcha – sweet, creamy, slightly salty

FOOD:
• Roti Bakar Kaya/Butter – classic toasted bread
• Chicken Buttermilk Spaghetti – creamy & slightly spicy
• Creamy Tomyam Seafood Spaghetti – spicy & sour fusion
• Chicken Alfredo – rich creamy pasta
• Pesto Pasta – herby basil sauce
• Marry Me Pasta – creamy sun-dried tomato sauce
• Fish N Chip – crispy battered fish
• Cheesy Chicken Chop – fried chicken with cheese
• Korean Spicy Chicken – sweet & spicy fried chicken
• Mantou with Clam/Chicken – soft fried buns with sauce

STORE INFO:
• Café Name: JuwitaKopi
• Location: Sutera Square, Kajang
• Operating Hours: Monday – Saturday, 5:00 PM – 11:00 PM
• Owner: Miss Farhana

RULES:
• Explain what the food/drink is when asked
• Give recommendations when unsure
• Keep answers under 120 words
`

    /* ==========================
       AI RESPONSE
    ========================== */
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt: userMessage,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("[Chatbot Error]", error)

    const msg = userMessage.toLowerCase()
    let response = ""

    /* ==========================
       SMART FALLBACK
    ========================== */
    if (msg.includes("manis") || msg.includes("sweet")) {
      response =
        "Kalau suka manis, kami cadangkan Caramel Macchiato atau Tiramisu Latte. Untuk bukan kopi, Strawberry Matcha sangat popular 😊"
    } else if (msg.includes("pedas") || msg.includes("spicy")) {
      response =
        "Untuk pedas, Creamy Tomyam Seafood Spaghetti atau Korean Spicy Chicken memang sesuai!"
    } else if (msg.includes("creamy") || msg.includes("lemak")) {
      response =
        "Kalau nak creamy, Chicken Buttermilk Spaghetti atau Chicken Alfredo adalah pilihan terbaik."
    } else if (msg.includes("tak nak kopi") || msg.includes("no coffee")) {
      response =
        "Tak nak kopi? Kami cadangkan Greeny Matcha seperti Buttercream Sea-Salt Matcha atau minuman coklat."
    } else {
      response =
        "Hi! Saya boleh bantu terangkan menu, cadangkan makanan atau minuman, dan jawab soalan tentang JuwitaKopi 😊"
    }

    return NextResponse.json({ response })
  }
}
