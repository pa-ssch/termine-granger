import { DataService } from "./../../data/data.service";
import { TaskList } from "./../../data/taskList";
import { GlobalTaskUpdateService } from "./../../events/global-task-update.service";
import { Component, Input } from "@angular/core";
@Component({
  selector: "app-task-list",
  templateUrl: "task-list.component.html",
  styleUrls: ["task-list.component.scss"],
})
export class TaskListComponent {
  _tId: number = 0;
  get tId(): number {
    return this._tId;
  }

  @Input("tId")
  set tId(tId: number) {
    this._tId = tId;
    this.taskList = new TaskList(this.tId, this.taskUpdateService, this.dataService);
  }

  taskList: TaskList;

  constructor(private taskUpdateService: GlobalTaskUpdateService, private dataService: DataService) {}
}
