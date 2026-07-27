import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";
import { Plus, Trash2, Upload, BookOpen, Eye, EyeOff, Pencil, X } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type BookletForm = {
  title: string;
  slug: string;
  description: string;
  fileUrl: string;
  fileKey: string;
  coverUrl: string;
  embedUrl: string;
  active: boolean;
  sortOrder: number;
};

const emptyForm: BookletForm = {
  title: "",
  slug: "",
  description: "",
  fileUrl: "",
  fileKey: "",
  coverUrl: "",
  embedUrl: "",
  active: true,
  sortOrder: 0,
};

export default function AdminBooklets() {
  const { data: booklets, isLoading, refetch } = trpc.booklets.adminList.useQuery();
  const utils = trpc.useUtils();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BookletForm>(emptyForm);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const pdfRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.booklets.uploadFile.useMutation();
  const createMutation = trpc.booklets.create.useMutation({
    onSuccess: () => {
      toast.success("小冊子已建立");
      setShowForm(false);
      setForm(emptyForm);
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });
  const deleteMutation = trpc.booklets.delete.useMutation({
    onSuccess: () => {
      toast.success("小冊子已刪除");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });
  const updateMutation = trpc.booklets.update.useMutation({
    onSuccess: () => {
      toast.success("更新成功");
      setEditingId(null);
      utils.booklets.adminList.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so the same file can be re-selected after an error
    e.target.value = "";
    // Validate file type
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("請選擇 PDF 格式的檔案");
      return;
    }
    // Validate file size (max 20 MB)
    const MAX_PDF_MB = 20;
    if (file.size > MAX_PDF_MB * 1024 * 1024) {
      toast.error(`PDF 大小不能超過 ${MAX_PDF_MB}MB（目前：${(file.size / 1024 / 1024).toFixed(1)}MB）`);
      return;
    }
    setUploadingPdf(true);
    try {
      const dataBase64 = await fileToBase64(file);
      const result = await uploadMutation.mutateAsync({
        filename: file.name,
        contentType: "application/pdf",
        dataBase64,
        type: "pdf",
      });
      setForm((f) => ({ ...f, fileUrl: result.url, fileKey: result.key }));
      toast.success("PDF 上傳成功");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "PDF 上傳失敗，請稍後再試";
      toast.error(message);
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.fileUrl) {
      toast.error("請填寫標題、Slug 並上傳 PDF");
      return;
    }
    createMutation.mutate({
      ...form,
      embedUrl: form.embedUrl.trim() || null,
    });
  };

  const handleEditStart = (b: typeof booklets extends (infer T)[] | undefined ? T : never) => {
    if (!b) return;
    setEditingId(b.id);
    setForm({
      title: b.title,
      slug: b.slug,
      description: b.description ?? "",
      fileUrl: b.fileUrl ?? "",
      fileKey: b.fileKey ?? "",
      coverUrl: b.coverUrl ?? "",
      embedUrl: (b as any).embedUrl ?? "",
      active: b.active,
      sortOrder: b.sortOrder,
    });
  };

  const handleEditSave = () => {
    if (!editingId) return;
    updateMutation.mutate({
      id: editingId,
      title: form.title,
      slug: form.slug,
      description: form.description || null,
      fileUrl: form.fileUrl,
      fileKey: form.fileKey,
      coverUrl: form.coverUrl || null,
      embedUrl: form.embedUrl.trim() || null,
      active: form.active,
      sortOrder: form.sortOrder,
    });
  };

  return (
    <AdminLayout title="小冊子管理">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-muted-foreground">共 {booklets?.length ?? 0} 本小冊子</p>
          <button
            onClick={() => { setShowForm((v) => !v); setEditingId(null); }}
            className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs tracking-wider hover:bg-foreground/80 transition-colors"
          >
            <Plus size={12} /> 新增小冊子
          </button>
        </div>

        {/* Create Form */}
        {showForm && !editingId && (
          <div className="border border-border p-6 mb-8 bg-secondary/10">
            <h3 className="font-serif text-base font-light mb-5">新增小冊子</h3>
            <BookletFormFields
              form={form}
              setForm={setForm}
              uploadMutation={uploadMutation}
              uploadingPdf={uploadingPdf}
              setUploadingPdf={setUploadingPdf}
              uploadingCover={uploadingCover}
              setUploadingCover={setUploadingCover}
              pdfRef={pdfRef}
              handlePdfUpload={handlePdfUpload}
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="bg-foreground text-background px-5 py-2 text-xs tracking-widest hover:bg-foreground/80 transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? "建立中..." : "建立小冊子"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-border px-5 py-2 text-xs tracking-widest hover:border-foreground transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* Edit Form */}
        {editingId && (
          <div className="border border-border p-6 mb-8 bg-secondary/10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-base font-light">編輯小冊子</h3>
              <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            <BookletFormFields
              form={form}
              setForm={setForm}
              uploadMutation={uploadMutation}
              uploadingPdf={uploadingPdf}
              setUploadingPdf={setUploadingPdf}
              uploadingCover={uploadingCover}
              setUploadingCover={setUploadingCover}
              pdfRef={pdfRef}
              handlePdfUpload={handlePdfUpload}
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleEditSave}
                disabled={updateMutation.isPending}
                className="bg-foreground text-background px-5 py-2 text-xs tracking-widest hover:bg-foreground/80 transition-colors disabled:opacity-50"
              >
                {updateMutation.isPending ? "儲存中..." : "儲存變更"}
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="border border-border px-5 py-2 text-xs tracking-widest hover:border-foreground transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-secondary/30 animate-pulse" />
            ))}
          </div>
        ) : booklets && booklets.length > 0 ? (
          <div className="space-y-3">
            {booklets.map((b) => (
              <div key={b.id} className="flex items-center gap-4 border border-border p-4">
                {b.coverUrl ? (
                  <img src={b.coverUrl} alt={b.title} className="w-12 h-16 object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-16 bg-secondary flex items-center justify-center flex-shrink-0">
                    <BookOpen size={16} className="text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm">{b.title}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{b.slug}</p>
                  {b.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{b.description}</p>
                  )}
                  {(b as any).embedUrl && (
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate">
                      🔗 {(b as any).embedUrl}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEditStart(b)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="編輯"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => updateMutation.mutate({ id: b.id, active: !b.active })}
                    className={`text-xs px-2 py-0.5 ${b.active ? "text-foreground" : "text-muted-foreground"}`}
                    title={b.active ? "隱藏" : "顯示"}
                  >
                    {b.active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`確定刪除「${b.title}」？`)) deleteMutation.mutate({ id: b.id });
                    }}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    title="刪除"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border">
            <p className="text-sm text-muted-foreground">尚無小冊子</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// ── Shared form fields component ──────────────────────────────────────────────
function BookletFormFields({
  form,
  setForm,
  uploadMutation,
  uploadingPdf,
  setUploadingPdf,
  uploadingCover,
  setUploadingCover,
  pdfRef,
  handlePdfUpload,
}: {
  form: BookletForm;
  setForm: React.Dispatch<React.SetStateAction<BookletForm>>;
  uploadMutation: ReturnType<typeof trpc.booklets.uploadFile.useMutation>;
  uploadingPdf: boolean;
  setUploadingPdf: (v: boolean) => void;
  uploadingCover: boolean;
  setUploadingCover: (v: boolean) => void;
  pdfRef: React.RefObject<HTMLInputElement | null>;
  handlePdfUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">標題 *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
            placeholder="熊野古道旅遊指南"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">Slug *</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            required
            className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground font-mono"
            placeholder="kumano-kodo"
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">描述</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={2}
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground resize-none"
          placeholder="小冊子簡介"
        />
      </div>

      {/* Embed URL */}
      <div>
        <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">
          嵌入網址（embedUrl）
        </label>
        <input
          type="url"
          value={form.embedUrl}
          onChange={(e) => setForm((f) => ({ ...f, embedUrl: e.target.value }))}
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground font-mono"
          placeholder="https://example.com（填入後小冊子頁面將顯示「開啟互動式旅遊指南」按鈕）"
        />
        <p className="text-xs text-muted-foreground mt-1">
          填入後，小冊子頁面將顯示「開啟互動式旅遊指南」按鈕，點擊可全螢幕嵌入外部網站。
        </p>
      </div>

      {/* PDF + Cover 並排 */}
      <div className="grid grid-cols-2 gap-4 items-start">
        {/* PDF 上傳 */}
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">PDF 檔案 *</label>
          {form.fileUrl ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border px-3 py-2">
              <BookOpen size={12} />
              <span className="truncate flex-1">PDF 已上傳</span>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, fileUrl: "", fileKey: "" }))}
                className="text-destructive hover:underline flex-shrink-0"
              >
                移除
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => pdfRef.current?.click()}
              disabled={uploadingPdf}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-border px-4 py-6 text-xs text-muted-foreground hover:border-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <Upload size={14} />
              {uploadingPdf ? "上傳中..." : "點擊上傳 PDF"}
            </button>
          )}
          <input ref={pdfRef} type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
        </div>

        {/* 封面圖片 — 使用 ImageUploader */}
        <ImageUploader
          label="封面圖片"
          currentUrl={form.coverUrl}
          uploading={uploadingCover}
          aspectRatio="3/4"
          onUpload={async (params) => {
            setUploadingCover(true);
            try {
              return await uploadMutation.mutateAsync({ ...params, type: "cover" });
            } finally {
              setUploadingCover(false);
            }
          }}
          onUploaded={(url) => setForm((f) => ({ ...f, coverUrl: url }))}
        />
      </div>
    </div>
  );
}
