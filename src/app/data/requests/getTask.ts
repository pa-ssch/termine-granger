import { DataService } from "../data.service";
import { Task } from "../task";

/** Lädt eine Aufgabe anhand der ID aus der Datenbank */
export async function getTask(this: DataService, tId: number): Promise<Task> {
  await this.dbReadyPromise();

  return this.requestPromise<Task>(
    this.db
      .transaction("TASK", "readonly")
      .objectStore("TASK")
      .get(+tId)
  );
}
