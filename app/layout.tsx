import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css" 
import { Suspense } from "react"
import { GlobalModalProvider } from "@/components/providers/modal-provider"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "IntelliCafe",
  description: "Experience the future of café ordering.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <GlobalModalProvider>
          {/* Global Navigation (Visible on all pages) */}
          <Navigation />
          
          {/* This renders the specific page content (Home, Menu, Admin, etc.) */}
          <Suspense fallback={null}>{children}</Suspense>
          
          {/* Global Footer (Visible on all pages) */}
          <Footer />
        </GlobalModalProvider>
        <Analytics />
      </body>
    </html>
  )
}