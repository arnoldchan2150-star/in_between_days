import AdminLayout from "./AdminLayout";
import { trpc } from "@/lib/trpc";
import { Mail, CheckCircle, Clock } from "lucide-react";

export default function AdminSubscribers() {
  const { data: subscribers, isLoading } = trpc.booklets.subscribers.useQuery();

  const sentCount = subscribers?.filter((s) => s.sentAt).length ?? 0;
  const pendingCount = (subscribers?.length ?? 0) - sentCount;

  return (
    <AdminLayout title="訂閱者管理">
      <div className="max-w-3xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "總訂閱者", value: subscribers?.length ?? 0, icon: Mail },
            { label: "已寄送", value: sentCount, icon: CheckCircle },
            { label: "待寄送", value: pendingCount, icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="border border-border p-4">
              <Icon size={14} className="text-muted-foreground mb-2" />
              <p className="font-serif text-2xl font-light">{value}</p>
              <p className="text-label mt-1">{label}</p>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse" />
            ))}
          </div>
        ) : subscribers && subscribers.length > 0 ? (
          <div className="border border-border">
            <div className="grid grid-cols-[1fr_1.5fr_auto_auto] gap-4 px-5 py-3 border-b border-border bg-secondary/30">
              <p className="text-label">姓名</p>
              <p className="text-label">電子郵件</p>
              <p className="text-label">狀態</p>
              <p className="text-label">訂閱日期</p>
            </div>
            {subscribers.map((sub, i) => (
              <div
                key={sub.id}
                className={[
                  "grid grid-cols-[1fr_1.5fr_auto_auto] gap-4 px-5 py-3 items-center",
                  i < subscribers.length - 1 ? "border-b border-border" : "",
                ].join(" ")}
              >
                <p className="text-sm font-light truncate">{sub.name}</p>
                <p className="text-sm text-muted-foreground truncate">{sub.email}</p>
                <span className="text-label whitespace-nowrap">
                  {sub.sentAt ? (
                    <span className="flex items-center gap-1 text-foreground">
                      <CheckCircle size={10} /> 已寄送
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock size={10} /> 待寄送
                    </span>
                  )}
                </span>
                <p className="text-label whitespace-nowrap">
                  {new Date(sub.createdAt).toLocaleDateString("zh-TW")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border">
            <p className="font-serif text-lg font-light text-muted-foreground">
              尚無訂閱者
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
