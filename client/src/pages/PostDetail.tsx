import { Link } from "wouter";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

interface PostDetailProps {
  params: { slug: string };
}

export default function PostDetail({ params }: PostDetailProps) {
  const { data, isLoading, error } = trpc.posts.bySlug.useQuery({ slug: params.slug });

  if (isLoading) {
    return (
      <Layout>
        <div className="container-narrow py-24 animate-pulse">
          <div className="h-3 bg-muted w-24 mb-8" />
          <div className="h-8 bg-muted w-3/4 mb-4" />
          <div className="h-3 bg-muted w-1/3 mb-12" />
          <div className="bg-muted aspect-[16/9] mb-12" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 bg-muted mb-3 last:w-2/3" />
          ))}
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="container-narrow py-24 text-center">
          <p className="font-serif text-2xl font-light text-muted-foreground mb-4">
            找不到這篇遊記
          </p>
          <Link href="/journal">
            <span className="text-label hover:text-foreground transition-colors">
              ← 返回遊記列表
            </span>
          </Link>
        </div>
      </Layout>
    );
  }

  const { post, media } = data;

  return (
    <Layout>
      {/* Back link */}
      <div className="container py-6 border-b border-border">
        <Link href="/journal">
          <span className="text-label hover:text-foreground transition-colors flex items-center gap-2">
            <ArrowLeft size={12} />
            返回遊記列表
          </span>
        </Link>
      </div>

      {/* Article header */}
      <header className="container-narrow pt-14 pb-10">
        <div className="flex items-center gap-4 mb-6">
          <span className="badge-category">{post.category}</span>
          {post.publishedAt && (
            <span className="text-label flex items-center gap-1">
              <Calendar size={10} />
              {new Date(post.publishedAt).toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-light leading-tight tracking-wide mb-6">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="font-serif text-lg text-muted-foreground font-light leading-loose">
            {post.excerpt}
          </p>
        )}
        <div className="divider mt-8" />
      </header>

      {/* Cover image – full width */}
      {post.coverImageUrl && (
        <div className="w-full mb-14">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full max-h-[70vh] object-cover img-travel"
          />
        </div>
      )}

      {/* Article body */}
      <article className="container-narrow pb-20">
        <div className="prose-travel">
          <Streamdown>{post.content}</Streamdown>
        </div>

        {/* Inline gallery */}
        {media && media.length > 0 && (
          <div className="mt-16">
            <p className="text-label mb-8">旅行影像</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {media.map((m) => (
                <figure key={m.id}>
                  <img
                    src={m.url}
                    alt={m.caption ?? "旅行照片"}
                    className="w-full aspect-[4/3] object-cover img-travel"
                  />
                  {m.caption && (
                    <figcaption className="text-label mt-2">{m.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-20 pt-10 border-t border-border flex justify-between items-center">
          <Link href="/journal">
            <span className="text-label hover:text-foreground transition-colors flex items-center gap-2">
              <ArrowLeft size={12} />
              所有遊記
            </span>
          </Link>
          <Link href={`/destinations?cat=${post.category}`}>
            <span className="text-label hover:text-foreground transition-colors flex items-center gap-2">
              <MapPin size={10} />
              更多 {post.category} 遊記
            </span>
          </Link>
        </div>
      </article>
    </Layout>
  );
}
