import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "一、我們收集的資料",
    body: [
      "當你訂閱 In-Between Days 電子報時，我們可能收集你主動提供的姓名及電子郵件地址。當你透過電郵聯絡我們時，我們亦會收到你在訊息中提供的資料。",
      "網站運作或分析服務可能收集瀏覽器類型、裝置、瀏覽頁面及使用時間等技術資料，實際範圍會視相關服務設定而定。",
    ],
  },
  {
    title: "二、資料用途",
    body: [
      "我們使用上述資料處理電子報訂閱、發送網站更新、回覆查詢、改善網站內容與閱讀體驗，以及維持網站安全與正常運作。我們不會出售或出租你的電子郵件地址作為第三方的行銷用途。",
    ],
  },
  {
    title: "三、電子報與取消訂閱",
    body: [
      "提交訂閱表格後，你可能需要透過確認信完成雙重確認。在完成確認前，電郵地址不會被視為已確認的電子報訂閱。每封電子報都會提供取消訂閱連結，你也可以電郵聯絡我們要求退訂。",
      "退訂後，我們會停止發送一般電子報，但可能保留最低限度的退訂紀錄，以確保不會再次寄送你已拒絕接收的內容。",
    ],
  },
  {
    title: "四、商品訂單、配送與付款資料",
    body: [
      "如果你購買行旅選物，我們可能收集處理訂單所需的姓名、電子郵件、配送地址、商品及履行狀態。這些資料只用於建立訂單、安排配送、回覆售後查詢及處理退換貨申請。",
      "付款會在 Stripe 的安全付款頁完成。我們不會在本網站保存完整卡號、CVV 或卡片有效期；付款識別碼及履行所需的最低限度資料，會按網站營運、帳務核對及適用法律需要保存。",
      "海外配送可能涉及跨境運輸及第三方物流服務，因此相關資料可能傳送至你所在的地區以外。提交訂單前，請確認你同意這種為配送及付款所需的資料處理方式。",
    ],
  },
  {
    title: "五、第三方服務與外部連結",
    body: [
      "網站可能使用 Resend 等第三方電子郵件服務，以及網站託管、資料儲存或分析服務。這些服務可能在你所在的地區以外處理資料，並受其自身的隱私政策規範。",
      "本網站包含外部旅遊指南、影片、博物館及其他網站的連結。當你離開本網站後，相關資料處理由第三方自行負責。",
    ],
  },
  {
    title: "六、Cookies 與資料保存",
    body: [
      "網站可能使用必要 Cookie 或類似技術，以維持網站功能、記住基本設定及了解網站使用情況。你可以透過瀏覽器設定管理或刪除 Cookie，但停用部分 Cookie 可能影響網站功能。",
      "我們只會在達成收集目的所需的期間，或適用法律要求的期間內保存資料。已退訂的地址可能以最低限度形式保留在抑制寄送名單中，以尊重你的退訂選擇。",
    ],
  },
  {
    title: "七、你的權利",
    body: [
      "在適用法律允許的範圍內，你可以要求查詢、查看、更正或刪除我們持有的個人資料，撤回電子報同意，或反對及限制某些資料處理。提出要求時，我們可能需要先確認你的身份。",
    ],
  },
  {
    title: "八、政策更新與聯絡我們",
    body: [
      "我們可能因應網站功能、第三方服務或適用法律變更而更新本政策。更新版本會在本頁公布，並以最新更新日期標示。",
      "如你對本政策、電子報或個人資料處理有疑問，請聯絡 365inwien@gmail.com。",
    ],
  },
];

export default function PrivacyPolicy() {
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
            <h1 className="font-serif text-3xl md:text-4xl font-light leading-tight mb-4">隱私權政策</h1>
            <p className="text-sm text-muted-foreground">最後更新日期：2026 年 8 月 27 日</p>
          </header>
          <div className="space-y-10">
            <p className="font-serif text-lg leading-[2] text-foreground/90">
              In-Between Days（以下稱「本網站」）重視你的個人資料及隱私。本政策說明當你瀏覽本網站、訂閱電子報、購買行旅選物或聯絡我們時，我們如何收集、使用、保存及保護你的資料。
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
