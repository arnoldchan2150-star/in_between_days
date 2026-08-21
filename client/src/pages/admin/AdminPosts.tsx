import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";

export default function AdminPosts() {
  const { data: posts, isLoading, refetch } = trpc.posts.adminList.useQuery();
  const utils = trpc.useUtils();
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const sortedPosts = useMemo(() => {
    if (!posts) return [];
    return [...posts].sort((a, b) => {
      const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.createdAt).getTime();
      const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });
  }, [posts, sortOrder]);

  const deleteMutation = trpc.posts.delete.useMutation({
    onSuccess: () => {
      toast.success("文章已刪除");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.posts.update.useMutation({
    onSuccess: () => {
      toast.success("更新成功");
      utils.posts.adminList.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`確定要刪除「${title}」嗎？此操作無法復原。`)) return;
    deleteMutation.mutate({ id });
  };

  const togglePublish = (id: number, published: boolean) => {
    updateMutation.mutate({ id, published: !published });
  };

  return (
    <AdminLayout title="文章管理">
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <p className="text-sm text-muted-foreground">
            共 {posts?.length ?? 0} 篇文章
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSortOrder((o) => (o === "desc" ? "asc" : "desc"))}
              className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs text-foreground bg-secondary/10 hover:border-foreground transition-colors"
            >
              發佈日期排序：{sortOrder === "desc" ? "新 → 舊 (降冪)" : "舊 → 新 (升冪)"}
            </button>
            <Link href="/admin/posts/new">
              <span className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs tracking-wider hover:bg-foreground/80 transition-colors cursor-pointer">
                <Plus size={12} /> 新增文章
              </span>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-secondary/30 animate-pulse" />
            ))}
          </div>
        ) : sortedPosts && sortedPosts.length > 0 ? (
          <div className="border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/20">
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">
                    標題
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal hidden md:table-cell">
                    分類
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal hidden md:table-cell">
                    類型
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">
                    發佈日期
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">
                    狀態
                  </th>
                  <th className="text-right px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPosts.map((post: any) => (
                  <tr key={post.id} className="border-b border-border last:border-0 hover:bg-secondary/10">
                    <td className="px-4 py-3">
                      <p className="text-sm font-serif line-clamp-1">{post.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 hidden md:block">
                        /{post.slug}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                      {post.category}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                      {post.type === "travel" ? "遊記" : post.type === "culture" ? "靈感" : "雪季"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("zh-TW", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                        : "未設定"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePublish(post.id, post.published)}
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm ${
                          post.published
                            ? "bg-foreground/10 text-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {post.published ? (
                          <>
                            <Eye size={10} /> 已發布
                          </>
                        ) : (
                          <>
                            <EyeOff size={10} /> 草稿
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <span className="p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                            <Edit size={13} />
                          </span>
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border">
            <p className="text-sm text-muted-foreground mb-4">尚無文章</p>
            <Link href="/admin/posts/new">
              <span className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs tracking-wider hover:border-foreground transition-colors cursor-pointer">
                <Plus size={12} /> 新增第一篇文章
              </span>
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
