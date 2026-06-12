import { Link } from "wouter";
import AdminLayout from "./AdminLayout";
import { trpc } from "@/lib/trpc";
import { FileText, Users, BookOpen, PlusCircle } from "lucide-react";

export default function AdminDashboard() {
  const { data: posts } = trpc.posts.adminList.useQuery();
  const { data: subscribers } = trpc.booklets.subscribers.useQuery();
  const { data: booklets } = trpc.booklets.all.useQuery();

  const publishedCount = posts?.filter((p) => p.published).length ?? 0;
  const draftCount = (posts?.length ?? 0) - publishedCount;

  const stats = [
    { label: "已發布遊記", value: publishedCount, icon: FileText, href: "/admin/posts" },
    { label: "草稿", value: draftCount, icon: FileText, href: "/admin/posts" },
    { label: "訂閱者", value: subscribers?.length ?? 0, icon: Users, href: "/admin/subscribers" },
    { label: "小冊子", value: booklets?.length ?? 0, icon: BookOpen, href: "/admin/booklets" },
  ];

  return (
    <AdminLayout title="後台概覽">
      <div className="max-w-3xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(({ label, value, icon: Icon, href }) => (
            <Link key={label} href={href}>
              <div className="border border-border p-5 hover:bg-secondary/30 transition-colors cursor-pointer">
                <Icon size={16} className="text-muted-foreground mb-3" />
                <p className="font-serif text-2xl font-light">{value}</p>
                <p className="text-label mt-1">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mb-10">
          <p className="text-label mb-4">快速操作</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/posts/new">
              <span className="btn-minimal text-xs">
                <PlusCircle size={13} />
                新增遊記
              </span>
            </Link>
            <Link href="/admin/booklets">
              <span className="btn-minimal text-xs">
                <BookOpen size={13} />
                管理小冊子
              </span>
            </Link>
            <Link href="/admin/about">
              <span className="btn-minimal text-xs">
                編輯關於我
              </span>
            </Link>
          </div>
        </div>

        {/* Recent posts */}
        {posts && posts.length > 0 && (
          <div>
            <p className="text-label mb-4">最近的遊記</p>
            <div className="space-y-2">
              {posts.slice(0, 5).map((post) => (
                <Link key={post.id} href={`/admin/posts/${post.id}`}>
                  <div className="flex items-center justify-between py-3 border-b border-border/50 hover:bg-secondary/20 px-2 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "w-1.5 h-1.5 rounded-full",
                          post.published ? "bg-foreground" : "bg-muted-foreground/40",
                        ].join(" ")}
                      />
                      <p className="text-sm font-light">{post.title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="badge-category text-[0.6rem]">{post.category}</span>
                      <span className="text-label">
                        {post.published ? "已發布" : "草稿"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
