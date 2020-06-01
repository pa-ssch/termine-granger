import { DataService } from "../data.service";
import { Task } from "../task";

export async function getTasks(
  this: DataService,
  parentId: number,
  skip?: number,
  cnt: number = 0
): Promise<Task[]> {
  await this.dbReadyPromise();

  var req = this.db
    .transaction("TASK", "readonly")
    .objectStore("TASK")
    .index("IX_TASK_START_DATE")
    .openCursor(this.undoneTaskKeyRange(+parentId));

  var tasks: Task[] = [];

  return await new Promise<Task[]>((res, rej) => {
    req.onsuccess = () => {
      if (cnt == 0 || !req.result) return res(tasks);

      if (skip > 0) {
        req.result.advance(skip);
        return (skip = 0);
      }

      tasks.push(Object.assign(new Task(), req.result.value));
      cnt--;
      req.result.continue();
    };
    req.onerror = () => rej(req.error);
  });
}
