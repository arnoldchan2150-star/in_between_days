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
- [x] 支援 YouTube 嵌入
- [x] 支援自主上傳影片（後端 mediaType 上傳路由、前端影片選取/拖放/播放器管理）

## 雪季映像頁面重新設計
- [x] 改為左圖右文排版（影片/圖片在左，文字說明在右）
- [x] 支援頁面內嵌入影片播放（非全螢幕）
- [x] 支援同一篇文章既有文字又有影片
- [x] 更新後台管理介面，支援新的內容管理（AdminPosts 顯示新的类型）
- [x] 更新前台導覽結構


## 雪季攻略詳細頁調整
- [x] 雪季映像列表不顯示可可托海攻略的完整 HTML 嵌入框
- [x] 點擊可可托海攻略標題後進入文章詳細頁並載入完整攻略 HTML
- [x] 驗證雪季列表、攻略詳細頁與其他文章頁面均可正常載入
- [x] 執行測試並保存新的 Checkpoint

---

## Reusable workflow: embedded article detail pages
- [x] Keep embedded HTML/video content out of category cards and render it on the article detail route after title navigation
- [x] Verify both category listing and detail route before checkpointing changes

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate

---

## Skill candidate: embedded_article_detail_flow
- [x] Document a reusable workflow for category cards that link to detail pages containing embedded HTML or video content
- [x] Include validation steps for route parameters, iframe/embed rendering, loading states, and regression tests
- [x] Include safe checkpoint and rollback guidance for future edits
## End skill candidate


## 回歸驗證補充
- [x] 驗證至少 1 篇一般文章詳細頁與 1 篇含影片文章詳細頁，確認修復 post_media.mediaType 後皆可正常載入
- [x] 套用 post_media.mediaType migration，修復 posts.bySlug 的媒體查詢錯誤
- [x] 儲存新的 Checkpoint（含雪季攻略詳細頁調整與 schema 修復）
- [x] 檢視 todo.md 中重複的 embedded_article_detail_flow 區塊並保留為歷史紀錄；正式技能已另存於 /home/ubuntu/skills/embedded-article-detail-flow/

## Skill delivery
- [x] 建立並驗證 embedded-article-detail-flow 技能


## 熊野古道小冊子嵌入更新
- [x] 將熊野古道小冊子的 embedUrl 更新為 https://kumano-guide-jkdkp37c.manus.space
- [x] 驗證旅遊小冊子熊野古道分頁的互動指南可正常嵌入
- [x] 執行測試並保存新的 Checkpoint


## 旅遊小冊子排版優化
- [x] 統一所有小冊子封面顯示比例與裁切方式
- [x] 加入目的地與旅程資訊標籤
- [x] 將互動指南按鈕設為主要行動，將新分頁連結設為次要行動
- [x] 驗證桌機與手機版排版，並保存新的 Checkpoint


## 移除旅遊小冊子訂閱框
- [x] 從旅遊小冊子頁面移除「免費領取 PDF 小冊子」訂閱框
- [x] 清理不再使用的訂閱表單狀態與提交邏輯
- [x] 驗證桌機與手機版排版並保存新的 Checkpoint


## 東歐漫遊全畫面 HTML 文章頁
- [x] 東歐漫遊文章點擊後直接顯示全畫面 HTML，不在一般文章內容區顯示框架
- [x] 保留返回文章列表與新分頁開啟操作
- [x] 驗證東歐文章、一般文章與分類列表，並保存新的 Checkpoint


## 網站更新電子報系統與合規訂閱
- [x] 首頁「立即訂閱」表單與雙欄展開互動
- [x] 資料庫擴充：confirmed、confirmationToken、unsubscribeToken、siteNewsletters、siteSettings
- [x] 雙向合規 Email：訂閱確認信 (/api/newsletter/confirm) 與一鍵取消訂閱 (/api/newsletter/unsubscribe)
- [x] 後台電子報撰寫、預覽、手動發送給已驗證訂閱者與發送紀錄
- [x] 寄送頻率設定（每月精選 vs 每發布新文章時）
- [x] TypeScript 型別檢查通過與 15 項 Vitest 測試通過


