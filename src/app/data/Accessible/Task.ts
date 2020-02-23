import { ExtSource } from "./ExtSource";
import { Group } from "./Group";
import { Reminder } from "./Reminder";
export class Task extends AccessibleDataObject {
  get taskId(): number {
    return this.id;
  }

  title: string;
  description?: string;

  startTime?: Date;
  duration?: number;
  deadLineTime?: Date;
  priority?: number;
  isVisible?: boolean;
  isBlocker: boolean;
  isDone: boolean;

  /** FKs */
  groupId?: number;
  extSourceId?: number;
  parentId?: number;

  /** Lazys */
  group?: Group;
  extSource?: ExtSource;
  reminder?: Reminder[];
  Parent?: Task;
  Childs?: Task[];
}
