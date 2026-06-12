import { useState } from "react";
import { BookOpen, CheckCircle, Mail, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { Booklet } from "../../../drizzle/schema";

// ── Single booklet subscription form ─────────────────────────────────────────
function BookletForm({ booklet }: { booklet: Booklet }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailWasSent, setEmailWasSent] = useState(false);

  const subscribe = trpc.booklets.subscribe.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setEmailWasSent(data.emailSent);
    },
    onError: (err) => {
      toast.error("訂閱失敗，請稍後再試。" + (err.message ? ` (${err.message})` : ""));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    subscribe.mutate({ name: name.trim(), email: email.trim(), bookletSlug: booklet.slug });
  };

  if (submitted) {
    return (
      <div className="text-center py-16 animate-fade-up">
        <CheckCircle size={36} className="mx-auto mb-6 text-muted-foreground" />
        <h3 className="font-serif text-xl font-light mb-4">感謝你的訂閱</h3>
        {emailWasSent ? (
          <>
            <p className="text-muted-foreground leading-relaxed mb-2">
              《{booklet.title}》已寄送至 <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground/70">若未收到，請檢查垃圾郵件資料夾。</p>
          </>
        ) : (
          <>
            <p className="text-muted-foreground leading-relaxed mb-2">
              感謝你的訂閱！目前小冊子尚在準備中。
            </p>
            <p className="text-sm text-muted-foreground/70">
              準備好後，將寄送至 <strong>{email}</strong>。
            </p>
          </>
        )}
        <div className="divider mx-auto mt-8" />
        <p className="text-label mt-6">In-Between Days・間隙裡的日常</p>
      </div>
    );
  }

  return (
    <div>
      {/* Booklet info */}
      <div className="mb-10">
        <p className="font-serif text-lg font-light leading-loose text-muted-foreground mb-4">
          {booklet.description ?? "精心整理的旅行指南，收錄行程規劃、在地推薦與旅行心得。"}
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { icon: BookOpen, title: "精選行程", desc: "手工整理的旅行路線與時間規劃" },
          { icon: Mail, title: "即時寄送", desc: "填寫完成後立即寄送至你的信箱" },
          { icon: CheckCircle, title: "完全免費", desc: "無需付費，無廣告，純粹分享" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col gap-3">
            <Icon size={18} className="text-muted-foreground" />
            <p className="font-serif text-sm font-light">{title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="divider mb-10" />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <label className="text-label block mb-2">姓名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="你的名字"
            required
            className="w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-foreground transition-colors duration-200 placeholder:text-muted-foreground/50"
          />
        </div>
        <div>
          <label className="text-label block mb-2">電子郵件</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-foreground transition-colors duration-200 placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="pt-4">
          <button
            type="submit"
            disabled={subscribe.isPending}
            className="btn-filled disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {subscribe.isPending ? "寄送中..." : `領取《${booklet.title}》`}
          </button>
        </div>
        <p className="text-[0.65rem] text-muted-foreground/60 tracking-wide">
          你的資料僅用於寄送小冊子，不會用於任何商業用途。
        </p>
      </form>
    </div>
  );
}

// ── Main Booklet page ─────────────────────────────────────────────────────────
export default function Booklet() {
  const { data: booklets, isLoading } = trpc.booklets.publicList.useQuery();
  const [activeIdx, setActiveIdx] = useState(0);

  const activeBooklet = booklets?.[activeIdx];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-64 md:h-80 flex items-end overflow-hidden">
        <img
          key={activeBooklet?.coverUrl ?? "default"}
          src={
            activeBooklet?.coverUrl ??
            "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=1800&q=80&auto=format&fit=crop"
          }
          alt="旅遊小冊子"
          className="absolute inset-0 w-full h-full object-cover img-travel transition-opacity duration-500"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 container pb-8">
          <p className="text-label text-white/60 mb-2">Free Booklet</p>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-white tracking-wider">
            免費旅遊小冊子
          </h1>
        </div>
      </section>

      {/* Tab nav + content */}
      <section className="section">
        <div className="container-narrow">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-8 bg-muted animate-pulse" />)}
            </div>
          ) : !booklets || booklets.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-serif text-lg font-light text-muted-foreground">
                小冊子準備中，敬請期待。
              </p>
            </div>
          ) : (
            <>
              {/* Tab bar */}
              <div className="flex gap-0 border-b border-border mb-12 overflow-x-auto">
                {booklets.map((b, i) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveIdx(i)}
                    className={[
                      "flex items-center gap-2 px-5 py-3.5 text-xs tracking-widest uppercase whitespace-nowrap transition-all duration-200 border-b-2 -mb-px",
                      i === activeIdx
                        ? "border-foreground text-foreground font-medium"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                    ].join(" ")}
                  >
                    {b.title}
                    {i === activeIdx && <ChevronRight size={10} className="opacity-60" />}
                  </button>
                ))}
              </div>

              {/* Active booklet content */}
              {activeBooklet && (
                <div key={activeBooklet.id} className="animate-fade-up">
                  {/* Booklet header */}
                  <div className="flex gap-6 mb-10">
                    {activeBooklet.coverUrl && (
                      <img
                        src={activeBooklet.coverUrl}
                        alt={activeBooklet.title}
                        className="w-24 md:w-32 flex-shrink-0 object-cover img-travel self-start"
                        style={{ aspectRatio: "3/4" }}
                      />
                    )}
                    <div>
                      <p className="text-label mb-2">No.{activeIdx + 1}</p>
                      <h2 className="font-serif text-2xl md:text-3xl font-light mb-3 tracking-wide">
                        {activeBooklet.title}
                      </h2>
                      <div className="divider" />
                    </div>
                  </div>

                  <BookletForm booklet={activeBooklet} />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
