import { NextRequest, NextResponse } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const success = await sendTelegramNotification({
      name: "টেস্ট কাস্টমার",
      phone: "01700000000",
      email: "test@jiapixel.com",
      price: 11500,
      source: "all-in-one-ecommerce-bangladesh (Test Ping)",
      details: "টেলিগ্রাম ইনস্ট্যান্ট নোটিফিকেশন ভেরিফিকেশন টেস্ট।",
    });

    if (success) {
      return NextResponse.json({
        success: true,
        message: "টেলিগ্রামে টেস্ট নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "টেলিগ্রাম নোটিফিকেশন পাঠানো যায়নি। অনুগ্রহ করে .env.local ফাইলে TELEGRAM_BOT_TOKEN এবং TELEGRAM_CHAT_ID চেক করুন।",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
