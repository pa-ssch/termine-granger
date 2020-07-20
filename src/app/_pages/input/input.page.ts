import { DatetimeComponent } from "./../../_components/datetime/datetime.component";
import { DataService } from "./../../data/data.service";
import { Task } from "../../data/task";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Reminder } from "src/app/data/reminder";
import { NavController, AlertController, ToastController } from "@ionic/angular";
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
    public alertController: AlertController,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.task = new Task();
    var tId = +this.activatedRoute.snapshot.paramMap.get("taskId");
    this.reminderList = [];
    if (tId > 0) {
      // Aufgabe aus der Datenbank laden
      this.dataService.getTask(tId).then((t) => Object.assign(this.task, t));
      this.dataService.getReminder(tId).then((r) => {
        this.reminderList = r.map((d) => Object.assign(new Reminder(), d));
        // Ein neuer leerer Reminder ist als Platzhalter ("Hinzufügen...") benötigt, wenn die Aufgabe bearbeitet werden darf
        if (!this.task.isDone) this.reminderList.push(new Reminder());
      });
    } else {
      // Neue Aufgabe erstellen
      this.task.parentId = +this.activatedRoute.snapshot.paramMap.get("parentTaskId");

      // Ein neuer leerer Reminder ist als Platzhalter ("Hinzufügen...") benötigt
      this.reminderList.push(new Reminder());
    }

    // Alle Aufgaben laden (für die Startzeitfindung und Gruppenzuweisung)
    if (!this.allTasks) {
      this.dataService.getTasks(null, null, -1).then((a) => {
        this.allTasks = a.map((t) => Object.assign(new Task(), t));

        this.potentialParents = this.allTasks.filter(
          (t) => t.parentId !== this.task.taskId && t.taskId !== this.task.taskId && !t.isDone
        );

        // Alle Potentiellen Gruppen (=Parents) laden (für die Gruppenzuweisung)
        do {
          var taskIds = this.potentialParents.map((p) => p.taskId);
          taskIds.push(0);

          // Alle Aufgaben entfernen, deren Parent nicht in der liste ist
          var lengthBeforeElimination = this.potentialParents.length;
          this.potentialParents = this.potentialParents.filter((t) => taskIds.includes(t.parentId));
          var lengthAfterElimination = this.potentialParents.length;
        } while (lengthBeforeElimination !== lengthAfterElimination);

        // Eine n.a. Aufgabe hinzufügen, um das Entfernen des Parents zu ermöglichen
        var dummyHeadTask = new Task();
        dummyHeadTask.taskId = 0;
        dummyHeadTask.title = "n. a.";
        this.potentialParents.push(dummyHeadTask);

        // Die potentiellen Gruppen alphabetisch sortieren, n. a. immer an die erste
        // stelle schieben.
        this.potentialParents = this.potentialParents.sort((p1, p2) => {
          if (p1.title === "n. a.") return -1;
          if (p2.title === "n. a.") return 1;
          return p1.title.localeCompare(p2.title);
        });
      });
    }
  }

  /** Speichert und schließt die Aufgabe.
   * Wenn die Aufgabe in Konflikt mit anderen Aufgaben steht (Überlappende
   * Blocker) wird dem Benutzer eine Meldung gezeigt.
   */
  async saveAndClose(force: boolean = false) {
    let starttime = new Date(this.task.startTime).getTime();
    if (!force && !this.calculatePotentialStarttime(this.task, starttime, starttime)) {
      // Es gibt für die gewählte Startzeit einen Konflikt, Benutzer muss die sein OK geben.
      await this.showStarttimeConflictAlert();
    } else {
      this.dataService
        .updateTask(
          this.task,
          this.reminderList.filter((r) => r.reminderTime)
        )
        .then(() => this.taskUpdateService.publish(this.task));
      this.navCtrl.back();
    }
  }

  /** Dialog um den Benutzer auf einen Konflikt bei der Durchführungszeit hinzuweisen.
   * Er kann trotz des Konflikts speichern, muss aber mit den Konsequenzen leben.
   */
  async showStarttimeConflictAlert() {
    const alert = await this.alertController.create({
      header: "Durchführungszeit Konflikt",
      message:
        "Die gewählte Startzeit steht in Konflikt mit andren Aufgaben. Möchten Sie trotzdem speichern?",
      buttons: [
        {
          text: "Abbrechen",
          role: "cancel",
        },
        {
          text: "Speichern",
          handler: () => this.saveAndClose(true),
        },
      ],
    });

    await alert.present();
  }

  /** Speicher & Lösch Funktionen für die Auswahl von Erinnerungen*/
  getReminderPickerOptions(reminder: Reminder) {
    return DatetimeComponent.getPickerOptions(
      (d: any) => {
        // Es wurde ein neuer Reminder erstellt -> Ein neuer leerer Reminder ist benötigt
        if (!reminder.reminderTime) this.reminderList.push(new Reminder());
        // Datum ändern
        reminder.reminderTime = DatetimeComponent.getDateFromPickerObject(d)?.toISOString();
      },
      () => {
        if (reminder.reminderTime) this.reminderList = this.reminderList.filter((r) => r !== reminder);
      }
    );
  }

  /** Speicherfunktion für die Auswhal der Startzeit (löschen ist hier nicht möglich) */
  getStartdatePickerOptions() {
    return DatetimeComponent.getPickerOptions(
      (d: any) => (this.task.startTime = DatetimeComponent.getDateFromPickerObject(d)?.toISOString()),
      null
    );
  }

  /** Speicher & Lösch Funktionen für die Auswahl der Deadline */
  getDeadlinePickerOptions() {
    return DatetimeComponent.getPickerOptions(
      (d: any) => (this.task.deadLineTime = DatetimeComponent.getDateFromPickerObject(d)?.toISOString()),
      () => (this.task.deadLineTime = null)
    );
  }

  //#region Funktionen

  /** Markiert die Aufgabe als Abgeschlossen, schließt und speichert. */
  setIsDone() {
    this.task.isDone = true;
    this.saveAndClose();
  }

  /** Öffnet die Eingabemaske, um eine Unteraufgabe zu erstellen. */
  createChild() {
    this.navCtrl.navigateForward(`input/0/${this.task.taskId}`);
  }

  /** Startet den Dialog für das finden einer möglichen Startzeit.
   * Im Dialog können der frühste start und das späteste Ende angegeben werden.
   * Im Anschluss wird versucht eine frühstmögliche Durchführungszeit zu bestimmen.
   */
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

  /** Berechnet die frühstmögliche Startzeit für eine Aufgabe unter beachtung einer unter- und Obergrenze */
  calculatePotentialStarttime(task: Task, minStartDate: number, maxEndDate: number): string {
    if (!task.duration) task.duration = 0;

    // Die Sekunden vom frühsten Startdatum wegrunden, da diese für das
    // gesamte System nicht relevant sind
    let minStartRounded = new Date(minStartDate);
    minStartRounded.setSeconds(0);
    minStartRounded.setMilliseconds(0);
    minStartDate = minStartRounded.getTime();

    // Die Sekunden vom spätesten Enddatum wegrunden, da diese für das
    // gesamte System nicht relevant sind
    let maxEndRounded = new Date(maxEndDate);
    maxEndRounded.setSeconds(0);
    maxEndRounded.setMilliseconds(0);
    maxEndDate = maxEndRounded.getTime();

    const ticksPerMinute = 60000;
    var minEndDate = minStartDate + task.duration * ticksPerMinute;
    var startTime: string;

    // Startzeitfindung nur möglich, wenn das frühste ende vor dem spätesten Ende ist
    if (minEndDate <= maxEndDate || !maxEndDate) {
      startTime = new Date(minStartDate).toISOString();
      // Aufgaben, welche bezüglich der Durchführungszeit miteinander konkurrieren
      var competingTasks = this.allTasks
        .filter((t) => t.taskId !== task.taskId && t.isBlocker)
        .sort(Task.compare);

      for (let i = 0; i < competingTasks.length; i++) {
        let potentialStartTime =
          new Date(competingTasks[i].startTime).getTime() + competingTasks[i].duration * ticksPerMinute;

        if (potentialStartTime <= minStartDate) {
          if (
            competingTasks.length > i + 1 &&
            minStartDate < new Date(competingTasks[i + 1].startTime).getTime()
          ) {
            // Der frühste Startzeitpunkt ist vor dem Beginn der folgenden Aufgabe.
            // Daher ist der frühste Startzeitpunkt ein optionaler Startzeitpunkt
            potentialStartTime = minStartDate;
          } else {
            continue;
          }
        } else if (potentialStartTime > maxEndDate) {
          startTime = "";
          break;
        }
        let potentialEndTime = potentialStartTime + task.duration * ticksPerMinute;

        if (
          (potentialEndTime <= maxEndDate || !maxEndDate) &&
          (!competingTasks[i + 1] || new Date(competingTasks[i + 1].startTime).getTime() >= potentialEndTime)
        ) {
          // der Potentielle Start und das potentielle Ende liegen im vom Benutzer gewählten Bereich
          // und die Zeitlich nächste Aufgabe beginnt erst nach dem potentiellen Ende.
          startTime = new Date(potentialStartTime).toISOString();
          break;
        } else {
          startTime = "";
        }
      }
    }

    return startTime;
  }

  /** Aufgabe in mehrere Teilaufgaben zerlegen und die Eigenschaften übertragen.
   * Die Parameter für die Zerlegung (Ober und Untergrenze für die Anzahl der Aufgaben) bestimmt
   * der Benutzer über einen Dialog.
   * Die Eingabemaske wird im Anschluss geschlossen.
   */
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

  /** Erstellt eine Anzahl an Unteraufgaben (liegt im MIN/MAX bereich)
   * und überträgt die Unterstüzenden EIgenschaften an die neuen Kinder.
   */
  cloneToChilds(minChildCount: number, maxChildCount: number): boolean {
    const ticksPerMinute = 60000;
    let childList: Task[] = [];

    // Zunächst versuchen so wenig Aufgaben wie möglich zu erstellen
    // Wenn nötig bis zum Maximum hochzählen.
    while (minChildCount <= maxChildCount) {
      let childCount = minChildCount;
      let startTime = new Date(this.task.startTime).getTime();
      let deadLine = new Date(this.task.deadLineTime).getTime();

      // Für jedes benötigte Kind eine potentielle Startzeit ermitteln
      for (var childIndex = 1; childIndex <= childCount; childIndex++) {
        var newTask = new Task();
        newTask.title = `(${childIndex}) ${this.task.title}`;
        newTask.duration = this.task.duration / childCount;

        var potentialStartTime = this.calculatePotentialStarttime(newTask, startTime, deadLine);

        if (potentialStartTime) {
          newTask.startTime = potentialStartTime;
          childList.push(newTask);
          startTime = new Date(potentialStartTime).getTime() + newTask.duration * ticksPerMinute;
        } else {
          // Wenn keine Potentielle Startzeit gefunden werden konte, kann für
          // die folgenden Kinder auch keine Startzeit gefunden werden.
          // Daher muss versucht werden Mehere Aufgaben mit jeweils kürzerer Dauer zu erstellen.
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
      for (var childIndex = 0; childIndex < childList.length; childIndex++) {
        // Eigenschaften an das Kind übertragen
        childList[childIndex].priority = this.task.priority;
        childList[childIndex].parentId = this.task.taskId;
        childList[childIndex].isVisible = this.task.isVisible;
        childList[childIndex].isBlocker = this.task.isBlocker;
        childList[childIndex].description = this.task.description;
        childList[childIndex].deadLineTime = this.task.deadLineTime;

        var childStarttime = new Date(childList[childIndex].startTime).getTime();
        // Erinnerungen erstellen
        let childReminders: Reminder[] = relativeReminder.map((relativeReminderTime) => {
          let childReminder = new Reminder();
          childReminder.reminderTime = new Date(childStarttime + relativeReminderTime).toISOString();
          return childReminder;
        });

        this.dataService.updateTask(childList[childIndex], childReminders);
      }

      return true;
    } else return false;
  }
  //#endregion Funktionen

  //#region Toasts
  async showNoStartTimeFoundToast() {
    const toast = await this.toastController.create({
      color: "danger",
      duration: 5000,
      header: "Keine Startzeit möglich",
      message: "Es konnte kein möglicher Durchführungszeitpunkt für die Aufgabe gefunden werden.",
    });
    await toast.present();
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
  //#endregion Toasts
}
