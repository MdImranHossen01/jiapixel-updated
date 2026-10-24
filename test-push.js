const webpush = require("web-push");
const mongoose = require("mongoose");

async function testPush() {
  const vapidPublicKey = "BKc8CDjOGVJXcupFb2GIDVaMJ7QstKD-Wb7YlTKt53GcE803xq5f57zboWjBymnLx5TsY9dgE4eETMrcDUpdJiY";
  const vapidPrivateKey = "GCP1PwN937Ec6JoHh1UwMZpIsAqmnkEV_-Styo4pxWQ";
  const vapidSubject = "mailto:imranshuvo101@gmail.com";

  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

  const uri = "mongodb://jiapixel:f0WrkvtwlfE6QLKL@ac-x5pf0ge-shard-00-00.gxzx6qo.mongodb.net:27017,ac-x5pf0ge-shard-00-01.gxzx6qo.mongodb.net:27017,ac-x5pf0ge-shard-00-02.gxzx6qo.mongodb.net:27017/?ssl=true&replicaSet=atlas-tem8ym-shard-0&authSource=admin&appName=Cluster0";
  await mongoose.connect(uri, { dbName: "jiapixel" });
  const sub = await mongoose.connection.collection("pushsubscriptions").findOne({});
  console.log("Sub found:", sub);

  const payload = JSON.stringify({
    title: "🔔 টেস্ট পুশ নোটিফিকেশন (Jiapixel)",
    body: "অভিনন্দন! আপনার মোবাইল ও ল্যাপটপে পুশ নোটিফিকেশন সফলভাবে কাজ করছে।",
    icon: "/Jia-Pixel-Logo.png",
    badge: "/Jia-Pixel-Logo.png",
    url: "/dashboard/admin/manage-requests",
  });

  try {
    const res = await webpush.sendNotification({
      endpoint: sub.endpoint,
      keys: sub.keys
    }, payload);
    console.log("SUCCESS SENDING NOTIFICATION:", res.statusCode, res.headers, res.body);
  } catch (err) {
    console.error("ERROR SENDING NOTIFICATION:", err);
  }

  await mongoose.disconnect();
}

testPush();
