# In-Between Days – Project TODO

## 資料庫 Schema 與 Migration
- [x] 建立 posts 資料表（title, slug, excerpt, content, category, type, published, coverImageUrl, coverImageKey, publishedAt）
- [x] 建立 post_media 資料表（postId, url, key, caption, sortOrder）
- [x] 建立 booklets 資料表（title, slug, description, fileUrl, fileKey, coverUrl, active, sortOrder）
- [x] 建立 booklet_subscribers 資料表（name, email, bookletId, sentAt, createdAt）
- [x] 建立 about_page 資料表（philosophy, blogOrigin, countriesVisited, photoUrl, photoKey）
- [x] 建立 admin_credentials 資料表（email, passwordHash）
- [x] 執行所有 SQL migration

## 後端 API
- [x] server/db.ts：完整 CRUD 查詢 helper（posts, booklets, subscribers, about, admin）
- [x] server/auth.ts：hashPassword, verifyPassword, adminLogin, setupAdminPassword, isAdminPasswordSet
- [x] server/email.ts：sendBookletToSubscriber, notifyOwnerNewSubscriber（Nodemailer）
- [x] server/routers.ts：完整 tRPC 路由（posts, booklets, subscribers, about, auth）
- [x] 管理員 adminProcedure 守衛
- [x] S3 檔案上傳（封面圖片、小冊子 PDF、關於我照片）

## 全域樣式與導覽
- [x] client/index.html：Google Fonts（Noto Serif TC + Noto Sans TC）
- [x] client/src/index.css：日式極簡低飽和度配色、Tailwind 4 OKLCH tokens
- [x] Navbar：桌機版 + 手機漢堡選單，首頁透明/捲動後白底
- [x] Footer：品牌、導覽連結、聯絡資訊

## 前端公開頁面
- [x] 首頁（Home）：Hero、最新遊記、引言、目的地地圖、小冊子 CTA、文化專欄 CTA
- [x] 遊記列表（Journal）：分類篩選、文章卡片
- [x] 單篇遊記（PostDetail）：封面、內文、相簿
- [x] 目的地（Destinations）：地區篩選、文章卡片
- [x] 電影×書籍（Culture）：文化專欄文章列表
- [x] 旅遊小冊子（Booklet）：多 Tab、訂閱表單、成功狀態
- [x] 關於我（About）：照片、旅行哲學、部落格初衷

## 管理後台
- [x] AdminLogin：email/password 登入，首次設定密碼
- [x] AdminLayout：側邊欄導覽、登出、查看網站連結
- [x] AdminDashboard：統計總覽、快速操作
- [x] AdminPosts：文章列表、發布/草稿切換、刪除
- [x] AdminPostEditor：新增/編輯文章、封面圖片上傳
- [x] AdminBooklets：小冊子管理、PDF + 封面上傳
- [x] AdminSubscribers：訂閱者列表、CSV 匯出
- [x] AdminAbout：關於我內容編輯、照片上傳

## 測試
- [x] server/auth.logout.test.ts：登出 cookie 清除測試
- [x] server/email.login.test.ts：密碼雜湊/驗證、DB helper 測試
- [x] server/posts.test.ts：文章相關測試
- [x] 所有 11 項測試通過

## 部署
- [x] 儲存 Checkpoint
- [x] 發布為永久網站（請點擊管理介面的 Publish 按鈕）

## 圖片上傳功能（從網址改為本地上傳）
- [x] 後端：建立 upload.image tRPC 路由，接收 base64 並上傳至 S3
- [x] 前端：建立 ImageUploader 共用元件（拖放 / 點擊選擇）
- [x] AdminPostEditor：封面圖改為 ImageUploader
- [x] AdminBooklets：小冊子封面改為 ImageUploader
- [x] AdminAbout：個人照片改為 ImageUploader

## 文章多圖相簿功能
- [x] 確認 post_media 資料表與後端 API
- [x] 後台文章編輯器加入多圖上傳相簿管理（新增、排序、刪除）
- [x] 前台 PostDetail 頁面以相簿方式展示文章照片

## 後台 embedUrl 輸入欄
- [x] AdminPostEditor：加入「嵌入網址（embedUrl）」輸入欄，支援從後台設定 iframe 嵌入網址
- [x] AdminBooklets：加入「嵌入網址（embedUrl）」輸入欄，支援從後台設定互動式旅遊指南嵌入網址
- [x] AdminBooklets：加入完整編輯功能（Pencil 按鈕開啟編輯表單）
- [x] 後端 posts.update 路由加入 embedUrl 欄位支援
- [x] 後端 booklets.create 與 booklets.update 路由加入 embedUrl 欄位支援

## 相簿 caption 儲存修復
- [x] 後端新增 posts.updateMedia tRPC 路由（更新 caption / sortOrder）
- [x] 後端新增 updatePostMedia DB helper
- [x] AdminPostEditor：加入「儲存照片說明」按鈕，點擊後將所有 caption 持久化至資料庫


## 頁面重構與新功能
- [x] 將「電影 X 書籍」頁面重新命名為「靈感拾光」
- [x] 整合「目的地」和「遊記」為「目的地遊記」頁面（混合展示）
- [x] 新增「雪季映像」頁面，展示滑雪相關內容
- [x] 更新資料庫 schema，支援新的內容分類（culture/travel/snow）
- [x] 實作「雪季映像」頁面的影片/文章分類篩選功能
- [ ] 支援 YouTube 嵌入和自主上傳影片
- [ ] 更新後台管理介面，支援新的內容管理
- [x] 更新前台導覽結構
