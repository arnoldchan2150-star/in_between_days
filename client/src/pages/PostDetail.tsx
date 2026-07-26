import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, MapPin, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

type MediaItem = {
  id: number;
  url: string;
  caption?: string | null;
  sortOrder: number;
  mediaType?: "image" | "video";
};

// ── Lightbox Component ────────────────────────────────────────────────────────
function Lightbox({
  items,
  initialIndex,
  onClose,
}: {
  items: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);

  const prev = useCallback(() => setCurrent((i) => (i - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % items.length), [items.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const item = items[current];
  if (!item) return null;

  const isVideo = item.mediaType === "video";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-xs tracking-widest">
        {current + 1} / {items.length}
      </div>

      {/* Prev */}
      {items.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 p-2"
          onClick={(e) => { e.stopPropagation(); prev(); }}
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* Media */}
      <div
        className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            src={item.url}
            controls
            autoPlay
            className="max-w-full max-h-[75vh] object-contain bg-black"
            style={{ maxWidth: "90vw" }}
          />
        ) : (
          <img
            src={item.url}
            alt={item.caption ?? `照片 ${current + 1}`}
            className="max-w-full max-h-[75vh] object-contain select-none"
            draggable={false}
          />
        )}
        {item.caption && (
          <p className="text-white/60 text-sm mt-3 text-center max-w-lg px-4">
            {item.caption}
          </p>
        )}
      </div>

      {/* Next */}
      {items.length > 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 p-2"
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          <ChevronRight size={32} />
        </button>
      )}

      {/* Thumbnail strip */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 max-w-[90vw] overflow-x-auto px-2">
          {items.map((m, i) => (
            <button
              key={m.id}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`flex-shrink-0 w-12 h-9 overflow-hidden transition-opacity relative ${
                i === current ? "opacity-100 ring-1 ring-white" : "opacity-40 hover:opacity-70"
              }`}
            >
              {m.mediaType === "video" ? (
                <div className="w-full h-full bg-black/60 flex items-center justify-center">
                  <Play size={14} className="text-white fill-white" />
                </div>
              ) : (
                <img src={m.url} alt="" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PostDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";

  const { data: post, isLoading, error } = trpc.posts.bySlug.useQuery({ slug }, { enabled: !!slug });

  const headerRef = useRef<HTMLDivElement>(null);
  const [iframeHeight, setIframeHeight] = useState("calc(100vh - 113px)");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!post?.embedUrl) return;
    const updateHeight = () => {
      if (headerRef.current) {
        const h = headerRef.current.getBoundingClientRect().bottom;
        setIframeHeight(`calc(100dvh - ${h}px)`);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [post?.embedUrl]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-24 container py-12 max-w-3xl mx-auto">
          <Skeleton className="h-4 w-24 mb-8" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <Skeleton className="aspect-video mb-8" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="font-serif text-xl text-muted-foreground mb-4">找不到這篇文章</p>
            <Link href="/journal">
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1 justify-center">
                <ArrowLeft size={14} /> 返回遊記列表
              </span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const mediaItems: MediaItem[] = (post.media ?? []) as MediaItem[];
  const sortedMedia = [...mediaItems].sort((a, b) => a.sortOrder - b.sortOrder);

  // Separate photos and videos
  const photoItems = sortedMedia.filter((m) => (m.mediaType ?? "image") === "image");
  const videoItems = sortedMedia.filter((m) => m.mediaType === "video");

  // All lightbox items: photos only (videos have inline player)
  const lightboxItems = photoItems;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Image */}
      {post.coverImageUrl && (
        <div className="relative h-[60vh] min-h-[400px]">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <article className={`flex-1 bg-background ${post.coverImageUrl ? "" : "pt-24"}`}>
        <div className="container max-w-3xl mx-auto py-12">
          <Link href="/journal">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-8">
              <ArrowLeft size={12} /> 返回遊記
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-xs text-muted-foreground tracking-widest flex items-center gap-1">
              <MapPin size={11} /> {post.category}
            </span>
            {post.publishedAt && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar size={11} />
                {new Date(post.publishedAt).toLocaleDateString("zh-TW", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>

          {/* ── Embedded Video (YouTube / iframe) ── */}
          {post.embedUrl && (
            <div className="mb-12">
              <div className="aspect-video bg-muted overflow-hidden rounded-sm">
                <iframe
                  src={post.embedUrl}
                  title={post.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* ── Uploaded Videos (native player) ── */}
          {videoItems.length > 0 && (
            <div className="mb-12 space-y-6">
              {videoItems.map((v, idx) => (
                <div key={v.id}>
                  <div className="aspect-video bg-black overflow-hidden rounded-sm">
                    <video
                      src={v.url}
                      controls
                      className="w-full h-full object-contain"
                      preload="metadata"
                      playsInline
                    />
                  </div>
                  {v.caption && (
                    <p className="text-xs text-muted-foreground mt-2 text-center italic">
                      {v.caption}
                    </p>
                  )}
                  {videoItems.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      影片 {idx + 1} / {videoItems.length}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <h1 className="font-serif text-3xl md:text-4xl font-light mb-4 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-muted-foreground text-base leading-relaxed mb-8 border-l-2 border-border pl-4 italic">
              {post.excerpt}
            </p>
          )}

          <hr className="border-border mb-8" />

          <div
            className="prose-travel"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }}
          />

          {/* ── Photo Gallery ── */}
          {photoItems.length > 0 && (
            <div className="mt-14">
              <div className="flex items-center gap-3 mb-6">
                <hr className="flex-1 border-border" />
                <span className="font-serif text-sm text-muted-foreground tracking-widest">
                  旅行相簿
                </span>
                <hr className="flex-1 border-border" />
              </div>

              {/* Masonry-style grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {photoItems.map((m, idx) => (
                  <div
                    key={m.id}
                    className={`overflow-hidden cursor-zoom-in group relative ${
                      idx === 0 && photoItems.length >= 3 ? "col-span-2 md:col-span-1" : ""
                    }`}
                    onClick={() => setLightboxIndex(idx)}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={m.url}
                        alt={m.caption ?? `旅行照片 ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    {/* Caption overlay on hover */}
                    {m.caption && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                        <p className="text-white text-xs px-3 py-2 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          {m.caption}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mt-3 text-center">
                點擊照片放大 · 共 {photoItems.length} 張
              </p>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-border">
            <Link href="/journal">
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <ArrowLeft size={14} /> 更多旅行故事
              </span>
            </Link>
          </div>
        </div>
      </article>

      <Footer />

      {/* Lightbox (photos only) */}
      {lightboxIndex !== null && lightboxItems.length > 0 && (
        <Lightbox
          items={lightboxItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
