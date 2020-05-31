export class Reminder {
  private _reminderId?: number;
  private _taskId: number;
  private _reminderTime?: string;

  public get reminderId(): number {
    return this._reminderId;
  }

  public set reminderId(value: number) {
    this._reminderId = value;
  }

  public get taskId(): number {
    return this._taskId;
  }

  public set taskId(value: number) {
    this._taskId = value;
  }

  public get reminderTime(): string {
    return this._reminderTime;
  }

  public set reminderTime(value: string) {
    if (new Date(value).toISOString() === value) this._reminderTime = value;
  }
}
