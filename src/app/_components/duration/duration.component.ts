import { Component, Input, Output, EventEmitter } from "@angular/core";
import { durationUnit, getAllUnits } from "src/app/data/types/durationUnit";

@Component({
  selector: "app-duration",
  templateUrl: "./duration.component.html",
  styleUrls: ["./duration.component.scss"],
})
export class DurationComponent {
  readonly units: durationUnit[] = getAllUnits().sort((a, b) => a.minutes - b.minutes);
  /** Einheit für die [unitDuration] */
  unit: durationUnit;
  /** Anzahl der Zeiteinheiten von [unit] */
  unitDuration: number;

  @Input()
  /** Dauer in Minuten - unabhängig von der gewählten Einheit */
  set minuteDuration(value: number) {
    // Bei Dauer == 0 wird Minuten als Einheit gewählt
    if (value == 0) {
      this.unitDuration = 0;
      this.unit = this.units[0];
      return;
    }

    // Bei gesetzter Dauer in Minuten größtmögliche Einheit festelgen
    // und die Minuten-Dauer in die neue Einheit umrechen
    // --> Einheiten müssen nach Dauer (ASC) sortiert sein
    for (let u of this.units) {
      if (value % u.minutes > 0) break;

      this.unit = u;
      this.unitDuration = Math.floor(value / u.minutes);
    }
  }

  @Output()
  minuteDurationChange = new EventEmitter<number>();

  constructor() {}

  change() {
    if (!this.unitDuration || this.unitDuration < 0) this.unitDuration = 0;
    this.unitDuration = Math.floor(this.unitDuration);

    this.minuteDurationChange.emit(this.unitDuration * this.unit.minutes);
  }
}
