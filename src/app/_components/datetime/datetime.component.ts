import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
@Component({
  selector: "app-datetime",
  templateUrl: "./datetime.component.html",
  styleUrls: ["./datetime.component.scss"],
})
export class DatetimeComponent implements OnInit {
  @Input() time: string;
  @Input() min: string;
  @Input() max: string;
  @Input() placeholder: string;
  @Input() icon: string;
  @Input() pickerOptions: any;

  constructor() {}

  ngOnInit() {}

  getMin(): string {
    return this.min ? this.min : new Date().getFullYear() - 100 + "";
  }
  getMax(): string {
    return this.max ? this.max : new Date().getFullYear() + 100 + "";
  }

  remove() {
    this.time = null;
    this.pickerOptions.buttons.find((b) => b.role === "clear").handler();
  }

  static getPickerOptions(doneHandler: (d) => void, clearHandler: () => void) {
    return {
      buttons: [
        {
          text: "Leeren",
          selected: true,
          role: "clear",
          handler: clearHandler,
        },
        {
          text: "Abbrechen",
          role: "cancel",
        },
        {
          text: "Okay",
          handler: doneHandler,
        },
      ],
    };
  }

  static getDateFromPickerObject(d): Date {
    // Verhalten von Date Object (JS):
    //    Der Monat ist Index-Basiert. Der Tag Kalenderbasiert
    //    Monat 1 = Februar (2. Monat im Jahr)
    //    Tag 1 = 1. Tag im Monat
    //    => Daher muss vom Monat [1] subtrahiert werden.

    return new Date(d.year.value, d.month.value - 1, d.day.value, d.hour.value, d.minute.value);
  }
}
