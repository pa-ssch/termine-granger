/**
 * Stellt ein von der Datenbank speicher- und lesbares Objekt dar.
 */
class AccessibleDataObject {
  /**
   * Primärschlussel
   */
  protected id?: number;

  UpdateId(req: IDBRequest<IDBValidKey>) {
    this.id = +req.result.valueOf();
  }
}
