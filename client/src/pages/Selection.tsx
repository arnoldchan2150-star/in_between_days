import { useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Compass, PackageOpen, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  SELECTION_CATEGORIES,
  SelectionCategory,
  SelectionItem,
  filterSelectionItems,
} from "@shared/selectionCatalog";
import { trpc } from "@/lib/trpc";

const SELECTION_NOTES = [
  {
    eyebrow: "Made slowly",
    title: "自己做的物件",
    description: "從構思、製作到寄出，讓一件小小的物件保留手作的溫度。",
    icon: Sparkles,
  },
  {
    eyebrow: "Found along the way",
    title: "旅行途中遇見",
    description: "把旅途中偶然遇見、值得帶回日常的特色小物，整理成一份小小選集。",
    icon: Compass,
  },
  {
    eyebrow: "For everyday life",
    title: "帶回生活裡",
    description: "不只收藏一段旅程，也讓遠方的質感在平日裡慢慢延續。",
    icon: PackageOpen,
  },
];

export default function Selection() {
  const [activeCategory, setActiveCategory] = useState<SelectionCategory>("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkoutItem, setCheckoutItem] = useState<{ id: number; title: string; priceMinor: number; weightGrams: number; shippingClass: "P" | "G" | "E" } | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryRegion, setDeliveryRegion] = useState<"HK" | "overseas">("HK");
  const { data: products, isLoading } = trpc.shop.publicList.useQuery();
  const checkoutWindowRef = useRef<Window | null>(null);
  const checkout = trpc.shop.createCheckout.useMutation({
    onSuccess: (result) => {
      if (!result.url) {
        checkoutWindowRef.current?.close();
        checkoutWindowRef.current = null;
        toast.error("付款頁暫時無法建立，請稍後再試");
        return;
      }
      const checkoutWindow = checkoutWindowRef.current;
      checkoutWindowRef.current = null;
      toast.success("正在前往安全付款頁");
      if (checkoutWindow && !checkoutWindow.closed) {
        checkoutWindow.location.href = result.url;
      } else {
        window.location.assign(result.url);
      }
      setCheckoutItem(null);
    },
    onError: (error) => {
      checkoutWindowRef.current?.close();
      checkoutWindowRef.current = null;
      toast.error(error.message);
    },
  });

  const selectionItems = useMemo<SelectionItem[]>(
    () => (products ?? []).map((product) => ({
      id: String(product.id),
      title: product.title,
      category: product.category,
      description: product.description,
      status: product.inventoryQuantity > 0 ? "available" : "sold_out",
      imageUrl: product.coverUrl ?? undefined,
      priceLabel: `HK$ ${(product.priceMinor / 100).toFixed(2)}`,
    })),
    [products],
  );
  const filteredItems = useMemo(
    () => filterSelectionItems(selectionItems, activeCategory, searchQuery),
    [activeCategory, searchQuery, selectionItems],
  );
  const hasActiveFilters = Boolean(searchQuery.trim()) || activeCategory !== "全部";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="pt-32 pb-14 border-b border-border">
          <div className="container">
            <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-3">Travel Selection</p>
            <div className="max-w-2xl">
              <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight">行旅選物</h1>
              <p className="text-base text-muted-foreground mt-5 leading-relaxed max-w-xl">
                把旅途中遇見的事物，帶回日常生活。這裡會收錄親自製作的物件，與那些在遠方偶然遇見、值得分享的特色小物。
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-16 z-40">
          <div className="container py-4 space-y-4">
            <label className="relative block max-w-xl">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="搜尋選物、旅程或關鍵字..."
                aria-label="搜尋行旅選物"
                className="w-full border border-border bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </label>
            <div className="flex gap-6 overflow-x-auto" role="tablist" aria-label="行旅選物分類">
              {SELECTION_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap pb-1 border-b text-xs tracking-[0.12em] transition-colors ${
                    activeCategory === category
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((item) => <div key={item} className="space-y-5"><div className="aspect-[4/5] bg-secondary/50 animate-pulse" /><div className="h-5 w-2/3 bg-secondary/50 animate-pulse" /><div className="h-4 w-full bg-secondary/50 animate-pulse" /></div>)}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                {filteredItems.map((item) => (
                  <article key={item.id} className="group">
                    <div className="aspect-[4/5] overflow-hidden bg-secondary mb-5">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <PackageOpen size={38} strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="text-[11px] text-muted-foreground tracking-[0.12em]">{item.category}</span>
                      {item.priceLabel && <span className="text-xs text-foreground">{item.priceLabel}</span>}
                    </div>
                    <h2 className="font-serif text-xl font-light leading-snug">{item.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3">{item.description}</p>
                    {item.status === "available" ? (
                      <button
                        type="button"
                        onClick={() => {
                          const product = products?.find((candidate) => String(candidate.id) === item.id);
                          if (product) setCheckoutItem({ id: product.id, title: product.title, priceMinor: product.priceMinor, weightGrams: product.weightGrams, shippingClass: product.shippingClass });
                        }}
                        className="mt-4 inline-flex items-center gap-2 text-xs text-foreground border-b border-foreground/40 pb-1 hover:border-foreground transition-colors"
                      >
                        前往結帳 <ArrowRight size={13} />
                      </button>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-4">{item.status === "sold_out" ? "暫時售罄" : "即將上架"}</p>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="max-w-3xl mx-auto py-8 md:py-14 text-center">
                <PackageOpen size={42} strokeWidth={1} className="mx-auto text-muted-foreground mb-6" />
                <p className="font-serif text-2xl font-light mb-3">
                  {hasActiveFilters ? "未找到相符的選物" : "選物正在慢慢準備中"}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                  {hasActiveFilters
                    ? "請嘗試其他關鍵字，或切換至其他分類。"
                    : "第一批商品仍在整理與準備之中。當物件、故事與寄送安排都準備好後，會在這裡與你見面。"}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory("全部");
                      setSearchQuery("");
                    }}
                    className="mt-6 border border-border px-4 py-2.5 text-xs tracking-[0.12em] text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                  >
                    清除篩選
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-border py-16 md:py-20">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
              <div>
                <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-3">A small collection</p>
                <h2 className="font-serif text-3xl font-light">為什麼是行旅選物？</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                每一件物件都希望不只是紀念品，而是一個可以在生活裡繼續發生的故事。
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-border">
              {SELECTION_NOTES.map(({ eyebrow, title, description, icon: Icon }) => (
                <div key={title} className="border-b md:border-b-0 md:border-r last:border-r-0 border-border py-7 md:pr-8 md:mr-8 last:mr-0 last:pr-0">
                  <Icon size={20} strokeWidth={1} className="text-muted-foreground mb-8" />
                  <p className="text-[10px] text-muted-foreground tracking-[0.16em] uppercase mb-2">{eyebrow}</p>
                  <h3 className="font-serif text-xl font-light mb-3">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-secondary/40 py-12">
          <div className="container flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="font-serif text-xl font-light">先回到旅途裡</p>
              <p className="text-sm text-muted-foreground mt-2">在選物上線以前，也可以先閱讀那些故事。</p>
            </div>
            <Link href="/destinations" className="inline-flex items-center gap-2 text-xs tracking-[0.12em] text-foreground hover:text-muted-foreground transition-colors">
              閱讀目的地遊記 <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>

      {checkoutItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 px-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckoutItem(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="checkout-title" className="w-full max-w-md bg-background border border-border p-6 sm:p-8 shadow-xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-[10px] text-muted-foreground tracking-[0.16em] uppercase mb-2">Secure checkout</p>
                <h2 id="checkout-title" className="font-serif text-2xl font-light">{checkoutItem.title}</h2>
                <p className="text-sm text-muted-foreground mt-2">HK$ {(checkoutItem.priceMinor / 100).toFixed(2)} ・ 1 件</p>
              </div>
              <button type="button" onClick={() => setCheckoutItem(null)} className="text-muted-foreground hover:text-foreground" aria-label="關閉結帳視窗"><X size={17} /></button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">請先留下聯絡資料，之後會前往 Stripe 安全付款頁完成交易。</p>
            <div className="border-y border-border py-4 mb-6 space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>香港配送：G 大型信件／包裹按重量計算；訂單滿 HK$300 免運。</p>
              <p>海外配送：跨境運費另計，付款前需要人工確認。</p>
            </div>
            <fieldset className="space-y-2 mb-6">
              <legend className="text-xs text-muted-foreground tracking-wider">配送地區</legend>
              <label className="flex items-start gap-2 text-sm text-foreground/80">
                <input type="radio" name="delivery-region" value="HK" checked={deliveryRegion === "HK"} onChange={() => setDeliveryRegion("HK")} className="mt-1 accent-foreground" />
                <span>香港（{checkoutItem.shippingClass} 類，{checkoutItem.weightGrams > 0 ? `${checkoutItem.weightGrams}g` : "重量待補"}）</span>
              </label>
              <label className="flex items-start gap-2 text-sm text-foreground/80">
                <input type="radio" name="delivery-region" value="overseas" checked={deliveryRegion === "overseas"} onChange={() => setDeliveryRegion("overseas")} className="mt-1 accent-foreground" />
                <span>海外（跨境運費另行確認）</span>
              </label>
            </fieldset>
            <div className="space-y-4">
              <label className="block text-xs text-muted-foreground tracking-wider">姓名
                <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} autoComplete="name" className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground" placeholder="你的姓名" />
              </label>
              <label className="block text-xs text-muted-foreground tracking-wider">Email
                <input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} autoComplete="email" className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground" placeholder="你的 Email" />
              </label>
            </div>
            <div className="flex flex-wrap gap-3 mt-7">
              <button
                type="button"
                disabled={checkout.isPending}
                onClick={() => {
                  if (deliveryRegion === "overseas") {
                    window.location.href = `mailto:365inwien@gmail.com?subject=${encodeURIComponent(`海外配送詢問：${checkoutItem.title}`)}&body=${encodeURIComponent(`你好，我想購買「${checkoutItem.title}」，請告知海外跨境運費。\n\n姓名：${customerName}\nEmail：${customerEmail}`)}`;
                    return;
                  }
                  if (!customerName.trim() || !customerEmail.trim()) {
                    toast.error("請填寫姓名及 Email");
                    return;
                  }
                  if (checkoutItem.weightGrams <= 0) {
                    toast.error("此商品尚未設定包裝重量，請稍後再試");
                    return;
                  }
                  const checkoutWindow = window.open("about:blank", "_blank");
                  if (checkoutWindow) {
                    checkoutWindow.opener = null;
                    checkoutWindow.document.title = "Stripe 安全付款";
                  }
                  checkoutWindowRef.current = checkoutWindow;
                  checkout.mutate({ customerName: customerName.trim(), customerEmail: customerEmail.trim(), items: [{ productId: checkoutItem.id, quantity: 1 }] });
                }}
                className="bg-foreground text-background px-5 py-2.5 text-xs tracking-wider hover:bg-foreground/80 disabled:opacity-50 transition-colors"
              >
                {deliveryRegion === "overseas" ? "詢問海外運費" : checkout.isPending ? "準備付款頁..." : "前往安全付款"}
              </button>
              <button type="button" onClick={() => setCheckoutItem(null)} className="border border-border px-5 py-2.5 text-xs tracking-wider hover:border-foreground transition-colors">取消</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
