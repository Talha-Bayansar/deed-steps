// @ts-check

/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope & typeof globalThis} */ (
  globalThis
);

sw.addEventListener("push", (event) => {
  const message = event.data?.json();
  const { title, body, groupId } = message;

  console.log("Received push message", message);

  async function handlePushEvent() {
    const windowClients = await sw.clients.matchAll({ type: "window" });

    if (windowClients.length > 0) {
      const appInForeground = windowClients.some((client) => client.focused);

      if (appInForeground) {
        console.log("App is in foreground, don't show notification");
        return;
      }
    }

    await sw.registration.showNotification(title, {
      body,
      icon: "/notification-icon.png",
      badge: "/notification-icon.png",
      tag: groupId ?? null,
    });
  }

  event.waitUntil(handlePushEvent());
});

sw.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  notification.close();

  async function handleNotificationClick() {
    sw.clients.openWindow(notification.tag ? "/" : "/groups/notifications");
  }

  event.waitUntil(handleNotificationClick());
});

// sw.addEventListener('pushsubscriptionchange', function(event) {
//   event.waitUntil(
//     fetch('https://pushpad.xyz/pushsubscriptionchange', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         old_endpoint: event.oldSubscription ? event.oldSubscription.endpoint : null,
//         new_endpoint: event.newSubscription ? event.newSubscription.endpoint : null,
//         new_p256dh: event.newSubscription ? event.newSubscription.toJSON().keys.p256dh : null,
//         new_auth: event.newSubscription ? event.newSubscription.toJSON().keys.auth : null
//       })
//     })
//   );
// });
