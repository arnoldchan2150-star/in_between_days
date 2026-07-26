import { useRef, useState, useCallback } from "react";
import { Upload, X, Video, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VideoUploaderProps {
  /** 目前顯示的影片 URL（預覽用） */
  currentUrl?: string | null;
  /** 上傳完成後回傳 URL */
  onUploaded: (url: string) => void;
  /** 呼叫後端上傳 mutation */
  onUpload: (params: { dataBase64: string; contentType: string; filename: string }) => Promise<{ url: string }>;
  /** 是否正在上傳 */
  uploading?: boolean;
  /** 說明文字 */
  label?: string;
  /** 最大檔案大小（MB），預設 200MB */
  maxSizeMB?: number;
}

export default function VideoUploader({
  currentUrl,
  onUploaded,
  onUpload,
  uploading: externalUploading,
  label = "上傳影片",
  maxSizeMB = 200,
}: VideoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localUploading, setLocalUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const isUploading = externalUploading || localUploading;
  const displayUrl = preview || currentUrl;

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("video/")) {
        toast.error("請選擇影片檔案（MP4、MOV、AVI、WEBM）");
        return;
      }
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        toast.error(`影片大小不能超過 ${maxSizeMB}MB`);
        return;
      }

      // 本地預覽
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setProgress(0);

      setLocalUploading(true);
      try {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1] ?? "");
          };
          reader.onprogress = (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 50));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        setProgress(60);
        const result = await onUpload({
          dataBase64: base64,
          contentType: file.type,
          filename: file.name,
        });
        setProgress(100);
        onUploaded(result.url);
        toast.success("影片上傳成功");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "上傳失敗，請稍後再試";
        toast.error(message);
        setPreview(null);
      } finally {
        setLocalUploading(false);
        setProgress(0);
      }
    },
    [onUpload, onUploaded, maxSizeMB]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
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

  const clearVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onUploaded("");
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs text-muted-foreground tracking-wider block">{label}</label>

      <div
        onClick={() => !isUploading && !displayUrl && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative w-full border-2 border-dashed transition-colors overflow-hidden bg-secondary/30
          ${dragging ? "border-foreground bg-secondary/60" : "border-border hover:border-foreground/40"}
          ${isUploading ? "cursor-wait" : displayUrl ? "" : "cursor-pointer"}
        `}
        style={{ aspectRatio: "16/9" }}
      >
        {displayUrl ? (
          <>
            <video
              src={displayUrl}
              controls
              className="w-full h-full object-contain bg-black"
              preload="metadata"
            />
            {/* 清除按鈕 */}
            {!isUploading && (
              <button
                type="button"
                onClick={clearVideo}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors z-10"
                title="移除影片"
              >
                <X size={12} />
              </button>
            )}
            {/* 更換按鈕 */}
            {!isUploading && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-3 py-1.5 hover:bg-black/80 transition-colors z-10 flex items-center gap-1.5"
              >
                <Upload size={11} /> 更換影片
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            {isUploading ? (
              <>
                <Loader2 size={28} className="animate-spin" />
                <span className="text-xs tracking-wider">上傳中... {progress > 0 ? `${progress}%` : ""}</span>
                {progress > 0 && (
                  <div className="w-48 h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <Video size={28} />
                <div className="text-center">
                  <p className="text-xs tracking-wider">點擊或拖放影片至此</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    MP4、MOV、WEBM，最大 {maxSizeMB}MB
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* 上傳中遮罩 */}
        {isUploading && displayUrl && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
            <Loader2 size={28} className="animate-spin text-white" />
            <span className="text-white text-xs">{progress > 0 ? `${progress}%` : "上傳中..."}</span>
            {progress > 0 && (
              <div className="w-48 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
