import { DataService } from "../data.service";
import { Task } from "../task";

export async function searchTasks(this: DataService, searchKey: IDBKeyRange): Promise<Task[]> {
  await this.dbReadyPromise();

  // IX_TASK_FILTER: "isDoneDate", "startTime", "title"
  return this.requestPromise<Task[]>(
    this.db.transaction("TASK", "readonly").objectStore("TASK").index("IX_TASK_FILTER").getAll(searchKey)
  );
}
