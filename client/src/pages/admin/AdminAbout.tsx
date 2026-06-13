import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Save } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

export default function AdminAbout() {
  const utils = trpc.useUtils();
  const { data: about } = trpc.about.get.useQuery();

  const [philosophy, setPhilosophy] = useState("");
  const [blogOrigin, setBlogOrigin] = useState("");
  const [countriesVisited, setCountriesVisited] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoKey, setPhotoKey] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (about) {
      setPhilosophy(about.philosophy ?? "");
      setBlogOrigin(about.blogOrigin ?? "");
      setCountriesVisited(about.countriesVisited ?? "");
      setPhotoUrl(about.photoUrl ?? "");
      setPhotoKey(about.photoKey ?? "");
    }
  }, [about]);

  const uploadPhotoMutation = trpc.about.uploadPhoto.useMutation();

  const updateAbout = trpc.about.update.useMutation({
    onSuccess: () => {
      utils.about.get.invalidate();
      toast.success("關於我已更新");
    },
    onError: (e: { message: string }) => toast.error("更新失敗：" + e.message),
  });

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
        <div className="max-w-xs">
          <ImageUploader
            label="個人意境照"
            currentUrl={photoUrl}
            uploading={uploading}
            aspectRatio="3/4"
            onUpload={async (params) => {
              setUploading(true);
              try {
                return await uploadPhotoMutation.mutateAsync(params);
              } finally {
                setUploading(false);
              }
            }}
            onUploaded={(url) => {
              setPhotoUrl(url);
              if (!url) setPhotoKey("");
            }}
          />
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
