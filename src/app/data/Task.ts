import { uint2 } from "./types/uints";

export class Task {
  taskId?: number;
  title: string = "";
  description?: string;
  startTime?: string = new Date().toISOString();
  duration: number = 0;
  deadLineTime?: string;
  priority: uint2 = 1;
  isVisible?: boolean;
  isBlocker: boolean;
  private isDoneDate: string = "";
  parentId: number = 0;

  // public get taskId(): number {
  //   return this._taskId;
  // }

  // public set taskId(value: number) {
  //   if (value) this._taskId = value;
  // }

  // public get title(): string {
  //   return this._title;
  // }

  // public set title(value: string) {
  //   if (value) this._title = value;
  // }

  // public get description(): string {
  //   return this._description;
  // }

  // public set description(value: string) {
  //   this._description = value;
  // }

  // public get startTime(): string {
  //   return this._startTime;
  // }

  // public set startTime(value: string) {
  //   if (new Date(value).toISOString() === value) this._startTime = value;
  // }

  // public get duration(): number {
  //   return this._duration;
  // }

  // public set duration(value: number) {
  //   if (value >= 0) this._duration = Math.round(value);
  // }

  // public get deadLineTime(): string {
  //   return this._deadLineTime;
  // }

  // public set deadLineTime(value: string) {
  //   if (new Date(value).toISOString() === value) this._deadLineTime = value;
  // }

  // public get priority(): uint2 {
  //   return this._priority;
  // }

  // public set priority(value: uint2) {
  //   this._priority = value;
  // }

  // public get isVisible(): boolean {
  //   return this._isVisible;
  // }

  // public set isVisible(value: boolean) {
  //   this._isVisible = value;
  // }

  // public get isBlocker(): boolean {
  //   return this._isBlocker;
  // }

  // public set isBlocker(value: boolean) {
  //   this._isBlocker = value;
  // }

  get isDone(): boolean {
    return this.isDoneDate?.length > 0;
  }

  set isDone(check: boolean) {
    if (check && !this.isDone) this.isDoneDate = new Date().toISOString();
    else if (!check) this.isDoneDate = null;
  }

  // public get parentId(): number {
  //   return this._parentId;
  // }

  // public set parentId(value: number) {
  //   if (value) this._parentId = value;
  // }

  static compare(a: Task, b: Task): number {
    if (a.startTime > b.startTime) return 1;

    if (a.startTime < b.startTime) return -1;

    return 0;
  }
  // checkIntegrity() {
  //   return;
  //   // Gleitkommazahl, unsigniert
  //   // Datum string
  //   // Integer, 32 Bit, unsigniert
  // }
}