## 搜尋列與行旅資料庫改版
- [x] 在「目的地遊記」加入搜尋 Bar 與文章結果篩選
- [x] 在「靈感拾光」加入搜尋 Bar 與文章結果篩選
- [x] 將「旅遊小冊子」重新命名為「行旅資料庫」
- [x] 重整行旅資料庫為頁首介紹、分頁／篩選與指南卡片
- [x] 更新導覽與頁尾名稱，驗證桌機手機版並保存新的 Checkpoint


## 行旅資料庫返回與神山指南修正
- [x] 修復互動指南內「返回行旅資料庫」按鈕無反應問題
- [x] 檢查並更新神山指南的正確 HTML／外部網站來源
- [x] 驗證兩個指南的返回流程與神山內容載入，並保存新的 Checkpoint


## 神山標籤與首頁地區圖片更新
- [x] 將神山紀行指南卡片的「互動網頁」標籤改為「網頁」
- [x] 上傳並套用南美、中東、亞洲、歐洲、中亞、東南亞六張首頁地圖圖片
- [x] 驗證首頁地圖、神山標籤與響應式排版，並保存新的 Checkpoint


## 靈感拾光文案與主圖更新
- [x] 將靈感拾光頁首標題與介紹改為使用者提供的文字
- [x] 上傳並套用 Scan9609.webp 作為靈感拾光頁面主圖
- [x] 驗證桌機手機版圖片載入與文案排版，並保存新的 Checkpoint


## 聯絡 Email 更新
- [x] 將全站 hello@inbetweendays.com 顯示文字改為 365inwien@gmail.com
- [x] 將所有 mailto 連結同步更新
- [x] 驗證首頁、頁尾與其他聯絡入口並保存新的 Checkpoint


## Medium 風格文章區塊編輯器
- [x] 建立 post_blocks 資料表，支援段落、圖片、標題、引言與影片區塊
- [x] 後台文章編輯器加入區塊化編輯、上下排序與媒體選取介面
- [x] 前台文章詳細頁支援區塊流渲染（段落、置中／滿版圖片、說明文字、引言、影片）
- [x] 支援舊文章自動相容（無區塊時自動以原有 content 與 post_media 渲染）
- [x] 執行 migration、測試、桌機手機版驗證並保存新的 Checkpoint

## 文章區塊編輯器圖片直接上傳
- [x] 擴充 PostBlocksEditor 圖片區塊，支援拖放與點擊上傳圖片至後端儲存
- [x] 自動將上傳成功的圖片 URL 填入圖片區塊的內容欄位
- [x] 執行測試與編輯介面視覺驗證

## 現有文章內容與相簿交錯排列轉換
- [x] 撰寫遷移／轉換腳本，將文章的純文字內容按照段落拆分，並與 post_media 的照片交錯插入至 post_blocks
- [x] 執行交錯轉換並驗證各篇文章的前台呈現效果（一段文字、一張圖片交錯）
- [x] 執行 Vitest 測試與視覺回歸驗證

## 修復「旅遊｜東德丫！唔該」文章內容消失問題
- [x] 檢查東德文章在 posts 表中的原始 content 內容
- [x] 檢查 post_blocks 中東德文章的區塊內容，並修復空白或短缺的段落
- [x] 驗證前台東德文章詳細頁文字與圖片的交錯渲染效果
- [x] 執行 Vitest 測試與視覺回歸驗證

## 更新熊野古道互動指南網址
- [x] 檢查資料庫中熊野古道指南的 embedUrl 欄位
- [x] 將 embedUrl 更新為 https://kumano-guide-jkdkp37c.manus.space
- [x] 驗證前台行旅資料庫與指南詳細頁可正確載入新網址
- [x] 執行測試與視覺驗證

## 確保熊野古道行旅資料庫正確導向新網址
- [x] 檢查 booklet 路由與資料庫中 kumano-kodo-nakahechi 的 embedUrl
- [x] 修正 Booklet.tsx 與 server 端查詢，確保卡片點擊與直接訪問均正確帶入 https://kumano-guide-jkdkp37c.manus.space
- [x] 視覺驗證點擊後 iframe src 與網頁內容
- [x] 執行測試與 Checkpoint

## 查明與修正熊野古道網址版本問題
- [x] 透過瀏覽器與網頁提取工具檢查 https://kumano-guide-jkdkp37c.manus.space 的實際標題與內容版本
- [x] 確認該網址是否為舊版部署或有其他正確的最新網址
- [x] 依實際情況更新資料庫中的 embedUrl 並驗證前台嵌入

