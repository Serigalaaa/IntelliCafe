import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css" 
import { Suspense } from "react"
import { GlobalModalProvider } from "@/components/providers/modal-provider" // 1. Import the provider

export const metadata: Metadata = {
  title: "IntelliCafe - An Interactive and Intelligent Web-based Café System",
  description:
    "Experience the future of café ordering with IntelliCafe - featuring smart menus, AI chatbot assistance, and interactive feedback systems.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* 2. Wrap everything inside the provider */}
        <GlobalModalProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </GlobalModalProvider>
        <Analytics />
      </body>
    </html>
  )
}