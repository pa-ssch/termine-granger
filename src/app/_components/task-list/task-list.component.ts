import { DataService } from "./../../data/data.service";
import { TaskList } from "./../../data/taskList";
import { GlobalTaskUpdateService } from "./../../events/global-task-update.service";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
@Component({
  selector: "app-task-list",
  templateUrl: "task-list.component.html",
  styleUrls: ["task-list.component.scss"],
})
export class TaskListComponent {
  _tId: number = 0;
  taskList: TaskList;

  get tId(): number {
    return this._tId;
  }

  @Input()
  set tId(tId: number) {
    this._tId = +tId;
    this.taskList = new TaskList(this._tId, this.taskUpdateService, this.dataService);
  }

  constructor(private taskUpdateService: GlobalTaskUpdateService, private dataService: DataService) {}

  refresh(event: any) {
    this.taskList = new TaskList(this._tId, this.taskUpdateService, this.dataService);

    // 50 ms warten, da der user bei schnellem laden nicht sieht, dass aktualisiert wurde
    setTimeout(() => event.target.complete(), 50);
  }
}