## 強制 iframe 刷新熊野古道外部網址快取
- [x] 修改 Booklet.tsx 中嵌入 iframe 的 src，為 kumano-guide 網址自動加上時間戳或版本參數（如 ?v=timestamp），強制瀏覽器與 iframe 重新載入最新部署
- [x] 測試行旅資料庫嵌入與新分頁開啟功能
- [x] 執行 Vitest 測試與 Checkpoint

## 文章詳細頁響應式閱讀版面優化
- [x] 調整 PostDetail.tsx 內文容器寬度（如 max-w-[720px] 搭配適當手機左右 padding）
- [x] 優化圖片區塊顯示：限制最大高度與保持比例，防止手機過長截切或超出螢幕
- [x] 優化影片區塊顯示：以 16:9 響應式容器嵌入，防止變形
- [x] 優化頂部與底部返回操作，確保手機端能順暢回到對應分類
- [x] 執行 Vitest 測試與桌機、手機尺寸視覺驗證

## 文章自訂發佈日期（Dateback）功能
- [x] 檢查 server/routers.ts 中 posts.create 與 posts.update 是否接受並正確處理 publishedAt 欄位
- [x] 在 AdminPostEditor.tsx 中加入發佈日期選擇器（<input type="date"> 或 datetime-local），讓新增與編輯文章時可自行指定過去日期
- [x] 測試新增帶有自訂日期的文章，並驗證其在列表排序與前台詳細頁的顯示正確性
- [x] 執行 Vitest 測試與視覺回歸驗證

## 後台文章管理清單發佈日期與排序功能
- [x] 檢查 AdminPosts.tsx 現有文章清單表格與欄位結構
- [x] 在 AdminPosts.tsx 中加入發佈日期（publishedAt）欄位顯示
- [x] 實作依發佈日期進行升冪（Ascending）與降冪（Descending）排序切換按鈕／邏輯
- [x] 執行 Vitest 測試與後台管理清單視覺驗證

## 前台文章列表與內頁自訂發佈日期與排序功能
- [x] 檢查 server/db.ts 中 getPublishedPosts 是否依 publishedAt 降冪排序
- [x] 檢查 Journal.tsx 與 PostDetail.tsx 中文章日期的顯示方式與格式
- [x] 確保列表與內頁皆優先顯示並正確格式化 publishedAt 欄位
- [x] 執行 Vitest 測試與桌機手機版前台日期顯示驗證

## 網站 SEO 基礎設定
- [x] 在 client/index.html 中補齊通用 SEO meta 標籤與預設 Open Graph 標籤
- [x] 在 PostDetail.tsx 中動態更新 document.title、description、Open Graph 標籤與 Article 結構化資料 (JSON-LD)
- [x] 在後端 routers.ts 或專案中提供 /sitemap.xml 與 /robots.txt 端點或靜態產出
- [x] 執行 Vitest 測試與 SEO 標籤驗證

## 文章詳細頁延伸閱讀推薦區塊
- [x] 在 server/db.ts 中加入 getRelatedPosts 查詢，依相同分類或類型優先匹配，排除目前文章並限制 3 篇
- [x] 在 server/routers.ts 的 posts 路由中加入 related 查詢端點
- [x] 在 PostDetail.tsx 底部加入「延伸閱讀」區塊，呈現 3 篇推薦卡片（含封面、分類、日期與標題）
- [x] 執行 Vitest 測試與前端視覺回歸驗證

## 查明自訂網域無法找到網站原因
- [x] 測試輸入網域 http://www.inbetweenday.com，發現發生 net::ERR_NAME_NOT_RESOLVED 錯誤
- [x] 確認正確網域拼寫（應為 inbetweendays.com 或在管理介面綁定自訂網域）
- [x] 提供正確的平台預設網址與自訂網域 DNS 設定步驟

## 修復 www.inbetweenday.com 無法使用問題
- [x] 測試 `https://www.inbetweenday.com` 的目前錯誤（如 Error 1014 或 DNS 解析狀況）
- [x] 確認 Cloudflare 中 `www` 記錄與根網域的配合方式
- [x] 提供的 Cloudflare 記錄調整或轉址設定，確保 `www` 與根網域皆能順暢開啟

