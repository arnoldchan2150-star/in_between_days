# 行旅資料庫指南驗證

## 2026-08-12

- 神山指南資料已從本機 `file://` 路徑改為 WebDev 儲存的 `/manus-storage/koyama-guide_0dba8315.html`。
- `/booklet?guide=mt-kinabalu-guide` 可顯示「返回行旅資料庫」與「在新分頁開啟」，iframe 來源為新的 WebDev HTML。
- 點擊「返回行旅資料庫」後，成功回到首頁 `/`；這代表目前返回按鈕會離開 `/booklet`，仍需進一步修正為回到 `/booklet` 列表頁。

追加驗證：重新載入 `/booklet?guide=mt-kinabalu-guide` 後，神山 HTML 已在 iframe 中實際呈現，頁面內可見神山圖片、導覽列與內容章節；「返回行旅資料庫」目前為原生 `/booklet` 連結，可避免先前按鈕事件被錯誤帶回首頁。
