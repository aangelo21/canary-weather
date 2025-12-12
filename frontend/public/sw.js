self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/logo.webp",
      badge: data.badge || "/logo.webp",
      vibrate: [100, 50, 100],
      data: data.data || {
        dateOfArrival: Date.now(),
        url: "/"
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || "/";
  const baseUrl = "https://canaryweather.xyz";
  const fullUrl = baseUrl + urlToOpen;
  
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.startsWith(baseUrl) && "focus" in client) {
          return client.focus().then(() => client.navigate(fullUrl));
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(fullUrl);
      }
    })
  );
});
