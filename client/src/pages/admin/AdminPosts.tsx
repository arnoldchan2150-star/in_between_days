import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";
import { Check, Clock3, Edit, Eye, EyeOff, Plus, Tag, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { getPostPublishMode, parseTagInput, type PostPublishMode } from "@shared/postWorkflow";

type StatusFilter = "all" | PostPublishMode;

function statusLabel(status: PostPublishMode) {
  if (status === "scheduled") return "已排程";
  if (status === "published") return "已發布";
  return "草稿";
}

export default function AdminPosts() {
  const { data: posts, isLoading, refetch } = trpc.posts.adminList.useQuery();
  const utils = trpc.useUtils();
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkTags, setBulkTags] = useState("");

  const sortedPosts = useMemo(() => {
    if (!posts) return [];
    return [...posts]
      .filter((post) => {
        if (statusFilter === "all") return true;
        return getPostPublishMode(post.published, post.publishedAt) === statusFilter;
      })
      .sort((a, b) => {
        const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.createdAt).getTime();
        const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
      });
  }, [posts, sortOrder, statusFilter]);

  const deleteMutation = trpc.posts.delete.useMutation({
    onSuccess: () => {
      toast.success("文章已刪除");
      setSelectedIds(new Set());
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

  const batchTagsMutation = trpc.posts.batchUpdateTags.useMutation({
    onSuccess: (result) => {
      toast.success(`已更新 ${result.updatedCount} 篇文章的標籤`);
      setSelectedIds(new Set());
      setBulkTags("");
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

  const toggleSelection = (id: number) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllVisible = () => {
    if (selectedIds.size === sortedPosts.length && sortedPosts.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedPosts.map((post) => post.id)));
    }
  };

  const applyBulkTags = (mode: "add" | "remove") => {
    const tags = parseTagInput(bulkTags);
    if (selectedIds.size === 0) {
      toast.info("請先選取至少一篇文章");
      return;
    }
    if (tags.length === 0) {
      toast.info("請輸入至少一個標籤");
      return;
    }
    batchTagsMutation.mutate({
      postIds: Array.from(selectedIds),
      addTags: mode === "add" ? tags : [],
      removeTags: mode === "remove" ? tags : [],
    });
  };

  const allVisibleSelected = sortedPosts.length > 0 && selectedIds.size === sortedPosts.length;
  const selectedCount = selectedIds.size;

  return (
    <AdminLayout title="文章管理">
      <div className="max-w-6xl">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <p className="text-sm text-muted-foreground">共 {posts?.length ?? 0} 篇文章</p>
            <p className="text-xs text-muted-foreground mt-1">草稿只在後台可見；排程文章會在指定日期自動出現在網站。</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setSortOrder((o) => (o === "desc" ? "asc" : "desc"))}
              className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs text-foreground bg-secondary/10 hover:border-foreground transition-colors"
            >
              發布日期：{sortOrder === "desc" ? "新 → 舊" : "舊 → 新"}
            </button>
            <Link href="/admin/posts/new">
              <span className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs tracking-wider hover:bg-foreground/80 transition-colors cursor-pointer">
                <Plus size={12} /> 新增文章
              </span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs text-muted-foreground mr-1">顯示：</span>
          {(["all", "published", "scheduled", "draft"] as StatusFilter[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs border transition-colors ${
                statusFilter === status
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {status === "all" ? "全部" : statusLabel(status)}
            </button>
          ))}
        </div>

        {selectedCount > 0 && (
          <div className="mb-4 border border-border bg-secondary/10 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground mb-3">
              <Tag size={13} /> 已選取 {selectedCount} 篇文章：批量管理標籤
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={bulkTags}
                onChange={(event) => setBulkTags(event.target.value)}
                placeholder="輸入標籤，以逗號分隔，例如：旅遊, 隨筆"
                className="min-w-0 flex-1 border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-foreground"
              />
              <button
                type="button"
                onClick={() => applyBulkTags("add")}
                disabled={batchTagsMutation.isPending}
                className="border border-foreground px-3 py-2 text-xs hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
              >
                套用標籤
              </button>
              <button
                type="button"
                onClick={() => applyBulkTags("remove")}
                disabled={batchTagsMutation.isPending}
                className="border border-border px-3 py-2 text-xs text-muted-foreground hover:border-destructive hover:text-destructive transition-colors disabled:opacity-50"
              >
                移除標籤
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                清除選取
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-secondary/30 animate-pulse" />
            ))}
          </div>
        ) : sortedPosts.length > 0 ? (
          <div className="border border-border overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-border bg-secondary/20">
                  <th className="w-12 px-4 py-3 text-left">
                    <button
                      type="button"
                      onClick={selectAllVisible}
                      aria-label={allVisibleSelected ? "取消選取目前文章" : "選取目前文章"}
                      className={`inline-flex h-4 w-4 items-center justify-center border transition-colors ${
                        allVisibleSelected ? "border-foreground bg-foreground text-background" : "border-border"
                      }`}
                    >
                      {allVisibleSelected && <Check size={11} />}
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">標題</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">標籤</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal hidden md:table-cell">分類</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal hidden md:table-cell">類型</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">發布日期</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">狀態</th>
                  <th className="text-right px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">操作</th>
                </tr>
              </thead>
              <tbody>
                {sortedPosts.map((post: any) => {
                  const status = getPostPublishMode(post.published, post.publishedAt);
                  const checked = selectedIds.has(post.id);
                  return (
                    <tr key={post.id} className={`border-b border-border last:border-0 hover:bg-secondary/10 ${checked ? "bg-secondary/20" : ""}`}>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleSelection(post.id)}
                          aria-label={`${checked ? "取消選取" : "選取"} ${post.title}`}
                          className={`inline-flex h-4 w-4 items-center justify-center border transition-colors ${
                            checked ? "border-foreground bg-foreground text-background" : "border-border"
                          }`}
                        >
                          {checked && <Check size={11} />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-serif line-clamp-1">{post.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 hidden md:block">/{post.slug}</p>
                      </td>
                      <td className="px-4 py-3 max-w-[220px]">
                        <div className="flex flex-wrap gap-1">
                          {(post.tags ?? []).length > 0 ? (
                            post.tags.map((tag: string) => (
                              <span key={tag} className="border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{post.category}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                        {post.type === "travel" ? "遊記" : post.type === "culture" ? "靈感" : "雪季"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" })
                          : "未設定"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => togglePublish(post.id, post.published)}
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm ${
                            status === "published"
                              ? "bg-foreground/10 text-foreground"
                              : status === "scheduled"
                                ? "bg-amber-100 text-amber-900"
                                : "bg-secondary text-muted-foreground"
                          }`}
                          title={status === "scheduled" ? "取消排程並轉為草稿" : undefined}
                        >
                          {status === "published" ? <Eye size={10} /> : status === "scheduled" ? <Clock3 size={10} /> : <EyeOff size={10} />}
                          {statusLabel(status)}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/posts/${post.id}/edit`}>
                            <span className="p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="編輯文章">
                              <Edit size={13} />
                            </span>
                          </Link>
                          <button onClick={() => handleDelete(post.id, post.title)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors" title="刪除文章">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border">
            <p className="text-sm text-muted-foreground mb-4">沒有符合目前篩選的文章</p>
            <Link href="/admin/posts/new">
              <span className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs tracking-wider hover:border-foreground transition-colors cursor-pointer">
                <Plus size={12} /> 新增文章
              </span>
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