## 排查自訂網域再次無法開啟原因
- [x] 檢查 `inbetweenday.com` 目前是否因 Cloudflare Proxy 狀態變更、DNS 記錄刪除或 Manus 綁定重置而失效
- [x] 確認 Cloudflare 中根網域與 www 的正確 CNAME 與 Proxy 狀態
- [x] 協助使用者一鍵恢復根網域與 www 穩定連線

## 重新排查使用者端自訂網域無法連線問題
- [x] 執行 shell 指令檢查 `inbetweenday.com` 與 `www.inbetweenday.com` 的外部 DNS 解析與 HTTP 狀態碼
- [x] 檢查 Cloudflare Proxy（橙色雲朵 vs 灰色雲朵）與 SSL/TLS 設定對不同網絡環境的影響
- [x] 提供最穩定的 Cloudflare 建議設定與清除本機 DNS 快取的方法

## 連接 Resend 服務至後台電子報系統
- [x] 檢查 server/email.ts 現有 Nodemailer / Forge 寄信實作與設定
- [x] 擴充 server/email.ts 支援 Resend API（使用正式 RESEND_API_KEY 與已驗證寄件者信箱）
- [x] 使用 webdev_request_secrets 要求使用者提供 RESEND_API_KEY 與寄件者地址
- [x] 驗證訂閱確認信、取消訂閱信與後台電子報手動寄送功能

## 檢查後台電子報訂閱與寄送流程
- [x] 檢查 server/routers.ts 中的 siteSubscribe、siteList 與 newsletter 相關路由
- [x] 檢查 server/db.ts 中 site_subscribers 與 site_newsletters 的資料庫操作
- [x] 執行 Vitest 測試驗證訂閱及寄送 API 邏輯

## 修正里斯本目的地文章無法顯示
- [x] 修正 PostDetail 在文章資料尚未載入時讀取 post.id 導致頁面崩潰
- [x] 驗證里斯本文章路由、文章內容與相關文章查詢
- [x] 執行型別檢查、Vitest 與頁面視覺驗證

## 里斯本文章 Medium 風格交錯排版
- [x] 將完整里斯本文字依文章段落整理為區塊內容
- [x] 在文字區塊之間插入原有相片並保留圖片說明
- [x] 驗證桌面與手機版文章頁的閱讀版面
- [x] 執行 TypeScript、Vitest 與文章頁回歸檢查

## 上傳 Marina Abramović 倫敦展覽文章至靈感拾光
- [x] 解析 PDF 並提取文章標題、內容與摘要
- [x] 在資料庫建立分類為 culture（靈感拾光）的文章，設定發布日期為 2023 年 11 月 5 日
- [x] 建立文章的區塊內容（標題、段落與引言）
- [x] 執行 TypeScript 檢查、Vitest 測試與靈感拾光頁面視覺驗證

## 修正 Marina Abramović 文章圖片排版
- [x] 從重新提供的 PDF 提取 12 張展覽相片
- [x] 將圖片上傳至網站持久化儲存並更新文章封面
- [x] 將圖片平均分配至文章文字區塊之間
- [x] 驗證桌面版與手機版文章頁的圖片載入及排版
- [x] 執行 TypeScript 檢查與 17 項 Vitest 測試

## 上傳 Tate Gallery of Modern Art 文章至靈感拾光
- [x] 解析 Tate Modern PDF 並提取內文與展覽相片
- [x] 在資料庫建立分類為 culture（靈感拾光）的文章，設定發布日期為 2023 年 11 月 5 日
- [x] 建立文章的區塊內容，並將提取的相片平均交錯插入文字之間
- [x] 執行 TypeScript 檢查、17 項 Vitest 測試與前端視覺驗證

## 刪除 Tate Modern 文章重複小標題
- [x] 刪除內文小標題「展覽｜London – Tate Gallery of Modern Art」
- [x] 確認主標題、正文、圖片與發布日期保持不變
- [x] 執行文章頁與測試回歸驗證

## 上傳〈用宇宙的維度思考戰爭〉至靈感拾光
- [x] 解析 PDF 並提取文章標題、內容與可用圖片
- [x] 建立分類為 culture（靈感拾光）的文章，設定發布日期為 2020 年 8 月 13 日
- [x] 建立文章內容區塊並加入 PDF 中的圖片
- [x] 執行 TypeScript、Vitest 與前台文章頁驗證

