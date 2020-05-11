import { GlobalTaskUpdateService } from "./../../events/global-task-update.service";
import { DataService } from "./../../data/data.service";
import { Component, OnInit, Input } from "@angular/core";
import { Task } from "src/app/data/task";
import { runInThisContext } from "vm";
@Component({
  selector: "app-task-list",
  templateUrl: "task-list.component.html",
  styleUrls: ["task-list.component.scss"],
})
export class TaskListComponent implements OnInit {
  @Input() tId: number;
  taskList: Task[] = [];

  ngOnInit(): void {
    if (!this.tId) this.tId = 0;
    this.loadData();
  }

  constructor(private taskUpdateService: GlobalTaskUpdateService) {
    this.taskUpdateService.getObservable().subscribe((newTask) => {
      var oldTaskIndex = this.taskList.findIndex((t) => t.taskId === newTask.taskId);

      // Wenn die Aufgabe geändert wurde, änderungen übernehmen
      if (oldTaskIndex > -1) {
        if (this.taskList[oldTaskIndex].startTime === newTask.startTime) {
          this.taskList[oldTaskIndex] = newTask;
          // Wenn die Startzeit gleich ist, wird keine umsortierung benötigt
          return;
        } else {
          // Aufgabe entfernen, wenn sich der Startzeitpunkt geändert hat
          this.taskList.splice(oldTaskIndex, 1);
        }
      }

      // Aufgabe hinzufügen, wenn sie im Bereich der angezeigten Aufgaben ist
      for (var index: number = 0; this.taskList[index]; index++)
        if (this.taskList[index].startTime > newTask.startTime) {
          this.taskList.splice(index, 0, newTask);
          break;
        }

      // wenn der Startzeitpunkt der neuen und der spätesten angezeigten aufgabe gleich sind,
      // die späteste Aufgabe entfernen. -> Diese wird in korrekter Reihenfolge nachgeladen
      for (var delCnt = 1; this.latestTask()?.startTime === newTask.startTime; delCnt++) {
        this.taskList.pop();
      }

      // gelöschte Aufgaben erneut laden, damit nicht weniger als zuvor angezeigt wird
      // Ansonsten könnten bei < 25 Aufgaben die fehlenden Aufgaben nicht nachgeladen werden
      this.loadData(undefined, delCnt);
    });
  }

  loadData(event?: any, count?: number) {
    if (!count) count = 25;

    DataService.loadMe()
      .getTasks(this.tId, this.taskList.length, count)
      .then((taskList) => {
        taskList.forEach((task) => this.taskList.push(task));
        if (taskList.length < count && event) event.target.disabled = true;
      });

    event?.target.complete();
  }

  private latestTask(): Task {
    return this.taskList[this.taskList.length - 1];
  }
}
