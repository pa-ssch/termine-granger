import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-reminder",
  templateUrl: "./reminder.component.html",
  styleUrls: ["./reminder.component.scss"]
})
export class ReminderComponent implements OnInit {
  @Input() time: string;
  @Output() update: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  dateChanged() {
    this.update.emit(this.time);
  }

  remove() {
    this.update.emit();
  }
}
