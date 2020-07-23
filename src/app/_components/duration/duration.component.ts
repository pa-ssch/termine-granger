import { durationUnit, getAllUnits, getBestFitUnit } from "./../../data/types/durationUnit";
import { Component, Input, Output, EventEmitter } from "@angular/core";

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
    if (this.unitDuration) return;

    this.unit = getBestFitUnit(value, this.units);
    this.unitDuration = Math.floor(value / this.unit.minutes);
  }

  @Input() readonly: boolean;
  @Output()
  minuteDurationChange = new EventEmitter<number>();

  constructor() {}

  change() {
    if (!this.unitDuration || this.unitDuration < 0) this.unitDuration = 0;

    this.unitDuration = Math.floor(this.unitDuration);

    this.minuteDurationChange.emit(this.unitDuration * this.unit.minutes);
  }
}
