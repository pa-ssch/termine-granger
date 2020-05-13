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
  isDoneDate: string = "";

  parentId: number = 0;

  extSourceLink?: string;

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
