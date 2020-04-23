import { Injectable } from "@angular/core";
import { Task } from "./Task";
import { Reminder } from "./Reminder";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private static instance: DataService;
  private indxDb: IDBFactory;
  private db: IDBDatabase;
  private static readonly DB_NAME = "TG_DB";
  private openReq: IDBOpenDBRequest;

  //#region promises
  private dbReadyPromise(timeout: number = 0) {
    console.log(timeout === 0 ? "check db connection" : "waiting for db connection...");
    return new Promise((res) =>
      setTimeout(() => {
        if (this.openReq?.readyState !== "done") {
          // Wenn beim 1. Versuch die DB noch nicht ready ist, dann zwischen jedem weiteren Versuch 100ms warten.
          this.dbReadyPromise(100);
        } else {
          console.log("db is connected");
          res();
        }
      }, timeout)
    );
  }

  private requestPromise<T>(req: IDBRequest) {
    return new Promise<T>((res, rej) => {
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
  }

  //#endregion promises

  //#region openData
  private constructor() {}

  private open() {
    this.dbReadyPromise();
    this.indxDb = self.indexedDB ? self.indexedDB : window.indexedDB;

    // Open & Init DB
    this.openReq = this.indxDb.open(DataService.DB_NAME, 1);
    this.openReq.addEventListener("success", () => (this.db = this.openReq.result));
    this.openReq.addEventListener("upgradeneeded", () => this.createOrUpgrade());
    this.openReq.addEventListener("error", () => console.log("[onerror]", this.openReq.error));
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

  //#endregion openData

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

    this.requestPromise(taskStore.put(task)).then((res) => (task.taskId = +res.valueOf()));

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

    // Da lexiographische Sortierung, sind alle Daten zwischen leerem Wort und 'a'
    var allTopTasksRangeSorted = IDBKeyRange.bound([0, "", ""], [0, "", "a"]);

    var req = this.db
      .transaction("TASK", "readonly")
      .objectStore("TASK")
      .index("IX_TASK_START_DATE")
      .openCursor(allTopTasksRangeSorted);

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

  async getChildrenCount(parentId: number): Promise<number> {
    await this.dbReadyPromise();

    return this.requestPromise<number>(
      this.db
        .transaction("TASK", "readonly")
        .objectStore("TASK")
        .index("IX_TASK_START_DATE")
        // Da lexiographische Sortierung, sind alle Daten zwischen leerem Wort und 'a'
        .count(IDBKeyRange.bound([0, "", ""], [0, "", "a"]))
    );
  }

  async getTask(tId: number): Promise<Task> {
    await this.dbReadyPromise();
    return this.requestPromise<Task>(this.db.transaction("TASK", "readonly").objectStore("TASK").get(tId));
  }

  async getReminder(tId: number): Promise<Reminder[]> {
    await this.dbReadyPromise();

    return this.requestPromise<Reminder[]>(
      this.db
        .transaction("REMINDER", "readonly")
        .objectStore("REMINDER")
        .index("IX_REMINDER_DATE")
        // Da lexiographische Sortierung, sind alle Daten zwischen leerem Wort und 'a'
        .getAll(IDBKeyRange.bound([tId, ""], [tId, "a"]))
    );
  }
}
