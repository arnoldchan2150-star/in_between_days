import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  UserCircle,
  LogOut,
  ExternalLink,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "總覽", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "文章管理", icon: FileText },
  { href: "/admin/booklets", label: "小冊子管理", icon: BookOpen },
  { href: "/admin/subscribers", label: "訂閱者", icon: Users },
  { href: "/admin/about", label: "關於我", icon: UserCircle },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => navigate("/admin/login"),
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/admin/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">載入中...</p>
      </div>
    );
  }

  if (!user) return null;

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location === href;
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border flex flex-col bg-background">
        <div className="p-6 border-b border-border">
          <p className="font-serif text-xs tracking-[0.2em] uppercase text-foreground">
            In-Between Days
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">管理後台</p>
        </div>

        <nav className="flex-1 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={`flex items-center gap-3 px-6 py-2.5 text-xs tracking-wider cursor-pointer transition-colors ${
                    active
                      ? "text-foreground bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <Icon size={14} />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-2 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink size={13} />
            查看網站
          </a>
          <button
            onClick={() => logout.mutate()}
            className="flex items-center gap-3 px-2 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-left"
          >
            <LogOut size={13} />
            登出
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {title && (
          <header className="border-b border-border px-8 py-5">
            <h1 className="font-serif text-lg font-light">{title}</h1>
          </header>
        )}
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
