import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Download, BookOpen } from "lucide-react";

export default function Booklet() {
  const { data: booklets, isLoading } = trpc.booklets.publicList.useQuery();
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

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
            <Skeleton className="aspect-[3/4]" />
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
                  onClick={() => setActiveTab(i)}
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
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  {activeBooklet.coverUrl ? (
                    <img
                      src={activeBooklet.coverUrl}
                      alt={activeBooklet.title}
                      className="w-full h-full object-cover"
                    />
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
                  {activeBooklet.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                      {activeBooklet.description}
                    </p>
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
