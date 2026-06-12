import { useState, useEffect, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Upload, Save } from "lucide-react";

export default function AdminAbout() {
  const utils = trpc.useUtils();
  const { data: about } = trpc.about.get.useQuery();

  const [philosophy, setPhilosophy] = useState("");
  const [blogOrigin, setBlogOrigin] = useState("");
  const [countriesVisited, setCountriesVisited] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoKey, setPhotoKey] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (about) {
      setPhilosophy(about.philosophy ?? "");
      setBlogOrigin(about.blogOrigin ?? "");
      setCountriesVisited(about.countriesVisited ?? "");
      setPhotoUrl(about.photoUrl ?? "");
      setPhotoKey(about.photoKey ?? "");
    }
  }, [about]);

  const uploadPhotoMutation = trpc.about.uploadPhoto.useMutation({
    onSuccess: (data: { url: string; key: string }) => {
      setPhotoUrl(data.url);
      setPhotoKey(data.key);
      toast.success("照片已上傳");
      setUploading(false);
    },
    onError: (e: { message: string }) => {
      toast.error("上傳失敗：" + e.message);
      setUploading(false);
    },
  });

  const updateAbout = trpc.about.update.useMutation({
    onSuccess: () => {
      utils.about.get.invalidate();
      toast.success("關於我已更新");
    },
    onError: (e: { message: string }) => toast.error("更新失敗：" + e.message),
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataBase64 = (reader.result as string).split(",")[1] ?? "";
      uploadPhotoMutation.mutate({
        filename: file.name,
        contentType: file.type,
        dataBase64,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateAbout.mutate({
      philosophy: philosophy || undefined,
      blogOrigin: blogOrigin || undefined,
      countriesVisited: countriesVisited || undefined,
      photoUrl: photoUrl || undefined,
      photoKey: photoKey || undefined,
    });
  };

  return (
    <AdminLayout title="關於我設定">
      <div className="max-w-2xl space-y-8">
        {/* Photo */}
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-3">個人意境照</label>
          <div className="flex items-start gap-4">
            {photoUrl && (
              <img
                src={photoUrl}
                alt="個人照"
                className="w-24 aspect-[3/4] object-cover"
              />
            )}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 border border-dashed border-border px-4 py-2 text-xs text-muted-foreground hover:border-foreground transition-colors disabled:opacity-50"
              >
                <Upload size={12} />
                {uploading ? "上傳中..." : "上傳照片"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="或直接貼上圖片 URL"
                className="border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:border-foreground transition-colors w-64"
              />
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-2">旅行理念</label>
          <textarea
            value={philosophy}
            onChange={(e) => setPhilosophy(e.target.value)}
            rows={8}
            placeholder="生活如長路，旅行便是途中屬於我的留白..."
            className="w-full border border-border bg-background p-4 text-sm font-serif font-light focus:outline-none focus:border-foreground transition-colors resize-y leading-loose"
          />
          <p className="text-xs text-muted-foreground/60 mt-1">支援純文字格式</p>
        </div>

        {/* Blog origin */}
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-2">部落格初衷</label>
          <textarea
            value={blogOrigin}
            onChange={(e) => setBlogOrigin(e.target.value)}
            rows={6}
            placeholder="「In-Between Days」取自..."
            className="w-full border border-border bg-background p-4 text-sm font-serif font-light focus:outline-none focus:border-foreground transition-colors resize-y leading-loose"
          />
        </div>

        {/* Countries */}
        <div>
          <label className="text-xs text-muted-foreground tracking-wider block mb-2">走過的國家</label>
          <textarea
            value={countriesVisited}
            onChange={(e) => setCountriesVisited(e.target.value)}
            rows={3}
            placeholder="日本、韓國、法國、義大利、秘魯..."
            className="w-full border border-border bg-background p-4 text-sm focus:outline-none focus:border-foreground transition-colors resize-y"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={updateAbout.isPending}
          className="flex items-center gap-2 bg-foreground text-background px-6 py-2.5 text-xs tracking-widest hover:bg-foreground/80 transition-colors disabled:opacity-50"
        >
          <Save size={13} />
          {updateAbout.isPending ? "儲存中..." : "儲存設定"}
        </button>
      </div>
    </AdminLayout>
  );
}
