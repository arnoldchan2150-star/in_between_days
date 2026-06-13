import { useRef, useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  /** 目前顯示的圖片 URL（預覽用） */
  currentUrl?: string | null;
  /** 上傳完成後回傳 URL */
  onUploaded: (url: string) => void;
  /** 呼叫後端上傳 mutation */
  onUpload: (params: { dataBase64: string; contentType: string; filename: string }) => Promise<{ url: string }>;
  /** 是否正在上傳 */
  uploading?: boolean;
  /** 圖片比例（CSS aspect-ratio），預設 16/9 */
  aspectRatio?: string;
  /** 說明文字 */
  label?: string;
}

export default function ImageUploader({
  currentUrl,
  onUploaded,
  onUpload,
  uploading: externalUploading,
  aspectRatio = "16/9",
  label = "封面圖片",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localUploading, setLocalUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const isUploading = externalUploading || localUploading;
  const displayUrl = preview || currentUrl;

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("請選擇圖片檔案（JPG、PNG、WEBP、GIF）");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("圖片大小不能超過 10MB");
        return;
      }

      // 本地預覽
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // 轉 base64 上傳
      setLocalUploading(true);
      try {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            // 移除 data:image/...;base64, 前綴
            resolve(result.split(",")[1] ?? "");
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const result = await onUpload({
          dataBase64: base64,
          contentType: file.type,
          filename: file.name,
        });
        onUploaded(result.url);
        toast.success("圖片上傳成功");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "上傳失敗，請稍後再試";
        toast.error(message);
        setPreview(null);
      } finally {
        setLocalUploading(false);
      }
    },
    [onUpload, onUploaded]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // 重置 input 讓同一檔案可以再次選擇
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onUploaded("");
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs text-muted-foreground tracking-wider block">{label}</label>

      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{ aspectRatio }}
        className={`relative w-full border-2 border-dashed transition-colors cursor-pointer overflow-hidden bg-secondary/30
          ${dragging ? "border-foreground bg-secondary/60" : "border-border hover:border-foreground/40"}
          ${isUploading ? "cursor-wait" : ""}
        `}
      >
        {displayUrl ? (
          <>
            <img
              src={displayUrl}
              alt="封面預覽"
              className="w-full h-full object-cover"
            />
            {/* 遮罩：hover 顯示更換提示 */}
            {!isUploading && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center group">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs tracking-widest flex items-center gap-2">
                  <Upload size={13} /> 點擊更換圖片
                </span>
              </div>
            )}
            {/* 清除按鈕 */}
            {!isUploading && (
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors z-10"
                title="移除圖片"
              >
                <X size={12} />
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            {isUploading ? (
              <>
                <Loader2 size={28} className="animate-spin" />
                <span className="text-xs tracking-wider">上傳中...</span>
              </>
            ) : (
              <>
                <ImageIcon size={28} />
                <div className="text-center">
                  <p className="text-xs tracking-wider">點擊或拖放圖片至此</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">JPG、PNG、WEBP，最大 10MB</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* 上傳中遮罩 */}
        {isUploading && displayUrl && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 size={28} className="animate-spin text-white" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
