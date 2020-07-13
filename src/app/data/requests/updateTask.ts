import { DataService } from "../data.service";
import { Task } from "../task";
import { Reminder } from "../reminder";

//#region JS Methods
declare function planNotification(id, title, text, time): any;
declare function abortNotification(id): any;
//#endregion JS Methods

/** Ändert eine bestehende Aufgabe oder fügt eine neue hinzu */
export async function updateTask(this: DataService, task: Task, reminder?: Reminder[]) {
  await this.dbReadyPromise();

  var transaction = this.db.transaction(["TASK", "REMINDER"], "readwrite");
  var ts = transaction.objectStore("TASK");
  var rs = transaction.objectStore("REMINDER");

  this.requestPromise(ts.put(task)).then((res) => {
    task.taskId = +res.valueOf();

    if (reminder) {
      // Reminder updaten
      var req = rs.index("IX_REMINDER_DATE").getAll(this.reminderForTaskKeyRange(task.taskId));
      req.onsuccess = function (event) {
        // Delete
        this.result.forEach((oldReminder: Reminder) => {
          oldReminder = Object.assign(new Reminder(), oldReminder);

          if (!reminder.find((newReminder) => oldReminder.reminderId == newReminder.reminderId)) {
            abortNotification(oldReminder.reminderId);
            rs.delete(oldReminder.reminderId);
          }
        });

        // Insert / Update
        reminder.forEach((r) => {
          r.taskId = task.taskId;
          let reminderReq = rs.put(r);
          reminderReq.addEventListener("success", () => {
            r.reminderId = +reminderReq.result.valueOf();
            console.log("a");
            planNotification(
              r.reminderId,
              task.title,
              "Startzeit: " + new Date(task.startTime).toLocaleDateString(),
              r.reminderTime
            );
            console.log("b");
          });
        });
      };
    }
  });
}
