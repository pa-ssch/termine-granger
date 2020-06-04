import { ToastController, AlertController } from "@ionic/angular";
import { Component, OnInit } from "@angular/core";

//#region JS Methods
declare function AddPushNotification(id, text, time, toastController, alertController): any;
//#endregion JS Methods

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  constructor(private toastController: ToastController, private alertController: AlertController) {
    AddPushNotification(1, "erinnerung", new Date().getTime(), this.toastController, this.alertController);
    // wenn erster start --> set root tutorial
    console.log("d");
  }

  ngOnInit() {}
}
