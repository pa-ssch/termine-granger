import { DatetimeComponent } from "./../../_components/datetime/datetime.component";
import { DataService } from "./../../data/data.service";
import { Task } from "../../data/task";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Reminder } from "src/app/data/reminder";
import { NavController } from "@ionic/angular";
import { GlobalTaskUpdateService } from "src/app/events/global-task-update.service";

@Component({
  selector: "app-input",
  templateUrl: "./input.page.html",
  styleUrls: ["./input.page.scss"],
})
export class InputPage implements OnInit {
  task: Task;
  reminderList: Reminder[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private taskUpdateService: GlobalTaskUpdateService
  ) {}

  ngOnInit() {
    this.task = new Task();
    var tId = +this.activatedRoute.snapshot.paramMap.get("taskId");
    this.reminderList = [];
    if (tId > 0) {
      DataService.loadMe()
        .getTask(tId)
        .then((t) => (this.task = t));
      DataService.loadMe()
        .getReminder(tId)
        .then((r) => {
          this.reminderList = r;
          // Ein neuer leerer Reminder ist als Platzhalter ("Add") benötigt
          this.reminderList.push(new Reminder());
        });
    } else {
      // neu erstellen
      this.task.parentId = +this.activatedRoute.snapshot.paramMap.get("parentTaskId");
      // Ein neuer leerer Reminder ist als Platzhalter ("Add") benötigt
      this.reminderList.push(new Reminder());
    }
  }

  saveAndClose() {
    DataService.loadMe()
      .updateTask(
        this.task,
        this.reminderList.filter((r) => r.reminderTime)
      )
      .then(() => this.taskUpdateService.publish(this.task));

    this.navCtrl.back();
  }

  getReminderPickerOptions(reminder: Reminder) {
    return DatetimeComponent.getPickerOptions(
      (d: any) => {
        // Es wurde ein neuer Reminder erstellt -> Ein neuer leerer Reminder ist benötigt
        if (!reminder.reminderTime) this.reminderList.push(new Reminder());
        // Datum ändern
        reminder.reminderTime = DatetimeComponent.getDateFromPickerObject(d)?.toISOString();
      },
      () => (this.reminderList = this.reminderList.filter((r) => r !== reminder))
    );
  }

  getStartdatePickerOptions() {
    return DatetimeComponent.getPickerOptions(
      (d: any) => (this.task.startTime = DatetimeComponent.getDateFromPickerObject(d)?.toISOString()),
      () => (this.task.startTime = null)
    );
  }

  getDeadlinePickerOptions() {
    return DatetimeComponent.getPickerOptions(
      (d: any) => (this.task.deadLineTime = DatetimeComponent.getDateFromPickerObject(d)?.toISOString()),
      () => (this.task.deadLineTime = null)
    );
  }

  get duration(): number {
    if (this.task.duration % 60 === 0) {
      // es sind stunden
      if (this.task.duration % (60 * 24) === 0) {
        // es sind tage
        if (this.task.duration % (60 * 24 * 31) === 0) {
          //es sind monate
          if (this.task.duration % (60 * 24 * 31 * 12) === 0) {
            // es sind Jahre
            this.durationUnit = "a";
            return this.task.duration / (60 * 24 * 31 * 12);
          }
          this.durationUnit = "M";
          return this.task.duration / (60 * 24 * 31);
        }
        this.durationUnit = "d";
        return this.task.duration / (60 * 24);
      }
      this.durationUnit = "h";
      return this.task.duration / 60;
    }
    this.durationUnit = "m";
    return this.task.duration;
  }

  // Eigenes objekt mit unit, unitduration & duratoinhour
  // --> umrechnungen
  //unit und unitduration binden (ngModel)
  // jeweils umrechnen (bei änderung)
  //

  set duration(duration: number) {}

  get durationUnit(): String {
    return "m";
  }

  set durationUnit(durationUnit: String) {}
}