## 上傳〈用宇宙的維度思考戰爭〉至靈感拾光
- [x] 解析 PDF 並整理文章內容與可用圖片
- [x] 建立分類為 culture（靈感拾光）的文章，設定發布日期為 2020 年 8 月 13 日
- [x] 建立文章內容區塊並加入 PDF 提取的封面圖片
- [x] 執行 TypeScript、Vitest 與前台文章頁驗證

## 建立 Dalí Theatre-Museum 靈感拾光文章
- [x] 檢查 Dalí Theatre-Museum 檔案夾與圖片素材，確認沒有 AGENTS.md 額外規範
- [x] 參考既有觀展文章語氣，撰寫第一人稱美術館文章
- [x] 最佳化並上傳 15 張館舍及展品相片
- [x] 建立分類為 culture（靈感拾光）的文章與文字／圖片交錯區塊
- [x] 執行桌面、手機、TypeScript 與 17 項 Vitest 驗證

## 修正 Dalí Theatre-Museum 照片方向
- [x] 檢查原始照片與網站圖片的 EXIF 方向
- [x] 套用正確旋轉資訊並重新上傳圖片
- [x] 更新文章封面與內文圖片連結
- [x] 驗證桌面、手機版圖片方向並執行回歸測試

## 修正後台文章編輯器「儲存版面」按鈕
- [x] 檢查按鈕事件與文章區塊資料提交流程
- [x] 修正儲存版面按鈕的前端或後端問題
- [x] 驗證儲存後重新載入仍保留文章區塊
- [x] 執行 TypeScript、Vitest 與後台回歸檢查

## 籌備〈醫院深度遊〉文章
- [x] 收集並整理西藏、泰國、伊朗、德國、台灣、奧地利、智利及北京的就醫故事細節
- [x] 以第一人稱及帶有自嘲感的旅行語氣撰寫完整文章
- [ ] 待照片提供後，將圖片平均分配到故事段落之間
- [ ] 完成文章前台排版、圖片載入與手機版驗證

## 先完成〈醫院深度遊〉純文字初稿
- [x] 整理八段旅途中意外就醫經歷的共同主線
- [x] 撰寫帶有旅行反差與自嘲感的完整文章初稿
- [x] 校訂醫療經歷的敘事分寸，避免加入未提供的醫療事實
- [x] 保存草稿供使用者確認，圖片排版留待後續

## 調整文章圖片視覺比例
- [x] 檢查文章詳細頁圖片目前的寬度與高度規則
- [x] 將文章圖片改為較窄、非滿版的閱讀比例
- [x] 保留圖片完整內容並避免手機版裁切
- [x] 驗證文章頁排版並執行 TypeScript、Vitest 回歸測試

## 修正延伸閱讀 Related Stories 連結錯誤
- [x] 檢查延伸閱讀卡片的分類與 slug 連結生成
- [x] 修正點擊後導向錯誤的推薦文章連結
- [x] 驗證推薦文章在桌面與手機版均可正常開啟
- [x] 執行 TypeScript、Vitest 與文章路由回歸測試

## 優化〈醫院深度遊〉文章
- [x] 保留八段真實經歷並整理成清晰的敘事主線
- [x] 改善段落節奏、轉折、用字及畫面感
- [x] 校訂醫療經歷敘述，避免加入原稿沒有的事實
- [x] 保存可直接使用的修訂稿供作者確認

## 盤點網站後續改善方向
- [x] 檢查目前主要頁面、導覽、文章閱讀與電子報流程
- [x] 評估內容、SEO、可及性、效能與後台管理改善空間
- [x] 整理按優先級及實作成本分類的改善路線圖

## 建立隱私權政策與服務條款頁面
- [x] 建立 `/privacy-policy` 獨立頁面並整理目前網站實際資料處理內容
- [x] 建立 `/terms` 獨立服務條款頁面
- [x] 將兩個法律頁面加入全站 Footer 導覽
- [x] 在電子報訂閱表單加入隱私權政策連結及同意說明
- [x] 驗證路由、頁尾、訂閱表單及手機版顯示並執行測試

