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
    this.pickerOptions.buttons.find((b) => b.role === "clear").handler();
  }

  static getPickerOptions(doneHandler: (d) => void, clearHandler: () => void) {
    return {
      buttons: [
        {
          text: "Clear",
          selected: true,
          role: "clear",
          handler: clearHandler,
        },
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Done",
          handler: doneHandler,
        },
      ],
    };
  }

  static getDateFromPickerobject(d) {
    return new Date(d.year.value, d.month.value, d.day.value, d.hour.value, d.minute.value);
  }
}
