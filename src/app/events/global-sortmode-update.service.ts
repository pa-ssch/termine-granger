import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GlobalSortmodeUpdateService {
  private sortmodeSubject = new Subject<{
    sortDirectionIndex: number;
    sortDbIndex: string;
  }>();

  publish(sortmode: { sortDirectionIndex: number; sortDbIndex: string }) {
    this.sortmodeSubject.next(sortmode);
  }

  getObservable(): Subject<{ sortDirectionIndex: number; sortDbIndex: string }> {
    return this.sortmodeSubject;
  }
}
