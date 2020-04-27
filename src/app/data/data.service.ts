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

  private undoneTaskKeyRange(tId: number): IDBKeyRange {
    // Da lexiographische Sortierung, sind alle Daten zwischen leerem Wort und 'a'
    return IDBKeyRange.bound([tId, "", ""], [tId, "", "a"]);
  }

  private reminderForTaskKeyRange(tId: number): IDBKeyRange {
    // Da lexiographische Sortierung, sind alle Daten zwischen leerem Wort und 'a'
    return IDBKeyRange.bound([tId, ""], [tId, "a"]);
  }

  //#region promises
  private dbReadyPromise() {
    return new Promise((res) => {
      if (this.db) res();
      else if (this.openReq && this.openReq.readyState !== "done")
        this.openReq.onsuccess = () => {
          if (!this.db) this.db = this.openReq.result;
          res();
        };
    });
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
    this.indxDb = self.indexedDB ? self.indexedDB : window.indexedDB;

    // Open & Init DB
    this.openReq = this.indxDb.open(DataService.DB_NAME, 1);
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
  }
  //#endregion openData

  /** Ändert eine bestehende Aufgabe oder fügt eine neue hinzu */
  async updateTask(task: Task, reminder?: Reminder[]) {
    await this.dbReadyPromise();

    var transaction = this.db.transaction(["TASK", "REMINDER"], "readwrite");
    var ts = transaction.objectStore("TASK");
    var rs = transaction.objectStore("REMINDER");

    this.requestPromise(ts.put(task)).then((res) => {
      task.taskId = +res.valueOf();

      // Reminder updaten
      var req = rs.index("IX_REMINDER_DATE").getAll(this.reminderForTaskKeyRange(task.taskId));
      req.onsuccess = function (event) {
        // Delete
        var deleted: Reminder[] = this.result.filter((r) => !reminder.includes(r));
        deleted.forEach((r) => rs.delete(r.reminderId));

        // Insert / Update
        reminder.forEach((r) => {
          r.taskId = task.taskId;
          let reminderReq = rs.put(r);
          reminderReq.addEventListener("success", () => (r.reminderId = +reminderReq.result.valueOf()));
        });
      };
    });
  }

  /** Comment */
  async getTasks(parentId: number, skip?: number, cnt: number = 0): Promise<Task[]> {
    await this.dbReadyPromise();

    var req = this.db
      .transaction("TASK", "readonly")
      .objectStore("TASK")
      .index("IX_TASK_START_DATE")
      .openCursor(this.undoneTaskKeyRange(parentId));

    var tasks: Task[] = [];

    return await new Promise<Task[]>((res, rej) => {
      req.onsuccess = () => {
        if (cnt == 0 || !req.result) return res(tasks);

        if (skip > 0) {
          req.result.advance(skip);
          return (skip = 0);
        }

        tasks.push(req.result.value);
        cnt--;
        req.result.continue();
      };
      req.onerror = () => rej(req.error);
    });
  }

  async getChildrenCount(parentId: number): Promise<number> {
    await this.dbReadyPromise();

    return this.requestPromise<number>(
      this.db
        .transaction("TASK", "readonly")
        .objectStore("TASK")
        .index("IX_TASK_START_DATE")
        .count(this.undoneTaskKeyRange(parentId))
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
        .getAll(this.reminderForTaskKeyRange(tId))
    );
  }
}
