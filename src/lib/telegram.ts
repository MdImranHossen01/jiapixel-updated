/**
 * Telegram Notification Helper for Jiapixel
 */

interface OrderNotificationData {
  name: string;
  phone: string;
  email?: string;
  price?: number;
  source?: string;
  paymentNumber?: string;
  details?: string;
  id?: string;
}

export async function sendTelegramNotification(data: OrderNotificationData): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("[Telegram] Skipping notification: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in .env");
    return false;
  }

  const nowFormatted = new Date().toLocaleString("bn-BD", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const message = `🔔 *নতুন অর্ডার রিকোয়েস্ট এসেছে! (Jiapixel)*
━━━━━━━━━━━━━━━━━━━━
👤 *নাম:* ${data.name}
📞 *ফোন নম্বর:* ${data.phone}
✉️ *ইমেইল:* ${data.email || "N/A"}
💰 *প্যাকেজ মূল্য:* ৳${(data.price || 0).toLocaleString("en-BD")}
🌐 *সোর্স পেজ:* ${data.source || "Website"}
${data.paymentNumber ? `💳 *পেমেন্ট নম্বর:* ${data.paymentNumber}\n` : ""}${data.details ? `📝 *বিবরণ:* ${data.details}\n` : ""}⏰ *সময়:* ${nowFormatted}
━━━━━━━━━━━━━━━━━━━━
🔗 [ড্যাশবোর্ডে দেখুন](https://www.jiapixel.com/dashboard/admin/manage-requests)`;

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });

    const resJson = await response.json();
    if (!response.ok || !resJson.ok) {
      console.error("[Telegram] API error:", resJson);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Telegram] Request failed:", error);
    return false;
  }
}
