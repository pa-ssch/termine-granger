import { GlobalSortmodeUpdateService } from "./../events/global-sortmode-update.service";
import { GlobalDisplaymodeUpdateService } from "./../events/global-displaymode-update.service";
import { displayMode } from "./../data/types/displaymode";
import { Component } from "@angular/core";
import { PickerController } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  displaymode: displayMode = "undone";
  private sortDirectionIndex: number = 0;
  private sortAttributeIndex: number = 0;

  constructor(
    public pickerController: PickerController,
    private displaymodeUpdateService: GlobalDisplaymodeUpdateService,
    private sortmodeUpdateService: GlobalSortmodeUpdateService
  ) {
    this.setSortmode(0, 0);
  }

  /** Liefert den Header abhängig von dem Status (Offen/Erledigt) der Aufgeführten Aufgaben */
  getDisplaymodeText() {
    return this.displaymode == "undone" ? "Offene Aufgaben" : "Erledigte Aufgaben";
  }

  /** Aktualisiert die Aufgaben abhängig vom Status (Offen/Erledigt) */
  displaymodeChanged(ev: any) {
    this.displaymode = ev.detail.value;
    this.displaymodeUpdateService.publish(this.displaymode);
  }

  /** Öffnet ein Auswahlfenster für das wählen einer Sortierung. Wendet die Sortierung an. */
  async showSortPicker() {
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

  /** Wendet eine Sortierung auf die aktuell angezeigten Aufgaben an */
  setSortmode(direction: number, attribute: number) {
    if (this.sortDirectionIndex !== direction || this.sortAttributeIndex !== attribute) {
      this.sortDirectionIndex = direction;
      this.sortAttributeIndex = attribute;
      let sortDbIndex: string = "";

      switch (this.sortAttributeIndex) {
        case 0:
          sortDbIndex = "IX_TASK_START_DATE";
          break;
        case 1:
          sortDbIndex = "IX_TASK_DEADLINE";
          break;
        case 2:
          sortDbIndex = "IX_TASK_TITLE";
          break;
        case 3:
          sortDbIndex = "IX_TASK_PRIORITY";
          break;
      }
      var sortmode = {
        sortDirectionIndex: this.sortDirectionIndex,
        sortDbIndex: sortDbIndex,
      };
      this.sortmodeUpdateService.publish(sortmode);
    }
  }
}
