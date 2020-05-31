import { DataService } from "./../../data/data.service";
import { Component, Input } from "@angular/core";
import { Task } from "src/app/data/task";
import { GlobalTaskUpdateService } from "src/app/events/global-task-update.service";
@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.scss"],
})
export class TaskComponent {
  _task: Task;
  childCount: number;
  constructor(private taskUpdateService: GlobalTaskUpdateService, private dataService: DataService) {}

  get task(): Task {
    return this._task;
  }

  @Input() set task(task: Task) {
    this._task = task;
    this.dataService.getChildrenCount(+this.task.taskId).then((t) => (this.childCount = t));
  }

  checkedChanged(event: any) {
    if (this.task.isDone !== event.target.checked) {
      this.task.isDone = event.target.checked;
      this.taskUpdateService.publish(this.task);
    }
  }
}
