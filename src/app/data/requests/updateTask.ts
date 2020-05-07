import { DataService } from "../data.service";
import { Task } from "../task";
import { Reminder } from "../reminder";

/** Ändert eine bestehende Aufgabe oder fügt eine neue hinzu */
export async function updateTask(this: DataService, task: Task, reminder?: Reminder[]) {
  await this.dbReadyPromise();

  var transaction = this.db.transaction(["TASK", "REMINDER"], "readwrite");
  var ts = transaction.objectStore("TASK");
  var rs = transaction.objectStore("REMINDER");

  this.requestPromise(ts.put(task)).then((res) => {
    task.taskId = +res.valueOf();

    // Reminder updaten
    var req = rs.index("IX_REMINDER_DATE").getAll(this.reminderForTaskKeyRange(task.taskId));
    req.onsuccess = function (event) {
      // Delete
      var deleted: Reminder[] = this.result.filter((r) => !reminder.includes(r));
      deleted.forEach((r) => rs.delete(r.reminderId));

      // Insert / Update
      reminder.forEach((r) => {
        r.taskId = task.taskId;
        let reminderReq = rs.put(r);
        reminderReq.addEventListener("success", () => (r.reminderId = +reminderReq.result.valueOf()));
      });
    };
  });
}
