import { Link } from "wouter";
import AdminLayout from "./AdminLayout";
import { trpc } from "@/lib/trpc";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminPosts() {
  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.posts.adminList.useQuery();

  const deletePost = trpc.posts.delete.useMutation({
    onSuccess: () => {
      utils.posts.adminList.invalidate();
      toast.success("遊記已刪除");
    },
    onError: () => toast.error("刪除失敗"),
  });

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`確定要刪除「${title}」嗎？此操作無法復原。`)) return;
    deletePost.mutate({ id });
  };

  return (
    <AdminLayout title="遊記管理">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <p className="text-label">共 {posts?.length ?? 0} 篇</p>
          <Link href="/admin/posts/new">
            <span className="btn-filled text-xs">
              <PlusCircle size={13} />
              新增遊記
            </span>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-muted animate-pulse" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="border border-border">
            {posts.map((post, i) => (
              <div
                key={post.id}
                className={[
                  "flex items-center justify-between px-5 py-4 gap-4",
                  i < posts.length - 1 ? "border-b border-border" : "",
                ].join(" ")}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={[
                      "w-1.5 h-1.5 rounded-full flex-shrink-0",
                      post.published ? "bg-foreground" : "bg-muted-foreground/40",
                    ].join(" ")}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-light truncate">{post.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-label">{post.category}</span>
                      <span className="text-label">
                        {post.published ? "已發布" : "草稿"}
                      </span>
                      {post.publishedAt && (
                        <span className="text-label">
                          {new Date(post.publishedAt).toLocaleDateString("zh-TW")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/posts/${post.id}`}>
                    <span className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil size={14} />
                    </span>
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    disabled={deletePost.isPending}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border">
            <p className="font-serif text-lg font-light text-muted-foreground mb-4">
              尚無遊記
            </p>
            <Link href="/admin/posts/new">
              <span className="btn-minimal text-xs">
                <PlusCircle size={13} />
                新增第一篇遊記
              </span>
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
