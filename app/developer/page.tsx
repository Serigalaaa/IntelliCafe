"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function DeveloperPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8 text-center animate-in fade-in zoom-in duration-500">
      
      <h1 className="text-3xl md:text-5xl font-extrabold mb-8 drop-shadow-lg animate-bounce">
        Developed by <span className="text-primary underline decoration-wavy">THIS</span> guy
      </h1>

      {/* Image Container with rotation effect */}
      <div className="relative w-64 h-64 md:w-80 md:h-96 mb-10 border-8 border-primary/20 rounded-xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300 ease-in-out">
        <Image
          src="/the-developer.jpg" // Checks public/the-developer.jpg
          alt="The Developer"
          fill
          className="object-cover"
          priority
        />
      </div>

      <p className="text-xl md:text-2xl text-muted-foreground font-semibold mb-2">
        Yup. That's him.
      </p>
      <p className="text-lg text-muted-foreground/80 mb-12 italic">
        (Legend says he is still debugging to this day.)
      </p>

      <Link href="/">
        <Button className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go back to safety
        </Button>
      </Link>
    </div>
  )
}