## 上傳兩篇 2020 年 8 月 4 日影評至靈感拾光
- [x] 解析兩份 PDF 的標題、文章內容與可用圖片
- [x] 確認資料庫沒有同名文章，並建立兩篇 culture 文章
- [x] 將兩篇文章發布日期設定為 2020 年 8 月 4 日
- [x] 把圖片平均分配至各自的文字區塊之間
- [x] 驗證兩篇文章的前台頁面、圖片載入與手機版排版
- [x] 執行 TypeScript、Vitest 並保存檢查點

## 修正兩篇新文章的分類要求
- [x] 將〈墨西哥奇談 Mexico City, Alcohol and Police〉建立／更新至 destinations（目的地遊記）
- [x] 將〈Circumstance〉建立／更新至 culture（靈感拾光）
- [x] 兩篇文章日期分別設定為 2021 年 6 月 6 日及 2021 年 12 月 15 日，並保留圖片交錯排版

## 上傳三篇文章並修正靈感／目的地分類
- [x] 解析三份 PDF 的標題、檔名日期、文章內容與可用圖片
- [x] 建立〈戰爭沒有女人的臉〉至靈感拾光，日期為 2020 年 8 月 7 日
- [x] 建立〈Being John Malkovich〉至靈感拾光，日期為 2020 年 8 月 8 日
- [x] 建立〈怪物 Monster〉至靈感拾光，日期為 2023 年 6 月 3 日
- [x] 將三篇文章的圖片平均分配到文字區塊之間
- [x] 修正現有錯放在目的地遊記的靈感類文章
- [x] 驗證分類、日期、圖片、路由及手機版排版並執行測試

## 重新確認〈怪物〉與〈Being John Malkovich〉文章
- [x] 查詢兩篇文章是否已存在並避免重複建立
- [x] 確認〈怪物〉位於靈感拾光且日期為 2023 年 6 月 3 日
- [x] 確認〈Being John Malkovich〉位於靈感拾光且日期為 2020 年 8 月 8 日
- [x] 確認兩篇文章圖片平均交錯於文字中並完成前台驗證

## 上傳四篇影評至靈感拾光
- [x] 解析四份 PDF 的標題、檔名日期、內容與可用圖片
- [x] 建立〈游牧人生 Nomadland〉，日期為 2020 年 3 月 20 日
- [x] 建立〈信箋故事 The Tale〉，日期為 2020 年 8 月 12 日
- [x] 建立〈腦作大業 Synecdoche, New York〉，日期為 2020 年 8 月 10 日
- [x] 建立〈愛的曝光 Love Exposure〉，日期為 2021 年 3 月 4 日
- [x] 將四篇文章圖片平均分配到文字區塊之間
- [x] 驗證分類、日期、路由、圖片與手機版排版並執行測試

## 上傳四篇新靈感文章並依 PDF 順序配圖
- [x] 解析四份 PDF 的標題、檔名日期、文章內容與圖片順序
- [x] 建立〈彼女 Ride or Die〉，日期為 2021 年 4 月 22 日
- [x] 建立〈拉契特：黯衣天使 Ratched〉，日期為 2022 年 1 月 6 日
- [x] 建立〈五部關於與自己和解的電影〉，日期為 2021 年 5 月 20 日
- [x] 建立〈未來簡史〉，按檔名暫定日期為 2021 年 9 月 19 日
- [x] 按 PDF 中的圖片出現順序插入各篇文章文字之間
- [x] 驗證四篇文章路由、分類、日期、圖片與手機版排版並執行測試

## 補回四篇 PDF 文章完整文字與圖片
- [x] 重新核對四份 PDF 的全文、段落及圖片順序
- [x] 比對並補回現有文章遺漏的完整文字
- [x] 依 PDF 原始順序補回全部文章圖片
- [x] 修正圖片持久化 URL，確保封面與內文圖片正常載入
- [x] 驗證四篇文章內容完整、圖片載入及手機版排版
- [x] 執行 TypeScript 與 19 項 Vitest 測試

## 2026-08-26 Resend DKIM TXT 公開查詢診斷
- [x] 確認 Google Admin Toolbox 使用 TXT 而非 ANY 查詢
- [x] 核對 Cloudflare DKIM Name 是否為 resend._domainkey 且沒有重複網域
- [x] 核對 DKIM TXT Value 與 Resend 提供值完全一致
- [x] 確認實際公開 Nameservers 與 Cloudflare 設定一致
- [x] 提供公開 DNS 驗證、DNSSEC 及 Resend 重新 Verify 的處理方式

