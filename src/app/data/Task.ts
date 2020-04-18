export class Task {
  taskId?: number;
  title: string = "";
  description?: string;

  private _startTime?: string = new Date().toISOString();

  get startTime(): Date {
    return this._startTime ? new Date(this._startTime) : null;
  }
  set startTime(startTime: Date) {
    this._startTime = startTime?.toISOString();
  }

  duration?: number;
  private _deadLineTime?: string;

  get deadLineTime() {
    return this._deadLineTime ? new Date(this._deadLineTime) : null;
  }

  set deadLineTime(deadLineTime: Date) {
    this._deadLineTime = deadLineTime?.toISOString();
  }

  priority?: number;
  //isVisible?: boolean;
  isBlocker: boolean;
  isDoneDate: string = "";

  parentId: number = 0;

  extSourceLink?: string;
}
