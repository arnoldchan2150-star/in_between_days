import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

const NAV_LINKS = [
  { href: "/journal", label: "遊記" },
  { href: "/destinations", label: "目的地" },
  { href: "/culture", label: "電影 × 書籍" },
  { href: "/booklet", label: "旅遊小冊子" },
  { href: "/about", label: "關於我" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [location]);

  const isHome = location === "/";

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || !isHome
            ? "bg-background/95 backdrop-blur-sm border-b border-border"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="container-wide flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/">
            <span
              className={[
                "font-serif text-sm tracking-[0.18em] uppercase transition-colors duration-300",
                scrolled || !isHome ? "text-foreground" : "text-white",
              ].join(" ")}
            >
              In-Between Days
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={[
                    "nav-link transition-colors duration-300",
                    scrolled || !isHome ? "" : "!text-white/80 hover:!text-white",
                    location === link.href ? "active" : "",
                  ].join(" ")}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link href="/admin">
                <span
                  className={[
                    "nav-link transition-colors duration-300",
                    scrolled || !isHome ? "" : "!text-white/80 hover:!text-white",
                  ].join(" ")}
                >
                  後台
                </span>
              </Link>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className={[
              "md:hidden p-2 transition-colors duration-300",
              scrolled || !isHome ? "text-foreground" : "text-white",
            ].join(" ")}
            onClick={() => setOpen((v) => !v)}
            aria-label="選單"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={[
          "fixed inset-0 z-40 bg-background flex flex-col pt-20 px-8 transition-all duration-300 md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <nav className="flex flex-col gap-8 mt-8">
          {NAV_LINKS.map((link, i) => (
            <Link key={link.href} href={link.href}>
              <span
                className={[
                  "font-serif text-2xl font-light tracking-wider transition-all duration-300",
                  open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                  location === link.href ? "text-foreground" : "text-muted-foreground",
                ].join(" ")}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {link.label}
              </span>
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link href="/admin">
              <span className="font-serif text-2xl font-light tracking-wider text-muted-foreground">
                後台管理
              </span>
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