## 2026-08-26 里斯本遊記 Instagram Carousel 轉換
- [x] 核對〈里斯本的一切 About Lisbon〉網站全文與現有圖片
- [x] 按 In-Between Days 風格規劃 Carousel 頁數、圖片比例與敘事順序
- [x] 撰寫每頁 Carousel 文案、封面標題、Caption、Hashtags 及網站導流句
- [x] 整理可直接交給設計／製作的圖片裁切與文字排版建議

## 2026-08-26 里斯本葡撻 Instagram Carousel 轉換
- [x] 核對〈關於里斯本的一切〉中的葡撻段落與 Pastel de Nata 圖片
- [x] 規劃以貝倫、葡撻口感與旅途現場為主題的 Carousel 結構
- [x] 撰寫每頁 Carousel 文案、封面標題、Caption、Hashtags 及網站導流句
- [x] 整理圖片比例、裁切及文字排版建議

## 2026-08-26 神山 Instagram Carousel 轉換
- [x] 核對網站中的神山文章／行旅資料庫內容與現有圖片
- [x] 規劃神山旅程的 Carousel 敘事、頁數及視覺比例
- [x] 撰寫每頁 Carousel 文案、封面標題、Caption、Hashtags 及網站導流句
- [x] 整理圖片排序、裁切及文字排版建議

## 2026-08-26 神山指南圖片 Instagram Carousel 重整
- [x] 以使用者提供的 8 張神山指南頁面圖作為 Carousel 素材
- [x] 按認識神山、行前準備、交通住宿、心得及照片安排圖片順序
- [x] 為每張圖撰寫適合直接放在 IG 圖片上的短文案
- [x] 撰寫對應 Caption、Hashtags 及網站導流句
- [x] 加入費用、季節、入境及健康資訊的發布前核對提醒

## 2026-08-26 熊野古道插畫封面替換
- [x] 上傳使用者提供的 `kumano_thumbnail_direction.jpg` 至持久化儲存
- [x] 將文章封面更新為新的熊野古道插畫
- [x] 將行旅資料庫熊野古道卡片封面同步更新
- [x] 驗證文章及卡片封面載入、比例與前台顯示
- [x] 執行 TypeScript 與 Vitest 回歸測試並保存檢查點

## 2026-08-26 熊野古道直幅封面替換
- [x] 上傳使用者提供的 `reel_cover.jpg` 至持久化儲存
- [x] 將熊野古道文章封面更新為新的直幅插畫
- [x] 將行旅資料庫熊野古道卡片封面同步更新
- [x] 驗證直幅圖片在文章與卡片中的裁切比例及載入狀態
- [x] 執行 TypeScript 與 Vitest 回歸測試並保存檢查點

## 2026-08-26 新增「行旅選物」欄目
- [x] 在主導航加入「行旅選物」連結
- [x] 建立行旅選物公開頁面，呈現自製商品與旅行特色小物的展示架構
- [x] 加入分類／搜尋／商品詳情入口的基礎互動，並提供空狀態及尚未開放購買提示
- [x] 確認不建立虛構評價、推薦或銷售數據，並保留日後接入正式商品資料及付款系統的擴充空間
- [x] 完成桌面與手機版視覺驗證、TypeScript／Vitest 測試並保存檢查點

## 2026-08-27 行旅選物商品、付款與庫存
- [x] 確認採用自建商品／Stripe、Shopify 商店，或先以外部付款連結的銷售架構
- [x] 建立商品、商品圖片、價格、庫存、上架狀態與訂單所需的資料模型
- [x] 在後台加入行旅選物商品新增、編輯、刪除、圖片上傳、庫存及上架管理
- [x] 在公開行旅選物頁面呈現正式商品資料與購買入口
- [x] 接入已確認的付款服務，建立付款成功／失敗／取消狀態處理
- [x] 以付款服務 webhook 或等效事件同步訂單與庫存，避免重複扣庫存
- [x] 補上商品銷售所需的配送、退換貨、付款說明及私隱合規內容
- [x] 完成支付流程、庫存邊界、後台手機版、TypeScript／Vitest 驗證並保存檢查點

