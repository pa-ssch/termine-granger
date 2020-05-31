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

  extSourceLink?: string;

  get isDone(): boolean {
    return this.isDoneDate?.length > 0;
  }

  set isDone(check: boolean) {
    if (check && !this.isDone) this.isDoneDate = new Date().toISOString();
    else if (!check) this.isDoneDate = null;
  }

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
