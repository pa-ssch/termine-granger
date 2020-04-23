import { DataService } from "./../../data/data.service";
import { Component, OnInit, Input } from "@angular/core";
import { Task } from "src/app/data/Task";
@Component({
  selector: "app-task-list",
  templateUrl: "task-list.component.html",
  styleUrls: ["task-list.component.scss"],
})
export class TaskListComponent implements OnInit {
  @Input() tId: number;
  taskList: Task[] = [];

  ngOnInit(): void {
    // if (!this.tId) this.tId = 0;
    this.loadData();
  }

  constructor() {}

  loadData(event?: any) {
    DataService.loadMe().getTasks(
      this.tId,
      (taskList) => {
        taskList.forEach((task) => this.taskList.push(task));
        if (taskList.length < 25 && event) event.target.disabled = true;
      },
      this.taskList.length,
      25
    );

    event?.target.complete();
  }
}
