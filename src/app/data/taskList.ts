import { Task } from "./task";
import { DataService } from "./data.service";
import { GlobalTaskUpdateService } from "../events/global-task-update.service";

export class TaskList extends Array<Task> {
  constructor(private tId: number, taskUpdateService: GlobalTaskUpdateService) {
    super();

    taskUpdateService.getObservable().subscribe(this.addOrChange);

    this.loadData();
  }

  loadData(event?: any, count?: number) {
    if (!count) count = 25;

    DataService.loadMe()
      .getTasks(this.tId, this.length, count)
      .then((taskList) => {
        console.log(taskList.length + " Aufgabe(n) geladen");
        taskList.forEach((task) => this.push(task));
        if (taskList.length < count && event) event.target.disabled = true;
      });

    event?.target.complete();
  }

  private last(): Task {
    return this[this.length - 1];
  }

  addOrChange(task: Task) {
    // Nur Aufgaben mit gleichem Parent können in einer Liste gespeichert werden
    if (task.parentId !== this.tId) return;

    // Falls die Aufgabe schon in der Liste ist, den Index des Eintrages heraussuchen
    var oldTaskIndex = this.findIndex((t) => t.taskId === task.taskId);

    // Wenn die Aufgabe geändert wurde, änderungen übernehmen
    if (oldTaskIndex > -1) {
      if (this[oldTaskIndex].startTime === task.startTime) {
        // Wenn die Startzeit gleich ist, wird keine umsortierung benötigt
        this[oldTaskIndex] = task;
        return;
      } else {
        // Aufgabe entfernen, wenn sich der Startzeitpunkt geändert hat
        this.splice(oldTaskIndex, 1);
      }
    }

    // Aufgabe hinzufügen, wenn sie im Bereich der angezeigten Aufgaben ist
    for (var index: number = 0; this[index]; index++)
      if (this[index].startTime > task.startTime) {
        this.splice(index, 0, task);
        break;
      }

    // wenn der Startzeitpunkt der neuen und der spätesten angezeigten aufgabe gleich sind,
    // die späteste Aufgabe entfernen. -> Diese wird in korrekter Reihenfolge nachgeladen
    for (var delCnt = 0; this.last()?.startTime === task.startTime; delCnt++) {
      this.pop();
    }

    // Gelöschte Aufgaben erneut laden, damit nicht weniger als zuvor angezeigt wird.
    // Ansonsten könnten die fehlenden Aufgaben nicht nachgeladen werden, falls bereits
    // ans Ende gescrollt wurde
    this.loadData(undefined, delCnt + 1);
  }
}
