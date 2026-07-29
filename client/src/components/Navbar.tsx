import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/destinations", label: "目的地遊記" },
  { href: "/eastern-europe", label: "東歐漫遊" },
  { href: "/culture", label: "靈感拾光" },
  { href: "/snow", label: "雪季映像" },
  { href: "/koktokay-ski-guide", label: "可可托海攻略" },
  { href: "/booklet", label: "旅遊小冊子" },
  { href: "/about", label: "關於我" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navBg = isHome
    ? scrolled
      ? "bg-background/95 backdrop-blur-sm border-b border-border"
      : "bg-transparent"
    : "bg-background/95 backdrop-blur-sm border-b border-border";

  const textColor = isHome && !scrolled ? "text-white" : "text-foreground";
  const logoColor = isHome && !scrolled ? "text-white" : "text-foreground";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <span className={`font-serif text-sm tracking-[0.2em] uppercase cursor-pointer transition-colors ${logoColor}`}>
              In-Between Days
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`text-xs tracking-[0.12em] cursor-pointer transition-colors hover:opacity-60 ${textColor} ${
                    location.startsWith(link.href) ? "opacity-100" : "opacity-70"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`md:hidden p-2 transition-colors ${textColor}`}
            aria-label="選單"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-16">
          <div className="container py-8 flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  onClick={() => setMenuOpen(false)}
                  className="font-serif text-xl font-light cursor-pointer text-foreground hover:text-muted-foreground transition-colors block"
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
