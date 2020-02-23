export class Reminder extends AccessibleDataObject {
  get reminderId(): number {
    return this.id;
  }
  time: Date;

  /** FKs */
  taskId: number;
}
