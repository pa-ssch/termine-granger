import { DataService } from "../data.service";
import { Task } from "../task";
import { Reminder } from "../reminder";

//#region JS Methods
declare function planNotification(id, title, text, time): any;
declare function abortNotification(id): any;
//#endregion JS Methods

/** Ändert eine bestehende Aufgabe oder fügt eine neue hinzu.
 * Aktualisiert die zugehörigen Erinnerungen
 */
export async function updateTask(this: DataService, task: Task, reminder?: Reminder[]) {
  await this.dbReadyPromise();

  var transaction = this.db.transaction(["TASK", "REMINDER"], "readwrite");
  var ts = transaction.objectStore("TASK");
  var rs = transaction.objectStore("REMINDER");

  // Aufgabe aktualisieren
  this.requestPromise(ts.put(task)).then((res) => {
    task.taskId = +res.valueOf();

    if (reminder) {
      // Erinnerungen aktualisieren
      var req = rs.index("IX_REMINDER_DATE").getAll(this.reminderForTaskKeyRange(task.taskId));
      req.onsuccess = function (event) {
        // Die aktuell in der Datenbank vorhandenen Erinnerungen bestimmen
        this.result.forEach((oldReminder: Reminder) => {
          oldReminder = Object.assign(new Reminder(), oldReminder);

          // Entfernte Erinnerungen in der Datenbank löschen und die geplante Push-Benachrichtung abbrechen
          if (!reminder.find((newReminder) => oldReminder.reminderId == newReminder.reminderId)) {
            abortNotification(oldReminder.reminderId);
            rs.delete(oldReminder.reminderId);
          }
        });

        // Neue und geänderte Erinnerungen Einfügen oder ändern
        reminder.forEach((r) => {
          r.taskId = task.taskId;
          let reminderReq = rs.put(r);
          reminderReq.addEventListener("success", () => {
            r.reminderId = +reminderReq.result.valueOf();
            let starttime = new Date(task.startTime);
            // Eine geplante Push-Benachrichtigung erstellen
            planNotification(
              r.reminderId,
              "Eine Aufgabe steht an!",
              `${
                task.title
              } am ${starttime.toLocaleDateString()} um ${starttime.getHours()}:${starttime.getMinutes()} Uhr.`,
              new Date(r.reminderTime).getTime()
            );
          });
        });
      };
    }
  });
}
