import { DatetimeComponent } from "./../../_components/datetime/datetime.component";
import { DataService } from "./../../data/data.service";
import { Task } from "../../data/task";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Reminder } from "src/app/data/reminder";
import { NavController, AlertController } from "@ionic/angular";
import { GlobalTaskUpdateService } from "src/app/events/global-task-update.service";

@Component({
  selector: "app-input",
  templateUrl: "./input.page.html",
  styleUrls: ["./input.page.scss"],
})
export class InputPage implements OnInit {
  task: Task;
  reminderList: Reminder[];
  allTasks: Task[];
  potentialParents: Task[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private taskUpdateService: GlobalTaskUpdateService,
    private dataService: DataService,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.task = new Task();
    var tId = +this.activatedRoute.snapshot.paramMap.get("taskId");
    this.reminderList = [];
    if (tId > 0) {
      this.dataService.getTask(tId).then((t) => Object.assign(this.task, t));
      this.dataService.getReminder(tId).then((r) => {
        this.reminderList = r.map((d) => Object.assign(new Reminder(), d));
        // Ein neuer leerer Reminder ist als Platzhalter ("Add") benötigt
        this.reminderList.push(new Reminder());
      });
    } else {
      // neu erstellen
      this.task.parentId = +this.activatedRoute.snapshot.paramMap.get("parentTaskId");

      // Ein neuer leerer Reminder ist als Platzhalter ("Add") benötigt
      this.reminderList.push(new Reminder());
    }

    // Alle Aufgaben laden
    if (!this.allTasks) {
      this.dataService.getTasks(null, null, -1).then((a) => {
        this.allTasks = a.map((t) => Object.assign(new Task(), t));

        this.potentialParents = this.allTasks.filter((t) => t.parentId !== this.task.taskId && !t.isDone);

        do {
          // Alle Potentiellen Parents.
          var taskIds = this.potentialParents.map((p) => p.taskId);
          taskIds.push(0);
          // Alle Tasks entfernen, deren Parent nicht in der liste ist
          var lengthBeforeElimination = this.potentialParents.length;
          this.potentialParents = this.potentialParents.filter((t) => taskIds.includes(t.parentId));
          var lengthAfterElimination = this.potentialParents.length;
        } while (lengthBeforeElimination !== lengthAfterElimination);
      });
    }
  }

  saveAndClose() {
    this.dataService
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
  //#region Funktionen

  setIsDone() {
    this.task.isDone = true;
    this.saveAndClose();
  }

  createChild() {
    this.navCtrl.navigateForward(`input/0/${this.task.taskId}`);
  }

  async findStarttime() {
    const alert = await this.alertController.create({
      header: "Durchführungszeit finden",
      message: "Den frühstmöglichen Start und das spätest mögliche Ende wählen",
      inputs: [
        {
          name: "minStartDate",
          type: "date",
          value: this.task.startTime?.substr(0, 10),
        },
        {
          name: "maxEndDate",
          type: "date",
          value: this.task.deadLineTime?.substr(0, 10),
        },
      ],
      buttons: [
        {
          text: "Abbrechen",
          role: "cancel",
        },
        {
          text: "Einplanen",
          handler: (alertData) => {
            this.calculateStarttime(
              this.task,
              new Date(alertData.minStartDate),
              new Date(alertData.maxEndDate)
            );
          },
        },
      ],
    });

    await alert.present();
  }

  calculateStarttime(task: Task, minStartDate: Date, maxEndDate: Date) {
    // Aufgaben, welche bezüglich der Durchführungszeit miteinander konkurrieren
    var competingTasks = this.allTasks
      .filter((t) => t.taskId !== task.taskId && t.isBlocker)
      .sort(Task.compare);

    for (let i = 0; i < competingTasks.length; i++) {}
  }

  split() {}

  //#endregion Funktionen
}
