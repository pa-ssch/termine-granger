import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class DataService {
  private IndxDb: IDBFactory;
  private db: IDBDatabase;
  private static readonly DB_NAME = "IRU_DB";
  private openReq: IDBOpenDBRequest;

  constructor() {
    this.IndxDb = self.indexedDB ? self.indexedDB : window.indexedDB;

    // Open & Init DB
    this.openReq = this.IndxDb.open("IRU_DB", 1);
    this.openReq.addEventListener(
      "success",
      () => (this.db = this.openReq.result)
    );
    this.openReq.addEventListener("upgradeneeded", () =>
      this.CreateOrUpgrade()
    );
    this.openReq.addEventListener("error", () =>
      console.log("[onerror]", this.openReq.error)
    );
  }
  private CreateOrUpgrade(): any {
    // Upgrade oder neue DB benötigt
    var db = this.openReq.result;
    var store = db.createObjectStore("PERSON", {
      keyPath: "id",
      autoIncrement: true
    });
    store.createIndex("IX_ID_UNIQUE", "id", { unique: true });
  }

  // CloseDB() {
  //   this.db.close();
  //   // this.IndxDb.deleteDatabase(DataService.DB_NAME);
  //   // this.OpenInitDB();
  // }

  /** Ändert eine bestehende Person oder fügt eine neue hinzu */
  UpdatePerson(person: any) {
    if (this.openReq.readyState !== "done")
      return this.openReq.addEventListener("success", () =>
        this.UpdatePerson(person)
      );

    var transaction = this.db.transaction("PERSON", "readwrite");
    // transaction.onerror = function(event) {};
    // transaction.onabort = function(event) {};
    // transaction.oncomplete = function(event) {};

    var personStore = transaction.objectStore("PERSON");

    if (person.value > 0 && person.id !== null) {
      let req = personStore.delete(person.id);
      // req.onerror = function(event) {};
      // req.onsuccess = function(event) {};
    } else if (person.value <= 0) {
      let req = personStore.put(person);
      // req.onerror = function(event) {};
      req.addEventListener(
        "success",
        () => (person.id = +req.result.valueOf())
      );
    }
  }

  /** Liefert alle Personen in der Datenbank */
  GetAllPerson(onsuccessfunction: (result: any[]) => void): any {
    if (this.openReq.readyState !== "done")
      return this.openReq.addEventListener("success", () =>
        this.GetAllPerson(onsuccessfunction)
      );

    var transaction = this.db.transaction("PERSON");
    // transaction.oncomplete = function(event) {};
    // transaction.onerror = function(event) {};
    // transaction.onabort = function(event) {};

    var request = transaction.objectStore("PERSON").getAll();

    request.onsuccess = function(event) {
      onsuccessfunction(this.result);
    };
    // request.onerror = function() {};
  }
}
