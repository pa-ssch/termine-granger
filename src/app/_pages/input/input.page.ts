import { Reminder } from "./../../data/Accessible/Reminder";
import { AccessibleDataObject } from "./../../data/AccessibleDataObject";
import { Component, OnInit, EventEmitter } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-input",
  templateUrl: "./input.page.html",
  styleUrls: ["./input.page.scss"]
})
export class InputPage implements OnInit {
  tId: number;
  reminderList: Reminder[];
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.tId = +this.activatedRoute.snapshot.paramMap.get("taskId");

    var r1 = new Reminder();
    r1.taskId = this.tId;
    r1.time = new Date();
    var r2 = new Reminder();
    r2.taskId = this.tId;
    r2.time = new Date();

    this.reminderList = [r1, r2, this.getNewReminder()];
  }

  updateReminder(event: EventEmitter<string>, reminder: Reminder) {
    if (event) {
      if (!reminder.time) {
        // Es wurde ein neuer Reminder erstellt -> Ein neuer leerer Reminder ist benötigt
        this.reminderList.push(this.getNewReminder());
      }
      // Datum ändern
      reminder.time = new Date(event + "");
    } else if (reminder.time) {
      // Reminder löschen. Objekt statt id Vergleich, da noch nicht jedes Objekt eine ID hat.
      this.reminderList = this.reminderList.filter(r => r != reminder);
    }
  }

  private getNewReminder(): Reminder {
    var nr = new Reminder();
    nr.taskId = this.tId;
    return nr;
  }
}
