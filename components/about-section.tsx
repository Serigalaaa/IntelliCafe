"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Menu, MessageSquare, ThumbsUp, Gamepad2 } from "lucide-react"
import Link from "next/link"

export function AboutSection() {
  const features = [
    {
      icon: Menu,
      title: "Smart Menu",
      description:
        "Explore our intelligent digital menu with smart filtering, real-time availability, and clear descriptions to help customers make informed choices.",
      href: "/menu",
    },
    {
      icon: MessageSquare,
      title: "AI Chatbot Assistant",
      description:
        "Interact with our intelligent chatbot to ask about menu items, receive food and drink recommendations, and get café information instantly.",
      href: "/chatbot",
    },
    {
      icon: ThumbsUp,
      title: "Interactive Feedback System",
      description:
        "Share your dining experience using sentiment-based feedback icons. Customer feedback helps improve service quality and user experience.",
      href: "/feedback",
    },
    {
      icon: Gamepad2,
      title: "Gamified Experience & Rewards",
      description:
        "Logged-in users can play our interactive food categorization game to enhance engagement. Successful gameplay allows users to earn discounted vouchers and special café rewards.",
      href: "/game",
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

        {/* Features Grid - Set to 4 columns on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href} className="block h-full">
              <Card
                className="h-full border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}