# 兩篇新文章驗證

## Circumstance
文章路由為 `/culture/circumstance-the-youth-is-no-longer-a-form`，頁面顯示分類「中東」、發布日期 2021 年 12 月 15 日，主標題與兩個圖片區塊均已出現在文章 DOM。封面圖片直接資源測試可正常載入；文章初次截圖中的灰色區域是圖片尚未完成 lazy loading 的暫時佔位，稍後重新查看後封面已正常顯示。

## 墨西哥奇談
文章路由為 `/destinations/mexico-city-alcohol-and-police`，頁面顯示分類「南美」、發布日期 2021 年 6 月 6 日，並顯示彩色小船、娃娃島、啤酒及餐點圖片區塊。文章已正確使用目的地遊記路由。

## 內容與圖片安排
兩篇文章均採用文字、圖片交錯區塊，圖片保留完整比例；Circumstance 使用電影海報及劇照，墨西哥文章使用 5 張旅遊／飲食圖片。已修正 Circumstance 封面網址前多餘空格。仍需完成 TypeScript、Vitest 與必要的桌面版截圖回歸檢查後保存檢查點。
