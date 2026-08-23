import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "一、條款接受",
    body: [
      "歡迎使用 In-Between Days。瀏覽本網站、閱讀文章或使用網站提供的功能，即表示你同意遵守本服務條款及適用的法律規定。如果你不同意本條款，請停止使用本網站。",
    ],
  },
  {
    title: "二、網站內容與著作權",
    body: [
      "本網站的文章、文字、照片、圖像、設計及其他內容，除另有註明外，均屬 In-Between Days 或相關權利人的作品，受適用的著作權及其他智慧財產權法律保護。",
      "你可以為個人、非商業用途閱讀及分享本網站連結。未經事前書面同意，不得大量複製、改作、轉載、出售、重新發布或將內容用於商業用途。若希望引用文章或照片，請先透過 365inwien@gmail.com 聯絡我們。",
    ],
  },
  {
    title: "三、外部連結與第三方內容",
    body: [
      "本網站可能提供外部旅遊指南、影片、博物館、住宿或其他網站的連結。這些連結只為方便讀者而提供；第三方網站由其各自營運，我們不控制其內容、可用性、準確性或隱私處理方式。",
    ],
  },
  {
    title: "四、電子報",
    body: [
      "你可以選擇訂閱 In-Between Days 電子報，以接收新文章、旅遊故事、滑雪攻略及其他網站更新。訂閱需要提供有效的電子郵件地址，並可能需要透過確認信完成雙重確認。你可以隨時使用電子報中的取消訂閱連結退訂。",
      "我們會按《隱私權政策》處理訂閱資料。電子報內容及發送頻率可能因網站更新而調整，亦可能暫停或終止。",
    ],
  },
  {
    title: "五、網站使用",
    body: [
      "你不得以任何方式干擾網站運作、嘗試未經授權存取系統或資料、傳送惡意程式，或利用本網站從事違法、侵權、欺詐或損害他人權益的活動。",
      "本網站的旅行資訊、觀點及個人經驗只供一般參考，不構成醫療、法律、財務、移民或其他專業建議。出發前請自行向官方或合資格專業人士確認最新資訊。",
    ],
  },
  {
    title: "六、內容準確性與網站可用性",
    body: [
      "我們會努力維持文章內容的準確性及網站的正常運作，但旅行安排、開放時間、價格、交通、政策及外部網站內容可能隨時變更。對於因依賴本網站內容或外部連結而產生的損失，應由使用者自行判斷及承擔。",
      "我們保留隨時修改、暫停或終止網站任何部分的權利，恕不一定事先通知。",
    ],
  },
  {
    title: "七、條款更新與聯絡方式",
    body: [
      "我們可能因應網站功能或營運方式變更而更新本條款。更新版本會在本頁公布，並以最新更新日期標示。",
      "如你對本服務條款或網站內容有任何疑問，請聯絡 365inwien@gmail.com。",
    ],
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="container max-w-3xl mx-auto px-5 md:px-8">
          <Link href="/">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-10">
              <ArrowLeft size={13} /> 返回首頁
            </span>
          </Link>
          <header className="border-b border-border pb-10 mb-10">
            <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-3">Legal</p>
            <h1 className="font-serif text-3xl md:text-4xl font-light leading-tight mb-4">服務條款</h1>
            <p className="text-sm text-muted-foreground">最後更新日期：2026 年 8 月 23 日</p>
          </header>
          <div className="space-y-10">
            <p className="font-serif text-lg leading-[2] text-foreground/90">
              本服務條款說明使用 In-Between Days 網站、文章內容及電子報服務時適用的基本規則。請在使用本網站前閱讀以下內容。
            </p>
            {sections.map((section) => (
              <section key={section.title} className="space-y-4">
                <h2 className="font-serif text-xl md:text-2xl font-light">{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-[2] text-foreground/80">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// 本頁內容為網站工作版本，正式使用前請按適用法規及實際服務設定審閱。
