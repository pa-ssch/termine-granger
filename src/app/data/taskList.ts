import { Task } from "./task";
import { DataService } from "./data.service";
import { GlobalTaskUpdateService } from "../events/global-task-update.service";

export class TaskList extends Array<Task> {
  constructor(
    private tId: number,
    taskUpdateService: GlobalTaskUpdateService,
    private dataService: DataService
  ) {
    super();
    if (taskUpdateService && dataService) {
      taskUpdateService.getObservable().subscribe((task) => this.addOrChange(task, this));
      this.loadData();
    }
  }

  loadData(event?: any, count?: number) {
    // Ein count < 0 bedeutet, dass alle Aufgaben geladen werden
    if (!count) count = -1;

    this.dataService.getTasks(this.tId, this.length, count).then((taskList) => {
      console.log(taskList.length + " Aufgabe(n) geladen");
      taskList.forEach((task) => this.push(Object.assign(new Task(), task)));
      if (taskList.length < count && event) event.target.disabled = true;
    });

    event?.target?.complete();
  }

  private last(): Task {
    return this[this.length - 1];
  }

  private addOrChange(task: Task, taskList: TaskList) {
    // Nur Aufgaben mit gleichem Parent können in einer Liste gespeichert werden
    if (task.parentId !== taskList.tId) return;

    // Falls die Aufgabe schon in der Liste ist, den Index des Eintrages heraussuchen
    var oldTaskIndex = taskList.findIndex((t) => t.taskId === task.taskId);
    // Wenn die Aufgabe geändert wurde, änderungen übernehmen
    if (oldTaskIndex > -1) {
      if (!taskList.isListable(task)) {
        // Die Aufgabe entspricht nichtmehr den Bedingungen der liste.
        // z.B. wurde die Aufgabe als erledigt markiert, oder das Datum ist außerhalb des Bereichs
        taskList.splice(oldTaskIndex, 1);
        return;
      } else if (taskList[oldTaskIndex].startTime === task.startTime) {
        // Wenn die Startzeit gleich ist, wird keine umsortierung benötigt
        taskList[oldTaskIndex] = task;
        return;
      } else {
        // Aufgabe entfernen, wenn sich der Startzeitpunkt geändert hat
        taskList.splice(oldTaskIndex, 1);
      }
    }

    // Aufgabe hinzufügen, wenn sie im Bereich der angezeigten Aufgaben ist
    for (var index: number = 0; this[index]; index++)
      if (taskList[index].startTime > task.startTime) {
        taskList.splice(index, 0, task);
        break;
      }

    // wenn der Startzeitpunkt der neuen und der spätesten angezeigten aufgabe gleich sind,
    // die späteste Aufgabe entfernen. -> Diese wird in korrekter Reihenfolge nachgeladen
    for (var delCnt = 0; taskList.last()?.startTime === task.startTime; delCnt++) {
      taskList.pop();
    }

    // Gelöschte Aufgaben erneut laden, damit nicht weniger als zuvor angezeigt wird.
    // Ansonsten könnten die fehlenden Aufgaben nicht nachgeladen werden, falls bereits
    // ans Ende gescrollt wurde
    this.loadData(undefined, delCnt + 1);
  }

  /**
   * Prüft, ob ein bestimmter Task zu den Filteroptionen der Liste passt
   * @param task Task, für welchen geprüft wird, ob er Teil der Liste sein darf.
   */
  private isListable(task: Task): boolean {
    // Aktuell sind nur tasks anzeigbar, die noch nicht abgehakt sind.
    return task.parentId == this.tId && !task.isDone;
  }
}
