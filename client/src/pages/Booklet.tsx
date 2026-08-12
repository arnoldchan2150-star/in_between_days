import { useRef, useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Download, BookOpen, ExternalLink, ArrowLeft, Eye, MapPin, Route } from "lucide-react";

const BOOKLET_META: Record<string, { destination: string; journey: string; format: string }> = {
  "mt-kinabalu-guide": {
    destination: "沙巴・馬來西亞",
    journey: "登山指南",
    format: "PDF 小冊子",
  },
  "kumano-kodo-nakahechi": {
    destination: "和歌山・日本",
    journey: "6 日 7 夜",
    format: "互動指南",
  },
};

function getBookletMeta(slug: string, hasEmbed: boolean) {
  return BOOKLET_META[slug] ?? {
    destination: "旅行目的地",
    journey: "實用指南",
    format: hasEmbed ? "互動指南" : "PDF 小冊子",
  };
}

export default function Booklet() {
  const { data: booklets, isLoading } = trpc.booklets.publicList.useQuery();
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [embedOpen, setEmbedOpen] = useState(false);

  // 動態計算 iframe 高度
  const headerRef = useRef<HTMLDivElement>(null);
  const [iframeHeight, setIframeHeight] = useState("calc(100dvh - 113px)");

  useEffect(() => {
    if (!embedOpen) return;
    const updateHeight = () => {
      if (headerRef.current) {
        const h = headerRef.current.getBoundingClientRect().bottom;
        setIframeHeight(`calc(100dvh - ${h}px)`);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [embedOpen]);

  // 切換 tab 時關閉 embed
  const handleTabChange = (i: number) => {
    setActiveTab(i);
    setEmbedOpen(false);
  };

  const subscribe = trpc.booklets.subscribe.useMutation({
    onSuccess: () => {
      const slug = booklets?.[activeTab]?.slug ?? "";
      setSubmitted((prev) => ({ ...prev, [slug]: true }));
      setForm({ name: "", email: "" });
      toast.success("訂閱成功！小冊子已寄送至您的信箱。");
    },
    onError: (err) => {
      toast.error(err.message || "訂閱失敗，請稍後再試");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitting(true);
    try {
      await subscribe.mutateAsync({
        name: form.name,
        email: form.email,
        bookletSlug: booklets?.[activeTab]?.slug,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const activeBooklet = booklets?.[activeTab];
  const isSubmitted = activeBooklet ? submitted[activeBooklet.slug] : false;
  const activeMeta = activeBooklet
    ? getBookletMeta(activeBooklet.slug, Boolean(activeBooklet.embedUrl))
    : null;

  // ── 全螢幕 iframe 模式 ───────────────────────────────────────────────────
  if (embedOpen && activeBooklet?.embedUrl) {
    return (
      <div style={{ height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div ref={headerRef} style={{ flexShrink: 0 }}>
          <Navbar />
          {/* 資訊列 */}
          <div className="border-b border-border bg-background">
            <div className="container py-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setEmbedOpen(false)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={12} /> 返回小冊子
                </button>
                <span className="text-muted-foreground/30 text-xs">|</span>
                <span className="font-serif text-sm font-light text-foreground hidden sm:block truncate max-w-xs">
                  {activeBooklet.title}
                </span>
              </div>
              <a
                href={activeBooklet.embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border px-3 py-1.5 hover:border-foreground/40 whitespace-nowrap"
              >
                <ExternalLink size={11} />
                在新分頁開啟
              </a>
            </div>
          </div>
        </div>

        <iframe
          src={activeBooklet.embedUrl}
          title={activeBooklet.title}
          style={{
            width: "100%",
            height: iframeHeight,
            border: "none",
            display: "block",
            flexShrink: 0,
          }}
          allow="fullscreen"
          loading="lazy"
        />
      </div>
    );
  }

  // ── 一般頁面模式 ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 bg-background border-b border-border">
        <div className="container">
          <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">
            Travel Booklets
          </p>
          <h1 className="font-serif text-3xl font-light">旅遊小冊子</h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg leading-relaxed">
            精心整理的旅行指南，收錄行程規劃、在地推薦與旅行心得。
            留下你的信箱，即刻免費寄送 PDF。
          </p>
        </div>
      </section>

      {/* Tabs */}
      {isLoading ? (
        <div className="container py-16">
          <div className="flex gap-6 mb-10">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="aspect-[4/5]" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full mt-8" />
            </div>
          </div>
        </div>
      ) : booklets && booklets.length > 0 ? (
        <section className="flex-1 py-16 bg-background">
          <div className="container">
            {/* Tab buttons */}
            <div className="flex gap-0 border-b border-border mb-12">
              {booklets.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => handleTabChange(i)}
                  className={`px-6 py-3 text-xs tracking-[0.12em] border-b-2 transition-colors -mb-px ${
                    activeTab === i
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {b.title}
                </button>
              ))}
            </div>

            {activeBooklet && (
              <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Cover */}
                <div className="aspect-[4/5] overflow-hidden bg-muted relative group">
                  {activeBooklet.coverUrl ? (
                    <>
                      <img
                        src={activeBooklet.coverUrl}
                        alt={activeBooklet.title}
                        className="w-full h-full object-cover"
                      />
                      {/* 若有 embedUrl，封面上顯示預覽按鈕 */}
                      {activeBooklet.embedUrl && (
                        <button
                          onClick={() => setEmbedOpen(true)}
                          className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors"
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-background/90 text-foreground text-xs tracking-widest px-5 py-3 border border-border">
                            <Eye size={13} /> 預覽互動指南
                          </span>
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <BookOpen size={48} className="text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info + Form */}
                <div>
                  <h2 className="font-serif text-2xl font-light mb-4">
                    {activeBooklet.title}
                  </h2>

                  {activeMeta && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs text-muted-foreground">
                        <MapPin size={12} /> {activeMeta.destination}
                      </span>
                      <span className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs text-muted-foreground">
                        <Route size={12} /> {activeMeta.journey}
                      </span>
                      <span className="inline-flex items-center border border-border px-3 py-1.5 text-xs text-muted-foreground">
                        {activeMeta.format}
                      </span>
                    </div>
                  )}
                  {activeBooklet.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {activeBooklet.description}
                    </p>
                  )}

                  {/* 主要操作與次要連結 */}
                  {activeBooklet.embedUrl && (
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      <button
                        onClick={() => setEmbedOpen(true)}
                        className="inline-flex items-center gap-2 bg-foreground text-background text-xs tracking-widest px-5 py-3 hover:bg-foreground/80 transition-colors"
                      >
                        <Eye size={13} />
                        開啟互動式旅遊指南
                      </button>
                      <a
                        href={activeBooklet.embedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                      >
                        <ExternalLink size={12} />
                        在新分頁開啟
                      </a>
                    </div>
                  )}

                  <div className="bg-secondary/30 border border-border p-6">
                    {isSubmitted ? (
                      <div className="text-center py-4">
                        <Download size={32} className="text-muted-foreground mx-auto mb-3" />
                        <p className="font-serif text-lg font-light mb-1">
                          小冊子已寄出！
                        </p>
                        <p className="text-sm text-muted-foreground">
                          請檢查您的信箱，PDF 已寄送至您填寫的地址。
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-muted-foreground tracking-wider mb-4">
                          免費領取 PDF 小冊子
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">
                              您的姓名
                            </label>
                            <input
                              type="text"
                              value={form.name}
                              onChange={(e) =>
                                setForm((f) => ({ ...f, name: e.target.value }))
                              }
                              placeholder="請輸入姓名"
                              required
                              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">
                              電子信箱
                            </label>
                            <input
                              type="email"
                              value={form.email}
                              onChange={(e) =>
                                setForm((f) => ({ ...f, email: e.target.value }))
                              }
                              placeholder="your@email.com"
                              required
                              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-foreground text-background py-3 text-xs tracking-widest hover:bg-foreground/80 transition-colors disabled:opacity-50"
                          >
                            {submitting ? "寄送中..." : "立即免費領取"}
                          </button>
                          <p className="text-xs text-muted-foreground/60 text-center">
                            您的信箱不會被用於任何商業用途
                          </p>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="flex-1 py-24 bg-background">
          <div className="container text-center">
            <BookOpen size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="font-serif text-xl text-muted-foreground font-light mb-2">
              旅遊小冊子即將上線
            </p>
            <p className="text-sm text-muted-foreground">
              精心整理中，敬請期待
            </p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
