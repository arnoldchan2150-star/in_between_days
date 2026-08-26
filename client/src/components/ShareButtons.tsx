import { useState } from "react";
import { Copy, Facebook, Instagram, Link2, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { createArticleShareLinks } from "@shared/shareLinks";

type ShareButtonsProps = {
  title: string;
};

async function copyArticleLink(title: string) {
  const url = window.location.href;
  try {
    await navigator.clipboard.writeText(url);
    toast.success("文章連結已複製", { description: `可以貼到 Instagram 或其他社群分享：${title}` });
    return true;
  } catch {
    toast.error("無法自動複製連結", { description: "請直接複製瀏覽器網址列分享。" });
    return false;
  }
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [isSharing, setIsSharing] = useState(false);
  const canNativeShare = typeof navigator !== "undefined" && "share" in navigator;
  const shareLinks = createArticleShareLinks(title, window.location.href);

  const openShareWindow = (url: string) => {
    window.open(url, "share-window", "noopener,noreferrer,width=640,height=640");
  };

  const handleNativeShare = async () => {
    if (!canNativeShare) {
      await copyArticleLink(title);
      return;
    }

    setIsSharing(true);
    try {
      await navigator.share({ title, text: title, url: window.location.href });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      await copyArticleLink(title);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <section className="mt-16 border-t border-border pt-8" aria-labelledby="article-share-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-lg font-light" id="article-share-heading">分享這篇文章</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            喜歡這段旅程嗎？把它分享給下一位想出發的人。
          </p>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="文章分享方式">
          <button
            type="button"
            onClick={() => openShareWindow(shareLinks.facebook)}
            className="inline-flex min-h-10 items-center gap-2 border border-border px-3 py-2 text-xs text-foreground transition-colors hover:border-foreground hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
            aria-label="分享到 Facebook"
          >
            <Facebook size={14} aria-hidden="true" />
            Facebook
          </button>
          <button
            type="button"
            onClick={() => openShareWindow(shareLinks.line)}
            className="inline-flex min-h-10 items-center gap-2 border border-border px-3 py-2 text-xs text-foreground transition-colors hover:border-foreground hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
            aria-label="分享到 LINE"
          >
            <MessageCircle size={14} aria-hidden="true" />
            LINE
          </button>
          <button
            type="button"
            onClick={() => copyArticleLink(title)}
            className="inline-flex min-h-10 items-center gap-2 border border-border px-3 py-2 text-xs text-foreground transition-colors hover:border-foreground hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
            aria-label="複製連結分享到 Instagram"
          >
            <Instagram size={14} aria-hidden="true" />
            Instagram
          </button>
          <button
            type="button"
            onClick={copyArticleLink.bind(null, title)}
            className="inline-flex min-h-10 items-center gap-2 border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-foreground hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
            aria-label="複製文章連結"
          >
            <Copy size={14} aria-hidden="true" />
            複製連結
          </button>
          <button
            type="button"
            onClick={handleNativeShare}
            disabled={isSharing}
            className="inline-flex min-h-10 items-center gap-2 border border-foreground bg-foreground px-3 py-2 text-xs text-background transition-colors hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 disabled:cursor-wait disabled:opacity-60"
            aria-label="使用裝置分享"
          >
            {canNativeShare ? <Share2 size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />}
            {isSharing ? "分享中…" : canNativeShare ? "更多分享" : "分享連結"}
          </button>
        </div>
      </div>
    </section>
  );
}
