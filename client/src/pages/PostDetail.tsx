import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, MapPin, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
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

type PostBlock = {
  id: number;
  blockType: "paragraph" | "image" | "heading" | "quote" | "video";
  content?: string | null;
  caption?: string | null;
  sortOrder: number;
};

function isVideoEmbedUrl(url?: string | null) {
  if (!url) return false;
  const normalized = url.toLowerCase();
  return (
    normalized.includes("youtube.com/") ||
    normalized.includes("youtube-nocookie.com/") ||
    normalized.includes("youtu.be/") ||
    normalized.includes("vimeo.com/")
  );
}

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

      {/* Image */}
      <div
        className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.url}
          alt={item.caption ?? `照片 ${current + 1}`}
          className="max-w-full max-h-[75vh] object-contain select-none"
          draggable={false}
        />
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
              className={`flex-shrink-0 w-12 h-9 overflow-hidden transition-opacity ${
                i === current ? "opacity-100 ring-1 ring-white" : "opacity-40 hover:opacity-70"
              }`}
            >
              <img src={m.url} alt="" className="w-full h-full object-cover" />
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

  const { data: relatedPosts } = trpc.posts.related.useQuery(
    { postId: post!.id, category: post!.category, type: post!.type, limit: 3 },
    { enabled: !!post?.id }
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!post) return;
    const prevTitle = document.title;
    const siteTitle = `${post.title} ｜ In-Between Days`;
    document.title = siteTitle;

    const descMeta = document.querySelector('meta[name="description"]');
    const prevDesc = descMeta?.getAttribute("content") ?? "";
    const description = post.excerpt || `${post.title} - In-Between Days 旅遊部落格`;
    if (descMeta) descMeta.setAttribute("content", description);

    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');

    if (ogTitle) ogTitle.setAttribute("content", siteTitle);
    if (ogDesc) ogDesc.setAttribute("content", description);
    if (ogImage && post.coverImageUrl) ogImage.setAttribute("content", post.coverImageUrl);
    if (ogUrl) ogUrl.setAttribute("content", window.location.href);

    // Article JSON-LD
    const jsonLdScript = document.createElement("script");
    jsonLdScript.type = "application/ld+json";
    jsonLdScript.id = "article-json-ld";
    jsonLdScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": description,
      "image": post.coverImageUrl || "",
      "datePublished": post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date(post.createdAt).toISOString(),
      "author": {
        "@type": "Person",
        "name": "In-Between Days"
      }
    });
    document.head.appendChild(jsonLdScript);

    return () => {
      document.title = prevTitle;
      if (descMeta) descMeta.setAttribute("content", prevDesc);
      const script = document.getElementById("article-json-ld");
      if (script) script.remove();
    };
  }, [post]);

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

  // 外部攻略 HTML 在文章詳細頁以全畫面 iframe 載入，不在文章內容區顯示框架。
  // 影片仍採一般文章模式，保留文章文字與嵌入播放器。
  const isHtmlEmbed = !!post.embedUrl && !isVideoEmbedUrl(post.embedUrl);
  if (isHtmlEmbed) {
    const isSnow = post.type === "snow";
    const isCulture = post.type === "culture";
    const backHref = isSnow ? "/snow" : isCulture ? "/culture" : "/destinations";
    const backLabel = isSnow ? "雪季映像" : isCulture ? "靈感拾光" : "目的地遊記";

    return (
      <div className="fixed inset-0 z-40 bg-background">
        <div className="absolute inset-x-0 top-0 z-10 pointer-events-none">
          <div className="pointer-events-auto flex items-center justify-between gap-4 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-md md:px-8">
            <Link href={backHref}>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <ArrowLeft size={13} /> 返回{backLabel}
              </span>
            </Link>
            <a
              href={post.embedUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink size={12} /> 在新分頁開啟
            </a>
          </div>
        </div>
        <iframe
          src={post.embedUrl ?? undefined}
          title={post.title}
          className="block h-[100dvh] w-full border-0"
          allow="fullscreen"
          loading="eager"
        />
      </div>
    );
  }

  // ── 一般文章模式 ─────────────────────────────────────────────────────────
  const mediaItems: MediaItem[] = (post.media ?? []) as MediaItem[];
  const sortedMedia = [...mediaItems].sort((a, b) => a.sortOrder - b.sortOrder);
  const imageMedia = sortedMedia.filter((item) => item.mediaType !== "video");
  const videoMedia = sortedMedia.filter((item) => item.mediaType === "video");
  const blocks = ([...(post.blocks ?? [])] as PostBlock[]).sort((a, b) => a.sortOrder - b.sortOrder);

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
        <div className="container max-w-[740px] mx-auto py-12 px-5 md:px-8">
          <Link href="/journal">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-8">
              <ArrowLeft size={13} /> 返回遊記
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

          <h1 className="font-serif text-3xl md:text-4xl font-light mb-4 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-muted-foreground text-base leading-relaxed mb-8 border-l-2 border-border pl-4 italic">
              {post.excerpt}
            </p>
          )}

          <hr className="border-border mb-8" />

          {blocks.length > 0 ? (
            <div className="space-y-10 md:space-y-12">
              {blocks.map((block) => {
                const content = block.content?.trim();
                if (!content) return null;

                if (block.blockType === "paragraph") {
                  return (
                    <p key={block.id} className="whitespace-pre-wrap font-serif text-[17px] leading-[2] text-foreground/90">
                      {content}
                    </p>
                  );
                }

                if (block.blockType === "heading") {
                  return (
                    <h2 key={block.id} className="font-serif text-2xl md:text-3xl font-light leading-tight pt-2">
                      {content}
                    </h2>
                  );
                }

                if (block.blockType === "quote") {
                  return (
                    <blockquote key={block.id} className="border-l-2 border-foreground/50 pl-5 md:pl-7 font-serif text-xl md:text-2xl italic leading-relaxed text-foreground/80">
                      {content}
                    </blockquote>
                  );
                }

                if (block.blockType === "image") {
                  return (
                    <figure key={block.id} className="my-10 md:-mx-6 lg:-mx-12">
                      <div className="overflow-hidden bg-muted rounded-sm">
                        <img src={content} alt={block.caption || post.title} className="block w-full max-h-[70vh] md:max-h-[760px] object-cover bg-muted w-full" loading="lazy" />
                      </div>
                      {block.caption && <figcaption className="mt-3 px-2 text-center text-xs leading-relaxed text-muted-foreground">{block.caption}</figcaption>}
                    </figure>
                  );
                }

                return (
                  <figure key={block.id} className="my-12">
                    <div className="aspect-video overflow-hidden bg-muted">
                      {isVideoEmbedUrl(content) ? (
                        <iframe
                          src={content}
                          title={block.caption || post.title}
                          className="h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <video src={content} controls preload="metadata" className="h-full w-full object-contain" />
                      )}
                    </div>
                    {block.caption && <figcaption className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">{block.caption}</figcaption>}
                  </figure>
                );
              })}
            </div>
          ) : (
            <div
              className="prose-travel"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }}
            />
          )}

          {/* ── Embedded Video ── */}
          {blocks.length === 0 && isVideoEmbedUrl(post.embedUrl) && (
            <div className="mt-14">
              <div className="flex items-center gap-3 mb-6">
                <hr className="flex-1 border-border" />
                <span className="font-serif text-sm text-muted-foreground tracking-widest">
                  影片
                </span>
                <hr className="flex-1 border-border" />
              </div>
              <div className="aspect-video bg-muted overflow-hidden rounded-sm">
                <iframe
                  src={post.embedUrl ?? undefined}
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

          {/* ── Self-hosted Video Gallery ── */}
          {blocks.length === 0 && videoMedia.length > 0 && (
            <div className="mt-14">
              <div className="flex items-center gap-3 mb-6">
                <hr className="flex-1 border-border" />
                <span className="font-serif text-sm text-muted-foreground tracking-widest">上傳影片</span>
                <hr className="flex-1 border-border" />
              </div>
              <div className="space-y-6">
                {videoMedia.map((video) => (
                  <div key={video.id} className="space-y-2">
                    <video
                      src={video.url}
                      controls
                      preload="metadata"
                      className="w-full aspect-video bg-muted rounded-sm"
                    />
                    {video.caption && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{video.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Photo Gallery ── */}
          {blocks.length === 0 && imageMedia.length > 0 && (
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
                {imageMedia.map((m, idx) => (
                  <div
                    key={m.id}
                    className={`overflow-hidden cursor-zoom-in group relative ${
                      // Make first photo span 2 columns if there are 3+ photos
                      idx === 0 && imageMedia.length >= 3 ? "col-span-2 md:col-span-1" : ""
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
                點擊照片放大 · 共 {imageMedia.length} 張
              </p>
            </div>
          )}

          {/* ── Related Posts Section ── */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-20 pt-12 border-t border-border">
              <div className="mb-8">
                <span className="font-serif text-sm tracking-widest text-muted-foreground uppercase">
                  Related Stories
                </span>
                <h3 className="font-serif text-2xl font-light mt-1 text-foreground">
                  延伸閱讀
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rel: any) => {
                  const relHref = rel.type === "snow" ? `/snow/${rel.slug}` : rel.type === "culture" ? `/culture/${rel.slug}` : `/journal/${rel.slug}`;
                  return (
                    <Link key={rel.id} href={relHref}>
                      <article className="group cursor-pointer flex flex-col h-full bg-secondary/10 border border-border/60 p-3 hover:border-foreground/30 transition-colors">
                        <div className="aspect-[4/3] overflow-hidden mb-3 bg-muted">
                          <img
                            src={rel.coverImageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"}
                            alt={rel.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex items-center gap-2 mb-1.5 text-xs text-muted-foreground">
                          <span>{rel.category}</span>
                          {rel.publishedAt && (
                            <>
                              <span>·</span>
                              <span className="font-mono">
                                {new Date(rel.publishedAt).toLocaleDateString("zh-TW", {
                                  year: "numeric",
                                  month: "2-digit",
                                })}
                              </span>
                            </>
                          )}
                        </div>
                        <h4 className="font-serif text-base font-light group-hover:text-muted-foreground transition-colors line-clamp-2 leading-snug">
                          {rel.title}
                        </h4>
                      </article>
                    </Link>
                  );
                })}
              </div>
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

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={imageMedia}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
