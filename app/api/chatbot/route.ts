import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  let userMessage = ""

  try {
    const body = await request.json()
    userMessage = (body.message || "").trim()
    const msg = userMessage.toLowerCase()

    if (!userMessage) {
      return NextResponse.json({
        response:
          "Hi! 😊 You can ask me about our menu, drinks, food, or recommendations at JuwitaKopi.",
      })
    }

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
       SYSTEM PROMPT
    ========================== */
    const systemPrompt = `
You are a friendly, intelligent café assistant for JuwitaKopi.

LANGUAGE:
Reply only in ${isMalay ? "Bahasa Melayu" : "English"}.

INTENTS:
Sweet: ${intent.sweet}
Spicy: ${intent.spicy}
Creamy: ${intent.creamy}
Non-Coffee: ${intent.nonCoffee}
Recommend: ${intent.recommend}

Explain food/drinks clearly.
Recommend items when unsure.
Max 120 words.
`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt: userMessage,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("[Chatbot Error]", error)

    const msg = userMessage.toLowerCase()

    /* ==========================
       RE-DETECT LANGUAGE (FIX)
    ========================== */
    const isMalay =
      msg.includes("nak") ||
      msg.includes("apa") ||
      msg.includes("manis") ||
      msg.includes("pedas") ||
      msg.includes("tak") ||
      msg.includes("boleh") ||
      msg.includes("sedap")

    let response = ""

    /* ==========================
      SMART FALLBACK (BILINGUAL)
    ========================== */

    if (msg.includes("manis") || msg.includes("sweet")) {
      response = isMalay
        ? "Kalau suka manis, kami cadangkan Caramel Macchiato, Tiramisu Latte atau Strawberry Matcha. Roti Bakar Kaya juga sesuai 😊"
        : "If you like sweet flavours, we recommend Caramel Macchiato, Tiramisu Latte, or Strawberry Matcha. Roti Bakar Kaya is also a great choice 😊"
    }

    /* ===== SPICY ===== */
    else if (msg.includes("pedas") || msg.includes("spicy")) {
      response = isMalay
        ? "Untuk menu pedas, Creamy Tomyam Seafood Spaghetti dan Korean Spicy Chicken adalah pilihan paling popular 🔥"
        : "For spicy food, Creamy Tomyam Seafood Spaghetti and Korean Spicy Chicken are our top choices 🔥"
    }

    /* ===== CREAMY ===== */
    else if (msg.includes("creamy") || msg.includes("lemak")) {
      response = isMalay
        ? "Kalau nak makanan berkrim, Chicken Buttermilk Spaghetti, Chicken Alfredo atau Latte memang sesuai."
        : "If you prefer creamy dishes, Chicken Buttermilk Spaghetti, Chicken Alfredo, or a Latte are excellent options."
    }

    /* ===== NON-COFFEE ===== */
    else if (
      msg.includes("tak nak kopi") ||
      msg.includes("no coffee") ||
      msg.includes("tanpa kopi")
    ) {
      response = isMalay
        ? "Tak nak kopi? Kami ada Matcha, Strawberry Matcha, Mango Matcha dan Buttercream Sea-Salt Matcha."
        : "Not a coffee drinker? We offer Matcha, Strawberry Matcha, Mango Matcha, and Buttercream Sea-Salt Matcha."
    }

    /* ======================
      DRINKS EXPLANATION
    ====================== */

    else if (msg.includes("americano")) {
      response = isMalay
        ? "Americano ialah kopi espresso yang dicampur air panas, rasanya kuat dan tidak manis."
        : "Americano is espresso mixed with hot water, giving a strong and bold coffee taste."
    }

    else if (msg.includes("latte") && !msg.includes("tiramisu")) {
      response = isMalay
        ? "Latte ialah kopi berasaskan susu yang lembut dan seimbang. Kami ada Vanilla, Hazelnut dan Spanish Latte."
        : "Latte is a smooth milk-based coffee. We offer Vanilla, Hazelnut, and Spanish Latte."
    }

    else if (msg.includes("caramel")) {
      response = isMalay
        ? "Caramel Macchiato ialah kopi manis dengan susu dan sirap karamel, sangat digemari pelanggan."
        : "Caramel Macchiato is a sweet coffee with milk and caramel syrup, one of our customer favourites."
    }

    else if (msg.includes("mocha")) {
      response = isMalay
        ? "Mocha ialah gabungan kopi dan coklat, sesuai untuk yang suka rasa manis coklat."
        : "Mocha is a combination of coffee and chocolate, perfect for chocolate lovers."
    }

    else if (msg.includes("tiramisu")) {
      response = isMalay
        ? "Tiramisu Latte ialah kopi berinspirasikan dessert tiramisu, berkrim dan manis."
        : "Tiramisu Latte is a dessert-inspired coffee, creamy and sweet."
    }

    else if (msg.includes("matcha")) {
      response = isMalay
        ? "Matcha ialah minuman teh hijau Jepun yang lembut dan earthy. Kami juga ada variasi buah."
        : "Matcha is a Japanese green tea drink with an earthy and smooth taste. We also offer fruity variations."
    }

    /* ======================
      FOOD EXPLANATION
    ====================== */

    else if (msg.includes("roti bakar")) {
      response = isMalay
        ? "Roti Bakar Kaya atau Butter ialah roti bakar klasik, ringkas dan sedap dimakan bersama kopi."
        : "Roti Bakar Kaya or Butter is a classic toasted bread, simple and delicious with coffee."
    }

    else if (msg.includes("buttermilk")) {
      response = isMalay
        ? "Chicken Buttermilk Spaghetti ialah pasta berkrim dengan rasa sedikit pedas dan ayam rangup."
        : "Chicken Buttermilk Spaghetti is a creamy pasta with a slightly spicy flavour and crispy chicken."
    }

    else if (msg.includes("tomyam")) {
      response = isMalay
        ? "Creamy Tomyam Seafood Spaghetti menggabungkan rasa pedas, masam dan berkrim."
        : "Creamy Tomyam Seafood Spaghetti combines spicy, sour, and creamy flavours."
    }

    else if (msg.includes("alfredo")) {
      response = isMalay
        ? "Chicken Alfredo ialah pasta sos putih berkrim yang lembut dan mengenyangkan."
        : "Chicken Alfredo is a classic creamy white-sauce pasta that is rich and filling."
    }

    else if (msg.includes("pesto")) {
      response = isMalay
        ? "Pesto Pasta menggunakan sos hijau basil yang wangi dan segar."
        : "Pesto Pasta uses a fragrant basil-based green sauce with a fresh taste."
    }

    else if (msg.includes("marry me")) {
      response = isMalay
        ? "Marry Me Pasta ialah pasta berkrim dengan sos tomato kering yang kaya rasa."
        : "Marry Me Pasta is a creamy pasta made with rich sun-dried tomato sauce."
    }

    else if (msg.includes("fish")) {
      response = isMalay
        ? "Fish N Chip terdiri daripada ikan goreng rangup bersama kentang goreng."
        : "Fish N Chip consists of crispy battered fish served with fries."
    }

    else if (msg.includes("cheesy")) {
      response = isMalay
        ? "Cheesy Chicken Chop ialah ayam goreng rangup dengan sos keju leleh."
        : "Cheesy Chicken Chop is crispy fried chicken topped with melted cheese sauce."
    }

    else if (msg.includes("korean")) {
      response = isMalay
        ? "Korean Spicy Chicken ialah ayam goreng dengan sos pedas manis ala Korea."
        : "Korean Spicy Chicken is fried chicken coated with sweet and spicy Korean sauce."
    }

    else if (msg.includes("mantou")) {
      response = isMalay
        ? "Mantou ialah roti goreng lembut yang dihidangkan bersama sos ayam atau clam."
        : "Mantou is a soft fried bun served with chicken or clam sauce."
    }

    /* ======================
      LOCATION & HOURS
    ====================== */

    else if (
      msg.includes("location") ||
      msg.includes("where") ||
      msg.includes("kat mana") ||
      msg.includes("lokasi")
    ) {
      response = isMalay
        ? "📍 JuwitaKopi terletak di Sutera Square, Kajang."
        : "📍 JuwitaKopi is located at Sutera Square, Kajang."
    }

    else if (
      msg.includes("open") ||
      msg.includes("close") ||
      msg.includes("pukul") ||
      msg.includes("hours")
    ) {
      response = isMalay
        ? "⏰ JuwitaKopi beroperasi Isnin hingga Sabtu, 5:00 petang hingga 11:00 malam."
        : "⏰ JuwitaKopi operates from Monday to Saturday, 5:00 PM to 11:00 PM."
    }

    /* ======================
      DEFAULT RESPONSE
    ====================== */
    else {
      response = isMalay
        ? "Hai 😊 Saya boleh terangkan menu, cadangkan makanan atau minuman, dan jawab soalan tentang JuwitaKopi."
        : "Hi 😊 I can explain our menu, recommend food or drinks, and answer questions about JuwitaKopi."
    }

    return NextResponse.json({ response })
  }
}
