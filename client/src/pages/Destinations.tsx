import { useEffect, useMemo, useState } from "react";
import { Link, useSearch } from "wouter";
import { Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["全部", "南美", "中東", "亞洲", "歐洲", "中亞", "東南亞"];

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=70&auto=format&fit=crop",
];

export default function Destinations() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCat = params.get("cat") ?? "全部";
  const [activeCategory, setActiveCategory] = useState(initialCat);

  useEffect(() => {
    const p = new URLSearchParams(search);
    const cat = p.get("cat") ?? "全部";
    setActiveCategory(cat);
  }, [search]);

  // 混合展示 travel 和 culture 類型的文章
  const [searchQuery, setSearchQuery] = useState("");
  const { data: posts, isLoading } = trpc.posts.list.useQuery({
    category: activeCategory === "全部" ? undefined : activeCategory,
  });

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return posts ?? [];
    return (posts ?? []).filter((post) =>
      [post.title, post.excerpt, post.category].some((value) => value?.toLowerCase().includes(query))
    );
  }, [posts, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 bg-background border-b border-border">
        <div className="container">
          <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">
            Destinations & Journeys
          </p>
          <h1 className="font-serif text-3xl font-light">目的地遊記</h1>
          <p className="text-sm text-muted-foreground mt-3">
            探索世界各地的旅行故事與文化發現
          </p>
        </div>
      </section>

      {/* Search & Category Filter */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container py-4 space-y-4">
          <label className="relative block max-w-xl">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="搜尋目的地、標題或旅行故事..."
              aria-label="搜尋目的地遊記"
              className="w-full border border-border bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </label>
          <div className="flex gap-6 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs tracking-[0.12em] whitespace-nowrap pb-1 transition-colors border-b ${
                  activeCategory === cat
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
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
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/destinations/${post.slug}`}
                >
                  <article className="group cursor-pointer">
                    <div className="aspect-[4/3] overflow-hidden mb-4 bg-muted">
                      <img
                        src={post.coverImageUrl || FALLBACK_IMGS[i % FALLBACK_IMGS.length]}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs text-muted-foreground tracking-widest">
                        {post.category}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {post.type === "travel" ? "🗺️ 遊記" : "📚 靈感"}
                      </span>
                    </div>
                    <h2 className="font-serif text-lg font-light group-hover:text-muted-foreground transition-colors">
                      {post.title}
                    </h2>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="font-serif text-xl text-muted-foreground font-light mb-2">
                {searchQuery.trim()
                  ? "未找到相符的旅行故事"
                  : activeCategory !== "全部"
                    ? `尚無「${activeCategory}」的故事`
                    : "故事即將上線"}
              </p>
              <p className="text-sm text-muted-foreground">{searchQuery.trim() ? "請嘗試其他搜尋詞" : "內容正在整理中，敬請期待"}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
