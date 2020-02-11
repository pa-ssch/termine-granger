import { Component, OnInit } from "@angular/core";
@Component({
  selector: "app-task-list",
  templateUrl: "task-list.component.html",
  styleUrls: ["task-list.component.scss"]
})
export class TaskListComponent implements OnInit {
  dataList: string[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  constructor() {}

  loadData(event?: any) {
    for (let i = 0; i < 25; i++) {
      this.dataList.push("Item number " + this.dataList.length);
    }

    event?.target.complete();

    // alles geladen
    if (this.dataList.length == 1000 && event) event.target.disabled = true;
  }
}
