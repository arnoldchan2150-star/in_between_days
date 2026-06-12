import { trpc } from "@/lib/trpc";
import AdminLayout from "./AdminLayout";
import { Link } from "wouter";
import { FileText, BookOpen, Users, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const { data: posts } = trpc.posts.adminList.useQuery();
  const { data: booklets } = trpc.booklets.adminList.useQuery();
  const { data: subscribers } = trpc.subscribers.list.useQuery();

  const stats = [
    {
      label: "文章總數",
      value: posts?.length ?? 0,
      published: posts?.filter((p) => p.published).length ?? 0,
      icon: FileText,
      href: "/admin/posts",
    },
    {
      label: "小冊子",
      value: booklets?.length ?? 0,
      active: booklets?.filter((b) => b.active).length ?? 0,
      icon: BookOpen,
      href: "/admin/booklets",
    },
    {
      label: "訂閱者",
      value: subscribers?.length ?? 0,
      sent: subscribers?.filter((s) => s.sentAt).length ?? 0,
      icon: Users,
      href: "/admin/subscribers",
    },
  ];

  return (
    <AdminLayout title="總覽">
      <div className="max-w-4xl">
        {/* Welcome */}
        <div className="mb-10">
          <p className="text-sm text-muted-foreground">
            歡迎回來，這是您的旅遊部落格管理後台。
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.href} href={stat.href}>
                <div className="border border-border p-6 hover:border-foreground/30 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <Icon size={16} className="text-muted-foreground" />
                    <ArrowRight size={12} className="text-muted-foreground" />
                  </div>
                  <p className="font-serif text-3xl font-light mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground tracking-wider">{stat.label}</p>
                  {"published" in stat && (
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      已發布 {stat.published} 篇
                    </p>
                  )}
                  {"active" in stat && (
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      啟用中 {stat.active} 本
                    </p>
                  )}
                  {"sent" in stat && (
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      已寄送 {stat.sent} 位
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick actions */}
        <div>
          <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase mb-4">
            快速操作
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/posts/new">
              <span className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs tracking-wider hover:border-foreground transition-colors cursor-pointer">
                <FileText size={12} /> 新增文章
              </span>
            </Link>
            <Link href="/admin/booklets">
              <span className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs tracking-wider hover:border-foreground transition-colors cursor-pointer">
                <BookOpen size={12} /> 管理小冊子
              </span>
            </Link>
            <Link href="/admin/about">
              <span className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs tracking-wider hover:border-foreground transition-colors cursor-pointer">
                編輯關於我
              </span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
