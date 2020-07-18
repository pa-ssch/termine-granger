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
    if (!count) count = -1;

    this.dataService
      .getTasks(this.tId, this.length, count, this._indexName, this._displayMode)
      .then((taskList) => {
        if (!this._sortAsc) taskList = taskList.reverse();
        taskList.forEach((task) => this.push(Object.assign(new Task(), task)));
        if (taskList.length < count && event) {
          event.target.disabled = true;
        }
      });
  }

  private last(): Task {
    return this[this.length - 1];
  }

  private addOrChange(task: Task, taskList: TaskList) {
    // Falls die Aufgabe schon in der Liste ist, den Index des Eintrages heraussuchen
    var oldTaskIndex = taskList.findIndex((t) => t.taskId === task.taskId);

    // Nur Aufgaben mit gleichem Parent können in einer Liste gespeichert werden
    if (task.parentId !== taskList.tId) {
      if (oldTaskIndex > -1) taskList.splice(oldTaskIndex, 1);
      return;
    }

    // Wenn die Aufgabe geändert wurde, änderungen übernehmen und korrekt einsortieren
    if (oldTaskIndex > -1) {
      if (!taskList.isListable(task)) {
        // Die Aufgabe entspricht nichtmehr den Bedingungen der liste (ist erledigt oder nichtmehr erledigt)
        taskList.splice(oldTaskIndex, 1);

        return;
      } else if (Task.compareByIndex(taskList[oldTaskIndex], task, taskList._indexName) === 0) {
        // Sortierkriterium ist gleich geblieben, keine umsortierung benötigt
        taskList[oldTaskIndex] = task;
        return;
      } else {
        // sortierkriterium hat sich geändert
        // Die Aufgabe muss entfernt werden
        taskList.splice(oldTaskIndex, 1);
      }
    }

    // Wenn noch keine andere Aufgabe in der Liste ist einfach einfügen
    if (taskList.length == 0) {
      taskList.push(task);
      return;
    }

    // Wenn schon AUfgaben in der Liste sind, an der richtigen Stelle einfügen
    for (let i = 0; i < taskList.length; i++) {
      let cmpResult = Task.compareByIndex(taskList[i], task, taskList._indexName);
      if (
        (cmpResult > 0 && taskList._sortAsc) ||
        (cmpResult < 0 && !taskList._sortAsc) ||
        i == taskList.length - 1
      ) {
        taskList.splice(i, 0, task);
        break;
      }
    }
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
