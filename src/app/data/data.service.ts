import { displayMode } from "./types/displaymode";
import { updateTask } from "./requests/updateTask";
import { getReminder } from "./requests/getReminder";
import { getTask } from "./requests/getTask";
import { getTasks } from "./requests/getTasks";
import { Injectable } from "@angular/core";
import { getChildrenCount } from "./requests/getChildrenCount";
import { searchTasks } from "./requests/searchTasks";
import { tick } from "@angular/core/testing";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private static readonly DB_NAME = "TG_DB";
  private openReq: IDBOpenDBRequest;
  protected db: IDBDatabase;

  public getReminder = getReminder;
  public updateTask = updateTask;
  public getTask = getTask;
  public getTasks = getTasks;
  public getChildrenCount = getChildrenCount;
  public searchTasks = searchTasks;

  protected taskKeyRange(tId: number, display: displayMode): IDBKeyRange {
    // Die Range leeres Wort bis ÿ erlaubt alle unicode-Zeichenketten
    if (display == "done") {
      return IDBKeyRange.bound([tId, "0", ""], [tId, "9", "ÿÿÿÿ"]);
    } else {
      return IDBKeyRange.bound([tId, "", ""], [tId, "", "ÿÿÿÿ"]);
    }
  }

  protected reminderForTaskKeyRange(tId: number): IDBKeyRange {
    // Da lexiographische Sortierung, sind alle Daten zwischen leerem Wort und 'a'
    return IDBKeyRange.bound([tId, ""], [tId, "a"]);
  }

  //#region promises
  protected dbReadyPromise() {
    return new Promise((res) => {
      if (this.db) res();
      else if (this.openReq && this.openReq.readyState !== "done")
        this.openReq.onsuccess = () => {
          if (!this.db) this.db = this.openReq.result;
          res();
        };
    });
  }

  protected requestPromise<T>(req: IDBRequest) {
    return new Promise<T>((res, rej) => {
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
  }

  //#endregion promises

  private constructor() {
    // DB Verbindung öffnen
    var indxDb = self.indexedDB ? self.indexedDB : window.indexedDB;
    this.openReq = indxDb.open(DataService.DB_NAME, 1);
    this.openReq.onupgradeneeded = () => this.createOrUpgrade();
    this.openReq.onerror = () => console.log("[onerror]", this.openReq.error);
  }

  /** Upgrade oder neue DB benötigt */
  private async createOrUpgrade() {
    var db = this.openReq.result;
    var ts = db.createObjectStore("TASK", {
      keyPath: "_taskId",
      autoIncrement: true,
    });
    ts.createIndex("IX_TASK_ID_UNIQUE", "_taskId", { unique: true });
    ts.createIndex("IX_TASK_START_DATE", ["_parentId", "_isDoneDate", "_startTime"]);
    ts.createIndex("IX_TASK_DEADLINE", ["_parentId", "_isDoneDate", "_deadLineTime"]);
    ts.createIndex("IX_TASK_TITLE", ["_parentId", "_isDoneDate", "_title"]);
    ts.createIndex("IX_TASK_PRIORITY", ["_parentId", "_isDoneDate", "_priority"]);

    var rs = db.createObjectStore("REMINDER", {
      keyPath: "_reminderId",
      autoIncrement: true,
    });
    rs.createIndex("IX_REMINDER_ID_UNIQUE", "_reminderId", { unique: true });
    rs.createIndex("IX_REMINDER_DATE", ["_taskId", "_reminderTime"]);
  }
}
