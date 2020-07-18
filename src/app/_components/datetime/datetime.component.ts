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
  @Input() readonly: boolean;

  constructor() {}

  ngOnInit() {}

  getMin(): string {
    if (this.min) {
      let date = new Date(this.min);
      const ticksPerMinute = 60000;
      date = new Date(date.getTime() - date.getTimezoneOffset() * ticksPerMinute);
      // alert(date);
      return date.toISOString();
    }
    return new Date().getFullYear() - 100 + "";
  }
  getMax(): string {
    if (this.max) {
      let date = new Date(this.max);
      const ticksPerMinute = 60000;
      date = new Date(date.getTime() - date.getTimezoneOffset() * ticksPerMinute);
      return date.toISOString();
    }
    return new Date().getFullYear() + 100 + "";
  }

  remove() {
    this.time = null;
    this.pickerOptions.buttons.find((b) => b.role === "clear").handler();
  }

  static getPickerOptions(doneHandler: (d) => void, clearHandler: () => void) {
    return {
      buttons: [
        {
          text: "Löschen",
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