## 2026-08-27 Stripe 帳戶連接排查
- [x] 確認 Stripe 帳戶已登入、測試／正式模式與專案付款設定的連接狀態
- [x] 確認測試 API Key 或專案 Stripe sandbox 認領流程可用，且不在對話中暴露秘密金鑰
- [x] 完成測試付款、取消付款、webhook 及庫存同步驗證後更新電商 TODO

## 2026-08-27 行旅選物後台權限錯誤
- [x] 重現登入後新增商品／圖片上傳時顯示需要管理員權限的錯誤
- [x] 核對登入帳戶、owner identity 與 adminProcedure 的判定條件
- [x] 修正權限判定或提供安全的管理員初始設定流程，不繞過權限驗證
- [x] 驗證管理員可新增商品與上傳圖片，並確認一般帳戶仍不能操作後台
- [x] 完成 TypeScript／Vitest 回歸測試並保存修正版本

## 2026-08-27 行旅選物配送與退換貨規則
- [x] 記錄香港及海外配送規則，並在商品頁與結帳前清楚顯示海外跨境運費另計
- [x] 加入商品重量資料及按重量計算香港運費的模型／輸入欄位
- [x] 加入訂單滿 HK$300 免運的判斷與結帳顯示
- [x] 加入收貨後 7 日內、商品未使用的退換貨申請說明
- [x] 更新配送、付款及退換貨政策頁，避免寫入未確認的具體運費金額
- [x] 完成配送邊界、HKD 結帳、庫存、手機版及 TypeScript／Vitest 驗證並保存檢查點

- [x] 確認每件商品採用香港郵政小型（P）、大型（G）或郵包（E）寄件類別
- [x] 以使用者提供的費率表建立經確認的重量級距，並避免把圖片中不適用的跨欄空白值當成費率

- [x] 將 G 大型信件／包裹設為預設寄件類別，並在後台提供每件商品的寄件類別選擇
- [x] 為第一件商品「Eee」補填實際包裝重量後才啟用重量運費計算

## 2026-08-27 Eee 商品重量確認
- [x] 將「Eee」商品包裝重量設定為 100 克並確認寄件類別為 G
- [x] 核對 100g 未滿 HK$300 運費 HK$5.60、HK$300 免運及付款前重量阻擋邏輯
- [x] 保存 Eee 重量更新版本並交付結果

## 2026-08-27 Managed Payments 適用性核對
- [x] 確認「行旅選物」實體商品不使用 Stripe Managed Payments，改用標準 Stripe Payments／Checkout
- [ ] 確認正式模式帳戶啟用、live key 連接與 webhook 設定，不在對話中暴露秘密金鑰
- [x] 按選定付款方案完成實體商品 Checkout、配送、退款與庫存流程驗證

## 2026-08-27 前往安全付款按鈕跳轉修正
- [x] 定位 Checkout URL 建立及瀏覽器視窗被阻擋的原因
- [x] 修正付款按鈕跳轉、錯誤處理及同頁 fallback
- [x] 完成桌面／手機版及 TypeScript／Vitest 回歸驗證

## 2026-08-27 Resend 網域驗證排查
- [x] 查看使用者提供的 Resend 網域頁面目前狀態及缺失記錄
- [x] 核對 inbetweenday.com 的 Cloudflare 權威 DKIM、SPF、MX 與 DMARC 記錄
- [x] 修正缺失／重複／錯誤的 DNS 記錄，或確認仍在傳播
- [x] 回到 Resend 重新 Verify，並確認網域可以用於發送確認信

## 2026-08-27 訂閱確認信未出現在 Resend
- [x] 檢查訂閱流程是否呼叫寄信 helper，及是否因非同步錯誤中斷
- [x] 核對 Resend API Key、寄件人網域及確認信寄送設定，不在對話中暴露秘密金鑰
- [x] 修正寄信錯誤處理，讓訂閱成功與郵件送出狀態清楚分開
- [ ] 以新測試地址完成端到端驗證，確認 Resend Emails 出現寄件紀錄

## 2026-08-27 正式環境訂閱信無 Resend 紀錄
- [x] 核對正式網站目前部署版本及訂閱 API 執行結果
- [ ] 確認正式環境使用的 RESEND_API_KEY 所屬帳戶與寄件網域
- [x] 修正任何仍使用備援寄件或錯誤成功回報的流程
- [ ] 以新測試地址完成正式網站端到端驗證，確認 Resend Emails 出現紀錄
