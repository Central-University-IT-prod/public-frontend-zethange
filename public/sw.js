self.addEventListener("install", () => {
  console.log("[Service Worker] Install");

  setInterval(() => {
    self.registration.showNotification("Notification", { body: 'from service worker' }).then();
  }, 5000)
});