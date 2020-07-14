import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "src/app/data/data.service";
import { Task } from "src/app/data/task";

@Component({
  selector: "app-list",
  templateUrl: "./list.page.html",
  styleUrls: ["./list.page.scss"],
})
export class ListPage implements OnInit {
  task: Task;
  tId: number;
  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService) {}

  ngOnInit() {
    this.task = new Task();
    this.tId = +this.activatedRoute.snapshot.paramMap.get("taskId");
    if (this.tId) this.dataService.getTask(this.tId).then((t) => Object.assign(this.task, t));
  }
}
