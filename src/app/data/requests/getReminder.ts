import { DataService } from "./../data.service";
import { Reminder } from "../reminder";

export async function getReminder(this: DataService, tId: number): Promise<Reminder[]> {
  await this.dbReadyPromise();

  return this.requestPromise<Reminder[]>(
    this.db
      .transaction("REMINDER", "readonly")
      .objectStore("REMINDER")
      .index("IX_REMINDER_DATE")
      .getAll(this.reminderForTaskKeyRange(tId))
  );
}
