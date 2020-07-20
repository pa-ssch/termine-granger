import { DataService } from "./../../data/data.service";
import { Component, Input } from "@angular/core";
import { Task } from "src/app/data/task";
import { getBestFitUnit } from "src/app/data/types/durationUnit";
@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.scss"],
})
export class TaskComponent {
  _task: Task;
  childCount: number;
  constructor(private dataService: DataService) {}

  get task(): Task {
    return this._task;
  }

  @Input() set task(task: Task) {
    this._task = task;
    if (this.task.taskId)
      this.dataService.getChildrenCount(+this.task.taskId).then((t) => (this.childCount = t));
  }

  checkedChanged(event: any) {
    if (this.task.isDone !== event.target.checked) {
      this.task.isDone = event.target.checked;
      this.dataService.updateTask(this.task);
    }
  }

  /** Liefert den Text für die Anzeige der Dauer */
  getTimeText(): string {
    let unit = getBestFitUnit(this.task.duration);
    let durationUnit = Math.floor(this.task.duration / unit.minutes);
    return `${durationUnit} ${unit.label}`;
  }

  /** Liefert den Text für die Anzeige des Datums */
  getDateText(): string {
    return new Date(this.task.startTime).toLocaleDateString();
  }
}
