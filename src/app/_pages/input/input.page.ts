import { DatetimeComponent } from "./../../_components/datetime/datetime.component";
import { DataService } from "./../../data/data.service";
import { Task } from "../../data/task";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Reminder } from "src/app/data/reminder";
import { NavController, AlertController, ToastController } from "@ionic/angular";
import { GlobalTaskUpdateService } from "src/app/events/global-task-update.service";
import { relative } from "path";

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
    public alertController: AlertController,
    public toastController: ToastController
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

        this.potentialParents = this.allTasks.filter(
          (t) => t.parentId !== this.task.taskId && t.taskId !== this.task.taskId && !t.isDone
        );

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
          max: this.task.deadLineTime?.substr(0, 10),
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
            var potentialStarttime = this.calculatePotentialStarttime(
              this.task,
              new Date(alertData.minStartDate).getTime(),
              new Date(alertData.maxEndDate).getTime()
            );
            if (potentialStarttime) this.task.startTime = potentialStarttime;
            else this.showNoStartTimeFoundToast();
          },
        },
      ],
    });

    await alert.present();
  }

  calculatePotentialStarttime(task: Task, minStartDate: number, maxEndDate: number): string {
    const ticksPerMinute = 60000;
    var minEndDate = minStartDate + task.duration * ticksPerMinute;
    var startTime: string;

    // Startzeitfindung nur möglich, wenn das frühste ende vor dem spätesten Ende ist
    if (minEndDate < maxEndDate) {
      startTime = new Date(minStartDate).toISOString();
      // Aufgaben, welche bezüglich der Durchführungszeit miteinander konkurrieren
      var competingTasks = this.allTasks
        .filter((t) => t.taskId !== task.taskId && t.isBlocker)
        .sort(Task.compare);

      for (let i = 0; i < competingTasks.length; i++) {
        let potentialStartTime =
          new Date(competingTasks[i].startTime).getTime() + competingTasks[i].duration * ticksPerMinute;

        if (potentialStartTime < minStartDate) {
          continue;
        } else if (potentialStartTime > maxEndDate) {
          startTime = "";
          break;
        }

        let potentialEndTime = potentialStartTime + task.duration * ticksPerMinute;

        if (
          potentialEndTime <= maxEndDate &&
          (!competingTasks[i + 1] || new Date(competingTasks[i + 1].startTime).getTime() <= potentialEndTime)
        ) {
          // der Potentielle Start und das potentielle ENde liegen im vom benutzer gewählten Bereich
          // und die Zeitlich nächste Aufgabe beginnt erst nach dem potentiellen Ende.
          startTime = new Date(potentialStartTime).toISOString();
        } else {
          startTime = "";
        }
      }
    }

    return startTime;
  }

  async showNoStartTimeFoundToast() {
    const toast = await this.toastController.create({
      color: "danger",
      duration: 5000,
      header: "Keine Startzeit möglich",
      message: "Es konnte kein möglicher Durchführungszeitpunkt für die Aufgabe gefunden werden.",
    });
    await toast.present();
  }

  /** Aufgabe in mehrere Teilaufgaben zerlegen und die Eigenschaften übertragen */
  async split() {
    // startZeit & Deadline müssen gesetzt sein, um den Durchführungszeitraum einzugernzen
    if (!this.task.startTime || !this.task.deadLineTime) {
      this.showCantStartSplitToast();
      return;
    }

    const alert = await this.alertController.create({
      header: "Termin aufteilen",
      message: "Die Durchführungszeit dieser Aufgabe wird gleichmäßig auf die Unteraufgaben verteilt.",
      inputs: [
        {
          name: "min",
          type: "number",
          placeholder: "Mindestanzahl",
          min: 1,
        },
        {
          name: "max",
          type: "number",
          placeholder: "Maximalanzahl",
          min: 1,
        },
      ],
      buttons: [
        {
          text: "Abbrechen",
          role: "cancel",
        },
        {
          text: "Aufteilen",
          handler: (alertData) => {
            if (this.cloneToChilds(alertData.min, alertData.max)) {
              this.reminderList = [];
              this.saveAndClose();
            } else {
              this.showUnsuccessfulSplitToast();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  cloneToChilds(minChildCount: number, maxChildCount: number): boolean {
    const ticksPerMinute = 60000;
    let childList: Task[] = [];
    while (minChildCount <= maxChildCount) {
      let childCount = minChildCount;
      let startTime = new Date(this.task.startTime).getTime();
      let deadLine = new Date(this.task.deadLineTime).getTime();

      for (var i = 1; i <= childCount; i++) {
        var newTask = new Task();
        newTask.title = `(${i}) ${this.task.title}`;
        newTask.duration = this.task.duration / childCount;

        var potentialStartTime = this.calculatePotentialStarttime(newTask, startTime, deadLine);

        if (potentialStartTime) {
          newTask.startTime = potentialStartTime;
          childList.push(newTask);
          startTime = new Date(potentialStartTime).getTime() + newTask.duration * ticksPerMinute;
        } else {
          minChildCount++;
          break;
        }
      }

      if (childList.length == minChildCount) break;
      else childList = [];
    }

    if (childList.length == minChildCount) {
      // Den relativen Zeitpunkt der Erinnerungen zur Startzeit ermitteln
      var relativeReminder = this.reminderList
        .filter((r) => r.reminderTime)
        .map((r) => new Date(r.reminderTime).getTime() - new Date(this.task.startTime).getTime());

      // Tasks & Reminder speichern
      for (var i = 0; i < childList.length; i++) {
        // Eigenschaften an das Kind übertragen
        childList[i].priority = this.task.priority;
        childList[i].parentId = this.task.taskId;
        childList[i].isVisible = this.task.isVisible;
        childList[i].isBlocker = this.task.isBlocker;
        childList[i].description = this.task.description;
        childList[i].deadLineTime = this.task.deadLineTime;

        var childStarttime = new Date(childList[i].startTime).getTime();
        // Erinnerungen erstellen
        let childReminders: Reminder[] = relativeReminder.map((relativeReminderTime) => {
          let childReminder = new Reminder();
          childReminder.reminderTime = new Date(childStarttime + relativeReminderTime).toISOString();
          return childReminder;
        });

        this.dataService.updateTask(childList[i], childReminders);
      }

      return true;
    } else return false;
  }

  async showCantStartSplitToast() {
    const toast = await this.toastController.create({
      color: "danger",
      duration: 5000,
      header: "Aufteilen nicht möglich",
      message: "Um die Aufgabe aufteilen zu können, müssen die Startzeit und die Deadline gesetzt sein",
    });
    await toast.present();
  }

  async showUnsuccessfulSplitToast() {
    const toast = await this.toastController.create({
      color: "danger",
      duration: 5000,
      header: "Aufteilen nicht möglich",
      message: "In dem gewählten Zeitraum ist nicht genug freie Zeit für die Unteraufgaben verfügbar.",
    });
    await toast.present();
  }

  //#endregion Funktionen
}
