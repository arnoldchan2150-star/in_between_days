import { useRef, useState } from "react";
import { Film, ImagePlus, Loader2, Upload } from "lucide-react";

type MediaUploaderProps = {
  onFiles: (files: File[]) => void;
  uploading?: boolean;
  multiple?: boolean;
  label?: string;
};

/** Reusable drag-and-drop picker for image and self-hosted video media. */
export default function MediaUploader({
  onFiles,
  uploading = false,
  multiple = true,
  label = "新增圖片或影片",
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const emitFiles = (fileList: FileList | null) => {
    if (!fileList?.length || uploading) return;
    onFiles(Array.from(fileList));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => !uploading && inputRef.current?.click()}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && !uploading) {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!uploading) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        emitFiles(event.dataTransfer.files);
      }}
      className={`border border-dashed rounded p-8 text-center transition-colors cursor-pointer ${
        dragging ? "border-foreground bg-muted" : "border-border hover:border-foreground"
      } ${uploading ? "cursor-wait opacity-70" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/mp4,video/webm,video/quicktime"
        multiple={multiple}
        className="hidden"
        onChange={(event) => {
          emitFiles(event.target.files);
          event.target.value = "";
        }}
      />
      {uploading ? (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-xs tracking-wider">上傳中...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <ImagePlus size={22} />
            <Film size={22} />
          </div>
          <p className="text-sm">拖放圖片或影片至此，或點擊選擇檔案</p>
          <p className="text-xs text-muted-foreground/70">
            JPG、PNG、WEBP、MP4、WebM；圖片最大 10MB，影片最大 100MB
          </p>
        </div>
      )}
    </div>
  );
}
