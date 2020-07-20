import { displayMode } from "./../types/displaymode";
import { DataService } from "../data.service";
import { Task } from "../task";

/** Lädt eine bestimmte Anzahl an Aufgaben anhand der folgenden Kriterien aus der Datenbank:
 * - Zugehörige Gruppe (Parent)
 * - Anzahl der zu überspringenden Aufgaben
 * - Anzahl der zu ladenden Aufgaben
 * - des Datenbank-Index für die Sortierung
 * - des ANzeigemodus für die Filterung
 */
export async function getTasks(
  this: DataService,
  parentId: number,
  skip?: number,
  cnt: number = 0,
  indexName: string = "IX_TASK_START_DATE",
  displaymode: displayMode = "undone"
): Promise<Task[]> {
  await this.dbReadyPromise();

  // Laden über einen Curser, um Datensätze überspringen zu können.
  // Aktuell ist kein dynamisches nachladen von Aufgaben (immer die nächsten 25 Aufgaben laden)
  // benötigt. Die funktion ist jedoch für die Zukunft geplant und daher in der Abfrage schon umgesetzt.

  var req: IDBRequest<IDBCursorWithValue>;
  if (parentId != null) {
    req = this.db
      .transaction("TASK", "readonly")
      .objectStore("TASK")
      .index(indexName)
      .openCursor(this.taskKeyRange(+parentId, displaymode));
  } else {
    req = this.db.transaction("TASK", "readonly").objectStore("TASK").openCursor();
  }
  var tasks: Task[] = [];

  return await new Promise<Task[]>((res, rej) => {
    req.onsuccess = () => {
      if (cnt == 0 || !req.result) return res(tasks);

      if (skip > 0) {
        req.result.advance(skip);
        return (skip = 0);
      }

      tasks.push(Object.assign(new Task(), req.result.value));
      cnt--;
      req.result.continue();
    };
    req.onerror = () => rej(req.error);
  });
}
