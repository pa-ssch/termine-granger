import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { durationUnit, getAllUnits } from "src/app/data/types/durationUnit";

@Component({
  selector: "app-duration",
  templateUrl: "./duration.component.html",
  styleUrls: ["./duration.component.scss"],
})
export class DurationComponent {
  readonly units: durationUnit[] = getAllUnits().sort((a, b) => a.minutes - b.minutes);
  unit: durationUnit = this.units[0];
  duration: number = 0;

  @Input()
  set ngModel(value: number) {
    // Größtmögliche Einheit für die Dauer festelgen und den
    // numerischen "Dauer"-Wert entsprechend anpassen
    // Voraussetzung hierfür ist, dass die Einheiten
    // nach Dauer aufsteigend sortiert sind.
    if (value > 0 && this.duration == 0) {
      for (let u of this.units) {
        console.log(u.label);
        console.log(value % u.minutes);
        if (value % u.minutes > 0) break;

        this.unit = u;
        this.duration = Math.floor(value / u.minutes);
      }
    }
  }

  @Output()
  ngModelChange = new EventEmitter<number>();

  constructor() {}

  change() {
    if (!this.duration || this.duration < 0) this.duration = 0;
    this.duration = Math.floor(this.duration);

    this.ngModelChange.emit(this.duration * this.unit.minutes);
  }
}
