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

export async function sendSiteSubscriptionConfirmation(opts: {
  subscriberName: string;
  subscriberEmail: string;
  confirmUrl: string;
}): Promise<boolean> {
  const { subscriberName, subscriberEmail, confirmUrl } = opts;
  const html = `
    <div style="font-family: 'Noto Serif TC', serif; max-width: 600px; margin: 0 auto; color: #3a3a3a; padding: 20px;">
      <h2 style="font-weight: 400; letter-spacing: 0.05em; border-bottom: 1px solid #e0e0e0; padding-bottom: 12px;">歡迎訂閱 In-Between Days</h2>
      <p>親愛的 ${subscriberName}，您好：</p>
      <p>感謝您訂閱 In-Between Days 網站更新通知。為了確保這是您的信箱並啟用訂閱，請點擊下方按鈕完成確認：</p>
      <p style="margin: 30px 0;">
        <a href="${confirmUrl}" 
           style="display: inline-block; padding: 12px 28px; background: #3a3a3a; color: #fff; text-decoration: none; letter-spacing: 0.05em; font-size: 14px;">
          確認訂閱
        </a>
      </p>
      <p style="color: #666; font-size: 0.9em;">如果您並未發起此訂閱，請直接忽略這封信件即可。</p>
      <p style="color: #888; font-size: 0.85em; margin-top: 40px; border-top: 1px solid #eee; pt: 15px;">
        — In-Between Days・走走停停，在旅途間隙，遇見世界，也遇見自己。
      </p>
    </div>
  `;
  return sendEmail({
    to: subscriberEmail,
    subject: `【In-Between Days】請確認您的網站更新訂閱`,
    html,
  });
}

export async function sendNewsletterBroadcast(opts: {
  subscriberEmail: string;
  subscriberName: string;
  subject: string;
  contentHtml: string;
  unsubscribeUrl: string;
}): Promise<boolean> {
  const { subscriberEmail, subscriberName, subject, contentHtml, unsubscribeUrl } = opts;
  const html = `
    <div style="font-family: 'Noto Serif TC', serif; max-width: 650px; margin: 0 auto; color: #3a3a3a; line-height: 1.7; padding: 20px;">
      <div style="border-bottom: 1px solid #e0e0e0; padding-bottom: 16px; margin-bottom: 24px;">
        <span style="font-size: 12px; letter-spacing: 0.1em; color: #777; text-transform: uppercase;">In-Between Days Newsletter</span>
      </div>
      <div style="font-size: 15px; color: #2c2c2c;">
        ${contentHtml}
      </div>
      <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
        <p>親愛的 ${subscriberName}，您收到這封信是因為您曾訂閱 In-Between Days 的網站更新。</p>
        <p style="margin-top: 8px;">
          <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">取消訂閱</a>
        </p>
      </div>
    </div>
  `;
  return sendEmail({
    to: subscriberEmail,
    subject: `【In-Between Days】${subject}`,
    html,
  });
}
