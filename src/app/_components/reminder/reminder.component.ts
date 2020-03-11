import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-reminder",
  templateUrl: "./reminder.component.html",
  styleUrls: ["./reminder.component.scss"]
})
export class ReminderComponent implements OnInit {
  @Input() rId: number;

  constructor() {}

  ngOnInit() {}

  dateChanged() {
    // - neuen reminder der liste hinzufügen
    // - rId setzen?
  }
}
