import { updateTask } from "./requests/updateTask";
import { getReminder } from "./requests/getReminder";
import { getTask } from "./requests/getTask";
import { getTasks } from "./requests/getTasks";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private static readonly DB_NAME = "TG_DB";
  private static instance: DataService;
  private openReq: IDBOpenDBRequest;
  protected db: IDBDatabase;

  public getReminder = getReminder;
  public updateTask = updateTask;
  public getTask = getTask;
  public getTasks = getTasks;

  protected undoneTaskKeyRange(tId: number): IDBKeyRange {
    // Da lexiographische Sortierung, sind alle Daten zwischen leerem Wort und 'a'
    return IDBKeyRange.bound([tId, "", ""], [tId, "", "a"]);
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

  private constructor() {}

  private open() {
    var indxDb = self.indexedDB ? self.indexedDB : window.indexedDB;
    this.openReq = indxDb.open(DataService.DB_NAME, 1);
    this.openReq.onupgradeneeded = () => this.createOrUpgrade();
    this.openReq.onerror = () => console.log("[onerror]", this.openReq.error);
  }

  static loadMe(): DataService {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new DataService();
      this.instance.open();
      return this.instance;
    }
  }

  /** Upgrade oder neue DB benötigt */
  private async createOrUpgrade() {
    var db = this.openReq.result;
    var ts = db.createObjectStore("TASK", {
      keyPath: "taskId",
      autoIncrement: true,
    });
    ts.createIndex("IX_TASK_ID_UNIQUE", "taskId", { unique: true });
    ts.createIndex("IX_TASK_START_DATE", ["parentId", "isDoneDate", "startTime"]);
    // ts.createIndex("IX_TASK_EXT_SRC", "extSourceLink");
    // evtl. isBlocker & prio

    var rs = db.createObjectStore("REMINDER", {
      keyPath: "reminderId",
      autoIncrement: true,
    });
    rs.createIndex("IX_REMINDER_ID_UNIQUE", "reminderId", { unique: true });
    rs.createIndex("IX_REMINDER_DATE", ["taskId", "reminderTime"]);
  }
}
