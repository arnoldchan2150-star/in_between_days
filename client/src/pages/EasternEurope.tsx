import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function EasternEurope() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 bg-background border-b border-border">
        <div className="container">
          <Link href="/destinations">
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-6">
              <ArrowLeft size={14} />
              返回目的地
            </span>
          </Link>
          <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-2">
            Eastern Europe
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-6">
            東歐漫遊手記
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>東歐</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>2026 年</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 py-16 bg-background">
        <div className="container max-w-2xl">
          <article className="prose-travel">
            <p>
              走進東歐的懷抱，我發現了一個被時光溫柔對待的世界。這裡的每一條街道、每一座建築，都在訴說著深邃而迷人的故事。
            </p>

            <h2>布拉格：千塔之城的魔法</h2>
            <p>
              布拉格的查理大橋上，我駐足良久。橋上的雕像見證了幾個世紀的風雨，而我在這一刻，彷彿也成了歷史的一部分。夕陽西下時，整座城市被金色的光芒籠罩，那一刻的美麗，足以讓人忘卻所有煩惱。
            </p>
            <p>
              城堡區的聖維特大教堂，以其哥特式的尖塔直指蒼穹。站在城堡的高處，俯瞰整個布拉格，紅瓦屋頂如同一片火焰，在陽光下熠熠生輝。
            </p>

            <h2>克拉科夫：波蘭的文化心臟</h2>
            <p>
              克拉科夫的中央廣場是我停留時間最長的地方。廣場四周的建築各具特色，而廣場中心的聖瑪麗亞教堂，其尖塔在每個整點時刻都會傳出悠揚的號角聲。
            </p>
            <p>
              這座城市的地下鹽礦是另一個不容錯過的奇蹟。深入地下，我看到了由鹽雕刻而成的教堂、雕像和走廊。在這個地下王國裡，時間彷彿靜止了。
            </p>

            <h2>布達佩斯：多瑙河畔的珍珠</h2>
            <p>
              多瑙河將布達佩斯分為兩部分，而馬蒂亞什教堂和漁人堡則是這座城市最璀璨的明珠。站在漁人堡的高台上，看著對岸的國會大廈在夜色中閃閃發光，我深深地被這座城市的浪漫所吸引。
            </p>
            <p>
              溫泉浴場是布達佩斯的另一大特色。在溫暖的溫泉中，我放鬆了身心，彷彿所有的旅途疲憊都在這一刻消散。
            </p>

            <h2>華沙：重生的不屈之城</h2>
            <p>
              華沙是一座充滿韌性的城市。在第二次世界大戰中被摧毀，又在戰後重建，這座城市的故事本身就是一部史詩。
            </p>
            <p>
              舊城廣場的五彩繽紛的建築，是戰後重建的見證。而華沙起義博物館，則讓我深刻地理解了這座城市的過去和現在。
            </p>

            <h2>旅行的收穫</h2>
            <p>
              東歐的旅行讓我重新認識了歐洲。這裡不像西歐那樣繁華喧囂，反而有著一種沉靜的魅力。每一次轉身，都能發現新的驚喜；每一次停留，都能感受到不同的文化底蘊。
            </p>
            <p>
              在東歐的日子裡，我學會了放慢腳步，學會了用心去感受。這些城市的故事，已經深深地刻在了我的心裡。
            </p>
          </article>
        </div>
      </section>

      <Footer />
    </div>
  );
}
