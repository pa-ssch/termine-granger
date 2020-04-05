export class Task {
  private id?: number;
  title: string;
  description?: string;

  startTime?: Date;
  duration?: number;
  deadLineTime?: Date;
  priority?: number;
  isVisible?: boolean;
  isBlocker: boolean;
  isDone: boolean;

  group?: string;
  ParentId?: number;
  extSourceLink?: string;
  reminder?: Date[];

  get taskId(): number {
    return this.id;
  }

  UpdateId(req: IDBRequest<IDBValidKey>) {
    if (req.readyState !== "done") {
      req.addEventListener("success", () => this.UpdateId(req));
      return;
    }
    this.id = +req.result.valueOf();
  }
}
