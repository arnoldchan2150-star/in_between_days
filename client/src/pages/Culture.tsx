import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=800&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=70&auto=format&fit=crop",
];

export default function Culture() {
  const { data: posts, isLoading } = trpc.posts.list.useQuery({ type: "culture" });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 bg-background border-b border-border">
        <div className="container">
          <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">
            Culture
          </p>
          <h1 className="font-serif text-3xl font-light">電影 × 書籍</h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg leading-relaxed">
            旅行不只是移動，更是一種閱讀。那些讓我想起某個城市的電影、某段旅程的書，
            以及旅途中的文字碎片。
          </p>
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
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {posts.map((post, i) => (
                <Link key={post.id} href={`/journal/${post.slug}`}>
                  <article className="group cursor-pointer flex gap-6">
                    <div className="w-32 h-44 flex-shrink-0 overflow-hidden bg-muted">
                      <img
                        src={post.coverImageUrl || FALLBACK_IMGS[i % FALLBACK_IMGS.length]}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-xs text-muted-foreground tracking-widest mb-2">
                        {post.category}
                      </p>
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
                文化專欄即將上線
              </p>
              <p className="text-sm text-muted-foreground">
                電影與書籍的旅行筆記正在整理中，敬請期待
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
