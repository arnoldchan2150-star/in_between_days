import { useState } from "react";
import { Link, useSearch } from "wouter";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";

const CATEGORIES = ["全部", "南美", "中東", "亞洲", "歐洲", "中亞", "東南亞"];

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=75&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=75&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=75&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=75&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=75&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=75&auto=format&fit=crop",
];

export default function Journal() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCat = params.get("cat") ?? "全部";
  const [activeCategory, setActiveCategory] = useState(initialCat);

  const { data: posts, isLoading } = trpc.posts.list.useQuery(
    activeCategory !== "全部" ? { category: activeCategory } : {}
  );

  return (
    <Layout>
      {/* Header */}
      <section className="section-sm border-b border-border">
        <div className="container">
          <p className="text-label mb-3">Journal</p>
          <h1 className="text-heading">旅行遊記</h1>
        </div>
      </section>

      {/* Category filter */}
      <section className="py-6 border-b border-border sticky top-16 md:top-20 bg-background/95 backdrop-blur-sm z-30">
        <div className="container overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={[
                  "text-label pb-1 border-b transition-all duration-200 whitespace-nowrap",
                  activeCategory === cat
                    ? "text-foreground border-foreground"
                    : "border-transparent hover:text-foreground hover:border-border",
                ].join(" ")}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="section">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted aspect-[4/3] mb-5" />
                  <div className="h-3 bg-muted w-16 mb-3" />
                  <div className="h-5 bg-muted w-3/4 mb-2" />
                  <div className="h-3 bg-muted w-full mb-1" />
                  <div className="h-3 bg-muted w-2/3" />
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
                      <span className="badge-category mb-3 inline-block">
                        {post.category}
                      </span>
                      <h2 className="font-serif text-lg font-light leading-snug mb-3 group-hover:text-muted-foreground transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      <p className="text-label mt-4">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("zh-TW", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : ""}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="font-serif text-2xl font-light text-muted-foreground mb-4">
                旅行故事即將上線
              </p>
              <p className="text-label">敬請期待</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
