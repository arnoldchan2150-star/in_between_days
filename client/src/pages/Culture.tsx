import { Link } from "wouter";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { CULTURE_TOPICS, CultureTopic, getCultureTopic, matchesPostSearch } from "@shared/postFilters";

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=800&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=70&auto=format&fit=crop",
];

export default function Culture() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<CultureTopic>("全部");
  const { data: posts, isLoading } = trpc.posts.list.useQuery({ type: "culture" });
  const filteredPosts = useMemo(() => {
    return (posts ?? []).filter((post) => {
      const matchesTopic = activeTopic === "全部" || getCultureTopic(post.title) === activeTopic;
      return matchesTopic && matchesPostSearch(post, searchQuery);
    });
  }, [activeTopic, posts, searchQuery]);
  const hasActiveFilters = Boolean(searchQuery.trim()) || activeTopic !== "全部";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 bg-background border-b border-border">
        <div className="container">
          <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">
            Culture
          </p>
          <h1 className="font-serif text-3xl font-light">靈感拾光</h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg leading-relaxed">
            有時候，我只想用一本書、一部電影、一杯咖啡、一個情節去記住一個地方。
            記不起，記得起，不過是我旅途中的一些小小碎片。
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container py-4">
          <label className="relative block max-w-xl">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="搜尋標題、摘要、內文、地點或分類..."
              aria-label="搜尋靈感拾光的標題、摘要、內文、地點或分類"
              className="w-full border border-border bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </label>
          <div className="flex gap-2 overflow-x-auto pt-4" role="tablist" aria-label="靈感文章主題">
            {CULTURE_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                role="tab"
                aria-selected={activeTopic === topic}
                onClick={() => setActiveTopic(topic)}
                className={`whitespace-nowrap border px-3 py-1.5 text-xs tracking-[0.12em] transition-colors ${
                  activeTopic === topic
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="flex-1 py-16 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-6">
                  <Skeleton className="w-32 h-44 flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredPosts.map((post, i) => (
                <Link key={post.id} href={`/culture/${post.slug}`}>
                  <article className="group cursor-pointer flex gap-6">
                    <div className="w-32 h-44 flex-shrink-0 overflow-hidden bg-muted">
                      <img
                        src={post.coverImageUrl || FALLBACK_IMGS[i % FALLBACK_IMGS.length]}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="border border-foreground/30 px-2 py-0.5 text-[10px] tracking-wider text-foreground">
                          {getCultureTopic(post.title)}
                        </span>
                        <span className="text-xs text-muted-foreground tracking-widest">
                          {post.category}
                        </span>
                      </div>
                      <h2 className="font-serif text-lg font-light mb-2 group-hover:text-muted-foreground transition-colors leading-snug">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      {post.publishedAt && (
                        <p className="text-xs text-muted-foreground/60 mt-3">
                          {new Date(post.publishedAt).toLocaleDateString("zh-TW", {
                            year: "numeric",
                            month: "long",
                          })}
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
                {hasActiveFilters ? "未找到相符的靈感文章" : "靈感拾光即將上線"}
              </p>
                <p className="text-sm text-muted-foreground">
                {hasActiveFilters ? "請嘗試其他搜尋詞或切換主題" : "電影與書籍的旅行筆記正在整理中，敬請期待"}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
