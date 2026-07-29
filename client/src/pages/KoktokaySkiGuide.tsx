import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function KoktokaySkiGuide() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 bg-background border-b border-border">
        <div className="container">
          <Link href="/snow">
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-6">
              <ArrowLeft size={14} />
              返回雪季映像
            </span>
          </Link>
          <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">
            Ski Resort Guide
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-6">
            可可托海國際滑雪度假區 ‧ 隨行攻略指南
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>新疆阿勒泰</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>冬季</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 py-16 bg-background">
        <div className="container max-w-2xl">
          <article className="prose-travel">
            <p>
              可可托海國際滑雪度假區位於新疆阿勒泰地區，是中國最北端的滑雪勝地。這裡擁有得天獨厚的自然條件和優質的粉雪資源，是滑雪愛好者的天堂。
            </p>

            <h2>地理位置與交通</h2>
            <p>
              可可托海距離阿勒泰市約 120 公里，距離烏魯木齊約 800 公里。最便捷的方式是先飛往烏魯木齊，再轉乘汽車或包車前往。冬季道路可能受雪況影響，建議提前了解路況信息。
            </p>

            <h2>最佳滑雪季節</h2>
            <p>
              可可托海的滑雪季節從 11 月中旬持續到次年 3 月中旬，其中 12 月至 2 月是最佳滑雪時期。這個時間段內，雪質最佳，積雪深度穩定，氣溫適宜滑雪運動。
            </p>

            <h2>雪質與雪道</h2>
            <p>
              可可托海以其優質的粉雪而聞名。由於地處高緯度，這裡的雪質乾爽，不易結冰，非常適合各類滑雪者。度假區擁有多條難度不同的雪道，從初級到高級，應有盡有。
            </p>
            <p>
              初級雪道適合初學者練習基本技巧，中級雪道則為有一定基礎的滑雪者提供挑戰，而高級雪道則考驗滑雪者的技術和膽識。
            </p>

            <h2>住宿與設施</h2>
            <p>
              度假區內有多家酒店和度假村，從五星級酒店到經濟型旅館應有盡有。建議提前預訂，特別是在高峰季節。
            </p>
            <p>
              度假區配備了完善的滑雪設施，包括現代化的纜車系統、滑雪學校、租賃店和多家餐飲場所。無論是初學者還是專業滑雪者，都能在這裡找到適合自己的服務。
            </p>

            <h2>滑雪課程與教練</h2>
            <p>
              度假區內有經驗豐富的滑雪教練，提供各個級別的滑雪課程。無論你是完全的初學者還是想要提升技術的進階滑雪者，都能找到適合的課程。
            </p>

            <h2>穿著與裝備建議</h2>
            <p>
              可可托海冬季氣溫極低，有時可達零下 30 度以下。因此，保暖是首要任務。建議穿著多層衣物，包括保暖內衣、羊毛衣和防風外套。
            </p>
            <p>
              滑雪鞋、滑雪板和護具可以在度假區租賃，無需自帶。但如果你有自己的裝備，也可以攜帶。
            </p>

            <h2>健康與安全提示</h2>
            <p>
              在高海拔地區滑雪，可能會出現高原反應。建議提前幾天到達，讓身體適應環境。
            </p>
            <p>
              滑雪前進行充分的熱身運動，避免肌肉拉傷。同時，始終遵守雪道上的安全規則，佩戴頭盔和護具。
            </p>

            <h2>周邊景點</h2>
            <p>
              除了滑雪，可可托海周邊還有許多值得探索的景點。可可托海國家地質公園以其獨特的地質景觀而聞名，是地質愛好者的必去之地。
            </p>
            <p>
              此外，還可以體驗當地的民族文化，品嚐新疆特色美食，感受這片邊疆地區的獨特魅力。
            </p>

            <h2>美食推薦</h2>
            <p>
              在可可托海，一定要品嚐新疆特色美食。羊肉串、馕、拌麵等都是不容錯過的佳餚。度假區內的餐廳提供各種選擇，從當地美食到國際料理應有盡有。
            </p>

            <h2>旅行建議</h2>
            <p>
              提前預訂酒店和滑雪課程，特別是在高峰季節。
              帶上足夠的防曬霜和唇膏，高紫外線和乾燥的環境容易導致皮膚受損。
              準備好充足的現金，雖然度假區內有 ATM，但在偏遠地區可能不夠便捷。
              租賃滑雪裝備時，確保尺寸合適，這對安全和舒適度都很重要。
            </p>

            <h2>結語</h2>
            <p>
              可可托海國際滑雪度假區是一個集滑雪、自然風光和文化體驗於一身的目的地。無論你是滑雪愛好者還是尋求冬季冒險的旅行者，這裡都能提供難忘的體驗。在粉雪中馳騁，在星空下休憩，感受大自然的壯麗與寧靜。
            </p>
          </article>
        </div>
      </section>

      <Footer />
    </div>
  );
}
