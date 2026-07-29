import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1551632786-de41ec16a83a?w=800&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551727747-da9ff2d541d7?w=800&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542401886-65d27afda266?w=800&q=70&auto=format&fit=crop",
];

export default function Snow() {
  const [filterType, setFilterType] = useState<"all" | "video" | "article">("all");

  const { data: posts, isLoading } = trpc.posts.list.useQuery({
    type: "snow",
  });

  const filteredPosts = posts?.filter((post) => {
    if (filterType === "all") return true;
    if (filterType === "video") return !!post.embedUrl;
    if (filterType === "article") return !post.embedUrl;
    return true;
  }) ?? [];

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
            探索冬季滑雪的精彩時刻與故事
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container">
          <div className="flex gap-6 py-4">
            <button
              onClick={() => setFilterType("all")}
              className={`text-xs tracking-[0.12em] whitespace-nowrap pb-1 transition-colors border-b ${
                filterType === "all"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterType("video")}
              className={`text-xs tracking-[0.12em] whitespace-nowrap pb-1 transition-colors border-b ${
                filterType === "video"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              影片
            </button>
            <button
              onClick={() => setFilterType("article")}
              className={`text-xs tracking-[0.12em] whitespace-nowrap pb-1 transition-colors border-b ${
                filterType === "article"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              文章
            </button>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="flex-1 py-16 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <Skeleton className="aspect-video" />
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="space-y-16">
              {filteredPosts.map((post, i) => (
                <Link key={post.id} href={`/snow/${post.slug}`}>
                  <article className="group cursor-pointer grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Left: Image or Video */}
                    <div className="order-2 md:order-1">
                      {post.embedUrl ? (
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
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video overflow-hidden bg-muted rounded-sm">
                          <img
                            src={post.coverImageUrl || FALLBACK_IMGS[i % FALLBACK_IMGS.length]}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      )}
                    </div>

                    {/* Right: Text */}
                    <div className="order-1 md:order-2">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-xs text-muted-foreground tracking-widest">
                          {post.category}
                        </p>
                        {post.embedUrl && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                            影片
                          </span>
                        )}
                      </div>
                      <h2 className="font-serif text-2xl font-light group-hover:text-muted-foreground transition-colors mb-3">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="font-serif text-xl text-muted-foreground font-light mb-2">
                {filterType !== "all"
                  ? `尚無${filterType === "video" ? "影片" : "文章"}內容`
                  : "雪季映像即將上線"}
              </p>
              <p className="text-sm text-muted-foreground">敬請期待精彩的滑雪故事</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
