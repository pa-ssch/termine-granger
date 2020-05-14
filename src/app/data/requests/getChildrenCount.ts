import { DataService } from "./../data.service";

export async function getChildrenCount(this: DataService, parentId: number): Promise<number> {
  await this.dbReadyPromise();

  return this.requestPromise<number>(
    this.db
      .transaction("TASK", "readonly")
      .objectStore("TASK")
      .index("IX_TASK_START_DATE")
      .count(this.undoneTaskKeyRange(+parentId))
  );
}
