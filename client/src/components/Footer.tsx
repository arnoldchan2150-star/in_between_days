import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <p className="font-serif text-sm tracking-[0.2em] uppercase mb-3">
              In-Between Days
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              走走停停，在旅途間隙，遇見世界，也遇見自己。
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase mb-4">
              探索
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/journal", label: "旅行遊記" },
                { href: "/destinations", label: "目的地" },
                { href: "/culture", label: "電影 × 書籍" },
                { href: "/booklet", label: "旅遊小冊子" },
                { href: "/about", label: "關於我" },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase mb-4">
              聯絡
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:hello@inbetweendays.com"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                hello@inbetweendays.com
              </a>
              <Link href="/booklet">
                <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  訂閱旅遊小冊子
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} In-Between Days. All rights reserved.
          </p>
          <Link href="/admin">
            <span className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-pointer">
              管理後台
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
