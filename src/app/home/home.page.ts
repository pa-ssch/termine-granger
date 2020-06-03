import { ToastController, AlertController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  constructor(private toastController: ToastController, private alertController: AlertController) {
    // wenn erster start --> set root tutorial
  }

  ngOnInit() {
    this.handleButtonClick();
  }

  private async handleButtonClick() {
    if (!("showTrigger" in Notification.prototype)) {
      const toast = await this.toastController.create({
        color: "danger",
        // duration: 5000, -> Dauerhaft anzeigen
        header: "Erinnerungen nicht verfügbar",
        message:
          "Der Browser unterstützt keine Push-Benachrichtigungen, oder die Funktion ist nicht aktiviert.",
        buttons: [
          {
            icon: "help",
            handler: () => {
              this.showHelp();
            },
          },
          {
            icon: "close",
            role: "cancel",
          },
        ],
      });
      await toast.present();
    }
  }

  private async showHelp() {
    const alert = await this.alertController.create({
      header: "Push-Benachrichtigungen nicht verfügbar.",
      message:
        "Es wird der Browser Google Chrome benötigt. " +
        "Ab Version 80 muss das Flag '#enable-experimental-web-platform-features' in 'chrome://flags' aktiviert werden.",
      buttons: ["OK"],
    });

    await alert.present();
  }
}
