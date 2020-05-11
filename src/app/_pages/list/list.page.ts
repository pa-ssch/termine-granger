import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-list",
  templateUrl: "./list.page.html",
  styleUrls: ["./list.page.scss"],
})
export class ListPage implements OnInit {
  tId: number;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.tId = +this.activatedRoute.snapshot.paramMap.get("taskId");
  }
}
