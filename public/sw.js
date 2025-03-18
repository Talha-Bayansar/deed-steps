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
    sw.clients.openWindow(notification.tag ? "/app" : "/app/notifications");
  }

  event.waitUntil(handleNotificationClick());
});

sw.addEventListener("pushsubscriptionchange", function (event) {
  // @ts-ignore
  event.waitUntil(
    fetch("https://deed-steps.vercel.app/api/subscribe", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // @ts-ignore
        oldEndpoint: event.oldSubscription
          ? // @ts-ignore
            event.oldSubscription.endpoint
          : null,
        // @ts-ignore
        newSubscription: event.newSubscription,
      }),
    })
  );
});
