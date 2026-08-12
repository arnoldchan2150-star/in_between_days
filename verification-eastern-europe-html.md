

## 全畫面 HTML 驗證

- 文章路徑：`/culture/eastern-europe-travel-notes-2018`。
- 頁面可見操作：返回「靈感拾光」與「在新分頁開啟」。
- DOM 確認 iframe `src` 為 `https://files.manuscdn.com/user_upload_by_module/session_file/310519663825344904/YlaiUsEWCicADsxH.html`，尺寸為 1280 × 1100，class 為 `block h-[100dvh] w-full border-0`。
- 頁面不再渲染一般文章標題、封面、內容卡片或內嵌框；HTML 內容以全畫面 iframe 顯示。
- 預覽截圖中的外部 iframe 內容區呈空白，屬於預覽環境對外部跨來源內容的視覺限制；iframe src 與尺寸均已由 DOM 驗證。
- TypeScript 檢查及 13 項 Vitest 測試通過。
