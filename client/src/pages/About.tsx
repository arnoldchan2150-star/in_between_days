import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

const DEFAULT_PHILOSOPHY = `生活如長路，旅行便是途中屬於我的留白。

十年前，嚮往遠方，執著踏遍山海，以腳步追尋夢想，漫遊四方，無需目的，只管向前。

十年後，依舊前行，卻學會駐足感受。城市、光影、書卷，皆成為生命裡溫潤的印跡。我是 Maxine，記錄旅途之隙，記錄屬於我的日常。`;

const DEFAULT_COUNTRIES = [
  "阿根廷", "智利", "秘魯", "玻利維亞", "哥倫比亞",
  "約旦", "以色列", "伊朗", "土耳其", "埃及",
  "日本", "韓國", "中國", "蒙古", "尼泊爾",
  "法國", "義大利", "西班牙", "葡萄牙", "德國",
  "烏茲別克", "哈薩克", "吉爾吉斯", "塔吉克",
  "泰國", "越南", "柬埔寨", "緬甸", "印尼",
];

export default function About() {
  const { data: about } = trpc.about.get.useQuery();

  const philosophy = about?.philosophy ?? DEFAULT_PHILOSOPHY;
  const countriesRaw = about?.countriesVisited;
  const countries: string[] = countriesRaw
    ? JSON.parse(countriesRaw)
    : DEFAULT_COUNTRIES;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-72 md:h-96 flex items-end">
        <img
          src={about?.photoUrl ?? "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1800&q=80&auto=format&fit=crop"}
          alt="Maxine"
          className="absolute inset-0 w-full h-full object-cover img-travel object-top"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 container pb-10">
          <p className="text-label text-white/60 mb-2">About</p>
          <h1 className="font-serif text-4xl font-light text-white tracking-wider">
            關於我
          </h1>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 md:gap-20 items-start">
            {/* Portrait */}
            <div className="relative">
              <img
                src={about?.photoUrl ?? "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80&auto=format&fit=crop"}
                alt="Maxine"
                className="w-full aspect-[3/4] object-cover object-top img-travel"
              />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 border border-border bg-background hidden md:block" />
            </div>

            {/* Text */}
            <div>
              <p className="text-label mb-4">旅行理念</p>
              <div className="divider mb-8" />
              <div className="prose-travel">
                <Streamdown>{philosophy}</Streamdown>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countries */}
      <section className="section bg-secondary/30">
        <div className="container">
          <p className="text-label mb-3">走過的地方</p>
          <h2 className="text-heading mb-10">
            {countries.length} 個國家與地區
          </h2>
          <div className="flex flex-wrap gap-3">
            {countries.map((country) => (
              <span
                key={country}
                className="badge-category"
              >
                {country}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Blog origin */}
      <section className="section">
        <div className="container-narrow">
          <p className="text-label mb-4">部落格初衷</p>
          <div className="divider mb-8" />
          <div className="prose-travel">
            <Streamdown>
              {about?.blogOrigin ??
                `「In-Between Days」取自 The Cure 的同名歌曲，也是我對旅行最真實的詮釋。\n\n旅行從來不只是抵達，而是那些「在之間」的時刻——等待轉機的午後、迷路後意外發現的小巷、與陌生人短暫交會的眼神。\n\n這個部落格，是我記錄這些間隙的地方。不是攻略，不是打卡，而是一個旅人的私人日記。`}
            </Streamdown>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section-sm border-t border-border">
        <div className="container-narrow text-center">
          <p className="text-label mb-4">聯絡我</p>
          <a
            href="mailto:hello@inbetweendays.com"
            className="font-serif text-lg font-light hover:text-muted-foreground transition-colors"
          >
            hello@inbetweendays.com
          </a>
        </div>
      </section>
    </Layout>
  );
}
