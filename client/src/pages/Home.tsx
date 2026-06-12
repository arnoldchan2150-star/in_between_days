import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const DESTINATIONS = [
  {
    cat: "南美",
    en: "South America",
    img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=70&auto=format&fit=crop",
  },
  {
    cat: "中東",
    en: "Middle East",
    img: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&q=70&auto=format&fit=crop",
  },
  {
    cat: "亞洲",
    en: "Asia",
    img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=70&auto=format&fit=crop",
  },
  {
    cat: "歐洲",
    en: "Europe",
    img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=70&auto=format&fit=crop",
  },
  {
    cat: "中亞",
    en: "Central Asia",
    img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=70&auto=format&fit=crop",
  },
  {
    cat: "東南亞",
    en: "Southeast Asia",
    img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=70&auto=format&fit=crop",
  },
];

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=75&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=75&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=75&auto=format&fit=crop",
];

export default function Home() {
  const { data: posts, isLoading: postsLoading } = trpc.posts.list.useQuery({});

  const latestPosts = posts?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-end pb-20">
        <div className="absolute inset-0">
          <img
            src="/manus-storage/hero-cover_6422da06.webp"
            alt="旅行意境"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        <div className="relative container text-white">
          <p className="text-xs tracking-[0.3em] uppercase mb-4 opacity-70">
            In-Between Days
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6" style={{fontSize: '20px'}}>
            走走停停，在旅途間隙，
            <br />
            遇見世界，也遇見自己。
          </h1>
          <div className="flex flex-wrap gap-4">
            <Link href="/journal">
              <span className="inline-flex items-center gap-2 border border-white/60 px-6 py-2.5 text-xs tracking-widest hover:bg-white hover:text-foreground transition-colors cursor-pointer">
                閱讀遊記 <ArrowRight size={14} />
              </span>
            </Link>
            <Link href="/booklet">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 px-6 py-2.5 text-xs tracking-widest hover:bg-white/20 transition-colors cursor-pointer">
                領取旅遊小冊子
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">
                最新遊記
              </p>
              <h2 className="font-serif text-2xl font-light">近期文章</h2>
            </div>
            <Link href="/journal">
              <span className="text-xs text-muted-foreground hover:text-foreground tracking-wider transition-colors cursor-pointer flex items-center gap-1">
                全部遊記 <ArrowRight size={12} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {postsLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="aspect-[4/3] mb-4" />
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))
              : latestPosts.length > 0
              ? latestPosts.map((post, i) => (
                  <Link key={post.id} href={`/journal/${post.slug}`}>
                    <article className="group cursor-pointer">
                      <div className="aspect-[4/3] overflow-hidden mb-4 bg-muted">
                        <img
                          src={
                            post.coverImageUrl ||
                            FALLBACK_IMGS[i % FALLBACK_IMGS.length]
                          }
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground tracking-widest mb-2">
                        {post.category}
                      </p>
                      <h3 className="font-serif text-lg font-light mb-2 group-hover:text-muted-foreground transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </article>
                  </Link>
                ))
              : Array.from({ length: 3 }).map((_, i) => (
                  <article key={i} className="group">
                    <div className="aspect-[4/3] overflow-hidden mb-4 bg-muted">
                      <img
                        src={FALLBACK_IMGS[i]}
                        alt="旅行照片"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground tracking-widest mb-2">
                      {["亞洲", "歐洲", "南美"][i]}
                    </p>
                    <h3 className="font-serif text-lg font-light mb-2">
                      遊記即將上線
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      旅行的故事正在整理中，敬請期待。
                    </p>
                  </article>
                ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 bg-secondary/30">
        <div className="container text-center">
          <blockquote className="font-serif text-xl md:text-2xl font-light text-muted-foreground italic max-w-2xl mx-auto leading-relaxed">
            「生活如長路，旅行便是途中屬於我的留白。」
          </blockquote>
          <p className="mt-4 text-xs text-muted-foreground tracking-widest">Maxine</p>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="mb-12">
            <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">
              目的地
            </p>
            <h2 className="font-serif text-2xl font-light">探索旅行地圖</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DESTINATIONS.map((d) => (
              <Link key={d.cat} href={`/destinations?cat=${d.cat}`}>
                <div className="group relative aspect-[4/3] overflow-hidden cursor-pointer">
                  <img
                    src={d.img}
                    alt={d.cat}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <p className="font-serif text-lg font-light tracking-wider">{d.cat}</p>
                    <p className="text-xs tracking-[0.2em] uppercase opacity-70 mt-1">
                      {d.en}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Booklet CTA */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-3">
              免費旅遊小冊子
            </p>
            <h2 className="font-serif text-2xl font-light mb-4">
              帶走一份旅行的溫度
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              精心整理的旅行指南，收錄行程規劃、在地推薦與旅行心得，
              <br />
              留下你的信箱，即刻免費寄送。
            </p>
            <Link href="/booklet">
              <span className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3 text-xs tracking-widest hover:bg-foreground/80 transition-colors cursor-pointer">
                立即領取 <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Culture CTA */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-3">
                旅行 × 電影 × 書籍
              </p>
              <h2 className="font-serif text-2xl font-light mb-4">
                用閱讀延伸旅行的邊界
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                旅行不只是移動，更是一種閱讀。在這裡，我分享那些讓我想起某個城市的電影、
                某段旅程的書，以及旅途中的文字碎片。
              </p>
              <Link href="/culture">
                <span className="inline-flex items-center gap-2 border border-foreground px-6 py-2.5 text-xs tracking-widest hover:bg-foreground hover:text-background transition-colors cursor-pointer">
                  進入專欄 <ArrowRight size={14} />
                </span>
              </Link>
            </div>
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=75&auto=format&fit=crop"
                alt="書籍與旅行"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
