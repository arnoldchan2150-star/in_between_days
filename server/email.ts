import { ENV } from "./_core/env";

interface SendBookletEmailOptions {
  to: string;
  name: string;
  bookletTitle: string;
  bookletUrl: string;
}

/**
 * Send the travel booklet PDF link to the subscriber via Manus built-in email API.
 * Falls back gracefully if the API is unavailable.
 */
export async function sendBookletEmail(opts: SendBookletEmailOptions): Promise<void> {
  const { to, name, bookletTitle, bookletUrl } = opts;

  // Build absolute URL for the booklet
  const absoluteUrl = bookletUrl.startsWith("http")
    ? bookletUrl
    : `${process.env.VITE_OAUTH_PORTAL_URL ?? ""}${bookletUrl}`;

  const htmlBody = `
<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="UTF-8" /></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background:#fafaf8; color:#2c2c2c; padding:40px 20px; max-width:600px; margin:0 auto;">
  <h2 style="font-weight:300; letter-spacing:0.05em; color:#1a1a1a;">你好，${name}</h2>
  <p style="line-height:1.8; color:#555;">感謝你訂閱《In-Between Days》旅遊小冊子。</p>
  <p style="line-height:1.8; color:#555;">你可以點擊下方連結下載《${bookletTitle}》：</p>
  <p style="margin:32px 0;">
    <a href="${absoluteUrl}"
       style="display:inline-block; padding:14px 28px; background:#2c2c2c; color:#fff; text-decoration:none; letter-spacing:0.08em; font-size:14px;">
      下載旅遊小冊子
    </a>
  </p>
  <p style="line-height:1.8; color:#888; font-size:13px;">若按鈕無法點擊，請複製以下連結至瀏覽器：<br/>${absoluteUrl}</p>
  <hr style="border:none; border-top:1px solid #e8e8e8; margin:40px 0;" />
  <p style="color:#aaa; font-size:12px;">In-Between Days・間隙裡的日常</p>
</body>
</html>`;

  const textBody = `你好，${name}\n\n感謝你訂閱《In-Between Days》旅遊小冊子。\n\n請點擊以下連結下載《${bookletTitle}》：\n${absoluteUrl}\n\n— In-Between Days・間隙裡的日常`;

  const apiUrl = process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY;

  if (!apiUrl || !apiKey) {
    console.warn("[Email] BUILT_IN_FORGE_API credentials not available, skipping email send.");
    return;
  }

  const response = await fetch(`${apiUrl}/v1/email/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      to,
      subject: `【In-Between Days】你的旅遊小冊子《${bookletTitle}》已準備好了`,
      html: htmlBody,
      text: textBody,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Email API error ${response.status}: ${body}`);
  }
}
