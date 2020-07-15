import { DataService } from "./../../data/data.service";
import { TaskList } from "./../../data/taskList";
import { GlobalTaskUpdateService } from "./../../events/global-task-update.service";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { GlobalDisplaymodeUpdateService } from "src/app/events/global-displaymode-update.service";
import { GlobalSortmodeUpdateService } from "src/app/events/global-sortmode-update.service";
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
    this.taskList = new TaskList(
      this._tId,
      this.taskUpdateService,
      this.dataService,
      this.displaymodeUpdateService,
      this.sortmodeUpdateService
    );
  }

  constructor(
    private taskUpdateService: GlobalTaskUpdateService,
    private dataService: DataService,
    private displaymodeUpdateService: GlobalDisplaymodeUpdateService,
    private sortmodeUpdateService: GlobalSortmodeUpdateService
  ) {}

  refresh(event: any) {
    this.taskList = new TaskList(
      this._tId,
      this.taskUpdateService,
      this.dataService,
      this.displaymodeUpdateService,
      this.sortmodeUpdateService
    );

    // 50 ms warten, da der user bei schnellem laden nicht sieht, dass aktualisiert wurde
    setTimeout(() => event.target.complete(), 50);
  }
}
