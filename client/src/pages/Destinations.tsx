import { useState } from "react";
import { Link, useSearch } from "wouter";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";

const CATEGORIES = [
  { label: "南美", en: "South America", img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80&auto=format&fit=crop" },
  { label: "中東", en: "Middle East", img: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&q=80&auto=format&fit=crop" },
  { label: "亞洲", en: "Asia", img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80&auto=format&fit=crop" },
  { label: "歐洲", en: "Europe", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=80&auto=format&fit=crop" },
  { label: "中亞", en: "Central Asia", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80&auto=format&fit=crop" },
  { label: "東南亞", en: "Southeast Asia", img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80&auto=format&fit=crop" },
];

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=75&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=75&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=75&auto=format&fit=crop",
];

export default function Destinations() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCat = params.get("cat") ?? "";
  const [activeCategory, setActiveCategory] = useState(initialCat);

  const { data: posts, isLoading } = trpc.posts.list.useQuery(
    activeCategory ? { category: activeCategory } : {}
  );

  const activeCatInfo = CATEGORIES.find((c) => c.label === activeCategory);

  return (
    <Layout>
      {/* Hero banner when category selected */}
      {activeCatInfo ? (
        <section className="relative h-64 md:h-80 flex items-end">
          <img
            src={activeCatInfo.img}
            alt={activeCatInfo.label}
            className="absolute inset-0 w-full h-full object-cover img-travel"
          />
          <div className="hero-overlay absolute inset-0" />
          <div className="relative z-10 container pb-10">
            <p className="text-label text-white/60 mb-2">{activeCatInfo.en}</p>
            <h1 className="font-serif text-4xl font-light text-white tracking-wider">
              {activeCatInfo.label}
            </h1>
          </div>
        </section>
      ) : (
        <section className="section-sm border-b border-border">
          <div className="container">
            <p className="text-label mb-3">Destinations</p>
            <h1 className="text-heading">旅行目的地</h1>
          </div>
        </section>
      )}

      {/* Category selector */}
      <section className="py-8 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() =>
                  setActiveCategory((prev) => (prev === cat.label ? "" : cat.label))
                }
                className={[
                  "relative overflow-hidden aspect-square group",
                  activeCategory === cat.label ? "ring-1 ring-foreground" : "",
                ].join(" ")}
              >
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-full object-cover img-travel group-hover:scale-105 transition-transform duration-400"
                />
                <div
                  className={[
                    "absolute inset-0 flex flex-col items-center justify-center transition-colors duration-300",
                    activeCategory === cat.label ? "bg-black/40" : "bg-black/25 group-hover:bg-black/15",
                  ].join(" ")}
                >
                  <p className="font-serif text-white text-sm tracking-wider">{cat.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="section">
        <div className="container">
          {!activeCategory && (
            <p className="text-label mb-10">
              選擇目的地以篩選遊記，或瀏覽全部
            </p>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted aspect-[4/3] mb-4" />
                  <div className="h-3 bg-muted w-16 mb-3" />
                  <div className="h-5 bg-muted w-3/4" />
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {posts.map((post: (typeof posts)[number], i: number) => (
                <Link key={post.id} href={`/journal/${post.slug}`}>
                  <article className="card-post group cursor-pointer">
                    <div className="overflow-hidden mb-5">
                      <img
                        src={post.coverImageUrl ?? PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]}
                        alt={post.title}
                        className="w-full aspect-[4/3] object-cover img-travel group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <span className="badge-category mb-3 inline-block">{post.category}</span>
                      <h2 className="font-serif text-lg font-light leading-snug mb-2 group-hover:text-muted-foreground transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
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
              <p className="font-serif text-2xl font-light text-muted-foreground mb-4">
                {activeCategory ? `尚無 ${activeCategory} 的遊記` : "遊記即將上線"}
              </p>
              <p className="text-label">敬請期待</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
