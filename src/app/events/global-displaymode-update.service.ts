import { displayMode } from "./../data/types/displaymode";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GlobalDisplaymodeUpdateService {
  private displaymodeSubject = new Subject<displayMode>();

  publish(displaymode: displayMode) {
    this.displaymodeSubject.next(displaymode);
  }

  getObservable(): Subject<displayMode> {
    return this.displaymodeSubject;
  }
}
