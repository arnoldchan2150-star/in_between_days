import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";

export default function About() {
  const { data: about, isLoading } = trpc.about.get.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 bg-background border-b border-border">
        <div className="container">
          <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">About</p>
          <h1 className="font-serif text-3xl font-light">關於我</h1>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 py-16 bg-background">
        <div className="container max-w-4xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-12">
              <Skeleton className="aspect-[3/4]" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-16 items-start">
              {/* Photo */}
              <div>
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  {about?.photoUrl ? (
                    <img
                      src={about.photoUrl}
                      alt="作者照片"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=75&auto=format&fit=crop"
                      alt="旅行者"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {about?.countriesVisited && (
                  <div className="mt-6 flex items-start gap-2">
                    <MapPin size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {about.countriesVisited}
                    </p>
                  </div>
                )}
              </div>

              {/* Text */}
              <div>
                <h2 className="font-serif text-2xl font-light mb-6">Maxine</h2>

                {about?.philosophy ? (
                  <div className="mb-8">
                    <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase mb-3">
                      旅行哲學
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/80 font-serif">
                      {about.philosophy}
                    </p>
                  </div>
                ) : (
                  <div className="mb-8">
                    <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase mb-3">
                      旅行哲學
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/80 font-serif">
                      旅行對我而言，不是逃離，而是一種回歸。
                      在陌生的街道上，我反而更清楚地看見自己。
                      每一段旅程都是一次對話，與世界，也與內心。
                    </p>
                  </div>
                )}

                {about?.blogOrigin ? (
                  <div>
                    <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase mb-3">
                      關於這個部落格
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/80 font-serif">
                      {about.blogOrigin}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase mb-3">
                      關於這個部落格
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/80 font-serif">
                      「In-Between Days」取自 The Cure 的同名歌曲。
                      那些在旅途中的間隙時光——等待的片刻、迷路的下午、
                      一個人坐在咖啡館看著窗外的黃昏——往往是最真實的旅行記憶。
                      這個部落格，就是為了記錄那些間隙裡的日常。
                    </p>
                  </div>
                )}

                <div className="mt-10 pt-8 border-t border-border">
                  <p className="text-xs text-muted-foreground tracking-wider mb-3">聯絡我</p>
                  <a
                    href="mailto:365inwien@gmail.com"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    365inwien@gmail.com
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
