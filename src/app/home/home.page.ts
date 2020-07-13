import { Component, OnInit } from "@angular/core";

//#region JS Methods
declare function planNotification(id, title, text, time): any;
//#endregion JS Methods

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  constructor() {}
  ngOnInit(): void {
    // Ein Beispiel zum Senden einer Benachrichtigung  (kommt in remidner speichermethode).
    planNotification(1, "Lernen", "eine Aufgabe steht an!", new Date().getTime() + 10000);
  }
}
