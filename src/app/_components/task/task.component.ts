import { Component, OnInit, Input } from "@angular/core";
@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.scss"]
})
export class TaskComponent implements OnInit {
  @Input() tId: number;
  hasChilds: boolean;
  constructor() {}

  ngOnInit() {
    this.hasChilds = this.tId % 3 == 0;
  }
}
