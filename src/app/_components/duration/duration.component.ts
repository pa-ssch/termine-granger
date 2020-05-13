import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { durationUnit, getAllUnits } from "src/app/data/types/durationUnit";

@Component({
  selector: "app-duration",
  templateUrl: "./duration.component.html",
  styleUrls: ["./duration.component.scss"],
})
export class DurationComponent implements OnChanges {
  readonly units: durationUnit[] = getAllUnits().sort((a, b) => a.minutes - b.minutes);
  unit: durationUnit = this.units[0];
  duration: number = 0;

  @Input()
  ngModel: number;

  @Output()
  ngModelChange = new EventEmitter<number>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    // Wenn bereits ein Wert zugewießen war, wird
    // die Einheit nicht automatisch geändert
    if (changes?.ngModel?.previousValue || !changes?.ngModel?.currentValue) return;

    // Größtmögliche Einheit für die Dauer festelgen und den
    // numerischen "Dauer"-Wert entsprechend anpassen
    // Voraussetzung hierfür ist, dass die Einheiten
    // nach Dauer aufsteigend sortiert sind.
    for (let u of this.units) {
      if (this.ngModel % u.minutes > 0) break;

      this.unit = u;
      this.duration = this.ngModel / u.minutes;
    }
  }

  change() {
    if (!this.duration || this.duration < 0) this.duration = 0;
    this.duration = Math.floor(this.duration);

    this.ngModelChange.emit(this.duration * this.unit.minutes);
  }
}
