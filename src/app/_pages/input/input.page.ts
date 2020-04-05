import { Component, OnInit, EventEmitter } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-input",
  templateUrl: "./input.page.html",
  styleUrls: ["./input.page.scss"]
})
export class InputPage implements OnInit {
  tId: number;
  reminderList: Date[];
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.tId = +this.activatedRoute.snapshot.paramMap.get("taskId");

    // var r1 = new Reminder();
    // r1.taskId = this.tId;
    // r1.time = new Date();
    // var r2 = new Reminder();
    // r2.taskId = this.tId;
    // r2.time = new Date();

    // this.reminderList = [r1, r2, this.getNewReminder()];
  }

  updateReminder(event: EventEmitter<string>, time: Date) {
    if (event) {
      if (!time) {
        // Es wurde ein neuer Reminder erstellt -> Ein neuer leerer Reminder ist benötigt
        this.reminderList.push(new Date());
      }
      // Datum ändern
      time = new Date(event + "");
    } else if (time) {
      // Reminder löschen. Objekt vergleich, falls zwei gleiche Daten vorhanden sind.
      this.reminderList = this.reminderList.filter(t => t !== time);
    }
  }
}
