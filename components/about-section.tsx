import { Card, CardContent } from "@/components/ui/card"
import { Menu, MessageSquare, ThumbsUp } from "lucide-react"

export function AboutSection() {
  const features = [
    {
      icon: Menu,
      title: "Smart Menu",
      description:
        "Browse our intelligent menu system with real-time availability, personalized recommendations, and detailed nutritional information.",
    },
    {
      icon: MessageSquare,
      title: "Chatbot Assistant",
      description:
        "Get instant help from our AI-powered chatbot. Ask questions, place orders, and receive personalized suggestions 24/7.",
    },
    {
      icon: ThumbsUp,
      title: "Feedback Icons",
      description:
        "Share your experience with our interactive feedback system. Your opinions help us serve you better every day.",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            About IntelliCafe
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Experience the future of café ordering with our intelligent, interactive platform designed to make your
            coffee experience seamless and enjoyable.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-pretty">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
