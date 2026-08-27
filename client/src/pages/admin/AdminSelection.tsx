import { useState } from "react";
import { Eye, EyeOff, Pencil, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import ImageUploader from "@/components/ImageUploader";
import AdminLayout from "./AdminLayout";
import { formatHkdFromMinorUnits, isValidInventoryQuantity, parseHkdToMinorUnits } from "@shared/shopPricing";

type ProductForm = {
  title: string;
  slug: string;
  description: string;
  category: "自製物件" | "旅途小物";
  shippingClass: "P" | "G" | "E";
  weightGrams: string;
  priceHkd: string;
  inventoryQuantity: string;
  coverUrl: string;
  coverKey: string;
  active: boolean;
  sortOrder: string;
};

const emptyForm: ProductForm = {
  title: "",
  slug: "",
  description: "",
  category: "自製物件",
  shippingClass: "G",
  weightGrams: "0",
  priceHkd: "",
  inventoryQuantity: "0",
  coverUrl: "",
  coverKey: "",
  active: false,
  sortOrder: "0",
};

export default function AdminSelection() {
  const { data: products, isLoading } = trpc.shop.adminList.useQuery();
  const { data: orders, isLoading: ordersLoading } = trpc.shop.adminOrders.useQuery();
  const utils = trpc.useUtils();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const uploadCover = trpc.shop.uploadCover.useMutation();
  const createProduct = trpc.shop.create.useMutation({
    onSuccess: () => {
      toast.success("商品已建立");
      setShowForm(false);
      setForm(emptyForm);
      utils.shop.adminList.invalidate();
      utils.shop.publicList.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });
  const updateProduct = trpc.shop.update.useMutation({
    onSuccess: () => {
      toast.success("商品已更新");
      setEditingId(null);
      utils.shop.adminList.invalidate();
      utils.shop.publicList.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });
  const deleteProduct = trpc.shop.delete.useMutation({
    onSuccess: () => {
      toast.success("商品已刪除");
      utils.shop.adminList.invalidate();
      utils.shop.publicList.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });
  const updateOrderStatus = trpc.shop.updateOrderStatus.useMutation({
    onSuccess: () => {
      toast.success("訂單狀態已更新");
      utils.shop.adminOrders.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const updateForm = (changes: Partial<ProductForm>) => setForm((current) => ({ ...current, ...changes }));

  const validateForm = () => {
    const priceMinor = parseHkdToMinorUnits(form.priceHkd);
    const inventoryQuantity = Number(form.inventoryQuantity);
    const weightGrams = Number(form.weightGrams);
    const sortOrder = Number(form.sortOrder);
    if (!form.title.trim() || !form.slug.trim() || !form.description.trim()) {
      toast.error("請填寫商品名稱、Slug 及商品介紹");
      return null;
    }
    if (priceMinor === null || !isValidInventoryQuantity(form.inventoryQuantity) || !Number.isInteger(weightGrams) || weightGrams < 0 || !Number.isInteger(sortOrder)) {
      toast.error("請輸入有效的 HKD 售價、庫存數量、包裝重量及排序值");
      return null;
    }
    return { priceMinor, inventoryQuantity, weightGrams, sortOrder };
  };

  const handleCreate = () => {
    const values = validateForm();
    if (!values) return;
    createProduct.mutate({
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      category: form.category,
      shippingClass: form.shippingClass,
      currency: "HKD",
      coverUrl: form.coverUrl || null,
      coverKey: form.coverKey || null,
      active: form.active,
      ...values,
    });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    const values = validateForm();
    if (!values) return;
    updateProduct.mutate({
      id: editingId,
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      category: form.category,
      shippingClass: form.shippingClass,
      currency: "HKD",
      coverUrl: form.coverUrl || null,
      coverKey: form.coverKey || null,
      active: form.active,
      ...values,
    });
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const startEdit = (product: NonNullable<typeof products>[number]) => {
    setShowForm(false);
    setEditingId(product.id);
    setForm({
      title: product.title,
      slug: product.slug,
      description: product.description,
      category: product.category,
      priceHkd: formatHkdFromMinorUnits(product.priceMinor),
      inventoryQuantity: String(product.inventoryQuantity),
      shippingClass: product.shippingClass,
      weightGrams: String(product.weightGrams),
      coverUrl: product.coverUrl ?? "",
      coverKey: product.coverKey ?? "",
      active: product.active,
      sortOrder: String(product.sortOrder),
    });
  };

  const handleCoverUpload = async (params: { dataBase64: string; contentType: string; filename: string }) => {
    const result = await uploadCover.mutateAsync(params);
    updateForm({ coverUrl: result.url });
    return result;
  };

  return (
    <AdminLayout title="行旅選物管理">
      <div className="max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-muted-foreground">共 {products?.length ?? 0} 件商品</p>
            <p className="text-xs text-muted-foreground/70 mt-1">貨幣固定為 HKD；商品預設為下架，需確認圖片、庫存及配送安排後再上架。</p>
          </div>
          <button type="button" onClick={startCreate} className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-4 py-2.5 text-xs tracking-wider hover:bg-foreground/80 transition-colors">
            <Plus size={13} /> 新增商品
          </button>
        </div>

        {(showForm || editingId) && (
          <div className="border border-border bg-secondary/10 p-4 sm:p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-lg font-light">{editingId ? "編輯商品" : "新增商品"}</h2>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="text-muted-foreground hover:text-foreground" aria-label="關閉商品表單">
                <X size={17} />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="text-xs text-muted-foreground tracking-wider">
                    商品名稱 *
                    <input value={form.title} onChange={(event) => updateForm({ title: event.target.value })} className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground" placeholder="例如：旅途中拾得的藍磚杯墊" />
                  </label>
                  <label className="text-xs text-muted-foreground tracking-wider">
                    Slug *
                    <input value={form.slug} onChange={(event) => updateForm({ slug: event.target.value })} className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-foreground" placeholder="lisbon-tile-coaster" />
                  </label>
                </div>
                <label className="text-xs text-muted-foreground tracking-wider block">
                  商品介紹 *
                  <textarea value={form.description} onChange={(event) => updateForm({ description: event.target.value })} rows={4} className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:border-foreground resize-y" placeholder="介紹物件的來源、材質、尺寸或背後故事。" />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <label className="text-xs text-muted-foreground tracking-wider">
                    分類
                    <select value={form.category} onChange={(event) => updateForm({ category: event.target.value as ProductForm["category"] })} className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground">
                      <option value="自製物件">自製物件</option>
                      <option value="旅途小物">旅途小物</option>
                    </select>
                  </label>
                  <label className="text-xs text-muted-foreground tracking-wider">
                    售價（HKD） *
                    <input type="number" min="0" step="0.01" value={form.priceHkd} onChange={(event) => updateForm({ priceHkd: event.target.value })} className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground" placeholder="180.00" />
                  </label>
                  <label className="text-xs text-muted-foreground tracking-wider">
                    庫存數量 *
                    <input type="number" min="0" step="1" value={form.inventoryQuantity} onChange={(event) => updateForm({ inventoryQuantity: event.target.value })} className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground" />
                  </label>
                  <label className="text-xs text-muted-foreground tracking-wider">
                    寄件類別
                    <select value={form.shippingClass} onChange={(event) => updateForm({ shippingClass: event.target.value as ProductForm["shippingClass"] })} className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground">
                      <option value="G">G 大型信件／包裹</option>
                      <option value="P">P 小型信件／包裹</option>
                      <option value="E">E 郵包</option>
                    </select>
                  </label>
                  <label className="text-xs text-muted-foreground tracking-wider">
                    包裝重量（克） *
                    <input type="number" min="0" step="1" value={form.weightGrams} onChange={(event) => updateForm({ weightGrams: event.target.value })} className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground" placeholder="例如：100" />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="text-xs text-muted-foreground tracking-wider">
                    排序值
                    <input type="number" step="1" value={form.sortOrder} onChange={(event) => updateForm({ sortOrder: event.target.value })} className="mt-1.5 w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground" />
                  </label>
                  <label className="flex items-center gap-3 text-xs text-muted-foreground tracking-wider pt-6">
                    <input type="checkbox" checked={form.active} onChange={(event) => updateForm({ active: event.target.checked })} className="h-4 w-4 accent-foreground" />
                    立即上架
                  </label>
                </div>
              </div>
              <ImageUploader
                currentUrl={form.coverUrl || null}
                onUploaded={(url) => updateForm({ coverUrl: url })}
                onUpload={handleCoverUpload}
                uploading={uploadCover.isPending}
                aspectRatio="4/5"
                label="商品封面"
              />
            </div>
            <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-border">
              <button type="button" onClick={editingId ? handleUpdate : handleCreate} disabled={createProduct.isPending || updateProduct.isPending} className="bg-foreground text-background px-5 py-2.5 text-xs tracking-wider hover:bg-foreground/80 disabled:opacity-50 transition-colors">
                {createProduct.isPending || updateProduct.isPending ? "儲存中..." : editingId ? "儲存變更" : "建立商品"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="border border-border px-5 py-2.5 text-xs tracking-wider hover:border-foreground transition-colors">取消</button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-24 bg-secondary/30 animate-pulse" />)}
          </div>
        ) : products && products.length > 0 ? (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col sm:flex-row sm:items-center gap-4 border border-border p-4">
                <div className="w-20 h-20 bg-secondary flex-shrink-0 overflow-hidden">
                  {product.coverUrl ? <img src={product.coverUrl} alt={product.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ShoppingBag size={20} strokeWidth={1} /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-base font-light">{product.title}</h2>
                    <span className="border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{product.category}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-1 truncate">{product.slug}</p>
                  <p className="text-xs text-muted-foreground mt-2">HK$ {(product.priceMinor / 100).toFixed(2)} ・ 庫存 {product.inventoryQuantity} ・ 可售 {Math.max(product.inventoryQuantity - product.reservedQuantity, 0)} ・ {product.shippingClass}／{product.weightGrams}g ・ {product.active ? "已上架" : "草稿／下架"}</p>
                </div>
                <div className="flex items-center gap-3 sm:flex-shrink-0">
                  <button type="button" onClick={() => startEdit(product)} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"><Pencil size={13} /> 編輯</button>
                  <button type="button" onClick={() => updateProduct.mutate({ id: product.id, active: !product.active })} className="p-1 text-muted-foreground hover:text-foreground" title={product.active ? "下架" : "上架"}>{product.active ? <Eye size={15} /> : <EyeOff size={15} />}</button>
                  <button type="button" onClick={() => { if (window.confirm(`確定刪除「${product.title}」？`)) deleteProduct.mutate({ id: product.id }); }} className="p-1 text-muted-foreground hover:text-destructive" title="刪除"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border py-20 text-center">
            <ShoppingBag size={30} strokeWidth={1} className="mx-auto text-muted-foreground mb-4" />
            <p className="font-serif text-xl font-light">尚未加入商品</p>
            <p className="text-sm text-muted-foreground mt-2">先建立商品，確認資料與庫存後再決定是否上架。</p>
          </div>
        )}

        <section className="mt-16 pt-8 border-t border-border">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-xs text-muted-foreground tracking-[0.16em] uppercase mb-2">Orders</p>
              <h2 className="font-serif text-2xl font-light">訂單與出貨</h2>
            </div>
            <p className="text-xs text-muted-foreground">{orders?.length ?? 0} 張訂單</p>
          </div>
          {ordersLoading ? (
            <div className="h-24 bg-secondary/30 animate-pulse" />
          ) : orders && orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border border-border p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-serif">訂單 #{order.id} ・ {order.customerName || "未提供姓名"}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{order.customerEmail}</p>
                      <p className="text-xs text-muted-foreground mt-2">{order.items.map((item) => `${item.productTitle} × ${item.quantity}`).join("、")}</p>
                    </div>
                    <div className="flex items-center gap-3 lg:flex-shrink-0">
                      <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("zh-HK")}</span>
                      <select
                        value={order.fulfillmentStatus}
                        onChange={(event) => updateOrderStatus.mutate({ id: order.id, fulfillmentStatus: event.target.value as "pending" | "processing" | "shipped" | "fulfilled" | "cancelled" })}
                        className="border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-foreground"
                        aria-label={`更新訂單 ${order.id} 狀態`}
                      >
                        <option value="pending">待處理</option>
                        <option value="processing">處理中</option>
                        <option value="shipped">已寄出</option>
                        <option value="fulfilled">已完成</option>
                        <option value="cancelled">已取消</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border py-12 text-center text-sm text-muted-foreground">付款完成後，訂單會出現在這裡。</div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
