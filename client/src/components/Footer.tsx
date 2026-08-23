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
                { href: "/destinations", label: "目的地遊記" },
                { href: "/culture", label: "靈感拾光" },
                { href: "/snow", label: "雪季映像" },
                { href: "/booklet", label: "行旅資料庫" },
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
                href="mailto:365inwien@gmail.com"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                365inwien@gmail.com
              </a>
              <Link href="/booklet">
                <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  瀏覽行旅資料庫
                </span>
              </Link>
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                <Link href="/privacy-policy">
                  <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    隱私權政策
                  </span>
                </Link>
                <Link href="/terms">
                  <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    服務條款
                  </span>
                </Link>
              </div>
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
