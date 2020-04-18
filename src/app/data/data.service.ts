import { Injectable } from "@angular/core";
import { Task } from "./Task";
import { Reminder } from "./Reminder";
import { NumericValueAccessor } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private static instance: DataService;

  private indxDb: IDBFactory;
  private db: IDBDatabase;
  private static readonly DB_NAME = "TG_DB";
  private openReq: IDBOpenDBRequest;

  private constructor() {
    this.indxDb = self.indexedDB ? self.indexedDB : window.indexedDB;

    // Open & Init DB
    this.openReq = this.indxDb.open(DataService.DB_NAME, 1);
    this.openReq.addEventListener("success", () => (this.db = this.openReq.result));
    this.openReq.addEventListener("upgradeneeded", () => this.createOrUpgrade());
    this.openReq.addEventListener("error", () => console.log("[onerror]", this.openReq.error));
  }

  static loadMe(): DataService {
    return this.instance ?? (this.instance = new DataService());
  }

  private createOrUpgrade(): any {
    // Upgrade oder neue DB benötigt

    var db = this.openReq.result;
    var ts = db.createObjectStore("TASK", {
      keyPath: "taskId",
      autoIncrement: true,
    });
    ts.createIndex("IX_TASK_ID_UNIQUE", "taskId", { unique: true });
    ts.createIndex("IX_TASK_START_DATE", ["parentId", "isDoneDate", "_startTime"]);
    // ts.createIndex("IX_TASK_EXT_SRC", "extSourceLink");
    // evtl. isBlocker & prio

    var rs = db.createObjectStore("REMINDER", {
      keyPath: "reminderId",
      autoIncrement: true,
    });
    rs.createIndex("IX_REMINDER_ID_UNIQUE", "reminderId", { unique: true });
    rs.createIndex("IX_REMINDER_DATE", ["taskId", "reminderTime"]);

    // https://stackoverflow.com/questions/12084177/in-indexeddb-is-there-a-way-to-make-a-sorted-compound-query
    // https://itnext.io/searching-in-your-indexeddb-database-d7cbf202a17
  }

  // CloseDB() {
  //   this.db.close();
  //   // this.IndxDb.deleteDatabase(DataService.DB_NAME);
  //   // this.OpenInitDB();
  // }

  /** Ändert eine bestehende Aufgabe oder fügt eine neue hinzu */
  updateTask(task: Task, reminder?: Reminder[]) {
    if (this.openReq.readyState !== "done")
      return this.openReq.addEventListener("success", () => this.updateTask(task, reminder));
    var transaction = this.db.transaction(["TASK", "REMINDER"], "readwrite");
    // transaction.onerror = function(event) {};
    // transaction.onabort = function(event) {};
    // transaction.oncomplete = function(event) {};

    var taskStore = transaction.objectStore("TASK");
    var reminderStore = transaction.objectStore("REMINDER");
    // let req = personStore.delete(task.id);
    // req.onerror = function(event) {};
    // req.onsuccess = function(event) {};

    let taskReq = taskStore.put(task);
    // req.onerror = function(event) {};
    taskReq.addEventListener("success", () => (task.taskId = +taskReq.result.valueOf()));

    //
    // Reminder mit cursor updaten, damit auch gelöscht wird!
    //
    //

    reminder.forEach((r) => {
      r.taskId = task.taskId;
      let reminderReq = reminderStore.put(r);
      // req.onerror = function(event) {};
      reminderReq.addEventListener("success", () => (r.reminderId = +reminderReq.result.valueOf()));
    });
  }

  /** Comment */
  getTasks(parentId: number, onsuccessfunction: (result: Task[]) => void, skip?: number, cnt?: number): void {
    if (this.openReq.readyState !== "done")
      return this.openReq.addEventListener("success", () =>
        this.getTasks(parentId, onsuccessfunction, skip, cnt)
      );

    // das geht nicht, wegen
    // https://stackoverflow.com/questions/12084177/in-indexeddb-is-there-a-way-to-make-a-sorted-compound-query
    // oder vlt. doch, wegen
    // https://stackoverflow.com/questions/16501459/javascript-searching-indexeddb-using-multiple-indexes

    // var lowerBound = [0, null, new Date(1970).toISOString()];
    // var upperBound = [0, null, new Date(2200).toISOString()];
    // var range = IDBKeyRange.bound(lowerBound, upperBound);

    var req = this.db
      .transaction("TASK", "readonly")
      .objectStore("TASK")
      // .index("IX_TASK_START_DATE")
      .openCursor(/*range*/);

    // transaction.oncomplete = function(event) {};
    // transaction.onerror = function(event) {};
    // transaction.onabort = function(event) {};

    var retval: Task[] = [];

    req.onsuccess = function (event) {
      if (skip > 0) {
        this.result.advance(skip);
        skip = 0;
      }

      if (this.result && cnt > 0) {
        retval.push(this.result.value);
        cnt--;
        this.result.continue();
      } else {
        onsuccessfunction(retval);
      }
    };

    // req.onerror = function () {};
  }

  getChildrenCount(parentId: number, onsuccessfunction: (t: number) => number) {
    if (this.openReq.readyState !== "done")
      return this.openReq.addEventListener("success", () =>
        this.getChildrenCount(parentId, onsuccessfunction)
      );

    if (!parentId) parentId = 0;

    var req = this.db
      .transaction("TASK", "readonly")
      .objectStore("TASK")
      .index("IX_TASK_START_DATE")
      .count(IDBKeyRange.only([parentId, ""]));
    // transaction.oncomplete = function(event) {};
    // transaction.onerror = function(event) {};
    // transaction.onabort = function(event) {};

    req.onsuccess = () => onsuccessfunction(req.result);

    req.onerror = function () {};
  }

  getTask(tId: number, onsuccessfunction: (t: Task) => Task) {
    if (this.openReq.readyState !== "done")
      return this.openReq.addEventListener("success", () => this.getTask(tId, onsuccessfunction));

    var req = this.db.transaction("TASK", "readonly").objectStore("TASK").get(tId);

    req.onsuccess = () => onsuccessfunction(req.result);
  }

  getReminder(tId: number, onsuccessfunction: (r: Reminder[]) => Reminder[]) {
    if (this.openReq.readyState !== "done")
      return this.openReq.addEventListener("success", () => this.getReminder(tId, onsuccessfunction));

    var req = this.db
      .transaction("REMINDER", "readonly")
      .objectStore("REMINDER")
      .index("IX_REMINDER_ID_UNIQUE")
      .openCursor(IDBKeyRange.only([tId]));
    // transaction.oncomplete = function(event) {};
    // transaction.onerror = function(event) {};
    // transaction.onabort = function(event) {};

    var retval: Reminder[];

    req.onsuccess = function (event) {
      if (this.result) {
        retval.push(this.result.value);
        this.result.continue();
      } else {
        onsuccessfunction(retval);
      }
    };

    // req.onerror = function () {};
  }
}
