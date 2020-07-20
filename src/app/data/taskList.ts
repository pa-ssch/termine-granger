import { displayMode } from "./types/displaymode";
import { Task } from "./task";
import { DataService } from "./data.service";
import { GlobalTaskUpdateService } from "../events/global-task-update.service";
import { GlobalDisplaymodeUpdateService } from "../events/global-displaymode-update.service";
import { GlobalSortmodeUpdateService } from "../events/global-sortmode-update.service";

/** Stellt eine geordnete Auflistung von Aufgaben dar */
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
    // Updates an Aufgaben abbonieren, um die Liste ggfs. zu aktualisieren
    if (taskUpdateService && dataService) {
      taskUpdateService.getObservable().subscribe((task) => TaskList.addOrChange(task, this));
      this.loadData();
    }

    // Updates für den Anzeigemodus (Erledigte/Offene Aufgaben) abbonieren, um die Liste ggfs. zu aktualisieren
    if (displaymodeUpdateService) {
      displaymodeUpdateService
        .getObservable()
        .subscribe((displaymode: displayMode) => this.displaymodeChanged(displaymode));
    }

    // Updates für die Sortierung abbonieren, um die Liste ggfs. zu aktualisieren
    if (sortmodeUpdateService) {
      sortmodeUpdateService
        .getObservable()
        .subscribe((sortmode) => this.sortmodeChanged(sortmode.sortDirectionIndex, sortmode.sortDbIndex));
    }
  }

  /** Lädt Aufgaben aus der Datenbank.
   * Die Sortierung ist durch den gesetzten Sortierungsmodus (Datenbankindex) bestimmt.*/
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

  /** Liefert die letzte Aufgabe in der aktuellen Aufgabenliste */
  private last(): Task {
    return this[this.length - 1];
  }

  /** Fügt eine Aufgabe in der liste an der korrekten stelle ein
   * Oder ändert diese, falls sie bereits vorhanden ist,
   * oder entfernt sie, falls sie nichtmehr den Kriterien der Auflistung entspricht */
  public static addOrChange(task: Task, taskList: TaskList) {
    // Falls die Aufgabe schon in der Liste ist, den Index des Eintrages heraussuchen
    var oldTaskIndex = taskList.findIndex((t) => t.taskId === task.taskId);

    // Nur Aufgaben mit gleichem Parent und AZeigeart (erledigt & abgeschlossen)
    // können in einer Liste gespeichert werden
    if (
      task.parentId !== taskList.tId ||
      (task.isDone && taskList._displayMode == "undone") ||
      (!task.isDone && taskList._displayMode == "done")
    ) {
      if (oldTaskIndex > -1) taskList.splice(oldTaskIndex, 1);
      return;
    }

    // Wenn die Aufgabe geändert wurde, änderungen übernehmen und korrekt einsortieren
    if (oldTaskIndex > -1) {
      if (Task.compareByIndex(taskList[oldTaskIndex], task, taskList._indexName) === 0) {
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

    // Wenn schon Aufgaben in der Liste sind, an der richtigen Stelle einfügen
    for (let i = 0; i < taskList.length; i++) {
      let cmpResult = Task.compareByIndex(taskList[i], task, taskList._indexName);
      if ((cmpResult > 0 && taskList._sortAsc) || (cmpResult < 0 && !taskList._sortAsc)) {
        taskList.splice(i, 0, task);
        break;
      } else if (i == taskList.length - 1) {
        taskList.push(task);
        break;
      }
    }
  }

  /** Lädt die Aufgaben nach einer Änderung des Anzeigemodus (Erledigte/Offene Aufgaben) neu,
   * um den Kriterien der Auflistung zu entsprechen
   */
  public displaymodeChanged(displaymode: displayMode) {
    if (displaymode !== this._displayMode) {
      this._displayMode = displaymode;

      this.reload();
    }
  }

  /** Lädt die Aufgaben nach einer Änderung des Sortiermodus neu */
  public sortmodeChanged(sortDirectionIndex: number, dbSortIndex: string) {
    this._sortAsc = sortDirectionIndex !== 1;

    this._indexName = dbSortIndex;
    this.reload();
  }

  /** Leert die Liste und lädt alle Daten erneut */
  public reload() {
    // alle aktuellen Aufgaben entfernen
    while (this.length > 0) this.pop();

    this.loadData();
  }
}
