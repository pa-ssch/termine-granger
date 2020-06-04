async function AddPushNotification(id, text, time, toastController, alertController) {
  sendPush(id, text, time, toastController, alertController);
}

async function sendPush(id, text, time, toastController, alertController) {
  
  const reg;

  Notification.requestPermission().then((permission) => {
    if (
      navigator.userAgent.indexOf("Chrome") < 0 ||
      permission !== "granted" ||
      !("serviceWorker" in navigator) ||
      !(reg = await navigator.serviceWorker.getRegistration()) ||
      !("showTrigger" in Notification.prototype)
    ) {
      showNotificationErrorToast(toastController, alertController);
      return;
    }

    reg.showNotification("Scheduled Push Notification", {
      tag: id,
      body: text,
      showTrigger: new TimestampTrigger(time + 6000),
      data: {
        url: window.location.href,
      },
      // badge: "./assets/badge.png",
      // icon: "./assets/icon.png",
    });
  });
}

async function showNotificationErrorToast(toastController, alertController) {
  const toast = await toastController.create({
    color: "danger",
    // duration: 5000, -> Dauerhaft anzeigen
    header: "Erinnerungen nicht verfügbar",
    message: "Der Browser unterstützt keine Push-Benachrichtigungen, oder die Funktion ist nicht aktiviert.",
    buttons: [
      {
        icon: "help",
        handler: () => showHelp(alertController)
      },
      {
        icon: "close",
        role: "cancel"
      },
    ],
  });
  await toast.present();
}

async function showHelp(alertController) {
  const alert = await alertController.create({
    header: "Push-Benachrichtigungen nicht verfügbar.",
    message:
      "Der Seite muss das Senden von Benachrichtigungen erlaubt werden und es wird der Browser Google Chrome benötigt. " +
      "Ab Version 80 muss das Flag '#enable-experimental-web-platform-features' in 'chrome://flags' aktiviert werden.",
    buttons: ["OK"],
  });

  await alert.present();
}
