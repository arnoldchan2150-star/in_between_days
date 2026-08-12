# 熊野古道小冊子嵌入驗證

- 資料庫記錄：booklets.slug = `kumano-kodo-nakahechi`，title = `熊野古道：中邊路朝聖之旅`，active = 1。
- 已將 `embedUrl` 更新為 `https://kumano-guide-jkdkp37c.manus.space/`。
- 使用者提供的外部網址可正常開啟，頁面標題為「熊野古道｜朝聖者筆記」，包含互動指南內容與圖片。
- `/booklet` 頁面切換至熊野古道分頁後，標題、封面、描述與「開啟互動式旅遊指南」按鈕正常顯示。
- 點擊後進入嵌入模式；瀏覽器 DOM 確認 iframe `src` 為 `https://kumano-guide-jkdkp37c.manus.space/`，尺寸為 1280 × 1045。
- 預覽模式底部顯示「This page is not live and cannot be shared directly」，屬於預覽環境提示，不是 iframe 來源錯誤；正式發布後需再次確認公開頁面。
