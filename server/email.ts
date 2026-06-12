import { ENV } from "./_core/env";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(opts: SendEmailOptions): Promise<boolean> {
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    console.warn("[Email] Forge API not configured, skipping email send");
    return false;
  }
  try {
    const res = await fetch(`${ENV.forgeApiUrl}/v1/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify(opts),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[Email] Send failed:", res.status, text);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Email] Send error:", err);
    return false;
  }
}

export async function sendBookletToSubscriber(opts: {
  subscriberName: string;
  subscriberEmail: string;
  bookletTitle: string;
  bookletFileUrl: string;
}): Promise<boolean> {
  const { subscriberName, subscriberEmail, bookletTitle, bookletFileUrl } = opts;
  const html = `
    <div style="font-family: 'Noto Serif TC', serif; max-width: 600px; margin: 0 auto; color: #3a3a3a;">
      <h2 style="font-weight: 400; letter-spacing: 0.05em;">您的旅遊小冊子已送達</h2>
      <p>親愛的 ${subscriberName}，</p>
      <p>感謝您訂閱《${bookletTitle}》旅遊小冊子。</p>
      <p>請點擊以下連結下載您的小冊子：</p>
      <p>
        <a href="${bookletFileUrl}" 
           style="display: inline-block; padding: 12px 24px; background: #3a3a3a; color: #fff; text-decoration: none; letter-spacing: 0.05em;">
          下載小冊子
        </a>
      </p>
      <p style="color: #888; font-size: 0.9em; margin-top: 32px;">
        — In-Between Days・間隙裡的日常
      </p>
    </div>
  `;
  return sendEmail({
    to: subscriberEmail,
    subject: `【In-Between Days】您的旅遊小冊子《${bookletTitle}》`,
    html,
  });
}

export async function notifyOwnerNewSubscriber(opts: {
  subscriberName: string;
  subscriberEmail: string;
  bookletTitle: string;
  ownerEmail: string;
}): Promise<boolean> {
  const { subscriberName, subscriberEmail, bookletTitle, ownerEmail } = opts;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #3a3a3a;">
      <h2>新訂閱者通知</h2>
      <p>有新讀者訂閱了您的旅遊小冊子《${bookletTitle}》：</p>
      <ul>
        <li>姓名：${subscriberName}</li>
        <li>信箱：${subscriberEmail}</li>
      </ul>
      <p style="color: #888; font-size: 0.9em;">— In-Between Days 系統通知</p>
    </div>
  `;
  return sendEmail({
    to: ownerEmail,
    subject: `【In-Between Days】新訂閱者：${subscriberName}`,
    html,
  });
}
