import { DataService } from "./../../data/data.service";
import { Component, OnInit, Input } from "@angular/core";
import { Task } from "src/app/data/Task";
@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.scss"],
})
export class TaskComponent implements OnInit {
  @Input() task: Task;
  childCount: number;
  constructor() {}

  ngOnInit() {
    DataService.getInstance().getTasks(2, (t) => (this.childCount = t.length));
  }
}
