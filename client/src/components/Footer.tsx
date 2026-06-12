import { Link } from "wouter";
import { Instagram, Facebook, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="container-wide py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="font-serif text-sm tracking-[0.18em] uppercase text-foreground mb-2">
              In-Between Days
            </p>
            <p className="text-label">間隙裡的日常</p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {[
              { href: "/journal", label: "遊記" },
              { href: "/destinations", label: "目的地" },
              { href: "/culture", label: "電影 × 書籍" },
              { href: "/booklet", label: "旅遊小冊子" },
              { href: "/about", label: "關於我" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="text-label hover:text-foreground transition-colors duration-200">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Instagram size={17} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Facebook size={17} />
            </a>
            <a
              href="mailto:hello@inbetweendays.com"
              aria-label="Email"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Mail size={17} />
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 text-center">
          <p className="text-label text-[0.65rem]">
            © {new Date().getFullYear()} In-Between Days・間隙裡的日常・All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
