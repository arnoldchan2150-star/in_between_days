import { Link } from "wouter";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

const PLACEHOLDER_CULTURE = [
  {
    title: "在《午夜巴黎》裡迷路的那個夜晚",
    type: "電影",
    excerpt: "每次看伍迪艾倫的巴黎，我都會想起那條石板路，想起那個下著雨的夜晚，想起自己也曾是個迷途的旅人。",
    img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=75&auto=format&fit=crop",
  },
  {
    title: "《在路上》：一本讓我背起行囊的書",
    type: "書籍",
    excerpt: "凱魯亞克的文字像一陣風，吹散了我對「目的地」的執念。旅行不是為了到達，而是為了途中的一切。",
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=75&auto=format&fit=crop",
  },
  {
    title: "《絲路》：用閱讀走一趟中亞",
    type: "書籍",
    excerpt: "在真正踏上中亞的土地之前，我先在書頁間走過了那片廣袤的草原與沙漠。",
    img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=75&auto=format&fit=crop",
  },
];

export default function Culture() {
  const { data: culturePosts } = trpc.posts.list.useQuery({ category: undefined });
  const filteredCulture = (culturePosts ?? []).filter((p: (typeof culturePosts)[number]) => p.type === "culture");

  return (
    <Layout>
      {/* Header */}
      <section className="relative h-64 md:h-80 flex items-end">
        <img
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1800&q=80&auto=format&fit=crop"
          alt="書籍與電影"
          className="absolute inset-0 w-full h-full object-cover img-travel"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 container pb-10">
          <p className="text-label text-white/60 mb-2">Column</p>
          <h1 className="font-serif text-4xl font-light text-white tracking-wider">
            旅行 × 電影 × 書籍
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="section-sm border-b border-border">
        <div className="container-narrow">
          <p className="font-serif text-lg font-light leading-loose text-muted-foreground">
            旅行不只是移動，更是一種閱讀。在這裡，我分享那些讓我想起某個城市的電影、
            某段旅程的書，以及旅途中的文字碎片。每一個故事，都是另一種形式的旅行。
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="section">
        <div className="container">
          {filteredCulture.length > 0 ? (
            <div className="space-y-16 md:space-y-20">
              {filteredCulture.map((post: (typeof filteredCulture)[number]) => (
                <Link key={post.id} href={`/journal/${post.slug}`}>
                  <article className="group grid md:grid-cols-[1fr_2fr] gap-8 md:gap-14 items-start cursor-pointer">
                    <div className="overflow-hidden">
                      <img
                        src={post.coverImageUrl ?? PLACEHOLDER_CULTURE[0].img}
                        alt={post.title}
                        className="w-full aspect-[4/3] object-cover img-travel group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                    <div className="py-2">
                      <span className="badge-category mb-4 inline-block">
                        {post.type === "culture" ? "文化" : post.category}
                      </span>
                      <h2 className="font-serif text-2xl font-light leading-snug mb-4 group-hover:text-muted-foreground transition-colors">
                        {post.title}
                      </h2>
                      <div className="divider" />
                      {post.excerpt && (
                        <p className="prose-travel text-muted-foreground mt-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <p className="text-label mt-6">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("zh-TW", {
                              year: "numeric",
                              month: "long",
                            })
                          : ""}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            /* Placeholder content */
            <div className="space-y-16 md:space-y-20">
              {PLACEHOLDER_CULTURE.map((item, i) => (
                <article key={i} className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-14 items-start">
                  <div className="overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full aspect-[4/3] object-cover img-travel"
                    />
                  </div>
                  <div className="py-2">
                    <span className="badge-category mb-4 inline-block">{item.type}</span>
                    <h2 className="font-serif text-2xl font-light leading-snug mb-4 text-muted-foreground">
                      {item.title}
                    </h2>
                    <div className="divider" />
                    <p className="prose-travel text-muted-foreground mt-4">{item.excerpt}</p>
                    <p className="text-label mt-6 text-muted-foreground/50">即將上線</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
