type uint2 = 1 | 2 | 3;

export class Task {
  taskId?: number;
  title: string = "";
  description?: string;

  startTime?: string = new Date().toISOString();

  duration?: number;
  deadLineTime?: string;

  priority?: uint2;
  //isVisible?: boolean;
  isBlocker: boolean;
  isDoneDate: string = "";

  parentId: number = 0;

  extSourceLink?: string;

  static compare(a: Task, b: Task): number {
    if (a.startTime > b.startTime) return 1;

    if (a.startTime < b.startTime) return -1;

    return 0;
  }
}
