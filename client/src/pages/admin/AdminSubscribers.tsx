import { trpc } from "@/lib/trpc";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";
import { Download, Mail } from "lucide-react";

export default function AdminSubscribers() {
  const { data: subscribers, isLoading } = trpc.subscribers.list.useQuery();

  const exportCsv = () => {
    if (!subscribers || subscribers.length === 0) return;
    const header = "姓名,信箱,小冊子,訂閱時間,寄送時間";
    const rows = subscribers.map((s) =>
      [
        s.name,
        s.email,
        s.bookletTitle ?? "",
        s.createdAt ? new Date(s.createdAt).toLocaleString("zh-TW") : "",
        s.sentAt ? new Date(s.sentAt).toLocaleString("zh-TW") : "未寄送",
      ].join(",")
    );
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
            共 {subscribers?.length ?? 0} 位訂閱者
          </p>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs tracking-wider hover:border-foreground transition-colors"
          >
            <Download size={12} /> 匯出 CSV
          </button>
        </div>

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
            <p className="text-sm text-muted-foreground">尚無訂閱者</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
