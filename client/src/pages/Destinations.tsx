import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
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

  const { data: posts, isLoading } = trpc.posts.list.useQuery({
    category: activeCategory === "全部" ? undefined : activeCategory,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 bg-background border-b border-border">
        <div className="container">
          <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">
            Destinations
          </p>
          <h1 className="font-serif text-3xl font-light">目的地遊記</h1>
          <p className="text-sm text-muted-foreground mt-3">
            探索世界各地的旅行故事與文化發現
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container">
          <div className="flex gap-6 overflow-x-auto py-4">
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
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <Link key={post.id} href={`/destinations/${post.slug}`}>
                  <article className="group cursor-pointer">
                    <div className="aspect-[4/3] overflow-hidden mb-4 bg-muted">
                      <img
                        src={post.coverImageUrl || FALLBACK_IMGS[i % FALLBACK_IMGS.length]}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground tracking-widest mb-2">
                      {post.category}
                    </p>
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
                {activeCategory !== "全部"
                  ? `尚無「${activeCategory}」的內容`
                  : "內容即將上線"}
              </p>
              <p className="text-sm text-muted-foreground">內容正在整理中，敬請期待</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
