import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, FileText } from "lucide-react";

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1551632786-de41ec16a82f?w=800&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551958219-acbc608c6c4d?w=800&q=70&auto=format&fit=crop",
];

export default function Snow() {
  const [filterType, setFilterType] = useState<"all" | "video" | "article">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 查詢所有 snow 類型的文章
  const { data: allPosts, isLoading } = trpc.posts.list.useQuery({
    type: "snow",
  });

  // 根據 embedUrl 判斷是否為影片
  const posts = allPosts || [];
  const videos = posts.filter((p) => p.embedUrl);
  const articles = posts.filter((p) => !p.embedUrl);

  // 篩選
  let filtered = posts;
  if (filterType === "video") {
    filtered = videos;
  } else if (filterType === "article") {
    filtered = articles;
  }

  // 搜尋
  if (searchQuery.trim()) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 bg-background border-b border-border">
        <div className="container">
          <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">
            Snow & Skiing
          </p>
          <h1 className="font-serif text-3xl font-light">雪季映像</h1>
          <p className="text-sm text-muted-foreground mt-3">
            探索滑雪的魅力，分享冬季冒險故事
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <input
              type="text"
              placeholder="搜尋內容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
            />

            {/* Filter */}
            <div className="flex gap-3">
              {[
                { value: "all", label: "全部" },
                { value: "video", label: `影片 (${videos.length})` },
                { value: "article", label: `文章 (${articles.length})` },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterType(filter.value as any)}
                  className={`text-xs tracking-[0.12em] px-3 py-1.5 border transition-colors ${
                    filterType === filter.value
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 py-16 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[4/3] mb-4" />
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-full mb-2" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post, i) => {
                const isVideo = !!post.embedUrl;
                return (
                  <Link key={post.id} href={`/snow/${post.slug}`}>
                    <article className="group cursor-pointer">
                      <div className="aspect-[4/3] overflow-hidden mb-4 bg-muted relative">
                        <img
                          src={post.coverImageUrl || FALLBACK_IMGS[i % FALLBACK_IMGS.length]}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Video badge */}
                        {isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                            <Play size={32} className="text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {isVideo ? (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Play size={12} /> 影片
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <FileText size={12} /> 文章
                          </span>
                        )}
                      </div>
                      <h2 className="font-serif text-lg font-light group-hover:text-muted-foreground transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </article>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="font-serif text-xl text-muted-foreground font-light mb-2">
                {searchQuery ? "未找到相符的內容" : "尚無雪季內容"}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "請嘗試其他搜尋詞" : "滑雪故事即將上線，敬請期待"}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
