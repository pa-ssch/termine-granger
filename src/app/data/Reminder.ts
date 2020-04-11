export class Reminder {
  private id?: number;
  taskId: number;
  reminderTime?: Date;

  get reminderId(): number {
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
