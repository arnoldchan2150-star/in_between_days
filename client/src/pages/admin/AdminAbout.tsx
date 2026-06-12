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

  const uploadFile = trpc.upload.uploadFile.useMutation({
    onSuccess: (data) => {
      setPhotoUrl(data.url);
      setPhotoKey(data.key);
      toast.success("照片已上傳");
      setUploading(false);
    },
    onError: (e) => {
      toast.error("上傳失敗：" + e.message);
      setUploading(false);
    },
  });

  const updateAbout = trpc.about.update.useMutation({
    onSuccess: () => {
      utils.about.get.invalidate();
      toast.success("關於我已更新");
    },
    onError: (e) => toast.error("更新失敗：" + e.message),
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadFile.mutate({
        base64,
        filename: file.name,
        contentType: file.type,
        folder: "about",
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
          <label className="text-label block mb-3">個人意境照</label>
          <div className="flex items-start gap-4">
            {photoUrl && (
              <img
                src={photoUrl}
                alt="個人照"
                className="w-24 aspect-[3/4] object-cover object-top img-travel"
              />
            )}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn-minimal text-xs"
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
                className="border-b border-border bg-transparent py-1.5 text-xs outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40 w-64"
              />
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <div>
          <label className="text-label block mb-2">旅行理念</label>
          <textarea
            value={philosophy}
            onChange={(e) => setPhilosophy(e.target.value)}
            rows={8}
            placeholder="生活如長路，旅行便是途中屬於我的留白..."
            className="w-full border border-border bg-transparent p-4 text-sm font-serif font-light outline-none focus:border-foreground transition-colors resize-y placeholder:text-muted-foreground/30 leading-loose"
          />
          <p className="text-[0.65rem] text-muted-foreground/60 mt-1">支援 Markdown 格式</p>
        </div>

        {/* Blog origin */}
        <div>
          <label className="text-label block mb-2">部落格初衷</label>
          <textarea
            value={blogOrigin}
            onChange={(e) => setBlogOrigin(e.target.value)}
            rows={6}
            placeholder="「In-Between Days」取自..."
            className="w-full border border-border bg-transparent p-4 text-sm font-serif font-light outline-none focus:border-foreground transition-colors resize-y placeholder:text-muted-foreground/30 leading-loose"
          />
        </div>

        {/* Countries */}
        <div>
          <label className="text-label block mb-2">走過的國家（JSON 陣列格式）</label>
          <textarea
            value={countriesVisited}
            onChange={(e) => setCountriesVisited(e.target.value)}
            rows={4}
            placeholder='["日本", "韓國", "法國", "義大利"]'
            className="w-full border border-border bg-transparent p-4 text-sm font-mono outline-none focus:border-foreground transition-colors resize-y placeholder:text-muted-foreground/30"
          />
          <p className="text-[0.65rem] text-muted-foreground/60 mt-1">
            請使用 JSON 陣列格式，例如：["日本", "法國", "秘魯"]
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={updateAbout.isPending}
          className="btn-filled text-xs"
        >
          <Save size={13} />
          {updateAbout.isPending ? "儲存中..." : "儲存設定"}
        </button>
      </div>
    </AdminLayout>
  );
}
