export class Task {
  taskId?: number;
  title: string = "";
  description?: string;

  startTime?: string = new Date().toISOString();

  duration?: number;
  deadLineTime?: string;

  priority?: number;
  //isVisible?: boolean;
  isBlocker: boolean;
  isDoneDate: string = "";

  parentId: number = 0;

  extSourceLink?: string;
}
