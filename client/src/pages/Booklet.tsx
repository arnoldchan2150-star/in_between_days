import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearch } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Download, ExternalLink, ArrowLeft, Eye, MapPin, Route, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";

const BOOKLET_META: Record<string, { destination: string; journey: string; format: string }> = {
  "mt-kinabalu-guide": {
    destination: "沙巴・馬來西亞",
    journey: "登山指南",
    format: "網頁",
  },
  "kumano-kodo-nakahechi": {
    destination: "和歌山・日本",
    journey: "6 日 7 夜",
    format: "網頁",
  },
};

function getBookletMeta(slug: string, hasEmbed: boolean) {
  return BOOKLET_META[slug] ?? {
    destination: "旅行目的地",
    journey: "實用指南",
    format: hasEmbed ? "網頁" : "PDF 指南",
  };
}

export default function Booklet() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { data: booklets, isLoading } = trpc.booklets.publicList.useQuery();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookletId, setSelectedBookletId] = useState<number | null>(null);
  const [embedOpen, setEmbedOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [iframeHeight, setIframeHeight] = useState("calc(100dvh - 113px)");

  const filteredBooklets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return (booklets ?? []).filter((booklet) => {
      const meta = getBookletMeta(booklet.slug, Boolean(booklet.embedUrl));
      const matchesFilter = activeFilter === "all" || booklet.slug === activeFilter;
      const matchesSearch = !query || [booklet.title, booklet.description, meta.destination, meta.journey, meta.format]
        .some((value) => value?.toLowerCase().includes(query));
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, booklets, searchQuery]);

  const selectedBooklet = booklets?.find((booklet) => booklet.id === selectedBookletId);

  useEffect(() => {
    const guideSlug = new URLSearchParams(search).get("guide");
    if (!guideSlug) {
      setEmbedOpen(false);
      return;
    }
    const guide = booklets?.find((booklet) => booklet.slug === guideSlug);
    if (guide?.embedUrl) {
      setSelectedBookletId(guide.id);
      setEmbedOpen(true);
    }
  }, [booklets, search]);

  useEffect(() => {
    if (!embedOpen) return;
    const updateHeight = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.getBoundingClientRect().bottom;
        setIframeHeight(`calc(100dvh - ${headerHeight}px)`);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [embedOpen]);

  const openInteractiveGuide = (id: number) => {
    const booklet = booklets?.find((item) => item.id === id);
    if (!booklet?.embedUrl) return;
    setSelectedBookletId(id);
    setEmbedOpen(true);
    setLocation(`/booklet?guide=${encodeURIComponent(booklet.slug)}`);
  };

  if (embedOpen && selectedBooklet?.embedUrl) {
    return (
      <div style={{ height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div ref={headerRef} style={{ flexShrink: 0 }}>
          <Navbar />
          <div className="border-b border-border bg-background">
            <div className="container py-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-4 min-w-0">
                <a
                  href="/booklet"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  <ArrowLeft size={12} /> 返回行旅資料庫
                </a>
                <span className="text-muted-foreground/30 text-xs">|</span>
                <span className="font-serif text-sm font-light text-foreground truncate max-w-xs">
                  {selectedBooklet.title}
                </span>
              </div>
              <a
                href={selectedBooklet.embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border px-3 py-1.5 hover:border-foreground/40 whitespace-nowrap"
              >
                <ExternalLink size={11} /> 在新分頁開啟
              </a>
            </div>
          </div>
        </div>
        <iframe
          src={selectedBooklet.embedUrl}
          title={selectedBooklet.title}
          style={{ width: "100%", height: iframeHeight, border: "none", display: "block", flexShrink: 0 }}
          allow="fullscreen"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="pt-32 pb-12 bg-background border-b border-border">
        <div className="container">
          <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">Travel Database</p>
          <h1 className="font-serif text-3xl font-light">行旅資料庫</h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-xl leading-relaxed">
            以目的地為索引，整理可直接閱讀的互動網頁與可下載的旅行指南，讓每一段旅程都能慢慢被帶走。
          </p>
        </div>
      </section>

      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container py-4 space-y-4">
          <label className="relative block max-w-xl">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="搜尋目的地、指南或旅程關鍵字..."
              aria-label="搜尋行旅資料庫"
              className="w-full border border-border bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </label>
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={`text-xs tracking-[0.12em] whitespace-nowrap pb-1 border-b transition-colors ${activeFilter === "all" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              全部指南
            </button>
            {(booklets ?? []).map((booklet) => (
              <button
                key={booklet.id}
                onClick={() => setActiveFilter(booklet.slug)}
                className={`text-xs tracking-[0.12em] whitespace-nowrap pb-1 border-b transition-colors ${activeFilter === booklet.slug ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                {booklet.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="flex-1 py-16 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="aspect-[4/5] mb-5" />
                  <Skeleton className="h-5 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-10 w-32 mt-4" />
                </div>
              ))}
            </div>
          ) : filteredBooklets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {filteredBooklets.map((booklet) => {
                const meta = getBookletMeta(booklet.slug, Boolean(booklet.embedUrl));
                const isInteractive = Boolean(booklet.embedUrl);
                return (
                  <article
                    key={booklet.id}
                    className={`group ${isInteractive ? "cursor-pointer" : ""}`}
                    onClick={() => isInteractive && openInteractiveGuide(booklet.id)}
                    onKeyDown={(event) => {
                      if (isInteractive && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        openInteractiveGuide(booklet.id);
                      }
                    }}
                    role={isInteractive ? "button" : undefined}
                    tabIndex={isInteractive ? 0 : undefined}
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-muted mb-5 relative">
                      {booklet.coverUrl ? (
                        <img src={booklet.coverUrl} alt={booklet.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary">
                          <BookOpen size={42} className="text-muted-foreground" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-background/90 border border-border px-2.5 py-1 text-[11px] tracking-wider text-foreground">
                        {meta.format}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                        <MapPin size={11} /> {meta.destination}
                      </span>
                      <span className="inline-flex items-center gap-1 border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                        <Route size={11} /> {meta.journey}
                      </span>
                    </div>

                    <h2 className="font-serif text-xl font-light leading-snug group-hover:text-muted-foreground transition-colors">
                      {booklet.title}
                    </h2>
                    {booklet.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mt-3">{booklet.description}</p>
                    )}

                    <div className="flex items-center gap-4 mt-5" onClick={(event) => event.stopPropagation()}>
                      {isInteractive ? (
                        <button
                          onClick={() => openInteractiveGuide(booklet.id)}
                          className="inline-flex items-center gap-2 bg-foreground text-background text-xs tracking-wider px-4 py-2.5 hover:bg-foreground/80 transition-colors"
                        >
                          <Eye size={13} /> 開啟互動指南
                        </button>
                      ) : booklet.fileUrl ? (
                        <a
                          href={booklet.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-foreground text-background text-xs tracking-wider px-4 py-2.5 hover:bg-foreground/80 transition-colors"
                        >
                          <Download size={13} /> 下載 PDF
                        </a>
                      ) : null}
                      {isInteractive && booklet.embedUrl && (
                        <a
                          href={booklet.embedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                        >
                          <ExternalLink size={12} /> 新分頁開啟
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24">
              <BookOpen size={42} className="text-muted-foreground mx-auto mb-4" />
              <p className="font-serif text-xl text-muted-foreground font-light mb-2">未找到相符的指南</p>
              <p className="text-sm text-muted-foreground">請嘗試其他目的地或關鍵字</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
