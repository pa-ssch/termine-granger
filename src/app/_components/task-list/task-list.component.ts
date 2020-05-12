import { TaskList } from "./../../data/taskList";
import { GlobalTaskUpdateService } from "./../../events/global-task-update.service";
import { Component, OnInit, Input } from "@angular/core";
@Component({
  selector: "app-task-list",
  templateUrl: "task-list.component.html",
  styleUrls: ["task-list.component.scss"],
})
export class TaskListComponent implements OnInit {
  @Input() tId: number = 0;
  taskList: TaskList;

  ngOnInit(): void {
    this.taskList = new TaskList(this.tId, this.taskUpdateService);
  }

  constructor(private taskUpdateService: GlobalTaskUpdateService) {}
}
