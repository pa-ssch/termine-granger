import { AccessibleDataObject } from "../AccessibleDataObject";

export class ExtSource extends AccessibleDataObject {
  get extSrcId(): number {
    return this.id;
  }
  referenceLink: string;
}
