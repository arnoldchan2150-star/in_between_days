import { trpc } from "@/lib/trpc";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";
import { Download, Mail } from "lucide-react";

export default function AdminSubscribers() {
  const { data: subscribers, isLoading } = trpc.subscribers.list.useQuery();
  const { data: siteSubscribers, isLoading: siteSubscribersLoading } = trpc.subscribers.siteList.useQuery();

  const exportCsv = () => {
    if ((!subscribers || subscribers.length === 0) && (!siteSubscribers || siteSubscribers.length === 0)) return;
    const header = "類型,姓名,信箱,小冊子,訂閱時間,狀態";
    const siteRows = (siteSubscribers ?? []).map((s) =>
      [
        "網站更新",
        s.name,
        s.email,
        "—",
        s.createdAt ? new Date(s.createdAt).toLocaleString("zh-TW") : "",
        s.unsubscribedAt ? "已取消" : "訂閱中",
      ].join(",")
    );
    const bookletRows = (subscribers ?? []).map((s) =>
      [
        "旅遊小冊子",
        s.name,
        s.email,
        s.bookletTitle ?? "",
        s.createdAt ? new Date(s.createdAt).toLocaleString("zh-TW") : "",
        s.sentAt ? "已寄送" : "待寄送",
      ].join(",")
    );
    const rows = [...siteRows, ...bookletRows];
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV 已匯出");
  };

  return (
    <AdminLayout title="訂閱者管理">
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-muted-foreground">
            共 {(subscribers?.length ?? 0) + (siteSubscribers?.length ?? 0)} 位訂閱者
          </p>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs tracking-wider hover:border-foreground transition-colors"
          >
            <Download size={12} /> 匯出 CSV
          </button>
        </div>

        {siteSubscribersLoading ? (
          <div className="space-y-3 mb-10">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-12 bg-secondary/30 animate-pulse" />
            ))}
          </div>
        ) : siteSubscribers && siteSubscribers.length > 0 ? (
          <section className="mb-10">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-serif text-lg font-light">網站更新訂閱</h2>
              <span className="text-xs text-muted-foreground">{siteSubscribers.length} 位</span>
            </div>
            <div className="border border-border overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/20">
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">姓名</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">信箱</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">訂閱時間</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">狀態</th>
                  </tr>
                </thead>
                <tbody>
                  {siteSubscribers.map((sub) => (
                    <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-secondary/10">
                      <td className="px-4 py-3 text-sm">{sub.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        <a href={`mailto:${sub.email}`} className="hover:text-foreground transition-colors flex items-center gap-1">
                          <Mail size={11} /> {sub.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString("zh-TW") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 ${sub.unsubscribedAt ? "bg-secondary text-muted-foreground" : "bg-foreground/10 text-foreground"}`}>
                          {sub.unsubscribedAt ? "已取消" : "訂閱中"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-secondary/30 animate-pulse" />
            ))}
          </div>
        ) : subscribers && subscribers.length > 0 ? (
          <div className="border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/20">
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">姓名</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">信箱</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal hidden md:table-cell">小冊子</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal hidden md:table-cell">訂閱時間</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">寄送狀態</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/10">
                    <td className="px-4 py-3 text-sm">{sub.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      <a href={`mailto:${sub.email}`} className="hover:text-foreground transition-colors flex items-center gap-1">
                        <Mail size={11} /> {sub.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                      {sub.bookletTitle ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                      {sub.createdAt
                        ? new Date(sub.createdAt).toLocaleDateString("zh-TW")
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 ${
                          sub.sentAt
                            ? "bg-foreground/10 text-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {sub.sentAt ? "已寄送" : "待寄送"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border">
            <p className="text-sm text-muted-foreground">尚無小冊子或網站更新訂閱者</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
