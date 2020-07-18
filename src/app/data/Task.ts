import { uint2 } from "./types/uint2";

export class Task {
  private _taskId?: number;
  private _title: string = "";
  private _description?: string;
  private _startTime?: string = new Date().toISOString();
  private _duration: number = 0;
  private _deadLineTime?: string;
  private _priority: uint2 = 1;
  private _isVisible?: boolean;
  private _isBlocker: boolean = true;
  private _isDoneDate: string = "";
  private _parentId: number = 0;

  public get taskId(): number {
    return this._taskId;
  }

  public set taskId(value: number) {
    this._taskId = value;
  }

  public get title(): string {
    return this._title;
  }

  public set title(value: string) {
    if (value) this._title = value;
  }

  public get description(): string {
    return this._description;
  }

  public set description(value: string) {
    this._description = value;
  }

  public get startTime(): string {
    return this._startTime;
  }

  public set startTime(value: string) {
    if (!value || (new Date(value).toISOString() === value && value)) this._startTime = value;
  }

  public get duration(): number {
    return this._duration;
  }

  public set duration(value: number) {
    if (value >= 0) this._duration = Math.round(value);
  }

  public get deadLineTime(): string {
    return this._deadLineTime;
  }

  public set deadLineTime(value: string) {
    if (!value || new Date(value).toISOString() === value) this._deadLineTime = value;
  }

  public get priority(): uint2 {
    return this._priority;
  }

  public set priority(value: uint2) {
    this._priority = <uint2>+value;
  }

  public get isVisible(): boolean {
    return this._isVisible;
  }

  public set isVisible(value: boolean) {
    this._isVisible = value;
  }

  public get isBlocker(): boolean {
    return this._isBlocker;
  }

  public set isBlocker(value: boolean) {
    this._isBlocker = value;
  }

  get isDone(): boolean {
    return this._isDoneDate?.length > 0;
  }

  set isDone(check: boolean) {
    if (check && !this.isDone) this._isDoneDate = new Date().toISOString();
    else if (!check) this._isDoneDate = "";
  }

  public get parentId(): number {
    return this._parentId;
  }

  public set parentId(value: number) {
    this._parentId = value;
  }

  static compare(a: Task, b: Task): number {
    if (a.startTime > b.startTime) return 1;

    if (a.startTime < b.startTime) return -1;

    return 0;
  }

  static compareByIndex(a: Task, b: Task, dbIndex: string): number {
    switch (dbIndex) {
      case "IX_TASK_START_DATE":
        return a.startTime.localeCompare(b.startTime);
      case "IX_TASK_DEADLINE":
        return a.deadLineTime.localeCompare(b.deadLineTime);
      case "IX_TASK_TITLE":
        return a.title.localeCompare(b.title);
      case "IX_TASK_PRIORITY":
        let cmpResult = a.priority - b.priority;
        if (cmpResult > 1) cmpResult = 1;
        return cmpResult;
      default:
        return 0;
    }
  }
}
