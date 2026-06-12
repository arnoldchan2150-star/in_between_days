import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  FileText,
  BookOpen,
  Users,
  Settings,
  Menu,
  LogOut,
  Home,
  Lock,
  ArrowLeft,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "概覽", icon: Home },
  { href: "/admin/posts", label: "遊記管理", icon: FileText },
  { href: "/admin/booklets", label: "小冊子管理", icon: BookOpen },
  { href: "/admin/subscribers", label: "訂閱者", icon: Users },
  { href: "/admin/about", label: "關於我設定", icon: Settings },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, loading, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-label animate-pulse tracking-widest">載入中⋯</div>
      </div>
    );
  }

  // ── Not logged in → redirect to email login page ──────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <div className="max-w-sm w-full text-center space-y-8">
          <div>
            <Lock size={28} className="mx-auto mb-6 text-muted-foreground" strokeWidth={1.5} />
            <h1 className="font-serif text-2xl font-light mb-3 tracking-wide">後台管理</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              請登入以存取後台管理功能。
            </p>
          </div>

          <div className="divider mx-auto max-w-[60px]" />

          <div className="space-y-3">
            <Link href="/admin/login">
              <span className="btn-filled w-full flex items-center justify-center gap-2 cursor-pointer">
                電郵登入後台
              </span>
            </Link>
            <Link href="/">
              <span className="flex items-center justify-center gap-1.5 text-label hover:text-foreground transition-colors cursor-pointer">
                <ArrowLeft size={12} />
                返回網站首頁
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Logged in but not admin ───────────────────────────────────────────────
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 gap-6">
        <div className="max-w-sm w-full text-center space-y-6">
          <Lock size={28} className="mx-auto text-muted-foreground" strokeWidth={1.5} />
          <div>
            <h1 className="font-serif text-xl font-light mb-3">權限不足</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              你目前登入的帳號沒有後台管理權限。
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mt-2">
              請使用站長帳號登入。
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => logout()}
              className="btn-filled text-sm"
            >
              登出並重新登入
            </button>
            <Link href="/">
              <span className="flex items-center justify-center gap-1.5 text-label hover:text-foreground transition-colors cursor-pointer">
                <ArrowLeft size={12} />
                返回網站首頁
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Admin layout ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-56 bg-background border-r border-border flex flex-col transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/">
            <span className="font-serif text-xs tracking-[0.16em] uppercase text-foreground hover:text-muted-foreground transition-colors cursor-pointer">
              In-Between Days
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <span
                className={[
                  "flex items-center gap-3 px-3 py-2.5 text-xs tracking-wider uppercase transition-colors duration-200 rounded-sm cursor-pointer",
                  location === href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                ].join(" ")}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={14} />
                {label}
              </span>
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-foreground truncate">{user.name || "站長"}</p>
              <p className="text-[0.6rem] text-muted-foreground tracking-wider uppercase mt-0.5">
                站長 · Admin
              </p>
            </div>
            <button
              onClick={() => logout()}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 flex-shrink-0"
              title="登出"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center px-6 gap-4 sticky top-0 bg-background/95 backdrop-blur-sm z-30">
          <button
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>
          <h1 className="text-sm tracking-wider uppercase text-foreground font-light flex-1">
            {title}
          </h1>
          <Link href="/">
            <span className="text-label hover:text-foreground transition-colors text-xs flex items-center gap-1 cursor-pointer">
              <ArrowLeft size={11} />
              前台
            </span>
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
