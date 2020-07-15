import { Component } from "@angular/core";
import { PickerController } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  displaymode: string = "undone";
  private sortDirectionIndex: number = 0;
  private sortAttributeIndex: number = 0;

  constructor(public pickerController: PickerController) {}

  getDisplaymodeText() {
    return this.displaymode == "undone" ? "Offene Aufgaben" : "Erledigte Aufgaben";
  }

  displaymodeChanged(ev: any) {
    this.displaymode = ev.detail.value;
    // Anzeigenänderung auslösen!
  }

  async showSortPicker(ev: any) {
    const sortPicker = await this.pickerController.create({
      columns: [
        {
          name: "Sortierung",
          selectedIndex: this.sortDirectionIndex,
          options: [
            { text: "Aufsteigend", value: 0 },
            { text: "Absteigend", value: 1 },
          ],
        },
        {
          name: "Eigenschaft",
          selectedIndex: this.sortAttributeIndex,
          options: [
            { text: "Startzeit", value: 0 },
            { text: "Deadline", value: 1 },
            { text: "Titel", value: 2 },
            { text: "Priorität", value: 3 },
          ],
        },
      ],
      buttons: [
        {
          text: "Abbrechen",
          role: "cancel",
        },
        {
          text: "Sortieren",
          handler: (value) => {
            this.setSortmode(value.Sortierung.value, value.Eigenschaft.value);
          },
        },
      ],
    });

    await sortPicker.present();
  }

  setSortmode(direction: number, attribute: number) {
    this.sortDirectionIndex = direction;
    this.sortAttributeIndex = attribute;
    // SORTIERUNG auslösen!
  }
}
