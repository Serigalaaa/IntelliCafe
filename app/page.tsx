import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section" // <--- Import here
// Do NOT import Navigation or Footer here (they are already in layout)

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      
      {/* This ensures the About Section only appears on the Home Page */}
      <AboutSection />
    </main>
  )
}