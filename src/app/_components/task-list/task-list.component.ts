import { Component, OnInit, Input } from "@angular/core";
@Component({
  selector: "app-task-list",
  templateUrl: "task-list.component.html",
  styleUrls: ["task-list.component.scss"]
})
export class TaskListComponent implements OnInit {
  @Input() tId: number;
  dataList: number[] = [];

  ngOnInit(): void {
    if (!this.tId) this.tId = 0;
    this.loadData();
  }

  constructor() {}

  loadData(event?: any) {
    for (let i = 0; i < 25; i++) {
      this.dataList.push(this.dataList.length + this.tId * 1000);
    }

    event?.target.complete();

    // alles geladen
    if (this.dataList.length == 1000 && event) event.target.disabled = true;
  }
}
