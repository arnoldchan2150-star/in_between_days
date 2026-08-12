import { useState } from "react";
import { trpc } from "@/lib/trpc";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";
import { Download, Mail, Send, Eye, Settings, Clock, CheckCircle } from "lucide-react";

export default function AdminSubscribers() {
  const [activeTab, setActiveTab] = useState<"subscribers" | "newsletter" | "settings">("subscribers");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { data: subscribers, isLoading, refetch } = trpc.subscribers.list.useQuery();
  const { data: siteSubscribers, isLoading: siteSubscribersLoading } = trpc.subscribers.siteList.useQuery();
  const { data: settings, refetch: refetchSettings } = trpc.subscribers.getSettings.useQuery();
  const { data: newsletters } = trpc.subscribers.listNewsletters.useQuery();

  const updateSettingsMutation = trpc.subscribers.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("寄送頻率設定已更新");
      refetchSettings();
    },
    onError: (err) => toast.error(err.message),
  });

  const sendNewsletterMutation = trpc.subscribers.createAndSendNewsletter.useMutation({
    onSuccess: (res) => {
      setIsSending(false);
      toast.success(`電子報已成功發送給 ${res.recipientCount} 位已確認訂閱者`);
      setSubject("");
      setContent("");
      refetch();
    },
    onError: (err) => {
      setIsSending(false);
      toast.error(err.message);
    },
  });

  const exportCsv = () => {
    if ((!subscribers || subscribers.length === 0) && (!siteSubscribers || siteSubscribers.length === 0)) return;
    const header = "類型,姓名,信箱,小冊子/狀態,訂閱時間,狀態";
    const siteRows = (siteSubscribers ?? []).map((s) =>
      [
        "網站更新",
        s.name,
        s.email,
        s.confirmed ? "已確認" : "未確認",
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

  const handleSend = () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("請填寫主旨與電子報內容");
      return;
    }
    if (!confirm("確定要將此電子報發送給所有已確認的網站更新訂閱者嗎？")) return;
    setIsSending(true);
    sendNewsletterMutation.mutate({ subject: subject.trim(), content: content.trim() });
  };

  const confirmedSiteSubCount = (siteSubscribers ?? []).filter((s) => s.confirmed && !s.unsubscribedAt).length;

  return (
    <AdminLayout title="訂閱者與電子報管理">
      <div className="max-w-5xl">
        {/* Tabs */}
        <div className="flex border-b border-border mb-8 gap-8">
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`pb-3 text-sm tracking-wider transition-colors border-b-2 -mb-[2px] ${
              activeTab === "subscribers" ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            訂閱者名單 ({(subscribers?.length ?? 0) + (siteSubscribers?.length ?? 0)})
          </button>
          <button
            onClick={() => setActiveTab("newsletter")}
            className={`pb-3 text-sm tracking-wider transition-colors border-b-2 -mb-[2px] ${
              activeTab === "newsletter" ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            撰寫與發送電子報
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 text-sm tracking-wider transition-colors border-b-2 -mb-[2px] ${
              activeTab === "settings" ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            自動寄送與頻率設定
          </button>
        </div>

        {activeTab === "subscribers" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                網站更新訂閱（已確認：{confirmedSiteSubCount} 位）與旅遊小冊子訂閱
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
                  <h2 className="font-serif text-lg font-light">網站更新訂閱者</h2>
                  <span className="text-xs text-muted-foreground">{siteSubscribers.length} 位</span>
                </div>
                <div className="border border-border overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/20">
                        <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">姓名</th>
                        <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">信箱</th>
                        <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">驗證狀態</th>
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
                          <td className="px-4 py-3 text-xs">
                            {sub.confirmed ? (
                              <span className="text-emerald-700 flex items-center gap-1">
                                <CheckCircle size={12} /> 已驗證
                              </span>
                            ) : (
                              <span className="text-amber-600">待信件確認</span>
                            )}
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

            <section>
              <h2 className="font-serif text-lg font-light mb-3">旅遊小冊子訂閱者</h2>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 bg-secondary/30 animate-pulse" />
                  ))}
                </div>
              ) : subscribers && subscribers.length > 0 ? (
                <div className="border border-border overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/20">
                        <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">姓名</th>
                        <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">信箱</th>
                        <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">小冊子</th>
                        <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">訂閱時間</th>
                        <th className="text-left px-4 py-3 text-xs text-muted-foreground tracking-wider font-normal">PDF 寄送</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((sub) => (
                        <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-secondary/10">
                          <td className="px-4 py-3 text-sm">{sub.name}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            <a href={`mailto:${sub.email}`} className="hover:text-foreground transition-colors flex items-center gap-1">
                              <Mail size={11} /> {sub.email}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-sm">{sub.bookletTitle ?? "全站小冊子"}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString("zh-TW") : "—"}
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <span className={sub.sentAt ? "text-emerald-700" : "text-amber-600"}>
                              {sub.sentAt ? "已寄送" : "處理中"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">尚無小冊子訂閱者</p>
              )}
            </section>
          </div>
        )}

        {activeTab === "newsletter" && (
          <div className="space-y-6">
            <div className="bg-secondary/20 p-4 border border-border text-xs text-muted-foreground space-y-1">
              <p>收件對象：所有已通過 Email 驗證且未取消訂閱的網站更新訂閱者（目前共 <strong className="text-foreground">{confirmedSiteSubCount}</strong> 位）。</p>
              <p>發信將自動包含合規的取消訂閱連結與網站風格信紙排版。</p>
            </div>

            <div>
              <label className="block text-xs font-medium tracking-wider mb-2">電子報主旨</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="例如：【新文章】探索奧地利阿爾卑斯山的粉雪時光"
                className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-medium tracking-wider mb-2">電子報內容 (支援 HTML / 段落)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder="親愛的讀者：&#10;&#10;最近過得好嗎？In-Between Days 近期更新了幾篇關於歐洲與滑雪的全新旅程記錄..."
                className="w-full bg-background border border-border p-4 text-sm font-sans focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="inline-flex items-center gap-2 border border-border px-5 py-3 text-xs tracking-wider hover:border-foreground transition-colors"
              >
                <Eye size={14} /> 預覽電子報
              </button>
              <button
                onClick={handleSend}
                disabled={isSending || confirmedSiteSubCount === 0}
                className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-xs tracking-wider hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                <Send size={14} /> {isSending ? "發送中..." : `立即發送給 ${confirmedSiteSubCount} 位訂閱者`}
              </button>
            </div>

            {/* Past newsletters history */}
            {newsletters && newsletters.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="font-serif text-base font-light mb-4">歷史發送紀錄</h3>
                <div className="border border-border divide-y divide-border">
                  {newsletters.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-medium text-sm text-foreground">{item.subject}</p>
                        <p className="text-muted-foreground mt-1">
                          發送時間：{item.sentAt ? new Date(item.sentAt).toLocaleString("zh-TW") : "草稿/未發送"} ｜ 成功寄送：{item.recipientCount} 位
                        </p>
                      </div>
                      <span className="text-muted-foreground">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString("zh-TW") : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6 max-w-xl">
            <h2 className="font-serif text-lg font-light mb-2">自動發送頻率設定</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              選擇當網站有新動態或定期觸發時，系統的寄送模式：
            </p>

            <div className="space-y-4 pt-2">
              <label className={`flex items-start gap-3 p-4 border transition-colors cursor-pointer ${settings?.frequency === "monthly" ? "border-foreground bg-secondary/10" : "border-border hover:border-foreground/50"}`}>
                <input
                  type="radio"
                  name="frequency"
                  value="monthly"
                  checked={settings?.frequency !== "per_post"}
                  onChange={() => updateSettingsMutation.mutate({ frequency: "monthly" })}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium">每月發送一次精選電子報</p>
                  <p className="text-xs text-muted-foreground mt-0.5">每月初由系統彙整上個月的精選遊記與小冊子更新，發送給全體確認訂閱者。</p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 border transition-colors cursor-pointer ${settings?.frequency === "per_post" ? "border-foreground bg-secondary/10" : "border-border hover:border-foreground/50"}`}>
                <input
                  type="radio"
                  name="frequency"
                  value="per_post"
                  checked={settings?.frequency === "per_post"}
                  onChange={() => updateSettingsMutation.mutate({ frequency: "per_post" })}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium">每發布新文章時自動寄送</p>
                  <p className="text-xs text-muted-foreground mt-0.5">當您在後台發布全新文章並勾選發送通知時，自動將文章摘要與連結寄發給所有訂閱者。</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-background border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <h3 className="font-serif text-base font-light">電子報預覽</h3>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-xs text-muted-foreground hover:text-foreground tracking-wider"
                >
                  關閉
                </button>
              </div>

              <div className="bg-secondary/10 p-4 rounded text-xs text-muted-foreground mb-4">
                <strong>主旨：</strong>【In-Between Days】{subject || "（未填寫主旨）"}
              </div>

              <div className="border border-border p-6 bg-white text-[#3a3a3a] font-serif rounded space-y-4">
                <div className="border-b border-gray-200 pb-3 text-xs text-gray-500 uppercase tracking-widest">
                  In-Between Days Newsletter
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-gray-800">
                  {content || "（尚未填寫內容）"}
                </div>
                <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-500 text-center space-y-1">
                  <p>親愛的讀者，您收到這封信是因為您曾訂閱 In-Between Days 的網站更新。</p>
                  <p>
                    <a href="#unsub" className="text-gray-600 underline">取消訂閱</a>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="bg-foreground text-background px-5 py-2 text-xs tracking-wider"
                >
                  返回修改
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
