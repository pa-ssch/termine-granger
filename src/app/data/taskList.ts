import { displayMode } from "./types/displaymode";
import { Task } from "./task";
import { DataService } from "./data.service";
import { GlobalTaskUpdateService } from "../events/global-task-update.service";
import { GlobalDisplaymodeUpdateService } from "../events/global-displaymode-update.service";
import { GlobalSortmodeUpdateService } from "../events/global-sortmode-update.service";

export class TaskList extends Array<Task> {
  private _indexName: string = "IX_TASK_START_DATE";
  private _displayMode: displayMode = "undone";
  private _sortAsc: boolean = true;

  constructor(
    private tId: number,
    taskUpdateService: GlobalTaskUpdateService,
    private dataService: DataService,
    displaymodeUpdateService: GlobalDisplaymodeUpdateService,
    sortmodeUpdateService: GlobalSortmodeUpdateService
  ) {
    super();
    if (taskUpdateService && dataService) {
      taskUpdateService.getObservable().subscribe((task) => this.addOrChange(task, this));
      this.loadData();
    }
    if (displaymodeUpdateService) {
      displaymodeUpdateService
        .getObservable()
        .subscribe((displaymode: displayMode) => this.displaymodeChanged(displaymode));
    }

    if (sortmodeUpdateService) {
      sortmodeUpdateService
        .getObservable()
        .subscribe((sortmode) => this.sortmodeChanged(sortmode.sortDirectionIndex, sortmode.sortDbIndex));
    }
  }

  loadData(event?: any, count?: number) {
    // Ein undefinierter oder negativer count bedeutet, dass alle Aufgaben geladen werden
    if (!count) count = -1;

    this.dataService
      .getTasks(this.tId, this.length, count, this._indexName, this._displayMode)
      .then((taskList) => {
        if (!this._sortAsc) taskList = taskList.reverse();
        taskList.forEach((task) => this.push(Object.assign(new Task(), task)));
        if (taskList.length < count && event) event.target.disabled = true;
      });
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
    return (
      task.parentId == this.tId &&
      ((task.isDone && this._displayMode == "done") || (!task.isDone && this._displayMode == "undone"))
    );
  }

  public displaymodeChanged(displaymode: displayMode) {
    console.log("test");
    if (displaymode !== this._displayMode) {
      this._displayMode = displaymode;

      this.reload();
    }
  }

  public sortmodeChanged(sortDirectionIndex: number, dbSortIndex: string) {
    this._sortAsc = sortDirectionIndex !== 1;

    this._indexName = dbSortIndex;
    this.reload();
  }

  public reload() {
    // alle aktuellen Aufgaben entfernen
    while (this.length > 0) this.pop();

    this.loadData();
  }
}
