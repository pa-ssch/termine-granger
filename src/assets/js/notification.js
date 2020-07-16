var toastController;
function injectToastController(tController) {
  toastController = tController;
}

var alertController;
function injectAlertController(aController) {
  alertController = aController;
}

async function abortNotification(id) {
  // Geplante Erinnerungen entfernen
  const reg = await navigator.serviceWorker.getRegistration();
  if (reg) (await reg.getNotifications({ includeTriggered: true, tag: id })).forEach((n) => n.close());
}

async function planNotification(id, title, text, time) {
  const reg = await navigator.serviceWorker.getRegistration();

  Notification.requestPermission().then((permission) => {
    let errorHelpText = "";

    if (permission !== "granted")
      errorHelpText += "Das Senden von Benachrichtigungen muss erlaubt werden. \r\n\r\n";

    if (navigator.userAgent.indexOf("Chrome") < 0 || !("showTrigger" in Notification.prototype))
      errorHelpText += "Es wird die aktuellste Version von Google Chrome benötigt.\r\n\r\n";

    if (errorHelpText.length > 0 || !("serviceWorker" in navigator) || !reg) {
      showErrorToast(errorHelpText);
      return;
    }

    const notification = reg.getNotifications({ includeTriggered: true, tag: id });

    if (notification[0]) {
      // Diese Erinnerung wurde bereits geplant. Es hat sich möglicherweiße eine Eigenschaft geändert
      notification.title = title;
      notification.body = text;
      notification.showTrigger = new TimestampTrigger(time);
    } else {
      reg.showNotification(title, {
        tag: id,
        body: text,
        showTrigger: new TimestampTrigger(time),
        data: {
          url: window.location.href,
        },
      });
    }
  });
}

async function showErrorToast(errorHelpText) {
  const toast = await toastController.create({
    color: "danger",
    duration: 5000,
    header: "Erinnerungen nicht verfügbar",
    message: "Push-Benachrichtigungen sind nicht verfügbar.",
    buttons: [
      {
        icon: "help",
        handler: () => showHelp(errorHelpText),
      },
      {
        icon: "close",
        role: "cancel",
      },
    ],
  });
  await toast.present();
}

async function showHelp(errorText) {
  const alert = await alertController.create({
    header: "Push-Benachrichtigungen nicht verfügbar.",
    message: errorText,
    buttons: ["OK"],
  });

  await alert.present();
}
