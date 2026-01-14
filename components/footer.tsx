import { Coffee, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <div className="flex flex-col w-full">
      {/* YOUR ORIGINAL FOOTER */}
      <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Coffee className="w-6 h-6" />
                <span className="font-semibold text-lg">IntelliCafe</span>
              </div>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                An Interactive and Intelligent Web-based Café System designed to revolutionize your coffee experience.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {["Home", "Menu", "Feedback", "Game", "Chatbot", "Admin"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-primary-foreground/80">University Campus, Building A, Room 101</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="text-primary-foreground/80">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="text-primary-foreground/80">info@intellicafe.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-primary-foreground/20 text-center">
            <p className="text-primary-foreground/70 text-sm">
              © {new Date().getFullYear()} IntelliCafe. All rights reserved. | Final Year Project
            </p>
          </div>
        </div>
      </footer>

      {/* THE HIDDEN TROLL LINK */}
      <div className="py-1 bg-background text-center border-t border-border/10">
         <Link 
            href="/developer" 
            className="text-[10px] text-muted-foreground/30 hover:text-primary transition-colors cursor-help font-mono"
            title="Click me if you dare"
         >
            Wait... who developed this?
         </Link>
      </div>
    </div>
  )
}