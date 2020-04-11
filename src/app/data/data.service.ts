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
    this.openReq.addEventListener(
      "success",
      () => (this.db = this.openReq.result)
    );
    this.openReq.addEventListener("upgradeneeded", () =>
      this.createOrUpgrade()
    );
    this.openReq.addEventListener("error", () =>
      console.log("[onerror]", this.openReq.error)
    );
  }

  static getInstance(): DataService {
    return this.instance ?? (this.instance = new DataService());
  }

  private createOrUpgrade(): any {
    // Upgrade oder neue DB benötigt

    var db = this.openReq.result;
    var ts = db.createObjectStore("TASK", {
      keyPath: "id",
      autoIncrement: true,
    });
    ts.createIndex("IX_TASK_ID_UNIQUE", "id", { unique: true });
    ts.createIndex("IX_TASK_START_DATE", ["parentId", "isDone", "startTime"]);
    // ts.createIndex("IX_TASK_EXT_SRC", "extSourceLink");
    // evtl. isBlocker & prio

    var rs = db.createObjectStore("REMINDER", {
      keyPath: "id",
      autoIncrement: true,
    });
    rs.createIndex("IX_REMINDER_ID_UNIQUE", "id", { unique: true });
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
      return this.openReq.addEventListener("success", () =>
        this.updateTask(task, reminder)
      );
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
    taskReq.addEventListener("success", () => task.UpdateId(taskReq));

    reminder.forEach((r) => {
      r.taskId = task.taskId;
      let reminderReq = reminderStore.put(r);
      // req.onerror = function(event) {};
      reminderReq.addEventListener("success", () => r.UpdateId(reminderReq));
    });
  }

  /** Comment */
  getTasks(
    parentId: number,
    onsuccessfunction: (result: Task[]) => void,
    skip?: number,
    count?: number
  ): any {
    if (this.openReq.readyState !== "done")
      return this.openReq.addEventListener("success", () =>
        this.getTasks(parentId, onsuccessfunction, skip, count)
      );

    var req = this.db
      .transaction("TASK", "readonly")
      .objectStore("TASK")
      .index("IX_TASK_START_DATE")
      .openCursor(IDBKeyRange.only([parentId, false]));
    // transaction.oncomplete = function(event) {};
    // transaction.onerror = function(event) {};
    // transaction.onabort = function(event) {};

    var retval: Task[];

    req.onsuccess = function (event) {
      this.result.advance(skip);
      skip = 0;

      if (this.result && count > 0) {
        retval.push(this.result.value);
        count--;
        this.result.continue();
      } else {
        onsuccessfunction(retval);
      }
    };

    req.onerror = function () {};
  }
}
