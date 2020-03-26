/**
 * Stellt ein von der Datenbank speicher- und lesbares Objekt dar.
 */
export class AccessibleDataObject {
  /**
   * Primärschlussel
   */
  protected id?: number;

  UpdateId(req: IDBRequest<IDBValidKey>) {
    if (req.readyState !== "done") {
      req.addEventListener("success", () => this.UpdateId(req));
      return;
    }
    this.id = +req.result.valueOf();
  }
}
