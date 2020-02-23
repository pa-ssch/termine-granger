export class Group extends AccessibleDataObject {
  get groupId(): number {
    return this.id;
  }
  title: string;
}
