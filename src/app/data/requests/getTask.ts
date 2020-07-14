import { DataService } from "../data.service";
import { Task } from "../task";

export async function getTask(this: DataService, tId: number): Promise<Task> {
  await this.dbReadyPromise();

  return this.requestPromise<Task>(
    this.db
      .transaction("TASK", "readonly")
      .objectStore("TASK")
      .get(+tId)
  );
}
