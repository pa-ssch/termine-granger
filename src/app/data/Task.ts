export class Task {
  private id?: number;
  title: string;
  description?: string;

  private _startTime?: string;

  get startTime(): Date {
    return this._startTime ? new Date(this._startTime) : null;
  }
  set startTime(startTime: Date) {
    if (startTime) this._startTime = startTime.toISOString();
  }

  duration?: number;
  private _deadLineTime?: string;

  get deadLineTime() {
    return this._deadLineTime ? new Date(this._deadLineTime) : null;
  }

  set deadLineTime(deadLineTime: Date) {
    if (deadLineTime) this._deadLineTime = deadLineTime?.toISOString();
  }

  priority?: number;
  //isVisible?: boolean;
  isBlocker: boolean;
  isDone: boolean; // sollte evtl datum sein...

  parentId?: number;

  extSourceLink?: string;

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
