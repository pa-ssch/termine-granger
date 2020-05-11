import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Task } from "../data/task";

@Injectable({
  providedIn: "root",
})
export class GlobalTaskUpdateService {
  private taskSubject = new Subject<Task>();

  publish(task: Task) {
    this.taskSubject.next(task);
  }

  getObservable(): Subject<Task> {
    return this.taskSubject;
  }
}
