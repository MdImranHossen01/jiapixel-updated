// Service Worker for Jiapixel Push Notifications

self.addEventListener("push", function (event) {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || "🛒 নতুন অর্ডার রিকোয়েস্ট (Jiapixel)";
    const options = {
      body: data.body || "একটি নতুন অর্ডার রিকোয়েস্ট জমা পড়েছে।",
      icon: data.icon || "/Jia-Pixel-Logo.png",
      badge: data.badge || "/Jia-Pixel-Logo.png",
      vibrate: [250, 100, 250, 100, 250],
      tag: "jiapixel-order-notification",
      renotify: true,
      requireInteraction: true,
      data: {
        url: data.url || "/dashboard/admin/manage-requests",
      },
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error("[SW] Push handling error:", err);
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/dashboard/admin/manage-requests";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      // If a tab is already open with the dashboard, focus it
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes("/dashboard/admin/manage-requests") && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
