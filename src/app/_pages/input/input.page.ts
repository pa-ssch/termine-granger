import { DatetimeComponent } from "./../../_components/datetime/datetime.component";
import { DataService } from "./../../data/data.service";
import { Task } from "./../../data/Task";
import { Component, OnInit, EventEmitter } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Reminder } from "src/app/data/Reminder";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-input",
  templateUrl: "./input.page.html",
  styleUrls: ["./input.page.scss"],
})
export class InputPage implements OnInit {
  task: Task;
  reminderList: Reminder[];

  constructor(private activatedRoute: ActivatedRoute, private navCtrl: NavController) {}

  ngOnInit() {
    this.task = new Task();
    var tId = +this.activatedRoute.snapshot.paramMap.get("taskId");
    this.reminderList = [];
    if (tId > 0) {
      DataService.loadMe().getTask(tId, (t) => (this.task = t));
      DataService.loadMe().getReminder(tId, (r) => (this.reminderList = r));
    } else {
      // neu erstellen
      this.task.parentId = +this.activatedRoute.snapshot.paramMap.get("parentTaskId");
    }

    // Ein neuer leerer Reminder ist benötigt
    this.reminderList.push(new Reminder());
  }

  saveAndClose() {
    DataService.loadMe().updateTask(this.task, this.reminderList);
    this.navCtrl.back();
  }

  getReminderPickerOptions(reminder: Reminder) {
    return DatetimeComponent.getPickerOptions(
      (d: any) => {
        // Es wurde ein neuer Reminder erstellt -> Ein neuer leerer Reminder ist benötigt
        if (!reminder.reminderTime) this.reminderList.push(new Reminder());
        // Datum ändern
        reminder.reminderTime = DatetimeComponent.getDateFromPickerobject(d);
      },
      () => (this.reminderList = this.reminderList.filter((r) => r !== reminder))
    );
  }

  getStartdatePickerOptions() {
    return DatetimeComponent.getPickerOptions(
      (d: any) => (this.task.startTime = DatetimeComponent.getDateFromPickerobject(d)),
      () => (this.task.startTime = null)
    );
  }

  getDeadlinePickerOptions() {
    return DatetimeComponent.getPickerOptions(
      (d: any) => (this.task.deadLineTime = DatetimeComponent.getDateFromPickerobject(d)),
      () => (this.task.deadLineTime = null)
    );
  }
}
