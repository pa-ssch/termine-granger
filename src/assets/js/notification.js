var toastController;
function injectToastController(tController) {
  toastController = tController;
}

var alertController;
function injectAlertController(aController) {
  alertController = aController;
}

async function planNotification(id, title, text, time) {
  const reg = await navigator.serviceWorker.getRegistration();

  Notification.requestPermission().then((permission) => {
    if (
      !(
        navigator.userAgent.indexOf("Chrome") < 0 ||
        permission !== "granted" ||
        !("serviceWorker" in navigator) ||
        !("showTrigger" in Notification.prototype) ||
        !reg
      )
    ) {
      showErrorToast();
      return;
    }

    reg.showNotification(title, {
      tag: id,
      body: text,
      showTrigger: new TimestampTrigger(time),
      data: {
        url: window.location.href,
      },
      // badge: "./assets/badge.png",
      // icon: "./assets/icon.png",
    });
  });
}

async function showErrorToast() {
  const toast = await toastController.create({
    color: "danger",
    // duration: 5000, -> Dauerhaft anzeigen
    header: "Erinnerungen nicht verfügbar",
    message: "Der Browser unterstützt keine Push-Benachrichtigungen, oder die Funktion ist nicht aktiviert.",
    buttons: [
      {
        icon: "help",
        handler: () => showHelp(),
      },
      {
        icon: "close",
        role: "cancel",
      },
    ],
  });
  await toast.present();
}

async function showHelp() {
  const alert = await alertController.create({
    header: "Push-Benachrichtigungen nicht verfügbar.",
    message:
      "Der Seite muss das Senden von Benachrichtigungen erlaubt werden und es wird die neuste Version von Google Chrome benötigt. \r\n\r\n" +
      "Bei älteren Versionen kann es helfen, das Flag '#enable-experimental-web-platform-features' in 'chrome://flags' zu aktivieren.",
    buttons: ["OK"],
  });

  await alert.present();
}
