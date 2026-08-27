# Stripe 測試付款核對（2026-08-27）

從 Stripe Dashboard 的測試付款列表讀到 1 筆付款：狀態為 `Succeeded`，金額為 `$20.00 USD`，付款方法尾四碼 `0077`，PaymentIntent 為 `pi_3U8sujRypOQmm8to08dxUi9I`，Customer 顯示為 `stripe@example.com`，時間為 Aug 27, 2:19 AM。列表頁帳戶為 `In Between Days 沙盒`，網址包含 `/test/payments`。

初步判斷：Stripe 測試環境確實收到一筆成功付款，但該筆付款的貨幣是 USD，而本專案行旅選物 Checkout 預期使用 HKD；Customer 及時間亦未足以證明是剛才由網站建立的付款。需要開啟付款詳情及檢查網站後台訂單／webhook，確認是否為本次網站交易。


後續嘗試開啟列表付款詳情時，列表索引已失效，瀏覽器返回 `about:blank`，因此尚未取得付款詳情頁的新資料。上一段列表資料仍是目前可核對的唯一結果。


再次載入 Stripe `/test/payments` 後仍只看到 1 筆交易：`$20.00 USD`、`Succeeded`、尾四碼 `0077`、PaymentIntent `pi_3U8sujRypOQmm8to08dxUi9I`、Customer `stripe@example.com`、Aug 27 2:19 AM。這不是本專案預期的 HKD 顯示，因此不能直接確認為剛才行旅選物網站交易；需要以網站後台訂單及付款詳情進一步比對。


已由付款列表開啟 `pi_3U8sujRypOQmm8to08dxUi9I` 詳情 URL，但頁面在目前瀏覽器中仍顯示載入中，尚未取得比列表更完整的明細；因此目前只能確認列表上的一筆 `$20.00 USD / Succeeded`，不能證明它就是網站剛完成的 HKD Checkout。


網站資料庫查到剛才的行旅選物訂單：order id `1`，建立時間 `2026-08-27 04:00:50`，Customer `arnoldchan2150@gmail.com`，狀態 `processing`，PaymentIntent `pi_3U8uVNL2ByqhTShQ0l1oWUHS`。

在目前登入的 Stripe 帳戶 `acct_1U8sqrRypOQmm8to` 的測試模式直接開啟該 PaymentIntent，Stripe 顯示 `Transaction not found`。這與網站已收到付款回調但 Stripe Dashboard 目前只列出另一筆 `$20.00 USD / Succeeded` 的結果不一致，初步警示網站 Stripe sandbox 憑證可能不是目前登入的 Stripe 帳戶，或付款事件仍未在該帳戶可見；不能把兩筆交易視為同一筆。


最終核對成功：在專案實際使用的 Stripe 測試帳戶 `acct_1U42dpL2ByqhTShQ`（Dashboard 顯示 `Manus inbetweenbd-ni9eppcf / In Between Days`）開啟網站訂單對應的 PaymentIntent `pi_3U8uVNL2ByqhTShQ0l1oWUHS`，Stripe 顯示 `$30.00 HKD`、`Succeeded`，付款方式為 Link，客戶 CHAN LI／arnoldchan2150@gmail.com，商品 `Eee Tttt`，數量 1，單價及總額均為 HK$30.00。

Stripe Events 顯示 Checkout Session completed、PaymentIntent succeeded 及 Charge HK$30.00；Logs 顯示 `POST /v1/checkout/sessions 200 OK` 及付款確認 `200 OK`。網站資料庫同時有 order id 1，狀態 `processing`。因此本次網站 HKD 測試交易已成功收到並完成 webhook／訂單狀態更新。

此前登入的 `acct_1U8sqrRypOQmm8to` 是另一個 Stripe 測試帳戶，只顯示一筆不相關的 `$20.00 USD` 交易；查看交易時必須切換到 `acct_1U42dpL2ByqhTShQ`。
