import { Component } from "@angular/core";

import { Platform, ToastController, AlertController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

//#region JS Methods
declare function injectToastController(toastController): any;
declare function injectAlertController(alertController): any;
//#endregion JS Methods

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    toastController: ToastController,
    alertController: AlertController
  ) {
    this.initializeApp();
    injectToastController(toastController);
    injectAlertController(alertController);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //DataService.loadMe(); // --> wenn erstellt wird: tutorial
    });
  }
}
