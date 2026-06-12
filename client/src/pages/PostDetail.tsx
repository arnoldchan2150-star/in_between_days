import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";

  const { data: post, isLoading, error } = trpc.posts.bySlug.useQuery({ slug }, { enabled: !!slug });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-24 container py-12 max-w-3xl mx-auto">
          <Skeleton className="h-4 w-24 mb-8" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <Skeleton className="aspect-video mb-8" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="font-serif text-xl text-muted-foreground mb-4">找不到這篇文章</p>
            <Link href="/journal">
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1 justify-center">
                <ArrowLeft size={14} /> 返回遊記列表
              </span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Image */}
      {post.coverImageUrl && (
        <div className="relative h-[60vh] min-h-[400px]">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <article className={`flex-1 bg-background ${post.coverImageUrl ? "" : "pt-24"}`}>
        <div className="container max-w-3xl mx-auto py-12">
          {/* Back link */}
          <Link href="/journal">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-8">
              <ArrowLeft size={12} /> 返回遊記
            </span>
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-xs text-muted-foreground tracking-widest flex items-center gap-1">
              <MapPin size={11} /> {post.category}
            </span>
            {post.publishedAt && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar size={11} />
                {new Date(post.publishedAt).toLocaleDateString("zh-TW", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl font-light mb-4 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-muted-foreground text-base leading-relaxed mb-8 border-l-2 border-border pl-4 italic">
              {post.excerpt}
            </p>
          )}

          <hr className="border-border mb-8" />

          {/* Body */}
          <div
            className="prose-travel"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }}
          />

          {/* Media gallery */}
          {post.media && post.media.length > 0 && (
            <div className="mt-12">
              <h3 className="font-serif text-lg font-light mb-6 text-muted-foreground">
                旅行相簿
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {post.media.map((m) => (
                  <div key={m.id} className="aspect-[4/3] overflow-hidden">
                    <img
                      src={m.url}
                      alt={m.caption ?? "旅行照片"}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-border">
            <Link href="/journal">
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <ArrowLeft size={14} /> 更多旅行故事
              </span>
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
